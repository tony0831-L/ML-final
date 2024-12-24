import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { Document } from "@langchain/core/documents";
/**
 * 輸入狀態
 */
export const chatState = Annotation.Root({
    // text: Annotation<string>,
    ...MessagesAnnotation.spec
});
