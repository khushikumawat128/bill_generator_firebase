"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import type { Invoice, BusinessProfile, Template } from "@/lib/types";
import { ModernTemplate } from "./templates/modern-template";
import { ClassicTemplate } from "./templates/classic-template";
import { CreativeTemplate } from "./templates/creative-template";
import { TemplateWrapper } from "./templates/template-wrapper";

interface InvoicePreviewProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  template: Template;
  onTemplateChange: (template: Template) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

const colorSwatches = [
  "#D96A21", // Accent
  "#F0D960", // Primary
  "#3B82F6", // Blue
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#000000", // Black
];

export const InvoicePreview: FC<InvoicePreviewProps> = ({
  invoice,
  businessProfile,
  template,
  onTemplateChange,
  accentColor,
  onAccentColorChange,
}) => {
  const handlePrint = () => {
    const printContents = document.getElementById("invoice-preview-area")?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      const printWindow = window.open('', '', 'height=600,width=800');
      
      if(printWindow) {
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        // You might need to link your stylesheet here for styles to apply
        const styles = Array.from(document.styleSheets).map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : '').join('');
        const tailwind = `<style>${Array.from(document.querySelectorAll('style')).map(s => s.innerText).join('')}</style>`;
        printWindow.document.write(styles);
        printWindow.document.write(tailwind);
        printWindow.document.write('</head><body >');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        // Use a timeout to ensure content is loaded before printing
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);

      }
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case "Modern":
        return <ModernTemplate invoice={invoice} businessProfile={businessProfile} accentColor={accentColor} />;
      case "Classic":
        return <ClassicTemplate invoice={invoice} businessProfile={businessProfile} accentColor={accentColor} />;
      case "Creative":
        return <CreativeTemplate invoice={invoice} businessProfile={businessProfile} accentColor={accentColor} />;
      default:
        return <ModernTemplate invoice={invoice} businessProfile={businessProfile} accentColor={accentColor} />;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Preview & Customize</CardTitle>
        <CardDescription>
          Select a template and customize its appearance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div>
            <Label htmlFor="template">Template</Label>
            <Select onValueChange={(v) => onTemplateChange(v as Template)} value={template}>
                <SelectTrigger id="template">
                <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Modern">Modern</SelectItem>
                <SelectItem value="Classic">Classic</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div>
            <Label>Accent Color</Label>
            <div className="flex items-center gap-2 mt-2">
                {colorSwatches.map((color) => (
                <button
                    key={color}
                    onClick={() => onAccentColorChange(color)}
                    className={cn(
                    "h-8 w-8 rounded-full border-2 transition-transform",
                    accentColor === color ? "border-foreground scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Set accent color to ${color}`}
                />
                ))}
            </div>
            </div>
        </div>
        
        <TemplateWrapper>{renderTemplate()}</TemplateWrapper>
      
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline"><Share2 className="mr-2 h-4 w-4"/>Share</Button>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handlePrint}><Download className="mr-2 h-4 w-4" />Download PDF</Button>
      </CardFooter>
    </Card>
  );
};
