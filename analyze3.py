from PIL import Image

def fine_scan(path, label):
    img = Image.open(path)
    w, h = img.size
    print(f"\n=== {label} {w}x{h} - DETAILED VERTICAL SCAN ===")
    
    # Vertical scan every 2% with multiple X samples
    for ypct in range(40, 80, 2):
        y = int(h * ypct / 100)
        pixels = []
        for xpct in [30, 40, 50, 60, 70]:
            x = int(w * xpct / 100)
            px = img.getpixel((x, y))
            pixels.append(px[:3])
        
        avg_bright = sum(sum(p)/3 for p in pixels) / len(pixels)
        has_skin = any(p[0] > 150 and p[0] > p[2] and abs(p[0]-p[1]) < 40 for p in pixels)
        has_dark = any(sum(p)/3 < 80 for p in pixels)
        
        markers = ""
        if has_skin: markers += " [SKIN]"
        if has_dark: markers += " [DARK]"
        if avg_bright > 200: markers += " [BG]"
        
        print(f"  Y={ypct}%: avg_bright={avg_bright:.0f} {[f'({p[0]},{p[1]},{p[2]})' for p in pixels]}{markers}")
    
    # For bride, also scan 20-45%
    if label == "bride":
        print(f"\n=== {label} - SCAN 20-50% ===")
        for ypct in range(20, 52, 2):
            y = int(h * ypct / 100)
            pixels = []
            for xpct in [30, 40, 50, 60, 70]:
                x = int(w * xpct / 100)
                px = img.getpixel((x, y))
                pixels.append(px[:3])
            
            avg_bright = sum(sum(p)/3 for p in pixels) / len(pixels)
            has_skin = any(p[0] > 150 and p[0] > p[2] and abs(p[0]-p[1]) < 40 for p in pixels)
            has_dark = any(sum(p)/3 < 80 for p in pixels)
            
            markers = ""
            if has_skin: markers += " [SKIN]"
            if has_dark: markers += " [DARK]"
            if avg_bright > 200: markers += " [BG]"
            
            print(f"  Y={ypct}%: avg_bright={avg_bright:.0f} {[f'({p[0]},{p[1]},{p[2]})' for p in pixels]}{markers}")

fine_scan('images/new/groom_nguyen.JPG', 'groom')
fine_scan('images/new/bride_jinnie.JPG', 'bride')

# Now calculate optimal CSS values
print("\n\n======= OPTIMAL CSS CALCULATIONS =======")

# Groom: face likely around Y=57-62%, X=50%
# Bride: face likely around Y=35-40%, X=50%
# We'll calculate for different face center assumptions

for label, img_path, face_y_options in [
    ('GROOM', 'images/new/groom_nguyen.JPG', [55, 58, 60, 62, 65]),
    ('BRIDE', 'images/new/bride_jinnie.JPG', [32, 35, 38, 40, 42])
]:
    img = Image.open(img_path)
    w, h = img.size
    ratio = h / w
    container = 120
    
    print(f"\n--- {label} ({w}x{h}, ratio={ratio:.2f}) ---")
    
    # With cover: displayed_w = container, displayed_h = container * ratio
    disp_w = container
    disp_h = container * ratio
    scale = w / disp_w
    
    print(f"  COVER: displayed = {disp_w}x{disp_h:.0f}, scale={scale:.1f}")
    print(f"  Overflow Y = {disp_h - container:.0f}px")
    
    for face_y_pct in face_y_options:
        face_y_disp = (face_y_pct / 100) * disp_h
        # We want face_y_disp at center of container (container/2)
        # offset_y needed = face_y_disp - container/2
        # background-position Y% = offset_y / (disp_h - container)
        needed_offset = face_y_disp - container / 2
        overflow = disp_h - container
        pos_y = (needed_offset / overflow) * 100
        pos_y = max(0, min(100, pos_y))
        
        # Verify: what area is visible
        actual_offset = (pos_y / 100) * overflow
        vis_top = actual_offset / disp_h * 100
        vis_bottom = (actual_offset + container) / disp_h * 100
        
        print(f"  face_y={face_y_pct}% → position: center {pos_y:.0f}% | visible: {vis_top:.1f}%-{vis_bottom:.1f}%")
    
    # With 200%: displayed_w = 240, displayed_h = 240 * ratio
    disp_w = 240
    disp_h = 240 * ratio
    scale = w / disp_w
    
    print(f"\n  200%: displayed = {disp_w}x{disp_h:.0f}, scale={scale:.1f}")
    
    for face_y_pct in face_y_options:
        face_y_disp = (face_y_pct / 100) * disp_h
        needed_offset = face_y_disp - container / 2
        overflow = disp_h - container
        pos_y = (needed_offset / overflow) * 100
        pos_y = max(0, min(100, pos_y))
        
        actual_offset = (pos_y / 100) * overflow
        vis_top = actual_offset / disp_h * 100
        vis_bottom = (actual_offset + container) / disp_h * 100
        
        print(f"  face_y={face_y_pct}% → position: 50% {pos_y:.0f}% | visible: {vis_top:.1f}%-{vis_bottom:.1f}%")
