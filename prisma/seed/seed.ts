/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from '@snaplet/seed';
import { copycat } from '@snaplet/copycat';
import { v7 as uuidv7 } from 'uuid';

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 user
  const userData = Array.from({ length: 10 }).map(() => {
    const randNum = Math.floor(Math.random() * 1000);
    const firstName = copycat.firstName(randNum);
    const lastName = copycat.lastName(randNum);
    return {
      id: uuidv7(),
      firstName: firstName,
      lastName: lastName,
      phoneNumber: copycat.phoneNumber(randNum, { prefixes: ["+628"], length: 13 }),
      rememberToken: null,
      deletedAt: null,
    };
  });

  await seed.user(userData);

  await seed.order(x => x(10));

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log('Database seeded successfully!');

  process.exit();
};

main();
