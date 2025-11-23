import express from 'express';
import { body, query } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Get all expenses
router.get(
    '/',
    authenticateToken,
    query('categoryId').optional().isString(),
    query('search').optional().isString(),
    async (req, res) => {
        try {
            const { categoryId, search } = req.query;
            const where: any = {};

            if (categoryId) {
                where.categoryId = categoryId;
            }

            if (search) {
                where.OR = [
                    { description: { contains: search as string } },
                    { reference: { contains: search as string } },
                ];
            }

            const expenses = await prisma.expense.findMany({
                where,
                include: {
                    category: true,
                    vendor: true,
                    currency: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { expenseDate: 'desc' },
            });

            res.json(expenses);
        } catch (error) {
            console.error('Get expenses error:', error);
            res.status(500).json({ error: 'Failed to fetch expenses' });
        }
    }
);

// Get single expense
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const expense = await prisma.expense.findUnique({
            where: { id: req.params.id },
            include: {
                category: true,
                vendor: true,
                currency: true,
                items: {
                    include: {
                        tax: true,
                    },
                },
            },
        });

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(expense);
    } catch (error) {
        console.error('Get expense error:', error);
        res.status(500).json({ error: 'Failed to fetch expense' });
    }
});

// Create expense
router.post(
    '/',
    authenticateToken,
    [
        body('categoryId').notEmpty(),
        body('currencyId').notEmpty(),
        body('expenseDate').isISO8601(),
        body('amount').isNumeric(),
    ],
    validate,
    async (req, res) => {
        try {
            const user = (req as AuthRequest).user!;
            const { categoryId, vendorId, currencyId, expenseDate, amount, reference, description, notes } = req.body;

            const expense = await prisma.expense.create({
                data: {
                    categoryId,
                    vendorId: vendorId || null,
                    userId: user.id,
                    currencyId,
                    expenseDate: new Date(expenseDate),
                    amount: new Prisma.Decimal(amount),
                    reference,
                    description,
                    notes,
                },
                include: {
                    category: true,
                    vendor: true,
                    currency: true,
                },
            });

            res.status(201).json(expense);
        } catch (error) {
            console.error('Create expense error:', error);
            res.status(500).json({ error: 'Failed to create expense' });
        }
    }
);

// Update expense
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const expense = await prisma.expense.update({
            where: { id: req.params.id },
            data: req.body,
            include: {
                category: true,
                vendor: true,
                currency: true,
            },
        });

        res.json(expense);
    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.expense.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

export default router;
