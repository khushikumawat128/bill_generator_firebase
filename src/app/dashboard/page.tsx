import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const invoices = [
  { id: "INV-240012", client: "Reliance Industries", date: "2024-07-15", total: "₹1,50,000.00", status: "Paid" },
  { id: "INV-240011", client: "Tata Consultancy Services", date: "2024-07-12", total: "₹2,75,000.00", status: "Pending" },
  { id: "INV-240010", client: "HDFC Bank", date: "2024-07-05", total: "₹85,500.00", status: "Paid" },
  { id: "INV-240009", client: "Infosys", date: "2024-06-28", total: "₹3,10,000.00", status: "Overdue" },
  { id: "INV-240008", client: "Airtel", date: "2024-06-25", total: "₹55,000.00", status: "Draft" },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to InvoicePilot</h1>
          <p className="text-muted-foreground">
            Manage your invoices efficiently and effortlessly.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/invoice/new">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            A list of your most recent invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="text-right">{invoice.total}</TableCell>
                  <TableCell className="text-center">
                     <Badge variant={
                        invoice.status === 'Paid' ? 'success' :
                        invoice.status === 'Pending' ? 'secondary' :
                        invoice.status === 'Overdue' ? 'destructive' :
                        'outline'
                      }
                     >
                       {invoice.status}
                     </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
