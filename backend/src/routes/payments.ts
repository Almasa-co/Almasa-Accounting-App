import express from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Add payment to invoice
router.post(
    '/',
    authenticateToken,
    [
        body('invoiceId').notEmpty(),
        body('amount').isNumeric(),
        body('paymentDate').isISO8601(),
        body('method').isIn(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'PAYPAL', 'CHECK', 'OTHER']),
    ],
    validate,
    async (req, res) => {
        try {
            const { invoiceId, amount, paymentDate, method, reference, notes } = req.body;

            // Get invoice
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId },
            });

            if (!invoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }

            // Create payment
            const payment = await prisma.payment.create({
                data: {
                    invoiceId,
                    amount: new Prisma.Decimal(amount),
                    paymentDate: new Date(paymentDate),
                    method,
                    reference,
                    notes,
                },
            });

            // Update invoice paid amount and status
            const newPaidAmount = invoice.paidAmount.add(amount);
            let newStatus = invoice.status;

            if (newPaidAmount.gte(invoice.total)) {
                newStatus = 'PAID';
            } else if (newPaidAmount.gt(0)) {
                newStatus = 'PARTIAL';
            }

            await prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    paidAmount: newPaidAmount,
                    status: newStatus,
                },
            });

            res.status(201).json(payment);
        } catch (error) {
            console.error('Create payment error:', error);
            res.status(500).json({ error: 'Failed to create payment' });
        }
    }
);

// Get payments for an invoice
router.get('/invoice/:invoiceId', authenticateToken, async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            where: { invoiceId: req.params.invoiceId },
            orderBy: { paymentDate: 'desc' },
        });

        res.json(payments);
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

export default router;
