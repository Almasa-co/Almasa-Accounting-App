import { exec } from 'child_process';
import { promisify } from 'util';
import prisma from './prisma';

const execAsync = promisify(exec);

/**
 * Initialize database by running migrations automatically
 * This will create all required tables if they don't exist
 */
export async function initializeDatabase(): Promise<void> {
    try {
        console.log('🔄 Checking database connection...');

        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Check if we need to run migrations
        console.log('🔄 Checking database schema...');

        try {
            // Try to query a table to see if schema exists
            await prisma.user.findFirst();
            console.log('✅ Database schema is up to date');
        } catch (error: any) {
            // If table doesn't exist, run migrations
            if (error.code === 'P2021' || error.message.includes('does not exist')) {
                console.log('📦 Database schema not found. Running migrations...');

                try {
                    // Run Prisma migrations
                    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
                        cwd: process.cwd(),
                    });

                    if (stdout) console.log(stdout);
                    if (stderr && !stderr.includes('warning')) console.error(stderr);

                    console.log('✅ Database migrations completed successfully');

                    // Optionally run seed data
                    console.log('🌱 Checking for seed data...');
                    try {
                        await execAsync('npm run db:seed', {
                            cwd: process.cwd(),
                        });
                        console.log('✅ Seed data loaded successfully');
                    } catch (seedError) {
                        console.log('ℹ️  No seed data or seed already run');
                    }
                } catch (migrateError: any) {
                    console.error('❌ Migration failed:', migrateError.message);

                    // Fallback: try db push instead (for development)
                    console.log('🔄 Trying alternative: prisma db push...');
                    try {
                        const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss', {
                            cwd: process.cwd(),
                        });

                        if (stdout) console.log(stdout);
                        if (stderr && !stderr.includes('warning')) console.error(stderr);

                        console.log('✅ Database schema pushed successfully');
                    } catch (pushError: any) {
                        console.error('❌ Database initialization failed:', pushError.message);
                        throw pushError;
                    }
                }
            } else {
                // Some other error occurred
                console.error('❌ Database error:', error.message);
                throw error;
            }
        }

    } catch (error: any) {
        console.error('❌ Database initialization failed:', error.message);
        console.error('Please check your DATABASE_URL in .env file');
        throw error;
    }
}

/**
 * Gracefully disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
    console.log('👋 Database disconnected');
}
