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

const SUGGESTED_OPTIONS = [
  "Me fale sobre energia eólica.",
  "Como faço manutenção de painéis solares?",
  "Estou com dificuldade no acoplamento da nacele no simulador de VR. Qual o procedimento?",
  "Olá, Zéfiro. Não entendi bem a diferença entre o hidrogênio cinza, o azul e o verde. Pode me explicar?",
];

export function ChatScreen({ userData }: ChatScreenProps) {
  const [messages, setMessages] = useState<MessageBoxProps[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    setShowOptions(false);
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
      <Card className="w-full max-w-4xl h-[700px] flex flex-col bg-[#F7F9FC]">
        {messages.length === 0 && (
          <CardHeader className="flex flex-col justify-center items-center">
            <img src="/logo.svg" alt="Logo" />
            <p className="text-2xl text-center">
              O que você quer aprender ou praticar hoje?
            </p>
          </CardHeader>
        )}
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
          <div className="flex flex-col w-full items-center gap-2">
            {showOptions && (
              <div className="flex flex-wrap gap-2 mb-2 justify-center">
                {SUGGESTED_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    style={{
                      backgroundColor: "#E6EBD0",
                      borderRadius: "9999px",
                      fontSize: "0.95rem",
                      color: "#333",
                      border: "none",
                      paddingLeft: "18px",
                      paddingRight: "18px",
                      height: "40px",
                      transition:
                        "background 0.2s, color 0.2s, box-shadow 0.2s",
                    }}
                    className="hover:bg-[#D2D8B6] hover:text-black hover:shadow-md cursor-pointer"
                    disabled={isLoading}
                    onClick={() => {
                      setInput("");
                      setIsLoading(true);
                      setShowOptions(false);
                      const userMessage: MessageBoxProps = {
                        text: option,
                        sender: "user",
                      };
                      setMessages((prevMessages) => [
                        ...prevMessages,
                        userMessage,
                      ]);
                      (async () => {
                        try {
                          const response = await fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              message: option,
                              apiKey: userData.apiKey,
                              assistantId: userData.assistantId,
                            }),
                          });
                          if (!response.ok) throw new Error("request failed");
                          const data = await response.json();
                          const assistantMessage: MessageBoxProps = {
                            text: data.response,
                            sender: "assistant",
                          };
                          setMessages((prevMessages) => [
                            ...prevMessages,
                            assistantMessage,
                          ]);
                        } catch (error) {
                          setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                              text: "Desculpe, não foi possível gerar sua resposta. Tente novamente mais tarde",
                              sender: "assistant",
                            },
                          ]);
                        } finally {
                          setIsLoading(false);
                        }
                      })();
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
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
                style={{
                  backgroundColor: "#E6EBD0",
                  height: "48px",
                  borderRadius: "9999px",
                  paddingLeft: "20px",
                  fontSize: "1rem",
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || input.trim() === ""}
                style={{
                  height: "48px",
                  borderRadius: "9999px",
                  fontSize: "1rem",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  backgroundColor: "#E6EBD0",
                  color: "#333",
                  border: "none",
                  transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                }}
                className="hover:bg-[#D2D8B6] hover:text-black hover:shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Enviar"
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
