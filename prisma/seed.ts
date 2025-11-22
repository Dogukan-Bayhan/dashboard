import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: (process.env.DATABASE_URL ?? "file:./dev.db") as
    | ":memory:"
    | (string & {}),
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const book = await prisma.book.upsert({
    where: { id: "seed-book-1" },
    update: {},
    create: {
      id: "seed-book-1",
      title: "Deep Work",
      author: "Cal Newport",
      coverUrl:
        "https://images.unsplash.com/photo-1528208079125-27c7e4e0e5c5?auto=format&fit=crop&w=600&q=80",
      totalPages: 300,
      currentPage: 42,
      status: "READING",
    },
  });

  const task = await prisma.task.upsert({
    where: { id: "seed-task-1" },
    update: {},
    create: {
      id: "seed-task-1",
      title: "Prototype Gamified Dashboard",
      type: "TODAY",
      category: "PROJECT",
      priority: "HIGH",
      isCompleted: false,
    },
  });

  console.log("Seed complete:", { book: book.title, task: task.title });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

