import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, apiKey, assistantId, threadId } = body;

    if (!message || !apiKey || !assistantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    let messages;

    // If threadId is provided, you can use it to continue a conversation
    // If not, you can create a new thread or handle it accordingly
    if (!threadId) {
      // Create a new thread
      let run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        },
      });

      while (run.status != "completed") {
        run = await openai.beta.threads.runs.retrieve(run.id, {
          thread_id: run.thread_id,
        });
      }

      messages = await openai.beta.threads.messages.list(run.thread_id);
    } else {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });

      let run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });

      while (run.status != "completed") {
        run = await openai.beta.threads.runs.retrieve(run.id, {
          thread_id: run.thread_id,
        });
      }

      messages = await openai.beta.threads.messages.list(run.thread_id);
    }

    const firstMessageContent = messages.data[0]?.content[0];

    let aiResponse;

    if (firstMessageContent && firstMessageContent.type === "text") {
      aiResponse = firstMessageContent.text.value;
    } else {
      aiResponse =
        "Resposta gerou um formato inesperado. Não foi possível extrair a resposta em formato de texto.";
    }

    console.log("Olha a resposta da IA aqui: ", aiResponse);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
