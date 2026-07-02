import type { NextAuthConfig } from "next-auth";

// Edge-safe Auth.js config.
// - No database adapter, no bcrypt — those live in auth.ts (Node runtime only).
// - Used by middleware, which runs on the edge.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) ?? token.sub ?? session.user.id;
      }
      return session;
    },
    authorized() {
      // Permit all routes by default; per-page guards handle access.
      return true;
    },
  },
} satisfies NextAuthConfig;
