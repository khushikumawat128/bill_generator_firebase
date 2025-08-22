"use client"
import type { FC } from 'react';
import type { Invoice, BusinessProfile } from '@/lib/types';
import { format } from 'date-fns';

interface TemplateProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  accentColor: string;
}

export const ClassicTemplate: FC<TemplateProps> = ({ invoice, businessProfile, accentColor }) => {
    return (
        <div className="p-10 text-black font-serif bg-white h-full border-4" style={{borderColor: accentColor}}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-wider">{businessProfile.name}</h1>
                <p className="text-sm text-gray-600">{businessProfile.address.replace(/\n/g, ' | ')}</p>
                <p className="text-sm text-gray-600">{businessProfile.phone} | {businessProfile.email}</p>
            </header>
            
            <div className="flex justify-between mb-8">
                <div>
                    <h2 className="text-lg font-semibold" style={{color: accentColor}}>Invoice To:</h2>
                    <p className="font-bold">{invoice.client.name}</p>
                    <p>{invoice.client.address.replace(/\n/g, ', ')}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p># {invoice.invoiceNumber}</p>
                    <p className="mt-2"><strong>Date Issued:</strong> {format(invoice.issueDate, 'MM/dd/yyyy')}</p>
                    <p><strong>Due Date:</strong> {format(invoice.dueDate, 'MM/dd/yyyy')}</p>
                </div>
            </div>

            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="border-b-2 border-t-2" style={{borderColor: accentColor}}>
                        <th className="p-2 text-left text-sm font-bold uppercase">Description</th>
                        <th className="p-2 text-center text-sm font-bold uppercase">Qty</th>
                        <th className="p-2 text-right text-sm font-bold uppercase">Price</th>
                        <th className="p-2 text-right text-sm font-bold uppercase">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="p-2">{item.description}</td>
                            <td className="p-2 text-center">{item.quantity}</td>
                            <td className="p-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                            <td className="p-2 text-right">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="flex justify-end">
                <table className="w-1/3">
                    <tbody>
                        <tr>
                            <td className="p-1 text-right font-semibold">Subtotal:</td>
                            <td className="p-1 text-right">₹{invoice.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="p-1 text-right font-semibold">Tax:</td>
                            <td className="p-1 text-right">₹{invoice.tax.toFixed(2)}</td>
                        </tr>
                        <tr className="border-t-2" style={{borderColor: accentColor}}>
                            <td className="p-2 text-right font-bold text-lg">Total Due:</td>
                            <td className="p-2 text-right font-bold text-lg">₹{invoice.total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <footer className="mt-10 pt-5 border-t text-sm text-gray-600">
                <p><strong>Notes:</strong> {invoice.notes}</p>
                <p className="mt-4 text-center">Thank you for your business!</p>
            </footer>
        </div>
    )
}
