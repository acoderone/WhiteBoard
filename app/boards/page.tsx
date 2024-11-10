"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for App Router
import { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function Boards() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen,setIsopen]=useState<boolean>(false);
  const handleAddBoard=()=>{
    setIsopen(true);
  }
  useEffect(() => {
    if (status === "unauthenticated") {
       
      router.push("/signin"); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return session ? (
    <div>
      <h1>Welcome to the Boards, {session.user?.name}!</h1>
      <button onClick={handleAddBoard}>Add</button>
      <Modal isOpen={isOpen} onClose={()=>setIsopen(false)}/>
    </div>
  ) : (
    <p>Please log in to view the boards.</p>
  );
}
