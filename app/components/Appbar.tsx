"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
const Appbar = () => {
  const router=useRouter();
  const { data: session, status } = useSession();
  const handleLogout=()=>{
    localStorage.removeItem('whiteboard-data');
  signOut({callbackUrl:"/signin"})
  }
  return (
    <SessionProvider session={session}>
      <div className=" flex justify-between px-6  ">
        <div>WhiteBoard</div>
        <div>
          {" "}
          {status === "authenticated" ? (
            <div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <button onClick={()=>router.push("/signin")}>Login</button>
            </div>
          )}
        </div>
      </div>
    </SessionProvider>
  );
};
export default Appbar;
