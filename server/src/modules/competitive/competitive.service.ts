import prisma from "../../utils/prisma";

// In a real scenario, this would use fetch() to hit Codeforces/LeetCode APIs.
// For manual fallback as requested, we just use standard CRUD.

export const getCompetitiveStats = async () => {
  return prisma.competitiveStats.findMany({
    orderBy: { platform: 'asc' }
  });
};

export const updateStats = async (platform: string, payload: any) => {
  const existing = await prisma.competitiveStats.findFirst({ where: { platform } });

  if (existing) {
    return prisma.competitiveStats.update({
      where: { id: existing.id },
      data: payload as any
    });
  }

  return prisma.competitiveStats.create({
    data: { ...payload, platform } as any
  });
};

export const CompetitiveService = {
  getCompetitiveStats,
  updateStats
};
