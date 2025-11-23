'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function DashboardPage() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await dashboardAPI.getStats();
            setStats(res.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    const chartData = {
        labels: stats?.monthlyIncome?.map((item: any) => item.month) || [],
        datasets: [
            {
                label: t('dashboard.income'),
                data: stats?.monthlyIncome?.map((item: any) => item.total) || [],
                borderColor: 'rgb(14, 165, 233)',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
            },
            {
                label: t('dashboard.expenses'),
                data: stats?.monthlyExpenses?.map((item: any) => item.total) || [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
            },
        },
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
                <div className="text-sm text-gray-500">
                    {formatDate(new Date())}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="stat-card bg-gradient-to-br from-primary-500 to-primary-600 text-white touch-manipulation">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-primary-100 text-xs sm:text-sm font-medium">{t('dashboard.totalIncome')}</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-2 truncate">{formatCurrency(stats?.income || 0)}</p>
                        </div>
                        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="stat-card bg-gradient-to-br from-red-500 to-red-600 text-white touch-manipulation">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-red-100 text-xs sm:text-sm font-medium">{t('dashboard.totalExpenses')}</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-2 truncate">{formatCurrency(stats?.expenses || 0)}</p>
                        </div>
                        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white touch-manipulation">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-green-100 text-xs sm:text-sm font-medium">{t('dashboard.netProfit')}</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-2 truncate">{formatCurrency(stats?.profit || 0)}</p>
                        </div>
                        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="stat-card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white touch-manipulation">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-yellow-100 text-xs sm:text-sm font-medium">{t('dashboard.pendingInvoices')}</p>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">{stats?.pendingInvoices?.count || 0}</p>
                            <p className="text-xs sm:text-sm text-yellow-100 mt-1 truncate">
                                {formatCurrency(stats?.pendingInvoices?.total || 0)}
                            </p>
                        </div>
                        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                            <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{t('dashboard.incomeVsExpenses')}</h3>
                    <div className="h-64 sm:h-72">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{t('dashboard.expensesByCategory')}</h3>
                    <div className="space-y-3 sm:space-y-4">
                        {stats?.expensesByCategory?.map((cat: any) => (
                            <div key={cat.name} className="touch-manipulation">
                                <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                                    <span className="font-medium text-gray-700 truncate mr-2">{cat.name}</span>
                                    <span className="text-gray-900 font-semibold flex-shrink-0">{formatCurrency(cat.total)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                                    <div
                                        className="h-2 sm:h-2.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(parseFloat(cat.total) / parseFloat(stats.expenses)) * 100}%`,
                                            backgroundColor: cat.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('dashboard.recentInvoices')}</h3>
                        <Link href="/dashboard/invoices" className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 active:text-primary-800 font-medium touch-manipulation">
                            {t('common.viewAll')} →
                        </Link>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {stats?.recentInvoices?.map((invoice: any) => (
                            <div key={invoice.id} className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-100 last:border-0 touch-manipulation hover:bg-gray-50 active:bg-gray-100 rounded transition-colors -mx-2 px-2">
                                <div className="flex-1 min-w-0 mr-3">
                                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{invoice.invoiceNumber}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">{invoice.customer.name}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(invoice.total)}</p>
                                    <p className="text-xs text-gray-500">{formatDate(invoice.invoiceDate)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('dashboard.recentExpenses')}</h3>
                        <Link href="/dashboard/expenses" className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 active:text-primary-800 font-medium touch-manipulation">
                            {t('common.viewAll')} →
                        </Link>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {stats?.recentExpenses?.map((expense: any) => (
                            <div key={expense.id} className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-100 last:border-0 touch-manipulation hover:bg-gray-50 active:bg-gray-100 rounded transition-colors -mx-2 px-2">
                                <div className="flex-1 min-w-0 mr-3">
                                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{expense.category.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">{expense.description || t('common.noDescription')}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(expense.amount)}</p>
                                    <p className="text-xs text-gray-500">{formatDate(expense.expenseDate)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overdue Invoices Alert */}
            {stats?.overdueInvoices?.length > 0 && (
                <div className="card bg-red-50 border-red-200">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-xs sm:text-sm font-medium text-red-800">{t('dashboard.overdueInvoices')}</h3>
                            <div className="mt-2 text-xs sm:text-sm text-red-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    {stats.overdueInvoices.slice(0, 3).map((inv: any) => (
                                        <li key={inv.id} className="break-words">
                                            <span className="font-medium">{inv.invoiceNumber}</span> - {inv.customer} - {formatCurrency(inv.total)} <span className="text-red-600">({t('dashboard.due')}: {formatDate(inv.dueDate)})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
