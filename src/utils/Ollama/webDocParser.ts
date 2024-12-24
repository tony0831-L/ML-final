import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const webDocParser = async (url: string):Promise<Document<Record<string, any>>[]> => {
    // const pTagSelector = "bo";
    const markdownSelector = ".markdown"
    const cheerioLoader = new CheerioWebBaseLoader(
        url,
        {
            selector: markdownSelector
        }
    );
    const docs = await cheerioLoader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, chunkOverlap: 200
    });

    const allSplits = await splitter.splitDocuments(docs);

    return allSplits
}