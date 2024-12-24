import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StateGraph, START, END } from "@langchain/langgraph";
import { InputStateAnnotation, StateAnnotation } from "../states/RagState";
import { OllamaSession } from "../OllamaSession";
import { BaseMessage } from "@langchain/core/messages";

export const ragGraph = async (ollamaSession: OllamaSession) => {
    const promptTemplate: ChatPromptTemplate = ChatPromptTemplate.fromMessages(
        [
            "user",
            "You are an assistant for question-answering tasks. Use the provided context (if available) to answer the following question. If you do not know the answer, or it isn't in the context, say that you don't know. Provide your answer in three sentences or less, and keep it concise.previous dialogue history:{messages} Question: {question}?Context:{context} Answer:"
        ]
    )

    const retrieve = async (state: typeof InputStateAnnotation.State) => {
        const retrievedDocs = await ollamaSession.vectorStore.similaritySearch(state.question,4,((doc)=>{
            return doc.metadata.sid == state.sid
        }));

        return { context: retrievedDocs,messages:[{role:"user",content:state.question}] };
    };

    const generate = async (state: typeof StateAnnotation.State) => {
        const docsContent = state.context.map((doc) => doc.pageContent).join("\n");

        const messages = await promptTemplate.invoke({
            messages:state.messages,
            question: state.question,
            context: docsContent,
        });

        const response = await ollamaSession.ollama.invoke(messages);
        return { answer: response, messages: [{role:"assistant",content:response}] };
    };

    const graph = new StateGraph(StateAnnotation)
        .addNode("retrieve", retrieve)
        .addNode("generate", generate)
        .addEdge(START, "retrieve")
        .addEdge("retrieve", "generate")
        .addEdge("generate", END)
        .compile(
            {
                checkpointer: ollamaSession.checkpointer,
                store: ollamaSession.store
            }
        );

    return graph
}