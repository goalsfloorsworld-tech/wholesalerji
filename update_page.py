import os

file_path = r"c:\Users\MD NEYAZ\Videos\My Sites\goalsfloors-universe\wholesalerji\src\app\wall-panels\[material]\page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

imports = """import PrimoSeriesTemplate from '@/components/templates/PrimoSeriesTemplate';
import EliteSeriesTemplate from '@/components/templates/EliteSeriesTemplate';
import PrimoFlutedSeriesTemplate from '@/components/templates/PrimoFlutedSeriesTemplate';
import EliteFlutedSeriesTemplate from '@/components/templates/EliteFlutedSeriesTemplate';

import { PRIMO_WALL_PANELS } from '@/data/primoPanelsData';
import { ELITE_WALL_PANELS } from '@/data/elitePanelsData';
import { PRIMO_FLUTED_WALL_PANELS } from '@/data/primoFlutedPanelsData';
import { ELITE_FLUTED_WALL_PANELS } from '@/data/eliteFlutedPanelsData';

"""

routing = """  const products = await getProducts(material.slug);
  const allMaterials = await getMaterials();

  const getFaqSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": material.faq?.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })) || [],
  });

  if (materialSlug === 'primo') {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqSchema()) }} />
        <main className="flex-1">
          <PrimoSeriesTemplate initialData={PRIMO_WALL_PANELS[0]} allShades={PRIMO_WALL_PANELS} />
        </main>
      </div>
    );
  }

  if (materialSlug === 'elite') {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqSchema()) }} />
        <main className="flex-1">
          <EliteSeriesTemplate initialData={ELITE_WALL_PANELS[0]} allShades={ELITE_WALL_PANELS} />
        </main>
      </div>
    );
  }

  if (materialSlug === 'primo-fluted') {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqSchema()) }} />
        <main className="flex-1">
          <PrimoFlutedSeriesTemplate initialData={PRIMO_FLUTED_WALL_PANELS[0]} allShades={PRIMO_FLUTED_WALL_PANELS} />
        </main>
      </div>
    );
  }

  if (materialSlug === 'elite-fluted') {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqSchema()) }} />
        <main className="flex-1">
          <EliteFlutedSeriesTemplate initialData={ELITE_FLUTED_WALL_PANELS[0]} allShades={ELITE_FLUTED_WALL_PANELS} />
        </main>
      </div>
    );
  }

"""

content = content.replace("import LeadForm from '@/components/client/LeadForm';", "import LeadForm from '@/components/client/LeadForm';\n" + imports)
content = content.replace("  const products = await getProducts(material.slug);\n  const allMaterials = await getMaterials();\n", routing)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated page.tsx")
