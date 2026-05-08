"use client";

import { useSession } from "next-auth/react";

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

// !! Drop-in replacement for the previous Supabase-backed useAuth hook.
// Returns the same { user, loading } shape so call sites stay unchanged.
export function useAuth(): { user: AuthUser | null; loading: boolean } {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      }
    : null;
  return { user, loading };
}
