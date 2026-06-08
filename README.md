# Prisma Blog Server (`prisma-blog-server`)

A production-grade, highly scalable backend engine driving a modern content management ecosystem. Built on **Express.js** and typed with **TypeScript**, it uses **Prisma** paired with **PostgreSQL** to manage highly structured relational schemas. Security is managed through seamless, decentralized cross-domain sessions powered by **Better Auth**.

---

## 🚀 Key Architectural Features

* **Prisma Schema Folder Architecture:** Organizes tables modularly using the native `prismaSchemaFolder` setup across split entity domains (`auth.prisma`, `post.prisma`, `comment.prisma`).
* **Decentralized Authentication (Better Auth):** Secure cross-domain session handling featuring Google OAuth, cross-site fallback handlers, and strict cookie verification bounds to eliminate state-mismatch bugs.
* **Atomic Transactions (`$transaction`):** Ensures absolute transactional safety when reading single post feeds while running self-contained updates like atomic `views` updates.
* **Recursive Multi-Threaded Comments:** Implements direct-node self-referencing links to allow linear database calls to resolve deeply nested thread systems.
* **Prisma Boundary Fault Handler:** Maps individual relational exceptions (`P2002`, `P2025`, `P2003`) directly into consistent JSON error definitions.
* **Advanced Analytical Aggregation:** Aggregates multi-table system statistics using low-overhead database promise streams.

---

## 📂 System Directory Layout

```text
prisma-blog-server/
├── generated/                     # Distributed client code output
│   └── prisma/                    # Custom target engine destination
├── prisma/
│   └── schema/                    # Multi-schema blueprint configuration
│       ├── auth.prisma            # Authentication identity layout
│       ├── comment.prisma         # Relational thread tree maps
│       ├── post.prisma            # Content properties definitions
│       └── schema.prisma          # Main database engine config
├── src/
│   ├── helpers/                   # Universal dynamic utilities
│   ├── lib/                       # Unified database and client setups
│   ├── middlewares/               # Custom security layers
│   ├── modules/                   # Feature-driven business engines
│   │   ├── comment/               # Comment endpoints
│   │   └── post/                  # Post endpoints
│   └── scripts/                   # System automation blueprints

```

---

## 🛠️ Core Technology Stack

* **Core Language Framework:** Node.js, Express.js, TypeScript
* **Database Layers:** PostgreSQL, Prisma ORM
* **Identity Provision Engine:** Better Auth (Cookies Strategy, Google OAuth)
* **Mailing Infrastructure:** Nodemailer SMTP Transporter Layer

---

## ⚙️ Environment Configuration

Create a `.env` configuration file inside your root directory. Make sure your local and live properties match these configuration profiles:

```env
# --- Server Configurations ---
PORT=5000
NODE_ENV=development

# --- Prisma Database Access Pipeline ---
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# --- Better Auth Ecosystem (Cross-Domain Session Handling) ---
BETTER_AUTH_SECRET=your_generated_secret_key_string
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000

# --- SMTP Mailing Service Platform (Nodemailer Pipeline) ---
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_secure_password

# --- Google Identity Integration Framework ---
GOOGLE_CLIENT_ID=your_google_client_oauth_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_oauth_secret_hash

```

---

## 🚦 Installation & Initial Initialization

Follow these commands to get your environment ready:

### 1. Initialize System Dependencies

```bash
npm install

```

### 2. Synchronize Database Blueprints

Run migrations against your PostgreSQL instance using Prisma's structural tracking pipeline:

```bash
npx prisma migrate dev --name init

```

### 3. Build Client Engine Outputs

Generate types into your custom client folder:

```bash
npx prisma generate

```

### 4. Create Administrative Accounts (Optional Seeding)

To seed an internal admin user profile for system management, uncomment the context fields within `src/scripts/seedAdmin.ts` and run it via `ts-node`:

```bash
npx ts-node src/scripts/seedAdmin.ts

```

### 5. Launch the Server

```bash
# Development Mode
npm run dev

# Production Mode Compiler Execution
npm run build
npm start

```

---

## 🔌 API Documentation Summary

### 🔑 Authentication (`/api/auth/*`)

Handled transparently through the integrated Better Auth framework routing layer.

* `POST /api/auth/sign-up/email` - Register user profiles.
* `POST /api/auth/sign-in/email` - Authenticate account identities.
* `POST /api/auth/sign-out` - Clear secure session tokens.

### 📝 Post Management (`/api/posts`)

* `POST /` - Create a blog post *(Requires Auth)*.
* `GET /` - Dynamic search and pagination filter (`/posts?search=prisma&page=1&limit=9`).
* `GET /:id` - Fetches single posts, increments its counter atomically, and maps approved nested comments.
* `PATCH /:id` - Update content maps. Author limits are strictly guarded, and `isFeatured` toggles are restricted to admin roles.
* `DELETE /:id` - Hard deletes single posts from table memory *(Admin/Author access only)*.

### 💬 Comment System (`/api/comments`)

* `POST /` - Add a parent comment or a reply thread node (`parentId`) *(Requires Auth)*.
* `PATCH /:id` - Update individual text fields.
* `DELETE /:id` - Remove comments safely using author ownership checks.
* `PATCH /:id/moderate` - Review and approve comment visibility states *(Admin Role Only)*.
