import os

files_to_update = [
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\app\page.tsx",
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\components\Navbar.tsx",
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\components\Footer.tsx",
]

replacements = {
    "/products/primo-panels": "/wall-panels/primo",
    "/products/elite-panels": "/wall-panels/elite",
    "/products/primo-fluted-panels": "/wall-panels/primo-fluted",
    "/products/elite-fluted-panels": "/wall-panels/elite-fluted",
    "currentPath.startsWith('/products')": "currentPath.startsWith('/wall-panels/primo') || currentPath.startsWith('/wall-panels/elite')"
}

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated links across files")
