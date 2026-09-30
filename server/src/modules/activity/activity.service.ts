import prisma from "../../utils/prisma";

type TLogActivityParams = {
  adminId?: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "REORDER" | "LOGIN" | "STATUS_TOGGLE" | "UPLOAD";
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
};

const logActivity = async (params: TLogActivityParams) => {
  try {
    await prisma.activityLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details,
        ipAddress: params.ipAddress
      }
    });
  } catch (error) {
    // Non-blocking error
    console.error("Failed to write activity log:", error);
  }
};

const getRecentActivities = async (limit: number = 20) => {
  return prisma.activityLog.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: limit
  });
};

export const ActivityService = {
  logActivity,
  getRecentActivities
};
