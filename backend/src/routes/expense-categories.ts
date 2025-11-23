import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Get expense categories
router.get('/', authenticateToken, async (req, res) => {
    try {
        const categories = await prisma.expenseCategory.findMany({
            where: { enabled: true },
            include: {
                _count: {
                    select: { expenses: true },
                },
            },
            orderBy: { name: 'asc' },
        });

        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Create category
router.post('/', authenticateToken, async (req, res) => {
    try {
        const category = await prisma.expenseCategory.create({
            data: req.body,
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Update category
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const category = await prisma.expenseCategory.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

export default router;
