"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { InvoicePreview } from "@/components/invoice/invoice-preview";
import type { BusinessProfile, Template, Invoice } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0),
});

const formSchema = z.object({
  invoiceNumber: z.string().min(1),
  issueDate: z.date(),
  dueDate: z.date(),
  client: z.object({
    name: z.string().min(1, "Client name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Client address is required"),
  }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required."),
  notes: z.string().optional(),
});

export type InvoiceFormData = z.infer<typeof formSchema>;

const businessProfile: BusinessProfile = {
  name: "InvoicePilot Co.",
  email: "hello@invoicepilot.co",
  phone: "+91 98765 43210",
  address: "456 Pilot Avenue\nCloud City, Sky 98765",
  website: "https://invoicepilot.ai",
  taxId: "TAX-PILOT-9876",
};

export default function NewInvoicePage() {
  const [template, setTemplate] = useState<Template>("Modern");
  const [accentColor, setAccentColor] = useState("#D96A21"); // Default to accent color
  const [isMounted, setIsMounted] = useState(false);

  const methods = useForm<InvoiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: { name: "", email: "", address: "" },
      items: [],
      notes: "Thank you for your business!",
    },
  });

  useEffect(() => {
    setIsMounted(true);
    const invoiceNumber = `INV-${format(new Date(), "yyyyMMdd")}-${String(Math.floor(Math.random() * 900) + 100)}`;
    methods.reset({
      invoiceNumber: invoiceNumber,
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      client: { name: "Acme Corp", email: "contact@acme.com", address: "123 Innovation Drive\nTech City, KA 560001" },
      items: [
        { id: crypto.randomUUID(), description: "Synergy Platform Development", quantity: 20, unitPrice: 6500 },
        { id: crypto.randomUUID(), description: "Quantum AI Integration", quantity: 1, unitPrice: 95000 },
      ],
      notes: "Thank you for your business. We appreciate your partnership.",
    });
  }, [methods]);

  const watchedData = methods.watch();

  const subtotal = watchedData.items?.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0) ?? 0;
  const taxRate = 0.18; // Example 18% tax (GST)
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const invoiceForPreview: Invoice = {
    ...watchedData,
    issueDate: watchedData.issueDate || new Date(),
    dueDate: watchedData.dueDate || new Date(),
    subtotal,
    tax,
    total,
  };
  
  if (!isMounted) {
    return (
       <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
             <Skeleton className="h-64 w-full" />
             <Skeleton className="h-32 w-full" />
             <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[80vh] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <InvoiceForm businessProfile={businessProfile} />
          </div>
          <div className="lg:col-span-2 sticky top-24">
            <InvoicePreview
              invoice={invoiceForPreview}
              businessProfile={businessProfile}
              template={template}
              onTemplateChange={setTemplate}
              accentColor={accentColor}
              onAccentColorChange={setAccentColor}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
