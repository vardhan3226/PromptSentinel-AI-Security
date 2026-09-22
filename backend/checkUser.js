import "dotenv/config";
import prisma from "./lib/prisma.js";

const user = await prisma.user.findUnique({
  where: {
    email: "aketipriyavardhan2006@gmail.com",
  },
  select: {
    email: true,
    emailVerified: true,
    verificationTokenExpiry: true,
  },
});

console.log(user);

await prisma.$disconnect();