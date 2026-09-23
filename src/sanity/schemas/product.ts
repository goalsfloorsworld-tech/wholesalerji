export interface BulkPriceTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  label?: string;
}

export interface ProductImage {
  cloudinaryPublicId: string;
  alt: string;
  isPrimary?: boolean;
}

export interface WallPanelProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  material: string;
  materialSlug: string;
  subcategory?: string;
  thickness: number; // in mm
  width: number; // in mm
  height: number; // in mm
  finish: string;
  colorFamily?: string;
  isWaterproof: boolean;
  isFireRetardant: boolean;
  isTermiteProof: boolean;
  isUVResistant: boolean;
  fireRating?: string;
  warrantyYears?: number;
  moq: number; // in sq ft or pieces
  priceUnit: string;
  bulkPricing: BulkPriceTier[];
  images: ProductImage[];
  shortDescription: string;
  longDescription?: string;
  isFeatured?: boolean;
  stockStatus: 'In Stock' | 'Low Stock' | 'Made to Order' | 'Discontinued';
}

// Sanity Type Definition object
export const productSchema = {
  name: 'product',
  title: 'Wall Panel Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(120),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'material',
      title: 'Material',
      type: 'reference',
      to: [{ type: 'material' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'thickness',
      title: 'Thickness (mm)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(50),
    },
    {
      name: 'width',
      title: 'Panel Width (mm)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'height',
      title: 'Panel Height (mm)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'finish',
      title: 'Surface Finish',
      type: 'string',
    },
    {
      name: 'isWaterproof',
      title: 'Waterproof',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'isFireRetardant',
      title: 'Fire Retardant',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'isTermiteProof',
      title: 'Termite Proof',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'moq',
      title: 'Minimum Order Quantity',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'priceUnit',
      title: 'Price Display Unit',
      type: 'string',
      initialValue: 'per sq ft',
    },
    {
      name: 'bulkPricing',
      title: 'Bulk Pricing Tiers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'minQuantity', type: 'number', title: 'Min Qty' },
            { name: 'maxQuantity', type: 'number', title: 'Max Qty' },
            { name: 'pricePerUnit', type: 'number', title: 'Price per Unit (₹)' },
            { name: 'label', type: 'string', title: 'Label' },
          ],
        },
      ],
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'cloudinaryPublicId', type: 'string', title: 'Image URL or Cloudinary ID' },
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'isPrimary', type: 'boolean', title: 'Is Primary Image' },
          ],
        },
      ],
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'stockStatus',
      title: 'Stock Status',
      type: 'string',
      options: { list: ['In Stock', 'Low Stock', 'Made to Order', 'Discontinued'] },
      initialValue: 'In Stock',
    },
    {
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
  ],
};

export default productSchema;
