import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Test database connection on startup
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test a simple query
    const count = await prisma.user.count();
    console.log(`📊 Database has ${count} users`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Database URL:', process.env.DATABASE_URL?.replace(/\/([^\/]+)$/, '/***'));
  }
}

// Only test connection in production
if (process.env.NODE_ENV === 'production') {
  testConnection();
}

export default prisma;
