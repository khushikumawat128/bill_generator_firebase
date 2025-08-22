"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Update your business details here. This information will be used on your invoices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" placeholder="Acme Inc." defaultValue="InvoicePilot Co." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" placeholder="contact@acme.com" defaultValue="hello@invoicepilot.co" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="123 Main St, Anytown, USA 12345" defaultValue="456 Pilot Avenue, Cloud City, Sky 98765" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://acme.com" defaultValue="https://invoicepilot.ai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / GSTIN</Label>
              <Input id="taxId" placeholder="22AAAAA0000A1Z5" defaultValue="TAX-PILOT-9876" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
