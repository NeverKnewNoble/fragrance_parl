# Supabase → Postgres Migration Setup

This project was migrated from Supabase to a self-hosted Postgres stack:

| Concern | Before | After |
|---|---|---|
| Database | Supabase Postgres | Neon Postgres + Drizzle ORM |
| Auth | Supabase Auth | Auth.js v5 (NextAuth) — Credentials + Google |
| Storage | Supabase Storage | URL-only (admin pastes hosted URLs) |
| SSR session | `@supabase/ssr` middleware | Auth.js middleware |

Follow this once after pulling the migration.

---

## 1. Install dependencies

```bash
yarn install
```

This drops `@supabase/*` and adds `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `next-auth@beta`, `@auth/drizzle-adapter`, and `bcryptjs`.

## 2. Provision Neon

1. Sign up at <https://console.neon.tech> and create a project.
2. Copy the **pooled** connection string from "Connection Details" — it looks like
   `postgresql://USER:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`.
3. Apply the initial schema:

```bash
psql "$DATABASE_URL" -f drizzle/0000_init.sql
```

Or, paste the contents of `drizzle/0000_init.sql` into the Neon SQL Editor and run it.

After this, future schema changes go through Drizzle Kit:

```bash
yarn db:generate    # produces a new SQL file in drizzle/
yarn db:migrate     # applies pending migrations to DATABASE_URL
yarn db:studio      # browse rows
```

## 3. Configure `.env.local`

```env
DATABASE_URL="postgresql://...sslmode=require"
AUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="<from Google Cloud Console>"
AUTH_GOOGLE_SECRET="<from Google Cloud Console>"
```

## 4. Configure Google OAuth

Auth.js v5 uses a different callback path than Supabase did. In the Google Cloud Console:

1. Open <https://console.cloud.google.com/apis/credentials>.
2. Edit your OAuth 2.0 Client.
3. Set the **Authorized redirect URI** to:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Prod:  `https://YOUR_DOMAIN/api/auth/callback/google`

The previous URI (`/auth/callback`) is no longer used and should be removed.

## 5. Seed an admin user (optional)

After signing up through the app, mark yourself as admin:

```sql
UPDATE user_role
SET role = 'admin'
WHERE user_id = (SELECT id FROM users WHERE email = 'YOUR_EMAIL');
```

The `user_role` row is automatically created on signup with role `'user'`.

---

## What's deferred / not implemented

These were features of the Supabase stack that aren't fully wired in the migration. They're scoped to follow-up work, not blockers:

### Email delivery
- `resetPassword(email)` and `resendConfirmationEmail(email)` in `src/lib/auth.ts` are stubs that log a warning. To make them work, wire an email provider (Resend, Postmark, SES) and add a token table for password resets — Auth.js's existing `verificationTokens` table can be reused.
- The `/reset-password` page now requires the user to be logged in (treat as "change password while signed in"). Re-introducing the email-link reset flow needs the email provider.

### Image storage
- `src/utils/imageUpload.ts` throws if called. The admin product form now accepts hosted image URLs directly.
- To wire an upload provider (S3, R2, Cloudinary), implement `uploadProductImage`/`uploadProductImages`/`deleteProductImage` and revert `ProductUploadForm` to use file inputs.

### Email verification
- New users are created without `emailVerified` set. There's no enforcement (yet) that a user must verify before signing in. Add a verification email + token flow when email delivery is wired.

### Existing data migration
- This setup creates an empty schema. If you need to migrate existing rows out of Supabase:
  1. `pg_dump --data-only --no-owner` from the Supabase database.
  2. Map `auth.users` → `public.users` (keep UUIDs intact so FKs survive).
  3. Each user needs a `password_hash` to sign in via Credentials. If they originally signed in with Google, that's fine — the OAuth flow works without a password. Otherwise force a password reset before they can sign in.

---

## File map

```
drizzle/0000_init.sql           Initial schema (apply once)
drizzle.config.ts               Drizzle Kit config
src/db/schema.ts                Drizzle schema (source of truth for migrations)
src/db/index.ts                 Neon HTTP client + drizzle()
src/auth.config.ts              Edge-safe Auth.js config (used by middleware)
src/auth.ts                     Full Auth.js config: DrizzleAdapter + Credentials + Google
src/lib/auth.ts                 Server-action helpers: signIn/signUp/signOut/etc.
src/lib/password.ts             bcrypt hash/verify
src/hooks/useAuth.ts            Client hook over next-auth/react useSession
src/components/providers/SessionProvider.tsx   <SessionProvider> wrapper
src/types/next-auth.d.ts        Adds session.user.id typing
middleware.ts                   Auth.js middleware
src/app/api/auth/[...nextauth]/route.ts        NextAuth handlers
```
