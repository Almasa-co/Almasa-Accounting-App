import express from 'express';
import { body, query } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Get all customers
router.get(
    '/',
    authenticateToken,
    query('search').optional().isString(),
    async (req, res) => {
        try {
            const { search } = req.query;
            const where = search
                ? {
                    OR: [
                        { name: { contains: search as string } },
                        { email: { contains: search as string } },
                    ],
                }
                : {};

            const customers = await prisma.customer.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { invoices: true },
                    },
                },
            });

            res.json(customers);
        } catch (error) {
            console.error('Get customers error:', error);
            res.status(500).json({ error: 'Failed to fetch customers' });
        }
    }
);

// Get single customer
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: req.params.id },
            include: {
                invoices: {
                    orderBy: { invoiceDate: 'desc' },
                    take: 10,
                },
            },
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

// Create customer
router.post(
    '/',
    authenticateToken,
    [
        body('name').trim().notEmpty(),
        body('email').optional().isEmail().normalizeEmail(),
        body('phone').optional().isString(),
    ],
    validate,
    async (req, res) => {
        try {
            const customer = await prisma.customer.create({
                data: req.body,
            });

            res.status(201).json(customer);
        } catch (error) {
            console.error('Create customer error:', error);
            res.status(500).json({ error: 'Failed to create customer' });
        }
    }
);

// Update customer
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const customer = await prisma.customer.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.json(customer);
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ error: 'Failed to update customer' });
    }
});

// Delete customer
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.customer.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
});

export default router;
