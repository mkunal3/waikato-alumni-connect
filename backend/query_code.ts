import prisma from "./src/prisma";

async function main() {
  const code = await prisma.emailVerification.findFirst({
    where: {
      email: "teststudent1234@students.waikato.ac.nz",
      purpose: "EMAIL_VERIFICATION"
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  
  console.log("Code:", code?.code);
  process.exit(0);
}

main().catch(console.error);
