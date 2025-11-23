import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all taxes
router.get('/', authenticateToken, async (req, res) => {
    try {
        const taxes = await prisma.tax.findMany({
            where: { enabled: true },
            orderBy: { name: 'asc' },
        });

        res.json(taxes);
    } catch (error) {
        console.error('Get taxes error:', error);
        res.status(500).json({ error: 'Failed to fetch taxes' });
    }
});

// Create tax
router.post('/', authenticateToken, async (req, res) => {
    try {
        const tax = await prisma.tax.create({
            data: req.body,
        });

        res.status(201).json(tax);
    } catch (error) {
        console.error('Create tax error:', error);
        res.status(500).json({ error: 'Failed to create tax' });
    }
});

export default router;
