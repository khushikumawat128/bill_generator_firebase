export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
};

export type BusinessProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxId: string;
};

export type Template = "Modern" | "Classic" | "Creative";
