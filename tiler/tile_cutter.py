from PIL import Image, ImageDraw
import os
import math

def pad_to_power_of_two(img, tile_size=256):
    width, height = img.size
    max_side = max(width, height)
    # 计算最近的2的幂
    target_size = 2 ** math.ceil(math.log(max_side, 2))
    if width == target_size and height == target_size:
        return img
    new_img = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
    new_img.paste(img, (0, 0))
    return new_img

def create_tiles(input_image, output_dir, tile_size=256):
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 打开输入图片
    img = Image.open(input_image)
    img = pad_to_power_of_two(img, tile_size)
    width, height = img.size
    
    # 计算缩放级别
    max_zoom = int(math.log(width // tile_size, 2))
    
    # 为每个缩放级别创建瓦片
    for zoom in range(max_zoom + 1):
        zoom_dir = os.path.join(output_dir, str(zoom))
        os.makedirs(zoom_dir, exist_ok=True)
        
        # 计算当前缩放级别的图片大小
        scale = 2 ** (max_zoom - zoom)
        current_width = width // scale
        current_height = height // scale
        
        # 调整图片大小
        resized = img.resize((current_width, current_height), Image.Resampling.LANCZOS)
        
        # 切割瓦片
        for x in range(0, current_width, tile_size):
            for y in range(0, current_height, tile_size):
                tile = resized.crop((x, y, x + tile_size, y + tile_size))
                tile_path = os.path.join(zoom_dir, f"{x//tile_size}_{y//tile_size}.png")
                tile.save(tile_path)

def create_error_tile(output_path, tile_size=256):
    # 创建一个红色背景的瓦片
    error_tile = Image.new('RGB', (tile_size, tile_size), color='red')
    draw = ImageDraw.Draw(error_tile)
    draw.text((tile_size // 4, tile_size // 2), "Error", fill="white")
    error_tile.save(output_path)

if __name__ == "__main__":
    # 生成错误瓦片
    create_error_tile("public/tiles/error.png")

    # 生成地图瓦片
    create_tiles("first_edition_map.png", "first_edition_tiles")