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
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const board_id = params.id;
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // Initialize the Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) {
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current,{
      isDrawingMode:true,
    });
    fabricCanvasRef.current = canvas;
    canvas.isDrawingMode = true;
    if(!canvas.freeDrawingBrush){
      canvas.freeDrawingBrush=new fabric.PencilBrush(canvas);
    }
    console.log("FreeDrawingBrush after initialization:", canvas.freeDrawingBrush);
    const getBoard = async () => {
      const response = await fetch(`/api/auth/boards/${board_id}`, {
        method: "GET",
      });
      if (response.ok) {
        const data: Board = await response.json();
        setBoard(data);
      }
    };

    getBoard();

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [board_id]);

  // Update brush properties and toggle eraser mode
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    console.log(canvas?.freeDrawingBrush)
    if (!canvas) return;
    
    canvas.isDrawingMode = !isErasing;
    console.log(canvas.freeDrawingBrush);
    if (canvas.freeDrawingBrush) {
      
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = width;
     
    }
   
    if (isErasing) {
      console.log("Hii");
      canvas.on("mouse:down", (event) => {
        const target = canvas.findTarget(event.e);
        if (target) {
          canvas.remove(target); // Remove object on click
        }
      });
    } else {
      //canvas.isDrawingMode = true;
      canvas.off("mouse:down"); // Disable erasing behavior
    }
  }, [color, isErasing, width]);

  return (
    <div>
      <div>{board?.title}</div>

      <div>
        <canvas
          ref={canvasRef}
          width={700}
          height={600}
          className="border border-black-200"
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
        <div>
          <button onClick={() => setIsErasing(!isErasing)}>
            {isErasing ? "Switch to Brush" : "Switch to Eraser"}
          </button>
        </div>
      </div>
    </div>
  );
}
