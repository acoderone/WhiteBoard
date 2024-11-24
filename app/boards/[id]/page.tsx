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
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const params = useParams();
  const [tool, setTool] = useState<"line" | "eraser" | "pencil">();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const board_id = params.id;
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    // Set canvas width after the component is mounted
    if (typeof window !== "undefined") {
      setCanvasWidth(window.innerWidth); // Set initial canvas width

      // Resize handler
      const handleResize = () => {
        setCanvasWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Initialize the Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) {
      return;
    }
    console.log("!");
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    fabricCanvasRef.current = canvas;
   // canvas.isDrawingMode = true;
    /*     if(!canvas.freeDrawingBrush){
      canvas.freeDrawingBrush=new fabric.PencilBrush(canvas);
    }
    console.log("FreeDrawingBrush after initialization:", canvas.freeDrawingBrush); */
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
    
    if (!canvas) return;

    

    if (tool == "pencil") {
      
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush=new fabric.PencilBrush(canvas);
      canvas.on("path:created",(e)=>{
        const path=e.path;
        
          path.selectable=false;
          path.evented=false;
        
       
      })
      if (canvas.freeDrawingBrush) {
        console.log("Hii")
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = width;
      }
    } else if (tool == "eraser") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush=new fabric.PencilBrush(canvas);
      if (canvas.freeDrawingBrush) {
    
        canvas.freeDrawingBrush.color = "#ffffff";
        canvas.freeDrawingBrush.width = 30;
        setWidth(30);
      }
    } else if (tool == "line") {
      canvas.isDrawingMode = false;
    }
  }, [color, tool, width]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || tool !== "line") return;

    let startX: number, startY: number;
    let currentLine: fabric.Line | null = null;

    const handleMouseDown = (e) => {
      const pointer = canvas.getPointer(e.e);
      startX = pointer.x;
      startY = pointer.y;

      // Create a new line starting and ending at the same point
      currentLine = new fabric.Line([startX, startY, startX, startY], {
        stroke: color,
        strokeWidth: width,
        selectable: false,
      });

      canvas.add(currentLine);
    };

    const handleMouseMove = (e) => {
      if (!currentLine) return;

      const pointer = canvas.getPointer(e.e);
      currentLine.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (currentLine) {
        currentLine.set({ selectable: true }); // Make the line selectable
        currentLine = null; // Reset current line
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      // Cleanup event listeners when tool changes
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [tool, color, width]);
  return (
    <div className="overflow-hidden">
      <div>{board?.title}</div>

      <div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={600}
          className="border border-black-200 "
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
            Width
          </label>
          <input
            id="width"
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
          />
        </div>
        <div>
          <button onClick={() => setTool("eraser")}>Eraser</button>
        </div>
        <div>
          <button onClick={() => setTool("pencil")}>Pencil</button>
        </div>
        <div>
          <button onClick={() => setTool("line")}>Line</button>
        </div>
      </div>
    </div>
  );
}
