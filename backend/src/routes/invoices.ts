import express from 'express';
import { body, query } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Get all invoices
router.get(
    '/',
    authenticateToken,
    query('status').optional().isString(),
    query('search').optional().isString(),
    async (req, res) => {
        try {
            const { status, search } = req.query;
            const where: any = {};

            if (status) {
                where.status = status;
            }

            if (search) {
                where.OR = [
                    { invoiceNumber: { contains: search as string } },
                    { customer: { name: { contains: search as string } } },
                ];
            }

            const invoices = await prisma.invoice.findMany({
                where,
                include: {
                    customer: true,
                    currency: true,
                    items: true,
                },
                orderBy: { invoiceDate: 'desc' },
            });

            res.json(invoices);
        } catch (error) {
            console.error('Get invoices error:', error);
            res.status(500).json({ error: 'Failed to fetch invoices' });
        }
    }
);

// Get single invoice
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: req.params.id },
            include: {
                customer: true,
                currency: true,
                items: {
                    include: {
                        tax: true,
                    },
                },
                payments: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
});

// Create invoice
router.post(
    '/',
    authenticateToken,
    [
        body('customerId').notEmpty(),
        body('currencyId').notEmpty(),
        body('invoiceDate').isISO8601(),
        body('dueDate').isISO8601(),
        body('items').isArray({ min: 1 }),
    ],
    validate,
    async (req, res) => {
        try {
            const user = (req as AuthRequest).user!;
            const { customerId, currencyId, invoiceDate, dueDate, items, notes, terms, discountAmount } = req.body;

            // Generate invoice number
            const count = await prisma.invoice.count();
            const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

            // Calculate totals
            let subtotal = new Prisma.Decimal(0);
            let taxAmount = new Prisma.Decimal(0);

            const invoiceItems = await Promise.all(
                items.map(async (item: any) => {
                    const itemTotal = new Prisma.Decimal(item.quantity).mul(item.price);
                    subtotal = subtotal.add(itemTotal);

                    if (item.taxId) {
                        const tax = await prisma.tax.findUnique({
                            where: { id: item.taxId },
                        });
                        if (tax) {
                            const itemTax = itemTotal.mul(tax.rate).div(100);
                            taxAmount = taxAmount.add(itemTax);
                        }
                    }

                    return {
                        name: item.name,
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                        taxId: item.taxId,
                        total: itemTotal,
                    };
                })
            );

            const discount = new Prisma.Decimal(discountAmount || 0);
            const total = subtotal.add(taxAmount).sub(discount);

            // Create invoice
            const invoice = await prisma.invoice.create({
                data: {
                    invoiceNumber,
                    customerId,
                    userId: user.id,
                    currencyId,
                    invoiceDate: new Date(invoiceDate),
                    dueDate: new Date(dueDate),
                    subtotal,
                    taxAmount,
                    discountAmount: discount,
                    total,
                    notes,
                    terms,
                    items: {
                        create: invoiceItems,
                    },
                },
                include: {
                    customer: true,
                    currency: true,
                    items: {
                        include: {
                            tax: true,
                        },
                    },
                },
            });

            res.status(201).json(invoice);
        } catch (error) {
            console.error('Create invoice error:', error);
            res.status(500).json({ error: 'Failed to create invoice' });
        }
    }
);

// Update invoice
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { items, ...invoiceData } = req.body;

        // Delete existing items
        await prisma.invoiceItem.deleteMany({
            where: { invoiceId: req.params.id },
        });

        // Recalculate if items provided
        if (items) {
            let subtotal = new Prisma.Decimal(0);
            let taxAmount = new Prisma.Decimal(0);

            const invoiceItems = await Promise.all(
                items.map(async (item: any) => {
                    const itemTotal = new Prisma.Decimal(item.quantity).mul(item.price);
                    subtotal = subtotal.add(itemTotal);

                    if (item.taxId) {
                        const tax = await prisma.tax.findUnique({
                            where: { id: item.taxId },
                        });
                        if (tax) {
                            const itemTax = itemTotal.mul(tax.rate).div(100);
                            taxAmount = taxAmount.add(itemTax);
                        }
                    }

                    return {
                        name: item.name,
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                        taxId: item.taxId,
                        total: itemTotal,
                    };
                })
            );

            const discount = new Prisma.Decimal(invoiceData.discountAmount || 0);
            const total = subtotal.add(taxAmount).sub(discount);

            invoiceData.subtotal = subtotal;
            invoiceData.taxAmount = taxAmount;
            invoiceData.total = total;

            const invoice = await prisma.invoice.update({
                where: { id: req.params.id },
                data: {
                    ...invoiceData,
                    items: {
                        create: invoiceItems,
                    },
                },
                include: {
                    customer: true,
                    currency: true,
                    items: {
                        include: {
                            tax: true,
                        },
                    },
                },
            });

            return res.json(invoice);
        }

        const invoice = await prisma.invoice.update({
            where: { id: req.params.id },
            data: invoiceData,
            include: {
                customer: true,
                currency: true,
                items: true,
            },
        });

        res.json(invoice);
    } catch (error) {
        console.error('Update invoice error:', error);
        res.status(500).json({ error: 'Failed to update invoice' });
    }
});

// Update invoice status
router.patch('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const invoice = await prisma.invoice.update({
            where: { id: req.params.id },
            data: { status },
            include: {
                customer: true,
                currency: true,
                items: true,
            },
        });

        res.json(invoice);
    } catch (error) {
        console.error('Update invoice status error:', error);
        res.status(500).json({ error: 'Failed to update invoice status' });
    }
});

// Delete invoice
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.invoice.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Delete invoice error:', error);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
});

export default router;
