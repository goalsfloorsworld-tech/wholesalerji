export interface LeadSubmission {
  _id?: string;
  name: string;
  businessName?: string;
  phone: string;
  email?: string;
  city: string;
  quantitySqFt: number;
  preferredMaterial: string;
  productId?: string;
  productName?: string;
  productSku?: string;
  message?: string;
  source?: 'Website RFQ Drawer' | 'Product Page' | 'WhatsApp Direct';
  status?: 'New' | 'Contacted' | 'Quoted' | 'Converted' | 'Lost';
  submittedAt?: string;
}

export const leadSchema = {
  name: 'lead',
  title: 'Lead / Inquiry',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Contact Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'city',
      title: 'City & Pincode',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'quantitySqFt',
      title: 'Required Quantity (Sq Ft)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'preferredMaterial',
      title: 'Preferred Material',
      type: 'string',
    },
    {
      name: 'product',
      title: 'Referenced Product',
      type: 'reference',
      to: [{ type: 'product' }],
    },
    {
      name: 'source',
      title: 'Lead Source',
      type: 'string',
      options: { list: ['Website RFQ Drawer', 'Product Page', 'WhatsApp Direct'] },
      initialValue: 'Website RFQ Drawer',
    },
    {
      name: 'status',
      title: 'Lead Status',
      type: 'string',
      options: { list: ['New', 'Contacted', 'Quoted', 'Converted', 'Lost'] },
      initialValue: 'New',
    },
    {
      name: 'submittedAt',
      title: 'Submission Timestamp',
      type: 'datetime',
    },
  ],
};

export default leadSchema;
