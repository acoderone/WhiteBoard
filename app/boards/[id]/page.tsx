"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Board = {
    id: number;
    owner_id: number;
    title: string;
    createdAt: Date;
  };
export default function Board() {
  const [board, setBoard] = useState<Board|undefined>(undefined);
  const params = useParams();
  const board_id = params.id;
  useEffect(() => {
    const getBoard = async () => {
        console.log(board_id);
      const response =   await fetch(`/api/auth/boards/${board_id}`, {
        method: "GET",
     
       
      });
      if (response.ok) {
        const data:Board=await response.json();
        console.log(data)
        setBoard(data);
      }
    };
    getBoard();
  },[board_id]);

  return <div>{board?.title}</div>;
}
