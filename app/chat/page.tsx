"use client";

import { useEffect, useState } from "react";
import firebase from "../../firebase";
import "firebase/compat/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface googleType {
  displayName: string;
  photoURL: string;
}

interface message {
  user: string;
  text: string;
  image: string;
}

export default function Chat(props: { user: any }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<message[]>([]);
  const [user, setUser] = useState<googleType>({} as googleType);

  const logout = async () => {
    await firebase.auth().signOut();
  };

  const addMessage = async () => {
    setMessage("");
    setMessages([
      ...messages,
      { user: user.displayName, text: message, image: user.photoURL },
    ]);
    const newMessage = {
      text: message,
      user: user.displayName,
      image: user.photoURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firebase.firestore().collection("messages").add(newMessage);
      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(newMessages);
        setMessages(newMessages as any);
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user as googleType);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="flex items-center gap-4 flex-col justify-between py-10 h-screen bg-[#0f0f0f]">
      <div className="flex w-full px-10 justify-between">
        <div className="flex items-center justify-center gap-2">
          <div className="relative h-9 rounded-full overflow-hidden w-9">
            <Image src={user.photoURL} fill alt="user photo"></Image>
          </div>
          <h1 className="text-white">{user.displayName}</h1>
        </div>
        <button
          className="px-4 p-2 border border-white rounded hover:bg-white hover:text-black hover:border-black text-sm transition-all"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div className="h-2/3 px-4 py-2 w-3/4 border flex-col flex items-end border-white rounded">
        <div className="w-full flex flex-col overflow-auto  gap-1 h-full p-3">
          {messages.map((message, key) => {
            return (
              <div
                key={key}
                className="flex flex-col w-fit h-fit rounded px-2 p-1 bg-violet-500 flex-nowrap"
              >
                <div className="flex items-center justify-start gap-2">
                  <div className="relative h-5 w-5 overflow-hidden rounded-full">
                    <Image src={message.image} fill alt="user photo"></Image>
                  </div>
                  <h5 className="text-black">{message.user.split(" ")[0]}</h5>
                </div>
                <p className="break-all">{message.text}</p>
              </div>
            );
          })}
        </div>
        <div className="p-3  w-full flex">
          <input
            type="text"
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (message.length < 1) return;
                addMessage();
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow text-black outline-none p-2 border w-full border-gray-300 rounded-l"
          />
          <button
            onClick={addMessage}
            disabled={message.length < 1}
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-r"
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}
