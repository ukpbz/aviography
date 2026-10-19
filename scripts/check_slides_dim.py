import os
import struct

def get_jpeg_size(filepath):
    try:
        with open(filepath, "rb") as f:
            if f.read(2) != b"\xff\xd8": return None
            while True:
                marker, length = struct.unpack(">2sH", f.read(4))
                if marker in (b"\xff\xc0", b"\xff\xc2"):
                    b, h, w = struct.unpack(">BHH", f.read(5))
                    return (w, h)
                f.seek(length - 2, 1)
    except:
        return None

files = sorted(os.listdir("public/photos/homepage_slides"))
print(f"Total downloaded slides: {len(files)}")
for f in files:
    p = os.path.join("public/photos/homepage_slides", f)
    sz = get_jpeg_size(p)
    bytes_sz = os.path.getsize(p)
    print(f, sz, f"{bytes_sz} bytes")
