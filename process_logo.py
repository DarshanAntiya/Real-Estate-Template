import os
import requests
from io import BytesIO
from rembg import remove
from PIL import Image, ImageDraw, ImageFont

# 1. Read input logo image
input_path = '/Users/darshanpatel/Downloads/Improve_the_image_quality_and_remove_the_backgroun_delpmaspu.png'
output_path = '/Users/darshanpatel/Desktop/Darshan/Antigravity/RIZ-WEE & CO./public/logo.png'

with open(input_path, 'rb') as i:
    input_data = i.read()

# 2. Remove background
output_data = remove(input_data)
img = Image.open(BytesIO(output_data)).convert("RGBA")

# 3. Crop
box = img.getbbox()
if box:
    img_cropped = img.crop(box)
    width, height = img_cropped.size
    
    pixels = img_cropped.load()
    split_y = int(height * 0.6)
    for y in range(height//3, int(height*0.8)):
        is_empty = True
        for x in range(width):
            if pixels[x, y][3] > 10: 
                is_empty = False
                break
        if is_empty:
            split_y = y
            break
            
    icon = img_cropped.crop((0, 0, width, split_y))
    # trim icon
    icon_box = icon.getbbox()
    if icon_box:
        icon = icon.crop(icon_box)
        
    # sample color
    w, h = icon.size
    sample_color = (255, 255, 255, 255)
    for y in range(h):
        for x in range(w):
            p = icon.getpixel((x,y))
            if p[3] > 200 and p[0] > 100: # not black outline
                sample_color = tuple(p)
                break
        if sample_color != (255, 255, 255, 255):
            break
            
    font_url = "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf"
    r = requests.get(font_url)
    with open('/tmp/PlayfairDisplay.ttf', 'wb') as f:
        f.write(r.content)
        
    target_height = 80
    ratio = target_height / float(icon.height)
    new_width = int(icon.width * ratio)
    icon = icon.resize((new_width, target_height), Image.Resampling.LANCZOS)
    
    font_size = 56
    font = ImageFont.truetype('/tmp/PlayfairDisplay.ttf', font_size)
    text = "SHREENATH ESTATE"
    
    left, top, right, bottom = font.getbbox(text)
    text_width = right - left
    text_height = bottom - top
    
    padding = 24
    final_width = new_width + padding + text_width
    final_height = max(target_height, text_height)
    
    out_img = Image.new("RGBA", (final_width, final_height), (255, 255, 255, 0))
    
    icon_y = (final_height - target_height) // 2
    out_img.paste(icon, (0, icon_y), icon)
    
    draw = ImageDraw.Draw(out_img)
    text_y = (final_height - text_height) // 2 - top 
    # Use white color as base since the logo sits on dark backgrounds and uses filters
    # User might want the original color but white is the safest
    # We'll use the sampled color since that gives the gold look and filter will convert it correctly
    draw.text((new_width + padding, text_y), text, font=font, fill=sample_color)
    
    out_img.save(output_path)
    print("Logo processed and saved.")
else:
    print("Error processing image")
