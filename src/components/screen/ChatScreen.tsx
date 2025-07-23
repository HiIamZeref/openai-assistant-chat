"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { MessageBox, MessageBoxProps } from "@/components/ui/MessageBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatScreen() {
  const [messages, setMessages] = useState<MessageBoxProps[]>([
    {
      text: "Hello! How can I assist you today?",
      sender: "assistant",
    },
    {
      text: "I need help with my project.",
      sender: "user",
    },
    {
      text: "Sure! What specifically do you need help with?",
      sender: "assistant",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-4xl h-[700px] flex flex-col">
        <CardHeader>
          <p className="">Welcome to OpenAI Assistant Chat</p>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <MessageBox
                key={index}
                text={message.text}
                sender={message.sender}
              />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center gap-2">
            <Input
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
            />
            <Button onClick={handleSendMessage} disabled={!input.trim()}>
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
