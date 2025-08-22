"use client";

import type { FC } from 'react';
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2, Wand2, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { BusinessProfile } from "@/lib/types";
import type { InvoiceFormData } from "@/app/dashboard/invoice/new/page";
import { suggestInvoiceDetails, SuggestInvoiceDetailsOutput } from "@/ai/flows/suggest-invoice-details";
import { useToast } from "@/hooks/use-toast";
import React from 'react';

interface InvoiceFormProps {
  businessProfile: BusinessProfile;
}

export const InvoiceForm: FC<InvoiceFormProps> = ({ businessProfile }) => {
  const { register, control, formState: { errors }, setValue, reset } = useFormContext<InvoiceFormData>();
  const { toast } = useToast();
  const [aiDescription, setAiDescription] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleAiGenerate = async () => {
    if (!aiDescription) {
      toast({ title: "Error", description: "Please enter a transaction description.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const result: SuggestInvoiceDetailsOutput = await suggestInvoiceDetails({
        transactionDescription: aiDescription,
        businessProfile: JSON.stringify(businessProfile),
      });

      const transformedData: InvoiceFormData = {
        invoiceNumber: result.invoiceNumber,
        issueDate: new Date(result.issueDate),
        dueDate: new Date(result.dueDate),
        client: {
          name: "Client Name", // AI doesn't provide this yet
          email: "client@email.com", // AI doesn't provide this yet
          address: result.billingAddress,
        },
        items: result.items.map(item => ({ ...item, id: crypto.randomUUID() })),
        notes: "Thank you for your business!"
      };

      reset(transformedData);
      toast({ title: "Success", description: "Invoice details have been populated by AI." });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast({ title: "AI Error", description: "Failed to generate invoice details. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <form className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Describe the transaction and let AI fill in the details for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="e.g., 'Sold 10 hours of web design consulting at $150/hr and one year of hosting for $300 to Acme Corp.'" 
            value={aiDescription}
            onChange={(e) => setAiDescription(e.target.value)}
          />
          <Button type="button" onClick={handleAiGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Who is this invoice for?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client.name">Client Name</Label>
            <Input id="client.name" {...register("client.name")} />
            {errors.client?.name && <p className="text-destructive text-sm">{errors.client.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="client.email">Client Email</Label>
            <Input id="client.email" type="email" {...register("client.email")} />
            {errors.client?.email && <p className="text-destructive text-sm">{errors.client.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="client.address">Client Address</Label>
            <Textarea id="client.address" {...register("client.address")} />
            {errors.client?.address && <p className="text-destructive text-sm">{errors.client.address.message}</p>}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input id="invoiceNumber" {...register("invoiceNumber")} />
              {errors.invoiceNumber && <p className="text-destructive text-sm">{errors.invoiceNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
               <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Add the items for this invoice.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start p-2 rounded-lg border">
              <div className="col-span-12 md:col-span-5 space-y-2">
                <Label htmlFor={`items.${index}.description`} className="sr-only">Description</Label>
                <Input placeholder="Item description" {...register(`items.${index}.description`)} />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-2">
                <Label htmlFor={`items.${index}.quantity`} className="sr-only">Quantity</Label>
                <Input type="number" placeholder="Qty" {...register(`items.${index}.quantity`)} />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-2">
                 <Label htmlFor={`items.${index}.unitPrice`} className="sr-only">Price</Label>
                <Input type="number" placeholder="Price" {...register(`items.${index}.unitPrice`)} />
              </div>
               <div className="col-span-4 md:col-span-2 flex items-center h-10">
                <p className="text-sm text-muted-foreground font-mono">
                 $ {((watch) => (watch(`items.${index}.quantity`) * watch(`items.${index}.unitPrice`)) || 0)(control.watch).toFixed(2)}
                </p>
              </div>
              <div className="col-span-12 md:col-span-1 flex items-center justify-end h-10">
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {errors.items && <p className="text-destructive text-sm">{errors.items.message}</p>}

          <Button type="button" variant="outline" onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 })}>
            Add Item
          </Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
           <Textarea placeholder="Any additional notes for the client..." {...register("notes")} />
        </CardContent>
      </Card>
    </form>
  );
};
