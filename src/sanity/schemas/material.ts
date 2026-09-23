export interface MaterialCategory {
  _id: string;
  name: string; // e.g. "WPC Louvers"
  slug: string; // e.g. "wpc"
  fullName: string; // "Wood Polymer Composite"
  seoTitle: string;
  seoDescription: string;
  heroImage: string;
  sortOrder?: number;
  faq?: Array<{ question: string; answer: string }>;
}

export const materialSchema = {
  name: 'material',
  title: 'Material Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Material Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'fullName',
      title: 'Full Technical Name',
      type: 'string',
    },
    {
      name: 'heroImage',
      title: 'Hero Image Asset',
      type: 'string',
    },
    {
      name: 'seoTitle',
      title: 'SEO Title Override',
      type: 'string',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description Override',
      type: 'text',
      rows: 3,
    },
    {
      name: 'faq',
      title: 'Category FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string' },
            { name: 'answer', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    },
  ],
};

export default materialSchema;
