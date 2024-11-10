"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for App Router
import { useEffect } from "react";

export default function Boards() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
        console.log("broooo")
      router.push("/signin"); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return session ? (
    <div>
      <h1>Welcome to the Boards, {session.user?.name}!</h1>
    </div>
  ) : (
    <p>Please log in to view the boards.</p>
  );
}
