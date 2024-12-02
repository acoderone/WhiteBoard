import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type CanvasData = {
  canvasState: string ;
  id: number;
};
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { canvasState, id } = req.body as CanvasData;

  if (!canvasState || !id) return;
  try{
    const result = await prisma.board.update({
        where: { id: id },
        data: { canvasState },
      });
      return res.status(200).json({ sucess: true, result });
  }
  catch(e){
    console.error("Error updating board:",e);
    res.status(500).json({success:false,message:"Internal Server Error"});
  }
 

 
}
