import { prisma } from "./prisma";
import { updateTrainSeats } from "./train";

export async function createBooking(userEmail: string, trainId: number, seats: number) {
  const train = await prisma.train.findUnique({
    where: { id: trainId },
  });

  if (!train) {
    throw new Error("Train not found");
  }

  if (train.remainingPlaces < seats) {
    throw new Error("Not enough seats available");
  }

  const totalPrice = train.price * seats;

  const booking = await prisma.booking.create({
    data: {
      userEmail,
      trainId,
      seats,
      totalPrice,
    },
  });

  await updateTrainSeats(trainId, seats);

  return booking;
}

export async function getBookingsByUser(userEmail: string) {
  return await prisma.booking.findMany({
    where: { userEmail },
    include: {
      train: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingById(id: number) {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      train: true,
      user: true,
    },
  });
}

export function calculateDiscount(accountNumber: string, totalPrice: number): number {
  // Simple discount logic: if account number starts with 'ACC', apply 10% discount
  if (accountNumber.startsWith("ACC")) {
    return totalPrice * 0.9;
  }
  return totalPrice;
}
