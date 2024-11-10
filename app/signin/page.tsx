"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleOauth = async () => {
    const resWithGithub = await signIn("github",{redirect:false});
    console.log("OAuth SignIn Response:", resWithGithub);
     
    if (resWithGithub?.error) {
      setError("Invalid email");
    } else if (resWithGithub?.ok) {
      console.log("OAuth Success");
      console.log("Sucess");
      router.push("http://localhost:3000/boards");
     
    } else {
      console.log("Unexpected response:", resWithGithub);
    }
  };
  const handleSignin = async () => {
    const reswithCredentials = await signIn("credentials", {
      username, // Ensure this matches the field expected by your provider
      password,
      redirect: false,
    });

    if (reswithCredentials?.error) {
      setError("Invalid username or password");
    } else if (reswithCredentials?.ok) {
      console.log("Sucess");
      router.push("/boards");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-7 h-full">
      <div>LOGIN</div>
      <div className="border-2 border-b-slate-600 p-2 gap-7">
        <div>
          {" "}
          <button onClick={handleOauth}>Login with Github</button>
        </div>
        <p>OR</p>
        <p>Sign In with credentials</p>
        <div className="flex flex-col w-1/4">
          {" "}
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
        </div>

        <button onClick={handleSignin}>Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
