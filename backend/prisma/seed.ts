import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Create admin user
    console.log("📝 Creating admin user...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@test.com" },
      update: {}, // Don't update if exists
      create: {
        email: "admin@test.com",
        name: "Admin User",
        passwordHash: adminPassword,
        role: "admin",
        approvalStatus: "approved",
      },
    });
    console.log("✅ Admin user created:", admin.id);

    // 2. Create alumni user with invitation code
    console.log("📝 Creating alumni user...");
    const alumniPassword = await bcrypt.hash("alumni123", 10);
    const alumni = await prisma.user.upsert({
      where: { email: "alumni@test.com" },
      update: {}, // Don't update if exists
      create: {
        email: "alumni@test.com",
        name: "Sarah Mitchell",
        passwordHash: alumniPassword,
        role: "alumni",
        approvalStatus: "approved",
        graduationYear: 2020,
        currentCompany: "Tech Corp",
        currentPosition: "Senior Developer",
        skillsOffered: ["React", "TypeScript", "System Design"],
      },
    });
    console.log("✅ Alumni user created:", alumni.id);

    // Create invitation code for alumni
    console.log("📝 Creating invitation code...");
    const invitationCode = await prisma.invitationCode.upsert({
      where: { code: "TEST-ALUMNI-2025" },
      update: {}, // Don't update if exists
      create: {
        code: "TEST-ALUMNI-2025",
        isActive: true,
      },
    });
    console.log("✅ Invitation code created:", invitationCode.code);

    // 3. Create student user
    console.log("📝 Creating student user...");
    const studentPassword = await bcrypt.hash("student123", 10);
    const student = await prisma.user.upsert({
      where: { email: "student@test.com" },
      update: {}, // Don't update if exists
      create: {
        email: "student@test.com",
        name: "Ravi Kumar",
        passwordHash: studentPassword,
        role: "student",
        approvalStatus: "pending",
        degree: "Computer Science",
        yearOfStudy: 3,
        skillsWanted: ["React", "System Design"],
        mentoringGoals: ["Career guidance", "Technical skills"],
      },
    });
    console.log("✅ Student user created:", student.id);

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("   Admin:   admin@test.com / admin123");
    console.log("   Alumni:  alumni@test.com / alumni123");
    console.log("   Student: student@test.com / student123");
    console.log("   Invite Code: TEST-ALUMNI-2025");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
