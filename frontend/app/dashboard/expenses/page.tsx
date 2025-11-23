'use client';

import { useEffect, useState } from 'react';
import { expensesAPI, expenseCategoriesAPI, vendorsAPI, currenciesAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [expensesRes, categoriesRes, vendorsRes, currenciesRes] = await Promise.all([
                expensesAPI.getAll(),
                expenseCategoriesAPI.getAll(),
                vendorsAPI.getAll(),
                currenciesAPI.getAll(),
            ]);
            setExpenses(expensesRes.data);
            setCategories(categoriesRes.data);
            setVendors(vendorsRes.data);
            setCurrencies(currenciesRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await expensesAPI.create({
                categoryId: formData.get('categoryId'),
                vendorId: formData.get('vendorId') || null,
                currencyId: formData.get('currencyId'),
                expenseDate: formData.get('expenseDate'),
                amount: parseFloat(formData.get('amount') as string),
                reference: formData.get('reference'),
                description: formData.get('description'),
                notes: formData.get('notes'),
            });
            toast.success('Expense created successfully');
            setShowCreateModal(false);
            loadData();
        } catch (error) {
            toast.error('Failed to create expense');
        }
    };

    const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await expenseCategoriesAPI.create({
                name: formData.get('name'),
                color: formData.get('color'),
                description: formData.get('description'),
            });
            toast.success('Category created successfully');
            setShowCategoryModal(false);
            loadData();
        } catch (error) {
            toast.error('Failed to create category');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>;
    }

    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
                    <p className="text-gray-600 mt-1">Total: {formatCurrency(totalExpenses)}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowCategoryModal(true)} className="btn-secondary">
                        <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Category
                    </button>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                        <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Expense
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {categories.map((cat) => {
                    const catExpenses = expenses.filter((e) => e.categoryId === cat.id);
                    const catTotal = catExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
                    return (
                        <div key={cat.id} className="card">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{cat.name}</p>
                                    <p className="text-lg font-bold text-gray-900">{formatCurrency(catTotal)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(expense.expenseDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: expense.category.color }} />
                                            <span className="text-sm font-medium text-gray-900">{expense.category.name}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.vendor?.name || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{expense.description || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {formatCurrency(expense.amount, expense.currency?.code, expense.currency?.symbol)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.reference || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>
                        <form onSubmit={handleCreateExpense} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Category *</label>
                                    <select name="categoryId" required className="input">
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Vendor</label>
                                    <select name="vendorId" className="input">
                                        <option value="">None</option>
                                        {vendors.map((v) => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Expense Date *</label>
                                    <input type="date" name="expenseDate" required className="input" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div>
                                    <label className="label">Amount *</label>
                                    <input type="number" name="amount" required min="0" step="0.01" className="input" />
                                </div>
                                <div>
                                    <label className="label">Currency *</label>
                                    <select name="currencyId" required className="input">
                                        {currencies.map((c) => (
                                            <option key={c.id} value={c.id}>{c.code}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Reference</label>
                                    <input type="text" name="reference" className="input" placeholder="e.g., Receipt #123" />
                                </div>
                            </div>

                            <div>
                                <label className="label">Description</label>
                                <input type="text" name="description" className="input" placeholder="Optional description" />
                            </div>

                            <div>
                                <label className="label">Notes</label>
                                <textarea name="notes" rows={3} className="input" placeholder="Optional notes"></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">Add Expense</button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold mb-6">New Category</h2>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="label">Name *</label>
                                <input type="text" name="name" required className="input" placeholder="e.g., Office Supplies" />
                            </div>

                            <div>
                                <label className="label">Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'].map(color => (
                                        <label key={color} className="cursor-pointer">
                                            <input type="radio" name="color" value={color} className="peer sr-only" defaultChecked={color === '#3b82f6'} />
                                            <div className="w-8 h-8 rounded-full bg-current border-2 border-transparent peer-checked:border-gray-900 transition-all" style={{ color: color }} />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="label">Description</label>
                                <textarea name="description" rows={3} className="input" placeholder="Optional description"></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">Create Category</button>
                                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
