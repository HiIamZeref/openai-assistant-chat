import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type MessageBoxProps = {
  text: string;
  sender: "user" | "assistant";
};

export function MessageBox({ text, sender }: MessageBoxProps) {
  const isUser = sender === "user";

  return (
    // 1. Contêiner principal que alinha a mensagem inteira (esquerda ou direita)
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      {/* 2. Contêiner do conteúdo que inverte a ordem do avatar/texto */}
      <div
        className={cn(
          "flex items-start gap-3 max-w-[75%]", // max-w evita que a mensagem ocupe a tela toda
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar>
          <AvatarImage
            src={isUser ? "/user-avatar.png" : "/assistant-avatar.png"}
          />
          <AvatarFallback>{isUser ? "U" : "A"}</AvatarFallback>
        </Avatar>

        {/* 3. A "bolha" da mensagem com o texto */}
        <div
          className={cn(
            "rounded-lg p-3",
            isUser
              ? "bg-primary text-primary-foreground" // Cores do shadcn para o usuário
              : "bg-muted" // Cor do shadcn para o assistente
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
