import os

file_path = r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\next.config.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

redirects_code = """
  async redirects() {
    return [
      {
        source: '/products/primo-panels',
        destination: '/wall-panels/primo',
        permanent: true,
      },
      {
        source: '/products/elite-panels',
        destination: '/wall-panels/elite',
        permanent: true,
      },
      {
        source: '/products/primo-fluted-panels',
        destination: '/wall-panels/primo-fluted',
        permanent: true,
      },
      {
        source: '/products/elite-fluted-panels',
        destination: '/wall-panels/elite-fluted',
        permanent: true,
      },
    ];
  },
"""

content = content.replace("  images: {", redirects_code + "  images: {")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated next.config.ts")
