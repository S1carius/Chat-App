"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import firebase from "firebase/compat/app";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        router.push("/chat");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      if (result.user) router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex items-center gap-4 flex-col justify-center h-screen bg-[#0f0f0f]">
      <div className="flex flex-col items-center justify-center p-10 border border-white rounded border-b-[#0f0f0f]">
        <h1 className="text-4xl font-bold">Welcome to my chat app</h1>
        <h2 className="text-2xl mb-10">Sign in to get started</h2>

        <button
          onClick={signInWithGoogle}
          className="bg-red-500 transition-all hover:bg-red-600 rounded p-4"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
