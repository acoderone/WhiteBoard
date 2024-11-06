"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignin = async () => {
    const res = await signIn("credentials", {
      username, // Ensure this matches the field expected by your provider
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <div>
      <button onClick={async () => { await signIn("google") }}>Login with Google</button>
      <p>or Sign In with credentials</p>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
