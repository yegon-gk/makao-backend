import prisma from "./prismaClient.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "tenant@example.com",
      password_hash: "hashed_password",
      role: "tenant",
    },
  });

  console.log("New User:", user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
