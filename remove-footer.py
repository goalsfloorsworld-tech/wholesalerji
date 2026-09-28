import os
import re

files_to_check = [
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\components\templates\PrimoSeriesTemplate.tsx",
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\components\templates\PrimoFlutedSeriesTemplate.tsx",
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\components\templates\EliteSeriesTemplate.tsx",
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\components\templates\EliteFlutedSeriesTemplate.tsx",
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\app\wall-panels\[material]\page.tsx",
    r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\app\wall-panels\page.tsx"
]

pattern = re.compile(r'\s*\{/\* ─+ \*/\}\s*\{/\* FOOTER WITH GRAND ARCHITECTURAL "WHOLESALERJI" WATERMARK\s*\*/\}\s*\{/\* ─+ \*/\}\s*<footer className="relative border-t border-stone-800/80 bg-stone-950 pt-16 pb-12 text-stone-400 text-xs overflow-hidden select-none">.*?</footer\>', re.DOTALL)

for file_path in files_to_check:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, count = pattern.subn('', content)
        if count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed footer from {file_path}")
        else:
            print(f"No match in {file_path}")
