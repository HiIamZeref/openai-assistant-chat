"use client";
import { useState } from "react";
import { LoginScreen, UserData } from "@/components/screen/LoginScreen";
import { ChatScreen } from "@/components/screen/ChatScreen";

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLoginSuccess = (data: UserData) => {
    setUserData(data);
  };

  return (
    <div>
      {userData ? (
        <ChatScreen userData={userData} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
