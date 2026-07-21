import "dotenv/config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth.middleware";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME || "Farabi Sunny",
      email: process.env.ADMIN_EMAIL || "farabisunny5@gmail.com",
      password: process.env.ADMIN_PASSWORD || "farabi1234",
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      console.log("Admin user already exists!");
      return;
    }

    const port = process.env.PORT || 5000;
    const signUpAdmin = await fetch(
      `http://localhost:${port}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...adminData, role: UserRole.ADMIN }),
      }
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
          role: UserRole.ADMIN,
        },
      });
      console.log("Admin seeded successfully!");
    } else {
      const error = await signUpAdmin.json();
      console.error("Failed to seed admin:", error);
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

seedAdmin().finally(() => prisma.$disconnect());
