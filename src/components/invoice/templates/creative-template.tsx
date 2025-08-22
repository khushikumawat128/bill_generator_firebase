"use client"
import type { FC } from 'react';
import type { Invoice, BusinessProfile } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';

interface TemplateProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  accentColor: string;
}

export const CreativeTemplate: FC<TemplateProps> = ({ invoice, businessProfile, accentColor }) => {
  return (
    <div className="text-black font-sans bg-gray-50 h-full flex">
      <div className="w-1/3 p-8 text-white" style={{ backgroundColor: accentColor }}>
        <h2 className="text-3xl font-bold mb-10">INVOICE</h2>
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider">From</p>
          <p className="font-bold">{businessProfile.name}</p>
          <p className="text-sm">{businessProfile.address.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider">To</p>
          <p className="font-bold">{invoice.client.name}</p>
          <p className="text-sm">{invoice.client.address.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
        </div>
        <div className="absolute bottom-8">
            <Image src="https://placehold.co/150x50.png" alt="Company Logo" width={150} height={50} data-ai-hint="company logo" />
        </div>
      </div>
      <div className="w-2/3 p-8 bg-white">
        <div className="text-right mb-10">
            <p><strong>Invoice #</strong> {invoice.invoiceNumber}</p>
            <p><strong>Issued:</strong> {format(invoice.issueDate, 'MMMM d, yyyy')}</p>
            <p><strong>Due:</strong> {format(invoice.dueDate, 'MMMM d, yyyy')}</p>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="p-2 text-left font-semibold text-gray-600 uppercase">Description</th>
              <th className="p-2 text-center font-semibold text-gray-600 uppercase">Qty</th>
              <th className="p-2 text-right font-semibold text-gray-600 uppercase">Price</th>
              <th className="p-2 text-right font-semibold text-gray-600 uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="p-3 font-medium">{item.description}</td>
                <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                <td className="p-3 text-right text-gray-600">₹{item.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-right font-medium">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

         <div className="flex justify-end">
            <div className="w-1/2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{invoice.tax.toFixed(2)}</span>
                </div>
                <hr className="my-2 border-gray-200"/>
                <div className="flex justify-between font-bold text-xl" style={{ color: accentColor }}>
                    <span>Amount Due</span>
                    <span>₹{invoice.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div className="mt-10 text-gray-500 text-sm">
            <p><strong>Notes:</strong> {invoice.notes}</p>
        </div>

      </div>
    </div>
  )
}
