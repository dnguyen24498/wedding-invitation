from PIL import Image
import sys

def analyze_area(img_path, label):
    img = Image.open(img_path)
    w, h = img.size
    print(f"\n=== {label}: {w}x{h} ===")
    
    # Sample pixels at different Y positions to understand the image layout
    center_x = w // 2
    print(f"Pixel colors at center X={center_x}:")
    for pct in [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80]:
        y = int(h * pct / 100)
        px = img.getpixel((center_x, y))
        brightness = sum(px[:3]) / 3
        desc = "DARK" if brightness < 100 else "MID" if brightness < 180 else "LIGHT"
        print(f"  Y={pct}% (px {y}): RGB{px[:3]} [{desc}]")
    
    # Sample at 25% and 75% X to detect horizontal composition
    print(f"\nHorizontal scan at Y=25% ({int(h*0.25)}):")
    for xpct in [10, 20, 30, 40, 50, 60, 70, 80, 90]:
        x = int(w * xpct / 100)
        y = int(h * 0.25)
        px = img.getpixel((x, y))
        brightness = sum(px[:3]) / 3
        desc = "DARK" if brightness < 100 else "MID" if brightness < 180 else "LIGHT"
        print(f"  X={xpct}%: RGB{px[:3]} [{desc}]")
    
    # Also check Y=15% and Y=20% for bride
    for ypct in [15, 20]:
        print(f"\nHorizontal scan at Y={ypct}% ({int(h*ypct/100)}):")
        for xpct in [20, 30, 40, 50, 60, 70, 80]:
            x = int(w * xpct / 100)
            y = int(h * ypct / 100)
            px = img.getpixel((x, y))
            brightness = sum(px[:3]) / 3
            desc = "DARK" if brightness < 100 else "MID" if brightness < 180 else "LIGHT"
            print(f"  X={xpct}%: RGB{px[:3]} [{desc}]")

    # Save crops for visual verification
    # Crop what should be visible at cover + center top
    # cover: width fills container, height = w_ratio * h
    # For 120px container, displayed width=120, displayed height = 120 * h/w
    # visible Y in original: 0 to w (since aspect ratio is portrait, cover width = container)
    # Actually for cover+center top, visible = top portion
    vis_h = int(w)  # with cover, the visible height = width (square crop from original)
    crop = img.crop((0, 0, w, vis_h))
    crop.save(f'/tmp/{label}_cover_top.jpg')
    print(f"\nSaved cover-top crop: 0,0 to {w},{vis_h}")
    
    # Crop what would be visible at 200% + 50%/21% for groom, 50%/7% for bride
    # At 200%: displayed = w*2 x h*2 in a 120px container... wait
    # background-size: 200% means displayed_width = container * 2 = 240
    # displayed_height = 240 * (h/w)
    container = 120
    disp_w = container * 2  # 200%
    disp_h = disp_w * (h / w)
    # position 50% X: offset_x = (container - disp_w) * 0.5 → this gives negative
    # Actually: (container - disp_w) * X% = scroll offset (negative = image moves left)
    # visible_x_start = -offset_x = (disp_w - container) * X%
    
    if label == "groom":
        pos_y_pct = 0.21
    else:
        pos_y_pct = 0.07
    
    vis_x_start = (disp_w - container) * 0.5
    vis_y_start = (disp_h - container) * pos_y_pct
    
    # Convert to original coords
    scale = w / disp_w
    ox = vis_x_start * scale
    oy = vis_y_start * scale
    ow = container * scale
    oh = container * scale
    
    print(f"\n200% with pos 50%/{int(pos_y_pct*100)}%:")
    print(f"  Visible area in original: ({ox:.0f},{oy:.0f}) to ({ox+ow:.0f},{oy+oh:.0f})")
    print(f"  Center: ({ox+ow/2:.0f}, {oy+oh/2:.0f}) = ({(ox+ow/2)/w*100:.1f}%, {(oy+oh/2)/h*100:.1f}%)")
    
    crop2 = img.crop((int(ox), int(oy), int(ox+ow), int(oy+oh)))
    crop2.save(f'/tmp/{label}_200pct.jpg')
    print(f"  Saved 200% crop to /tmp/{label}_200pct.jpg")

analyze_area('images/new/groom_nguyen.JPG', 'groom')
analyze_area('images/new/bride_jinnie.JPG', 'bride')
