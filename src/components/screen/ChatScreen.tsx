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
import { UserData } from "./LoginScreen";
import { Loader2 } from "lucide-react";

export type ChatScreenProps = {
  userData: UserData;
};

export function ChatScreen({ userData }: ChatScreenProps) {
  const [messages, setMessages] = useState<MessageBoxProps[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: MessageBoxProps = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          apiKey: userData.apiKey,
          assistantId: userData.assistantId,
        }),
      });

      if (!response.ok) {
        throw new Error("request failed");
      }

      const data = await response.json();

      const assistantMessage: MessageBoxProps = {
        text: data.response,
        sender: "assistant",
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.log("Erro ao comunicar com a API:", error);

      const errorMessage: MessageBoxProps = {
        text: "Desculpe, não foi possível gerar sua resposta. Tente novamente mais tarde",
        sender: "assistant",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-4xl h-[700px] flex flex-col">
        <CardHeader>
          <p className="">Bem vindo ao OpenAI Assistant Chat!</p>
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
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              placeholder={
                isLoading
                  ? "Aguardando resposta..."
                  : "Insira aqui sua mensagem!"
              }
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ""}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
