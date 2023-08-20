import { PrismaClient } from '@prisma/client';
import { createDummyProductCategories } from './seeds/product-catetory.seed';
import { createDummyProducts } from './seeds/product.seed';
import { createDummyShops } from './seeds/shop.seed';
import { createDummyUsers } from './seeds/user.seed';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const users = await createDummyUsers(prisma);

  const shops = await createDummyShops(prisma);

  const products = await createDummyProducts(prisma);

  const productCategories = await createDummyProductCategories(prisma);

  console.log({
    users,
    shops,
    products,
    productCategories,
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
