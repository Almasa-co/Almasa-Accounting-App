import express from 'express';
import { body, query } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Get all vendors
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

            const vendors = await prisma.vendor.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { expenses: true },
                    },
                },
            });

            res.json(vendors);
        } catch (error) {
            console.error('Get vendors error:', error);
            res.status(500).json({ error: 'Failed to fetch vendors' });
        }
    }
);

// Get single vendor
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { id: req.params.id },
            include: {
                expenses: {
                    orderBy: { expenseDate: 'desc' },
                    take: 10,
                },
            },
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        res.json(vendor);
    } catch (error) {
        console.error('Get vendor error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor' });
    }
});

// Create vendor
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
            const vendor = await prisma.vendor.create({
                data: req.body,
            });

            res.status(201).json(vendor);
        } catch (error) {
            console.error('Create vendor error:', error);
            res.status(500).json({ error: 'Failed to create vendor' });
        }
    }
);

// Update vendor
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const vendor = await prisma.vendor.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.json(vendor);
    } catch (error) {
        console.error('Update vendor error:', error);
        res.status(500).json({ error: 'Failed to update vendor' });
    }
});

// Delete vendor
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.vendor.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error('Delete vendor error:', error);
        res.status(500).json({ error: 'Failed to delete vendor' });
    }
});

export default router;
