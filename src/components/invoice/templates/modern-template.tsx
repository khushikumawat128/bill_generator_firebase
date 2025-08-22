"use client"
import type { FC } from 'react';
import type { Invoice, BusinessProfile } from '@/lib/types';
import { format } from 'date-fns';

interface TemplateProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  accentColor: string;
}

export const ModernTemplate: FC<TemplateProps> = ({ invoice, businessProfile, accentColor }) => {
    return (
        <div className="p-8 text-black font-sans bg-white h-full">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: accentColor }}>INVOICE</h1>
                    <p className="text-gray-500">Invoice #: {invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold text-gray-800">{businessProfile.name}</h2>
                    <p className="text-gray-500">{businessProfile.address.replace(/\n/g, ', ')}</p>
                    <p className="text-gray-500">{businessProfile.email}</p>
                    <p className="text-gray-500">{businessProfile.phone}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h3 className="text-gray-500 font-semibold mb-2">BILL TO</h3>
                    <p className="font-bold text-gray-800">{invoice.client.name}</p>
                    <p className="text-gray-600">{invoice.client.address.replace(/\n/g, ', ')}</p>
                    <p className="text-gray-600">{invoice.client.email}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500"><strong>Issue Date:</strong> {format(invoice.issueDate, 'PPP')}</p>
                    <p className="text-gray-500"><strong>Due Date:</strong> {format(invoice.dueDate, 'PPP')}</p>
                </div>
            </div>

            <table className="w-full mb-8">
                <thead>
                    <tr style={{ backgroundColor: accentColor, color: '#fff' }}>
                        <th className="p-3 text-left font-semibold">Description</th>
                        <th className="p-3 text-center font-semibold">Quantity</th>
                        <th className="p-3 text-right font-semibold">Unit Price</th>
                        <th className="p-3 text-right font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                            <td className="p-3">{item.description}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">${item.unitPrice.toFixed(2)}</td>
                            <td className="p-3 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-1/3">
                    <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Tax</span>
                        <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                    <hr className="my-2 border-gray-300"/>
                    <div className="flex justify-between font-bold text-lg" style={{ color: accentColor }}>
                        <span>Total</span>
                        <span>${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 text-gray-500">
                <h4 className="font-semibold mb-1">Notes</h4>
                <p>{invoice.notes}</p>
            </div>
        </div>
    )
}
