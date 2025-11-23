'use client';

import { useEffect, useState } from 'react';
import { invoicesAPI, customersAPI, currenciesAPI, taxesAPI } from '@/lib/api';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [taxes, setTaxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [invoicesRes, customersRes, currenciesRes, taxesRes] = await Promise.all([
                invoicesAPI.getAll(),
                customersAPI.getAll(),
                currenciesAPI.getAll(),
                taxesAPI.getAll(),
            ]);
            setInvoices(invoicesRes.data);
            setCustomers(customersRes.data);
            setCurrencies(currenciesRes.data);
            setTaxes(taxesRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const items = [
            {
                name: formData.get('itemName'),
                description: formData.get('itemDescription'),
                quantity: parseFloat(formData.get('quantity') as string),
                price: parseFloat(formData.get('price') as string),
                taxId: formData.get('taxId') || null,
            },
        ];

        try {
            await invoicesAPI.create({
                customerId: formData.get('customerId'),
                currencyId: formData.get('currencyId'),
                invoiceDate: formData.get('invoiceDate'),
                dueDate: formData.get('dueDate'),
                items,
                notes: formData.get('notes'),
                discountAmount: parseFloat(formData.get('discountAmount') as string) || 0,
            });
            toast.success('Invoice created successfully');
            setShowCreateModal(false);
            loadData();
        } catch (error) {
            toast.error('Failed to create invoice');
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await invoicesAPI.updateStatus(id, status);
            toast.success('Status updated');
            loadData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredInvoices = filter
        ? invoices.filter((inv) => inv.status === filter)
        : invoices;

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                    <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Invoice
                </button>
            </div>

            <div className="card">
                <div className="flex gap-2 mb-4">
                    <button onClick={() => setFilter('')} className={`px-3 py-1 rounded-lg text-sm ${!filter ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
                    <button onClick={() => setFilter('DRAFT')} className={`px-3 py-1 rounded-lg text-sm ${filter === 'DRAFT' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Draft</button>
                    <button onClick={() => setFilter('SENT')} className={`px-3 py-1 rounded-lg text-sm ${filter === 'SENT' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Sent</button>
                    <button onClick={() => setFilter('PAID')} className={`px-3 py-1 rounded-lg text-sm ${filter === 'PAID' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Paid</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.customer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.invoiceDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.dueDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(invoice.total)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`badge ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            className="text-sm border rounded px-2 py-1"
                                            value={invoice.status}
                                            onChange={(e) => handleUpdateStatus(invoice.id, e.target.value)}
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="SENT">Sent</option>
                                            <option value="PAID">Paid</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Create New Invoice</h2>
                        <form onSubmit={handleCreateInvoice} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Customer</label>
                                    <select name="customerId" required className="input">
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Currency</label>
                                    <select name="currencyId" required className="input">
                                        {currencies.map((c) => (
                                            <option key={c.id} value={c.id}>{c.code}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Invoice Date</label>
                                    <input type="date" name="invoiceDate" required className="input" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div>
                                    <label className="label">Due Date</label>
                                    <input type="date" name="dueDate" required className="input" />
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold mb-3">Invoice Item</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="label">Item Name</label>
                                        <input type="text" name="itemName" required className="input" placeholder="e.g., Web Development" />
                                    </div>
                                    <div>
                                        <label className="label">Description</label>
                                        <input type="text" name="itemDescription" className="input" placeholder="Optional" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="label">Quantity</label>
                                            <input type="number" name="quantity" required min="1" step="0.01" defaultValue="1" className="input" />
                                        </div>
                                        <div>
                                            <label className="label">Price</label>
                                            <input type="number" name="price" required min="0" step="0.01" className="input" />
                                        </div>
                                        <div>
                                            <label className="label">Tax</label>
                                            <select name="taxId" className="input">
                                                <option value="">None</option>
                                                {taxes.map((t) => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="label">Discount Amount</label>
                                <input type="number" name="discountAmount" min="0" step="0.01" defaultValue="0" className="input" />
                            </div>

                            <div>
                                <label className="label">Notes</label>
                                <textarea name="notes" rows={3} className="input" placeholder="Optional notes"></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">Create Invoice</button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
