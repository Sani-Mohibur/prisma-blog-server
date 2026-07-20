import { prisma } from "./src/lib/prisma.js";
import { auth } from "./src/lib/auth.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log("PRISMA USERS:", users.map(u => ({ email: u.email, role: u.role })));
  
  if (users.length > 0) {
    const sessionToken = await prisma.session.findFirst({ where: { userId: users[0].id } });
    if (sessionToken) {
      console.log("Found session for user", users[0].email);
      const session = await auth.api.getSession({
        headers: new Headers({
          cookie: `better-auth.session_token=${sessionToken.token}`
        })
      });
      console.log("BETTER AUTH SESSION USER:", session?.user);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
