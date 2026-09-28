import prisma from "../../utils/prisma";
import { getEmbeddingsModel } from "./embedding.service";

export const indexDocument = async (content: string, metadata: any) => {
  const embeddings = getEmbeddingsModel();
  const vector = await embeddings.embedQuery(content);
  
  const vectorString = `[${vector.join(",")}]`;
  
  await prisma.$executeRaw`
    INSERT INTO vector_documents (id, content, metadata, embedding)
    VALUES (gen_random_uuid(), ${content}, ${metadata}::jsonb, ${vectorString}::vector)
  `;
};

export const searchSimilarDocuments = async (query: string, limit = 5) => {
  const embeddings = getEmbeddingsModel();
  const vector = await embeddings.embedQuery(query);
  const vectorString = `[${vector.join(",")}]`;
  
  const results = await prisma.$queryRaw`
    SELECT id, content, metadata, 1 - (embedding <=> ${vectorString}::vector) as similarity
    FROM vector_documents
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT ${limit};
  `;
  
  return results;
};
