import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StateGraph, START, END } from "@langchain/langgraph";
import { pull } from "langchain/hub";
import { OllamaSession } from "../OllamaSession";
import { chatState } from "../states/chatState";

export const chatGraph = async (ollamaSession:OllamaSession) => {

    const generate = async (state: typeof chatState.State) => {
        const resp = await ollamaSession.ollama.invoke(state.messages);
        return { messages: [resp] };
    };

    const graph = new StateGraph(chatState)
        .addNode("model", generate)
        .addEdge(START, "model")
        .addEdge("model", END)
        .compile(
            {
                // checkpointer: ollamaSession.MemorySaver,
                checkpointer: ollamaSession.checkpointer,
                store: ollamaSession.store
            }
        );
    
    return graph
}