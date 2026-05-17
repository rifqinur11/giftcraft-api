import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create a new tenant (Prisma automatically generates a UUID for the id field)
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Mammoy Store',
    },
  });

  // Create a new user
  const user = await prisma.user.create({
    data: {
      email: 'admin@mammoy.store',
      password: await bcrypt.hash('12341234', 10),
      name: 'Super Admin',
      tenantId: tenant.id,
      role: 'ADMIN',
    },
  });

  console.log('Created tenant:', tenant);
  console.log('Created user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });