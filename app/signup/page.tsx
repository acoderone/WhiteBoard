"use client";
import { useState } from "react";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [typed_password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(""); // State for messages
    const [email,setEmail]=useState("");
    const handleSignup = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username,email, typed_password, confirmPassword }),
        });

        const data = await response.json();
        if (response.ok) {
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            console.log("Signup successful", data);
            setMessage(data.message); // Set success message
        } else {
            console.error("Signup failed", data);
            setMessage(data.message || "Signup failed"); // Set error message
        }
    };

    return (
        <form onSubmit={handleSignup}> {/* Use a form element */}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
             <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={typed_password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Signup</button>
            
            {message && <p>{message}</p>} {/* Display message */}
        </form>
    );
}
