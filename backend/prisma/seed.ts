import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create default user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@accounting.com' },
        update: {},
        create: {
            email: 'admin@accounting.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        },
    });
    console.log('✅ Created admin user:', user.email);

    // Create currencies
    const currencies = [
        { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 1 },
        { code: 'USD', name: 'US Dollar', symbol: '$', rate: 30.9 },
        { code: 'EUR', name: 'Euro', symbol: '€', rate: 33.5 },
        { code: 'GBP', name: 'British Pound', symbol: '£', rate: 39.2 },
    ];

    for (const currency of currencies) {
        await prisma.currency.upsert({
            where: { code: currency.code },
            update: {},
            create: currency,
        });
    }
    console.log('✅ Created currencies');

    // Create taxes
    const taxes = [
        { name: 'VAT (14%)', rate: 14, description: 'Value Added Tax' },
        { name: 'Sales Tax (10%)', rate: 10, description: 'Sales Tax' },
        { name: 'Withholding Tax (1%)', rate: 1, description: 'Withholding Tax' },
    ];

    for (const tax of taxes) {
        const existingTax = await prisma.tax.findFirst({
            where: { name: tax.name },
        });

        if (!existingTax) {
            await prisma.tax.create({
                data: tax,
            });
        }
    }
    console.log('✅ Created taxes');

    // Create expense categories
    const categories = [
        { name: 'Office Supplies', description: 'Office supplies and equipment', color: '#3b82f6' },
        { name: 'Marketing', description: 'Marketing and advertising', color: '#8b5cf6' },
        { name: 'Utilities', description: 'Electricity, water, internet', color: '#ec4899' },
        { name: 'Travel', description: 'Business travel expenses', color: '#f59e0b' },
        { name: 'Software', description: 'Software subscriptions', color: '#10b981' },
        { name: 'Rent', description: 'Office rent', color: '#ef4444' },
    ];

    for (const category of categories) {
        await prisma.expenseCategory.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }
    console.log('✅ Created expense categories');

    // Create sample customers
    console.log('Creating 10 customers...');
    for (let i = 1; i <= 10; i++) {
        await prisma.customer.create({
            data: {
                name: `Customer ${i}`,
                email: `customer${i}@example.com`,
                phone: `+20 100 000 ${i.toString().padStart(4, '0')}`,
                address: `${i * 10} Nile St`,
                city: 'Cairo',
                state: 'Cairo',
                zipCode: '11511',
                country: 'EG',
            },
        });
    }
    console.log('✅ Created 10 customers');

    // Create sample vendors
    console.log('Creating 10 vendors...');
    for (let i = 1; i <= 10; i++) {
        await prisma.vendor.create({
            data: {
                name: `Vendor ${i}`,
                email: `vendor${i}@example.com`,
                phone: `+20 111 111 ${i.toString().padStart(4, '0')}`,
                address: `${i * 20} Tahrir St`,
                city: 'Giza',
                state: 'Giza',
                zipCode: '12511',
                country: 'EG',
            },
        });
    }
    console.log('✅ Created 10 vendors');

    // Get references for creating related data
    const allCustomers = await prisma.customer.findMany();
    const allVendors = await prisma.vendor.findMany();
    const allCurrencies = await prisma.currency.findMany();
    const allCategories = await prisma.expenseCategory.findMany();
    const defaultCurrency = allCurrencies.find(c => c.code === 'EGP') || allCurrencies[0];

    // Create sample invoices
    console.log('Creating 10 invoices...');
    for (let i = 1; i <= 10; i++) {
        const customer = allCustomers[i % allCustomers.length];
        const amount = (i * 1000) + 500;

        await prisma.invoice.create({
            data: {
                invoiceNumber: `INV-${2024000 + i}`,
                customerId: customer.id,
                userId: user.id,
                currencyId: defaultCurrency.id,
                invoiceDate: new Date(),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
                status: i % 2 === 0 ? 'PAID' : 'SENT',
                subtotal: amount,
                taxAmount: amount * 0.14,
                total: amount * 1.14,
                paidAmount: i % 2 === 0 ? amount * 1.14 : 0,
                items: {
                    create: [
                        {
                            name: `Service ${i}`,
                            description: `Consulting service #${i}`,
                            quantity: 1,
                            price: amount,
                            total: amount,
                        }
                    ]
                }
            },
        });
    }
    console.log('✅ Created 10 invoices');

    // Create sample expenses
    console.log('Creating 10 expenses...');
    for (let i = 1; i <= 10; i++) {
        const category = allCategories[i % allCategories.length];
        const vendor = allVendors[i % allVendors.length];
        const amount = (i * 500) + 250;

        await prisma.expense.create({
            data: {
                categoryId: category.id,
                vendorId: vendor.id,
                userId: user.id,
                currencyId: defaultCurrency.id,
                expenseDate: new Date(),
                amount: amount,
                description: `Expense #${i} - ${category.name}`,
                reference: `EXP-${2024000 + i}`,
            },
        });
    }
    console.log('✅ Created 10 expenses');

    console.log('🎉 Seeding completed successfully!');
    console.log('\n📝 Default credentials:');
    console.log('   Email: admin@accounting.com');
    console.log('   Password: admin123');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
