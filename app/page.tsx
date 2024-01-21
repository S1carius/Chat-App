"use client";
import { useEffect, useState } from "react";
import { auth } from "../firebase"; // Ajuste o caminho conforme necessário
import firebase from "../firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        router.push("/chat")
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoggedIn)
    return (
      <main className="flex items-center gap-4 flex-col justify-center h-screen bg-[#0f0f0f]">
        <p className="text-white">Logged in</p>
      </main>
    );

  return (
    <main className="flex items-center gap-4 flex-col justify-center h-screen w-screen bg-[#0f0f0f]">
      <div className="h-12 w-12 rounded-full border border-white border-b-[#0f0f0f] animate-spin"></div>
    </main>
  );
}
