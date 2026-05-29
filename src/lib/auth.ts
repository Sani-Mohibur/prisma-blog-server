import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false, // Turn off email verification
  },
  emailVerification: {
    sendOnSignUp: false, // Turn off email verification
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog App" <mdfarabi200@gmail.com>',
          to: user.email,
          subject: "Verify Your Email Address",
          html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 24px;
        border-radius: 8px;
      }
      .header {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .content {
        font-size: 16px;
        color: #333;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        margin: 24px 0;
        padding: 12px 20px;
        background-color: #4f46e5;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 24px;
        font-size: 13px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">Verify your email</div>

      <div class="content">
        <p>Hello ${user.name || "there"},</p>

        <p>
          Thank you for registering. Please verify your email address by clicking
          the button below.
        </p>

        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">
            Verify Email
          </a>
        </p>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Prisma Blog App. All rights reserved.
      </div>
    </div>
  </body>
</html>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});
