import { useState } from "react";
import {useRouter} from "next/navigation";
interface ModalProps{
isOpen:boolean,
onClose:()=>void
}

const Modal:React.FC<ModalProps> =({isOpen,onClose})=>{
    //const router=useRouter();
   const [title,setTitle]=useState("");
    const addBoard=async()=>{
      const response=await fetch('/api/auth/boards',{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({title}),
      });
     const data=await response.json();
     if(response.ok){
        console.log("board added");
        //location.reload();
        isCreated=true;
     }
     else{
        console.error("Signup failed", data);
     }
    }
    if(isOpen===false){
        return null;
    }
    return(
        <div>
        <input  placeholder="title" onChange={(e)=>setTitle(e.target.value)}/>
        <button onClick={addBoard}>Add</button>
        <button onClick={onClose}>Close</button>
        
    </div>
    )
   
}
export default Modal;

