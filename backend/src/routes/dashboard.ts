import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Get current month date range
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Total income this month
        const totalIncome = await prisma.invoice.aggregate({
            where: {
                invoiceDate: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth,
                },
                status: {
                    in: ['PAID', 'PARTIAL'],
                },
            },
            _sum: {
                paidAmount: true,
            },
        });

        // Total expenses this month
        const totalExpenses = await prisma.expense.aggregate({
            where: {
                expenseDate: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth,
                },
            },
            _sum: {
                amount: true,
            },
        });

        // Pending invoices
        const pendingInvoices = await prisma.invoice.aggregate({
            where: {
                status: {
                    in: ['DRAFT', 'SENT', 'VIEWED', 'APPROVED'],
                },
            },
            _sum: {
                total: true,
            },
            _count: true,
        });

        // Overdue invoices
        const overdueInvoices = await prisma.invoice.findMany({
            where: {
                dueDate: {
                    lt: now,
                },
                status: {
                    notIn: ['PAID', 'CANCELLED'],
                },
            },
            include: {
                customer: true,
            },
            take: 10,
            orderBy: {
                dueDate: 'asc',
            },
        });

        // Recent invoices
        const recentInvoices = await prisma.invoice.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                customer: true,
                currency: true,
            },
        });

        // Recent expenses
        const recentExpenses = await prisma.expense.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: true,
                vendor: true,
                currency: true,
            },
        });

        // Income by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyIncome = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(invoiceDate, '%Y-%m') as month,
        SUM(paidAmount) as total
      FROM invoices
      WHERE invoiceDate >= ${sixMonthsAgo}
      AND status IN ('PAID', 'PARTIAL')
      GROUP BY DATE_FORMAT(invoiceDate, '%Y-%m')
      ORDER BY month ASC
    `;

        // Expenses by month (last 6 months)
        const monthlyExpenses = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(expenseDate, '%Y-%m') as month,
        SUM(amount) as total
      FROM expenses
      WHERE expenseDate >= ${sixMonthsAgo}
      GROUP BY DATE_FORMAT(expenseDate, '%Y-%m')
      ORDER BY month ASC
    `;

        // Expenses by category
        const expensesByCategory = await prisma.expenseCategory.findMany({
            include: {
                expenses: {
                    where: {
                        expenseDate: {
                            gte: firstDayOfMonth,
                            lte: lastDayOfMonth,
                        },
                    },
                },
            },
        });

        const categoryTotals = expensesByCategory.map((category) => ({
            name: category.name,
            color: category.color,
            total: category.expenses.reduce(
                (sum, expense) => sum.add(expense.amount),
                new Prisma.Decimal(0)
            ),
        }));

        res.json({
            income: totalIncome._sum.paidAmount || 0,
            expenses: totalExpenses._sum.amount || 0,
            profit: new Prisma.Decimal(totalIncome._sum.paidAmount || 0).sub(
                totalExpenses._sum.amount || 0
            ),
            pendingInvoices: {
                count: pendingInvoices._count,
                total: pendingInvoices._sum.total || 0,
            },
            overdueInvoices: overdueInvoices.map((inv) => ({
                id: inv.id,
                invoiceNumber: inv.invoiceNumber,
                customer: inv.customer.name,
                total: inv.total,
                dueDate: inv.dueDate,
            })),
            recentInvoices,
            recentExpenses,
            monthlyIncome,
            monthlyExpenses,
            expensesByCategory: categoryTotals.filter((ct) => ct.total.toNumber() > 0),
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

export default router;
