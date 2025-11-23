import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Profit & Loss Report
router.get('/profit-loss', authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate as string) : new Date();

        // Total income
        const income = await prisma.invoice.aggregate({
            where: {
                invoiceDate: { gte: start, lte: end },
                status: { in: ['PAID', 'PARTIAL'] },
            },
            _sum: { paidAmount: true },
        });

        // Total expenses
        const expenses = await prisma.expense.aggregate({
            where: {
                expenseDate: { gte: start, lte: end },
            },
            _sum: { amount: true },
        });

        // Expenses by category
        const expensesByCategory = await prisma.expenseCategory.findMany({
            include: {
                expenses: {
                    where: {
                        expenseDate: { gte: start, lte: end },
                    },
                },
            },
        });

        const categoryBreakdown = expensesByCategory.map((category) => ({
            category: category.name,
            color: category.color,
            total: category.expenses.reduce(
                (sum, expense) => sum.add(expense.amount),
                new Prisma.Decimal(0)
            ),
        })).filter(item => item.total.toNumber() > 0);

        const totalIncome = income._sum.paidAmount || new Prisma.Decimal(0);
        const totalExpenses = expenses._sum.amount || new Prisma.Decimal(0);
        const profit = new Prisma.Decimal(totalIncome).sub(totalExpenses);

        res.json({
            period: { startDate: start, endDate: end },
            income: totalIncome,
            expenses: totalExpenses,
            profit,
            expensesByCategory: categoryBreakdown,
        });
    } catch (error) {
        console.error('Profit/Loss report error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// Income Summary Report
router.get('/income-summary', authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate as string) : new Date();

        const invoices = await prisma.invoice.findMany({
            where: {
                invoiceDate: { gte: start, lte: end },
            },
            include: {
                customer: true,
                currency: true,
                payments: true,
            },
            orderBy: { invoiceDate: 'desc' },
        });

        const summary = invoices.map((invoice) => ({
            invoiceNumber: invoice.invoiceNumber,
            customer: invoice.customer.name,
            date: invoice.invoiceDate,
            total: invoice.total,
            paid: invoice.paidAmount,
            status: invoice.status,
            currency: invoice.currency.code,
        }));

        const total = invoices.reduce(
            (sum, inv) => sum.add(inv.total),
            new Prisma.Decimal(0)
        );

        const totalPaid = invoices.reduce(
            (sum, inv) => sum.add(inv.paidAmount),
            new Prisma.Decimal(0)
        );

        res.json({
            period: { startDate: start, endDate: end },
            invoices: summary,
            total,
            totalPaid,
            outstanding: total.sub(totalPaid),
        });
    } catch (error) {
        console.error('Income summary report error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// Expense Summary Report
router.get('/expense-summary', authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate as string) : new Date();

        const expenses = await prisma.expense.findMany({
            where: {
                expenseDate: { gte: start, lte: end },
            },
            include: {
                category: true,
                vendor: true,
                currency: true,
            },
            orderBy: { expenseDate: 'desc' },
        });

        const summary = expenses.map((expense) => ({
            date: expense.expenseDate,
            category: expense.category.name,
            vendor: expense.vendor?.name || 'N/A',
            description: expense.description,
            amount: expense.amount,
            currency: expense.currency.code,
        }));

        const total = expenses.reduce(
            (sum, exp) => sum.add(exp.amount),
            new Prisma.Decimal(0)
        );

        res.json({
            period: { startDate: start, endDate: end },
            expenses: summary,
            total,
        });
    } catch (error) {
        console.error('Expense summary report error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

export default router;
