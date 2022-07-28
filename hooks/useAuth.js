/** @format */

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

function useAuth() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
      // The user is not authenticated, handle it here.
    },
  });

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  return { status, session };
}

export default useAuth;
