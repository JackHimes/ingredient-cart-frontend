"use client"; 

import useStoreUser from "../hooks/useStoreUser";

export default function Page() {
  useStoreUser();
  return (
    <div className="flex items-center justify-center h-screen bg-off-white">
        <div>
            <h1 className="text-black">HELLO</h1>
        </div>
    </div>
  );
}
