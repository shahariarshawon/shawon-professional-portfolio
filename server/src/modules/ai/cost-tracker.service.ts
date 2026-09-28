import prisma from "../../utils/prisma";

export const trackAIUsage = async (
  endpoint: string,
  modelName: string,
  tokensUsed: number
) => {
  try {
    // Pricing estimations (e.g. gpt-4o vs gpt-4o-mini)
    let costPer1k = 0;
    if (modelName === "gpt-4o") costPer1k = 0.005;
    else if (modelName === "gpt-4o-mini") costPer1k = 0.00015;

    const estimatedCost = (tokensUsed / 1000) * costPer1k;

    await prisma.aIUsageMetric.create({
      data: {
        endpoint,
        modelName,
        tokensUsed,
        estimatedCost
      }
    });
  } catch (error) {
    console.error("Failed to track AI usage:", error);
  }
};
