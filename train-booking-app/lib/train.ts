import { prisma } from "./prisma";

export async function searchTrains(departureCity: string, arrivalCity: string, date?: string) {
  const where: {
    departureCity: string;
    arrivalCity: string;
    departureDate?: {
      gte: Date;
      lt: Date;
    };
  } = {
    departureCity,
    arrivalCity,
  };

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    where.departureDate = {
      gte: startDate,
      lt: endDate,
    };
  }

  return await prisma.train.findMany({
    where,
    orderBy: { departureDate: "asc" },
  });
}

export async function getTrainById(id: number) {
  return await prisma.train.findUnique({
    where: { id },
  });
}

export async function updateTrainSeats(id: number, seatsToBook: number) {
  return await prisma.train.update({
    where: { id },
    data: {
      remainingPlaces: {
        decrement: seatsToBook,
      },
    },
  });
}
