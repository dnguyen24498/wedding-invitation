from PIL import Image

# Analyze groom image
groom = Image.open('images/new/groom_nguyen.JPG')
gw, gh = groom.size
print(f'=== GROOM IMAGE ===')
print(f'Size: {gw}x{gh}')
print(f'Aspect ratio: {gw/gh:.3f}')

# Analyze bride image
bride = Image.open('images/new/bride_jinnie.JPG')
bw, bh = bride.size
print(f'\n=== BRIDE IMAGE ===')
print(f'Size: {bw}x{bh}')
print(f'Aspect ratio: {bw/bh:.3f}')

circle = 120  # px

print(f'\n=== GROOM CALCULATIONS ===')
for size_pct in [180, 200, 250, 320]:
    disp_w = circle * size_pct / 100
    disp_h = disp_w * (gh / gw)
    print(f'\nbackground-size: {size_pct}%')
    print(f'  Display size: {disp_w:.0f}x{disp_h:.0f}px')
    
    scale = gw / disp_w
    print(f'  Scale: {scale:.2f} (1 display px = {scale:.2f} original px)')
    
    for pos_x, pos_y in [(48, 22), (55, 22), (58, 25), (50, 30), (50, 28)]:
        off_x = (pos_x / 100) * (disp_w - circle)
        off_y = (pos_y / 100) * (disp_h - circle)
        orig_x = off_x * scale
        orig_y = off_y * scale
        orig_w = circle * scale
        orig_h = circle * scale
        print(f'  pos {pos_x}%/{pos_y}%: orig=({orig_x:.0f},{orig_y:.0f})-({orig_x+orig_w:.0f},{orig_y+orig_h:.0f}) center=({(orig_x+orig_w/2)/gw*100:.1f}%,{(orig_y+orig_h/2)/gh*100:.1f}%)')

print(f'\n=== BRIDE CALCULATIONS ===')
for size_pct in [180, 200, 250, 300]:
    disp_w = circle * size_pct / 100
    disp_h = disp_w * (bh / bw)
    print(f'\nbackground-size: {size_pct}%')
    print(f'  Display size: {disp_w:.0f}x{disp_h:.0f}px')
    
    scale = bw / disp_w
    
    for pos_x, pos_y in [(50, 14), (50, 18), (48, 20), (50, 15), (50, 12)]:
        off_x = (pos_x / 100) * (disp_w - circle)
        off_y = (pos_y / 100) * (disp_h - circle)
        orig_x = off_x * scale
        orig_y = off_y * scale
        orig_w = circle * scale
        orig_h = circle * scale
        print(f'  pos {pos_x}%/{pos_y}%: orig=({orig_x:.0f},{orig_y:.0f})-({orig_x+orig_w:.0f},{orig_y+orig_h:.0f}) center=({(orig_x+orig_w/2)/bw*100:.1f}%,{(orig_y+orig_h/2)/bh*100:.1f}%)')

# Now try to detect faces using a simple approach
# The face in the groom image is roughly at ~30.8% from top (Y=740/2400)
# The face in the bride image is roughly at ~21.5% from top (Y=1260/5855)
print("\n=== FACE POSITIONS (from previous analysis) ===")
print(f"Groom face center: ~50% X, ~30.8% Y (pixel ~800, ~740)")
print(f"Bride face center: ~50% X, ~21.5% Y (pixel ~1952, ~1260)")

# For background-position to center the face in the circle:
# We need: face_position_in_displayed_image = offset + circle/2
# offset = (pos% / 100) * (disp_size - circle)
# face_pos_in_display = (face_pos_in_original / original_size) * disp_size
# So: (face_pos_in_original / original_size) * disp_size = (pos% / 100) * (disp_size - circle) + circle/2
# pos% = ((face_pos / orig_size * disp_size - circle/2) / (disp_size - circle)) * 100

print("\n=== OPTIMAL POSITION FOR EACH SIZE ===")
groom_face_x, groom_face_y = 800, 740
bride_face_x, bride_face_y = 1952, 1260

print("\nGROOM (face at 800,740 in 1600x2400):")
for size_pct in [180, 200, 220, 250]:
    disp_w = circle * size_pct / 100
    disp_h = disp_w * (gh / gw)
    
    face_disp_x = (groom_face_x / gw) * disp_w
    face_disp_y = (groom_face_y / gh) * disp_h
    
    if disp_w > circle and disp_h > circle:
        pos_x = ((face_disp_x - circle/2) / (disp_w - circle)) * 100
        pos_y = ((face_disp_y - circle/2) / (disp_h - circle)) * 100
        pos_x = max(0, min(100, pos_x))
        pos_y = max(0, min(100, pos_y))
        print(f"  size {size_pct}%: optimal position = {pos_x:.0f}% {pos_y:.0f}%")
        
        # Verify: what area is visible?
        off_x = (pos_x / 100) * (disp_w - circle)
        off_y = (pos_y / 100) * (disp_h - circle)
        scale = gw / disp_w
        orig_x = off_x * scale
        orig_y = off_y * scale
        orig_w = circle * scale
        orig_h = circle * scale
        print(f"    -> visible: ({orig_x:.0f},{orig_y:.0f})-({orig_x+orig_w:.0f},{orig_y+orig_h:.0f}), center=({orig_x+orig_w/2:.0f},{orig_y+orig_h/2:.0f})")

print("\nBRIDE (face at 1952,1260 in 3903x5855):")
for size_pct in [180, 200, 220, 250]:
    disp_w = circle * size_pct / 100
    disp_h = disp_w * (bh / bw)
    
    face_disp_x = (bride_face_x / bw) * disp_w
    face_disp_y = (bride_face_y / bh) * disp_h
    
    if disp_w > circle and disp_h > circle:
        pos_x = ((face_disp_x - circle/2) / (disp_w - circle)) * 100
        pos_y = ((face_disp_y - circle/2) / (disp_h - circle)) * 100
        pos_x = max(0, min(100, pos_x))
        pos_y = max(0, min(100, pos_y))
        print(f"  size {size_pct}%: optimal position = {pos_x:.0f}% {pos_y:.0f}%")
        
        off_x = (pos_x / 100) * (disp_w - circle)
        off_y = (pos_y / 100) * (disp_h - circle)
        scale = bw / disp_w
        orig_x = off_x * scale
        orig_y = off_y * scale
        orig_w = circle * scale
        orig_h = circle * scale
        print(f"    -> visible: ({orig_x:.0f},{orig_y:.0f})-({orig_x+orig_w:.0f},{orig_y+orig_h:.0f}), center=({orig_x+orig_w/2:.0f},{orig_y+orig_h/2:.0f})")
