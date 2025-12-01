import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import vendorRoutes from './routes/vendors';
import invoiceRoutes from './routes/invoices';
import expenseRoutes from './routes/expenses';
import expenseCategoryRoutes from './routes/expense-categories';
import dashboardRoutes from './routes/dashboard';
import taxRoutes from './routes/taxes';
import currencyRoutes from './routes/currencies';
import paymentRoutes from './routes/payments';
import reportRoutes from './routes/reports';
import { initializeDatabase, disconnectDatabase } from './lib/db-init';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Accounting API is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database (auto-create tables if needed)
        await initializeDatabase();

        // Start server
        app.listen(port, () => {
            console.log(`⚡️ Server is running at http://localhost:${port}`);
            console.log(`📊 Accounting API ready`);
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🛑 Shutting down gracefully...');
            await disconnectDatabase();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\n🛑 Shutting down gracefully...');
            await disconnectDatabase();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the application
startServer();

export default app;

