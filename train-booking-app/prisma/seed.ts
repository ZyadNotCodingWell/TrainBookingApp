import { PrismaClient } from "@prisma/client";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

const cities = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Bordeaux",
  "Lille",
  "Nantes",
  "Strasbourg",
  "Nice",
  "Montpellier",
];

function getRandomCityPair() {
  const from = cities[Math.floor(Math.random() * cities.length)];
  let to = cities[Math.floor(Math.random() * cities.length)];
  while (to === from) {
    to = cities[Math.floor(Math.random() * cities.length)];
  }
  return { from, to };
}

function getRandomHour() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.random() < 0.5 ? "00" : "30";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

async function main() {
  console.log("🌱 Seeding users...");

  const users = [
    { email: "alice@example.com", passwordHash: "hashed_password_1", accountNumber: "ACC001" },
    { email: "bob@example.com", passwordHash: "hashed_password_2", accountNumber: "ACC002" },
    { email: "charlie@example.com", passwordHash: "hashed_password_3", accountNumber: "ACC003" },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("🌱 Seeding trains...");

  for (let i = 0; i < 15; i++) {
    const { from, to } = getRandomCityPair();
    const date = addDays(new Date(), Math.floor(Math.random() * 20));
    const hour = getRandomHour();
    const price = parseFloat((20 + Math.random() * 80).toFixed(2));
    const remainingPlaces = Math.floor(10 + Math.random() * 90);

    await prisma.train.create({
      data: {
        departureCity: from,
        arrivalCity: to,
        departureDate: date,
        departureHour: hour,
        price,
        remainingPlaces,
      },
    });
  }

  console.log("✅ Seeding done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
