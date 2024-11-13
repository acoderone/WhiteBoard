"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for App Router
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { NextResponse } from "next/server";

type board={
  id:number;
  title:string;
 

};

export default function Boards() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boards,setBoards]=useState<board[]>([]);
  const [isOpen,setIsopen]=useState<boolean>(false);
  const handleAddBoard=()=>{
    setIsopen(true);
  }
  const deleteBoard=async(board_id: number)=>{
    
    const response=await fetch(`api/auth/boards/${board_id}`,{
      method:"DELETE",
    })
    if(response.ok){
      setBoards((prevBoards)=>
        prevBoards.filter((board)=>board.id!=board_id)
      )
      const data=await response.json();
      console.log(data);
      NextResponse.json({
        message:"Board is deleted"})
    }
  }

  useEffect(() => {
const checkAuthnetication=async()=>{
  if (status === "unauthenticated") {
       
    router.push("/signin"); // Redirect to login if unauthenticated
  }
  else{
      const response= await fetch("/api/auth/boards",{
        method:"GET"
        
      })
      if(response.ok){
        const data=await response.json();
        setBoards(data.boards)
        //console.log(data);
      }
  }
}
checkAuthnetication();
  
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return session ? (
    <div>
      <h1>Welcome to the Boards, {session.user?.name}!</h1>
      <button onClick={handleAddBoard}>Add</button>
      <Modal isOpen={isOpen} onClose={()=>setIsopen(false)} />
      <div>
     {boards.length>0?
     (
      boards.map((board)=>(
        
        <div key={board.id}>
          <h1>{board.title}</h1>
        <button onClick={()=>deleteBoard(board.id)}>Delete</button></div>
        
      ))
     ):(<div>Boards not present</div>)}

    </div>
    </div>
  ) : (
  <div></div>
  );
}
