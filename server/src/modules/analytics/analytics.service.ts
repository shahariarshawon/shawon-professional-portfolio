import prisma from "../../utils/prisma";

export const trackEvent = async (eventType: string, page?: string, visitorId?: string, metadata?: any) => {
  return prisma.analyticsEvent.create({
    data: {
      eventType,
      page,
      visitorId,
      metadata: metadata || {}
    } as any
  });
};

export const getAnalyticsOverview = async () => {
  const [totalVisits, uniqueVisitors, pageViews] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.groupBy({
      by: ['visitorId'],
      _count: { visitorId: true }
    }),
    prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } })
  ]);

  return {
    totalVisits,
    uniqueVisitors: uniqueVisitors.length,
    pageViews
  };
};

export const getRecentVisitors = async () => {
  return prisma.analyticsEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });
};

export const AnalyticsService = {
  trackEvent,
  getAnalyticsOverview,
  getRecentVisitors
};
