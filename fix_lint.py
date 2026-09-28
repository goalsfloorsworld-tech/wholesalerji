import os

file_path = r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\components\server\ProductGrid.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import Link from 'next/link';\n", "")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed Link import")
