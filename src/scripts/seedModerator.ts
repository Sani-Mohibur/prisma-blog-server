import "dotenv/config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth.middleware";

async function seedModerator() {
  try {
    const moderatorData = {
      name: process.env.MODERATOR_NAME || "Moderator User",
      email: process.env.MODERATOR_EMAIL || "moderator@thoughtspace.com",
      password: process.env.MODERATOR_PASSWORD || "moderator1234",
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: moderatorData.email,
      },
    });

    if (existingUser) {
      console.log("Moderator user already exists!");
      return;
    }

    const port = process.env.PORT || 5000;
    const signUpModerator = await fetch(
      `http://localhost:${port}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...moderatorData, role: UserRole.MODERATOR }),
      }
    );

    if (signUpModerator.ok) {
      await prisma.user.update({
        where: {
          email: moderatorData.email,
        },
        data: {
          emailVerified: true,
          role: UserRole.MODERATOR,
        },
      });
      console.log("Moderator seeded successfully!");
    } else {
      const error = await signUpModerator.json();
      console.error("Failed to seed moderator:", error);
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

seedModerator().finally(() => prisma.$disconnect());
