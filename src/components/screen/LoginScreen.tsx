"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type UserData = {
  apiKey: string;
  assistantId: string;
};

type LoginScreenProps = {
  onLoginSuccess: (userData: UserData) => void;
};

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [apiKey, setApiKey] = useState("");
  const [assistantId, setAssistantId] = useState("");

  const handleLogin = () => {
    if (assistantId.trim() && apiKey.trim()) {
      onLoginSuccess({ assistantId, apiKey });
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Bem-vindo!</CardTitle>
          <CardDescription>
            Insira seus dados para poder conversar com seu OpenAI Assistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="apiKey">Sua chave da OpenAI</Label>
            <Input
              id="apiKey"
              placeholder="Ex: my-openai-api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="assistantId">ID do Assistente</Label>
            <Input
              id="assistantId"
              type="text"
              placeholder="Ex: my-assistant-id"
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Entrar no Chat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
