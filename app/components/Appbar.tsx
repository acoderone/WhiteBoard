"use client";
import { SessionProvider, useSession } from "next-auth/react";

const Appbar = () => {
  const { data:session,status } = useSession();
  return (
    <SessionProvider session={session}>
      <div>
      {status === "authenticated" ? (
        <div>
          <button>Logout</button>
        </div>
      ) : (
        <div>
          <button>Login</button>
        </div>
      )}
    </div>
    </SessionProvider>
    
  );
};
export default Appbar;
