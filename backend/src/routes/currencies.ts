import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all currencies
router.get('/', authenticateToken, async (req, res) => {
    try {
        const currencies = await prisma.currency.findMany({
            where: { enabled: true },
            orderBy: { code: 'asc' },
        });

        res.json(currencies);
    } catch (error) {
        console.error('Get currencies error:', error);
        res.status(500).json({ error: 'Failed to fetch currencies' });
    }
});

export default router;
