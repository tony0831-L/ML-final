import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { Document } from "@langchain/core/documents";
/**
 * 輸入狀態
 */
export const InputStateAnnotation = Annotation.Root({
    sid:Annotation<string>,
    question: Annotation<string>,
    ...MessagesAnnotation.spec
});

/**
 * 生成狀態
 */
export const StateAnnotation = Annotation.Root({
    sid:Annotation<string>,
    question: Annotation<string>,
    context: Annotation<Document[]>,
    answer: Annotation<string>,
    ...MessagesAnnotation.spec
});

