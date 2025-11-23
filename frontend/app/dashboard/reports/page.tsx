'use client';

import { useEffect, useState } from 'react';
import { reportsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReportsPage() {
    const [profitLoss, setProfitLoss] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const res = await reportsAPI.profitLoss();
            setProfitLoss(res.data);
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>

            {profitLoss && (
                <div className="card">
                    <h2 className="text-2xl font-bold mb-6">Profit & Loss Statement</h2>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
                                <span className="text-lg font-semibold text-gray-900">Total Income</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(profitLoss.income)}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <span className="text-lg font-semibold text-gray-900">Total Expenses</span>
                                <span className="text-lg font-bold text-red-600">{formatCurrency(profitLoss.expenses)}</span>
                            </div>
                            <div className="mt-3 space-y-2 pl-4">
                                {profitLoss.expensesByCategory?.map((cat: any) => (
                                    <div key={cat.category} className="flex items-center justify-between py-2 text-sm">
                                        <span className="text-gray-700">{cat.category}</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(cat.total)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t-2 border-gray-300">
                            <div className="flex items-center justify-between py-3">
                                <span className="text-xl font-bold text-gray-900">Net Profit</span>
                                <span className={`text-xl font-bold ${parseFloat(profitLoss.profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(profitLoss.profit)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t text-sm text-gray-500">
                        <p>Period: {formatDate(profitLoss.period.startDate)} - {formatDate(profitLoss.period.endDate)}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <h3 className="font-semibold text-gray-900">Income Summary</h3>
                    <p className="text-sm text-gray-600 mt-1">Detailed breakdown of all income</p>
                </div>
                <div className="card text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <h3 className="font-semibold text-gray-900">Expense Summary</h3>
                    <p className="text-sm text-gray-600 mt-1">Detailed breakdown of all expenses</p>
                </div>
                <div className="card text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <h3 className="font-semibold text-gray-900">Cash Flow</h3>
                    <p className="text-sm text-gray-600 mt-1">Track your cash flow over time</p>
                </div>
            </div>
        </div>
    );
}
