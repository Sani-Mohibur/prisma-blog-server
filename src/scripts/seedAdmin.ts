import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth.middleware";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Farabi Sunny",
      email: "farabisunny5@gmail.com",
      password: "farabi1234",
      role: UserRole.ADMIN,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: "farabisunny5@gmail.com",
      },
    });

    if (existingUser) {
      throw new Error("User already exists!");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

seedAdmin();
