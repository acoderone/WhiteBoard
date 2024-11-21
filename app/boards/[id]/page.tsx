"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import * as fabric from "fabric";

type Board = {
  id: number;
  owner_id: number;
  title: string;
  createdAt: Date;
};

export default function Board() {
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState<number>(5);
  const params = useParams();
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Specify canvas element type
  const board_id = params.id;

  useEffect(() => {
    if (!canvasRef.current) return; // Ensure the canvasRef exists before accessing it

    const canvas = new fabric.Canvas(canvasRef.current);
    canvas.isDrawingMode = true; // Enable drawing mode
    
    const pencilBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush = pencilBrush;
    const updateBrush = () => {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = width; // Update brush width
      }
    };

    const getBoard = async () => {
      //console.log(board_id);
      const response = await fetch(`/api/auth/boards/${board_id}`, {
        method: "GET",
      });
      if (response.ok) {
        const data: Board = await response.json();
        //console.log(data);
        setBoard(data);
      }
    };
    getBoard();
 
    updateBrush(); // Update brush color and width on initial load

    return () => {
      canvas.dispose();
    };
  }, [board_id, color, width]); // Ensure the effect depends on width and color

  return (
    <div>
      <div> {board?.title}</div>

      <div>
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={500}
          className="border border-red-500"
        />
      </div>

      <div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium">
            Brush Color
          </label>
          <input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="width" className="block text-sm font-medium">
            Brush Width
          </label>
          <input
            id="width"
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
