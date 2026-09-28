import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";

type TAnyObject = Record<string, any>;

export const getAchievements = async () => {
  return prisma.achievement.findMany({
    orderBy: { order: "asc" }
  });
};

export const createAchievement = async (payload: TAnyObject) => {
  return prisma.achievement.create({ data: payload as any });
};

export const updateAchievement = async (id: string, payload: TAnyObject) => {
  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Achievement not found");

  return prisma.achievement.update({
    where: { id },
    data: payload as any
  });
};

export const deleteAchievement = async (id: string) => {
  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Achievement not found");

  return prisma.achievement.delete({ where: { id } });
};

export const AchievementService = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
