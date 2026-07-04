import { ContactMessageStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

type TAnyObject = Record<string, any>;

const asObjectArray = (value: unknown): TAnyObject[] => {
  return Array.isArray(value) ? (value as TAnyObject[]) : [];
};

const pickSimpleData = (
  payload: TAnyObject,
  blockedKeys: string[]
): TAnyObject => {
  const data: TAnyObject = {};

  Object.keys(payload).forEach((key) => {
    if (!blockedKeys.includes(key)) {
      data[key] = payload[key];
    }
  });

  return data;
};

/* ---------------- Dashboard ---------------- */

const getDashboardOverview = async () => {
  const [
    totalProjects,
    totalSkills,
    totalMessages,
    unreadMessages,
    totalExperiences,
    totalServices,
    activeResume,
    recentMessages
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({
      where: {
        status: "UNREAD"
      }
    }),
    prisma.experience.count(),
    prisma.service.count(),
    prisma.resume.findFirst({
      where: {
        isActive: true
      },
      select: {
        id: true,
        title: true,
        targetRole: true,
        updatedAt: true
      }
    }),
    prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    })
  ]);

  return {
    totals: {
      projects: totalProjects,
      skills: totalSkills,
      messages: totalMessages,
      unreadMessages,
      experiences: totalExperiences,
      services: totalServices
    },
    resumeStatus: activeResume,
    recentMessages
  };
};

/* ---------------- Hero ---------------- */

const getHero = async () => {
  return prisma.heroSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      badges: {
        orderBy: {
          order: "asc"
        }
      },
      techHighlights: {
        orderBy: {
          order: "asc"
        }
      },
      socialLinks: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const updateHero = async (payload: TAnyObject) => {
  const existingHero = await prisma.heroSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  const { badges, techHighlights, socialLinks, ...heroData } = payload;

  if (!existingHero) {
    return prisma.heroSection.create({
      data: {
        ...heroData,
        name: heroData.name || "AL Shahariar Arafat Shawon",
        designation:
          heroData.designation ||
          "Backend Developer | Backend-Focused Full-Stack Developer | Software Engineer",
        introduction: heroData.introduction || "Portfolio introduction",
        badges: {
          create: asObjectArray(badges).map((badge, index) => ({
            text: badge.text,
            order: badge.order ?? index + 1,
            isEnabled: badge.isEnabled ?? true
          }))
        },
        techHighlights: {
          create: asObjectArray(techHighlights).map((tech, index) => ({
            name: tech.name,
            order: tech.order ?? index + 1,
            isEnabled: tech.isEnabled ?? true
          }))
        },
        socialLinks: {
          create: asObjectArray(socialLinks).map((link, index) => ({
            platform: link.platform,
            url: link.url,
            icon: link.icon,
            order: link.order ?? index + 1,
            isEnabled: link.isEnabled ?? true
          }))
        }
      },
      include: {
        badges: true,
        techHighlights: true,
        socialLinks: true
      }
    });
  }

  return prisma.$transaction(async (tx) => {
    await tx.heroSection.update({
      where: {
        id: existingHero.id
      },
      data: heroData
    });

    if (Array.isArray(badges)) {
      await tx.heroBadge.deleteMany({
        where: {
          heroId: existingHero.id
        }
      });

      if (badges.length) {
        await tx.heroBadge.createMany({
          data: asObjectArray(badges).map((badge, index) => ({
            text: badge.text,
            order: badge.order ?? index + 1,
            isEnabled: badge.isEnabled ?? true,
            heroId: existingHero.id
          }))
        });
      }
    }

    if (Array.isArray(techHighlights)) {
      await tx.heroTechHighlight.deleteMany({
        where: {
          heroId: existingHero.id
        }
      });

      if (techHighlights.length) {
        await tx.heroTechHighlight.createMany({
          data: asObjectArray(techHighlights).map((tech, index) => ({
            name: tech.name,
            order: tech.order ?? index + 1,
            isEnabled: tech.isEnabled ?? true,
            heroId: existingHero.id
          }))
        });
      }
    }

    if (Array.isArray(socialLinks)) {
      await tx.socialLink.deleteMany({
        where: {
          heroId: existingHero.id
        }
      });

      if (socialLinks.length) {
        await tx.socialLink.createMany({
          data: asObjectArray(socialLinks).map((link, index) => ({
            platform: link.platform,
            url: link.url,
            icon: link.icon,
            order: link.order ?? index + 1,
            isEnabled: link.isEnabled ?? true,
            heroId: existingHero.id
          }))
        });
      }
    }

    return tx.heroSection.findUnique({
      where: {
        id: existingHero.id
      },
      include: {
        badges: {
          orderBy: {
            order: "asc"
          }
        },
        techHighlights: {
          orderBy: {
            order: "asc"
          }
        },
        socialLinks: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });
  });
};

/* ---------------- About ---------------- */

const getAbout = async () => {
  return prisma.aboutSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      quickFacts: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const updateAbout = async (payload: TAnyObject) => {
  const existingAbout = await prisma.aboutSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  const { quickFacts, ...aboutData } = payload;

  if (!existingAbout) {
    return prisma.aboutSection.create({
      data: {
        currentStatus: aboutData.currentStatus || "",
        programmingJourney: aboutData.programmingJourney || "",
        workEnjoyment: aboutData.workEnjoyment || "",
        backendInterest: aboutData.backendInterest || "",
        futurePlan: aboutData.futurePlan || "",
        personality: aboutData.personality || "",
        hobbies: aboutData.hobbies,
        imageUrl: aboutData.imageUrl,
        quickFacts: {
          create: asObjectArray(quickFacts).map((fact, index) => ({
            label: fact.label,
            value: fact.value,
            order: fact.order ?? index + 1,
            isEnabled: fact.isEnabled ?? true
          }))
        }
      },
      include: {
        quickFacts: true
      }
    });
  }

  return prisma.$transaction(async (tx) => {
    await tx.aboutSection.update({
      where: {
        id: existingAbout.id
      },
      data: aboutData
    });

    if (Array.isArray(quickFacts)) {
      await tx.quickFact.deleteMany({
        where: {
          aboutId: existingAbout.id
        }
      });

      if (quickFacts.length) {
        await tx.quickFact.createMany({
          data: asObjectArray(quickFacts).map((fact, index) => ({
            label: fact.label,
            value: fact.value,
            order: fact.order ?? index + 1,
            isEnabled: fact.isEnabled ?? true,
            aboutId: existingAbout.id
          }))
        });
      }
    }

    return tx.aboutSection.findUnique({
      where: {
        id: existingAbout.id
      },
      include: {
        quickFacts: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });
  });
};

/* ---------------- Navbar ---------------- */

const getNavbarItems = async () => {
  return prisma.navbarItem.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createNavbarItem = async (payload: TAnyObject) => {
  return prisma.navbarItem.create({
    data: payload as any
  });
};

const updateNavbarItem = async (id: string, payload: TAnyObject) => {
  return prisma.navbarItem.update({
    where: {
      id
    },
    data: payload as any
  });
};

const deleteNavbarItem = async (id: string) => {
  return prisma.navbarItem.delete({
    where: {
      id
    }
  });
};

/* ---------------- Experience ---------------- */

const getExperiences = async () => {
  return prisma.experience.findMany({
    orderBy: {
      order: "asc"
    },
    include: {
      bullets: {
        orderBy: {
          order: "asc"
        }
      },
      metrics: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const createExperience = async (payload: TAnyObject) => {
  const { bullets, metrics, ...experienceData } = payload;

  return prisma.experience.create({
    data: {
      ...experienceData,
      bullets: {
        create: asObjectArray(bullets).map((bullet, index) => ({
          text: bullet.text,
          order: bullet.order ?? index + 1
        }))
      },
      metrics: {
        create: asObjectArray(metrics).map((metric, index) => ({
          label: metric.label,
          value: metric.value,
          order: metric.order ?? index + 1
        }))
      }
    } as any,
    include: {
      bullets: true,
      metrics: true
    }
  });
};

const updateExperience = async (id: string, payload: TAnyObject) => {
  const { bullets, metrics, ...experienceData } = payload;

  return prisma.$transaction(async (tx) => {
    await tx.experience.update({
      where: {
        id
      },
      data: experienceData as any
    });

    if (Array.isArray(bullets)) {
      await tx.experienceBullet.deleteMany({
        where: {
          experienceId: id
        }
      });

      if (bullets.length) {
        await tx.experienceBullet.createMany({
          data: asObjectArray(bullets).map((bullet, index) => ({
            text: bullet.text,
            order: bullet.order ?? index + 1,
            experienceId: id
          }))
        });
      }
    }

    if (Array.isArray(metrics)) {
      await tx.experienceMetric.deleteMany({
        where: {
          experienceId: id
        }
      });

      if (metrics.length) {
        await tx.experienceMetric.createMany({
          data: asObjectArray(metrics).map((metric, index) => ({
            label: metric.label,
            value: metric.value,
            order: metric.order ?? index + 1,
            experienceId: id
          }))
        });
      }
    }

    return tx.experience.findUnique({
      where: {
        id
      },
      include: {
        bullets: {
          orderBy: {
            order: "asc"
          }
        },
        metrics: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });
  });
};

const deleteExperience = async (id: string) => {
  return prisma.experience.delete({
    where: {
      id
    }
  });
};

/* ---------------- Skill Categories and Skills ---------------- */

const getSkillCategories = async () => {
  return prisma.skillCategory.findMany({
    orderBy: {
      order: "asc"
    },
    include: {
      skills: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const createSkillCategory = async (payload: TAnyObject) => {
  return prisma.skillCategory.create({
    data: payload as any
  });
};

const updateSkillCategory = async (id: string, payload: TAnyObject) => {
  return prisma.skillCategory.update({
    where: {
      id
    },
    data: payload as any
  });
};

const deleteSkillCategory = async (id: string) => {
  return prisma.skillCategory.delete({
    where: {
      id
    }
  });
};

const getSkills = async () => {
  return prisma.skill.findMany({
    orderBy: {
      order: "asc"
    },
    include: {
      category: true
    }
  });
};

const createSkill = async (payload: TAnyObject) => {
  return prisma.skill.create({
    data: payload as any,
    include: {
      category: true
    }
  });
};

const updateSkill = async (id: string, payload: TAnyObject) => {
  return prisma.skill.update({
    where: {
      id
    },
    data: payload as any,
    include: {
      category: true
    }
  });
};

const deleteSkill = async (id: string) => {
  return prisma.skill.delete({
    where: {
      id
    }
  });
};

/* ---------------- Projects ---------------- */

const getProjects = async () => {
  return prisma.project.findMany({
    orderBy: [
      {
        isFeatured: "desc"
      },
      {
        order: "asc"
      }
    ],
    include: {
      images: {
        orderBy: {
          order: "asc"
        }
      },
      features: {
        orderBy: {
          order: "asc"
        }
      },
      challenges: {
        orderBy: {
          order: "asc"
        }
      },
      improvements: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const createProject = async (payload: TAnyObject) => {
  const { images, features, challenges, improvements, ...projectData } = payload;

  return prisma.project.create({
    data: {
      ...projectData,
      images: {
        create: asObjectArray(images).map((image, index) => ({
          url: image.url,
          altText: image.altText,
          fileType: image.fileType || "IMAGE",
          order: image.order ?? index + 1
        }))
      },
      features: {
        create: asObjectArray(features).map((feature, index) => ({
          title: feature.title,
          text: feature.text,
          type: feature.type,
          order: feature.order ?? index + 1
        }))
      },
      challenges: {
        create: asObjectArray(challenges).map((challenge, index) => ({
          challenge: challenge.challenge,
          solution: challenge.solution,
          order: challenge.order ?? index + 1
        }))
      },
      improvements: {
        create: asObjectArray(improvements).map((improvement, index) => ({
          improvement: improvement.improvement,
          order: improvement.order ?? index + 1
        }))
      }
    } as any,
    include: {
      images: true,
      features: true,
      challenges: true,
      improvements: true
    }
  });
};

const updateProject = async (id: string, payload: TAnyObject) => {
  const { images, features, challenges, improvements, ...projectData } = payload;

  return prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: {
        id
      },
      data: projectData as any
    });

    if (Array.isArray(images)) {
      await tx.projectImage.deleteMany({
        where: {
          projectId: id
        }
      });

      if (images.length) {
        await tx.projectImage.createMany({
          data: asObjectArray(images).map((image, index) => ({
            url: image.url,
            altText: image.altText,
            fileType: image.fileType || "IMAGE",
            order: image.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    if (Array.isArray(features)) {
      await tx.projectFeature.deleteMany({
        where: {
          projectId: id
        }
      });

      if (features.length) {
        await tx.projectFeature.createMany({
          data: asObjectArray(features).map((feature, index) => ({
            title: feature.title,
            text: feature.text,
            type: feature.type,
            order: feature.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    if (Array.isArray(challenges)) {
      await tx.projectChallenge.deleteMany({
        where: {
          projectId: id
        }
      });

      if (challenges.length) {
        await tx.projectChallenge.createMany({
          data: asObjectArray(challenges).map((challenge, index) => ({
            challenge: challenge.challenge,
            solution: challenge.solution,
            order: challenge.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    if (Array.isArray(improvements)) {
      await tx.projectImprovement.deleteMany({
        where: {
          projectId: id
        }
      });

      if (improvements.length) {
        await tx.projectImprovement.createMany({
          data: asObjectArray(improvements).map((improvement, index) => ({
            improvement: improvement.improvement,
            order: improvement.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    return tx.project.findUnique({
      where: {
        id
      },
      include: {
        images: {
          orderBy: {
            order: "asc"
          }
        },
        features: {
          orderBy: {
            order: "asc"
          }
        },
        challenges: {
          orderBy: {
            order: "asc"
          }
        },
        improvements: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });
  });
};

const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: {
      id
    }
  });
};

/* ---------------- Education ---------------- */

const getEducation = async () => {
  return prisma.education.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createEducation = async (payload: TAnyObject) => {
  return prisma.education.create({
    data: payload as any
  });
};

const updateEducation = async (id: string, payload: TAnyObject) => {
  return prisma.education.update({
    where: {
      id
    },
    data: payload as any
  });
};

const deleteEducation = async (id: string) => {
  return prisma.education.delete({
    where: {
      id
    }
  });
};

/* ---------------- Certifications ---------------- */

const getCertifications = async () => {
  return prisma.certification.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createCertification = async (payload: TAnyObject) => {
  return prisma.certification.create({
    data: payload as any
  });
};

const updateCertification = async (id: string, payload: TAnyObject) => {
  return prisma.certification.update({
    where: {
      id
    },
    data: payload as any
  });
};

const deleteCertification = async (id: string) => {
  return prisma.certification.delete({
    where: {
      id
    }
  });
};

/* ---------------- Services ---------------- */

const getServices = async () => {
  return prisma.service.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createService = async (payload: TAnyObject) => {
  return prisma.service.create({
    data: payload as any
  });
};

const updateService = async (id: string, payload: TAnyObject) => {
  return prisma.service.update({
    where: {
      id
    },
    data: payload as any
  });
};

const deleteService = async (id: string) => {
  return prisma.service.delete({
    where: {
      id
    }
  });
};

/* ---------------- Contact Info and Messages ---------------- */

const getContactInfo = async () => {
  return prisma.contactInfo.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });
};

const updateContactInfo = async (payload: TAnyObject) => {
  const existingContactInfo = await prisma.contactInfo.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  if (!existingContactInfo) {
    return prisma.contactInfo.create({
      data: payload as any
    });
  }

  return prisma.contactInfo.update({
    where: {
      id: existingContactInfo.id
    },
    data: payload as any
  });
};

const getMessages = async (status?: string) => {
  const validStatus =
    status === "READ" || status === "UNREAD"
      ? (status as ContactMessageStatus)
      : undefined;

  return prisma.contactMessage.findMany({
    where: validStatus
      ? {
          status: validStatus
        }
      : undefined,
    orderBy: {
      createdAt: "desc"
    }
  });
};

const markMessageAsRead = async (id: string) => {
  return prisma.contactMessage.update({
    where: {
      id
    },
    data: {
      status: "READ"
    }
  });
};

const markMessageAsUnread = async (id: string) => {
  return prisma.contactMessage.update({
    where: {
      id
    },
    data: {
      status: "UNREAD"
    }
  });
};

const deleteMessage = async (id: string) => {
  return prisma.contactMessage.delete({
    where: {
      id
    }
  });
};

/* ---------------- Footer Links ---------------- */

const getFooterLinks = async () => {
  return prisma.footerLink.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createFooterLink = async (payload: TAnyObject) => {
  return prisma.footerLink.create({
    data: payload as any
  });
};

const updateFooterLink = async (id: string, payload: TAnyObject) => {
  return prisma.footerLink.update({
    where: {
      id
    },
    data: payload as any
  });
};

const deleteFooterLink = async (id: string) => {
  return prisma.footerLink.delete({
    where: {
      id
    }
  });
};

/* ---------------- Site Settings ---------------- */

const getSiteSettings = async () => {
  return prisma.siteSetting.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });
};

const updateSiteSettings = async (payload: TAnyObject) => {
  const existingSettings = await prisma.siteSetting.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  if (!existingSettings) {
    return prisma.siteSetting.create({
      data: payload as any
    });
  }

  return prisma.siteSetting.update({
    where: {
      id: existingSettings.id
    },
    data: payload as any
  });
};

/* ---------------- Safe Delete Wrapper ---------------- */

const ensureRecordExists = async (
  modelName: string,
  callback: () => Promise<unknown>
) => {
  try {
    return await callback();
  } catch (error: any) {
    if (error?.code === "P2025") {
      throw new AppError(404, `${modelName} not found`);
    }

    throw error;
  }
};

export const AdminService = {
  getDashboardOverview,

  getHero,
  updateHero,

  getAbout,
  updateAbout,

  getNavbarItems,
  createNavbarItem,
  updateNavbarItem,
  deleteNavbarItem,

  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,

  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,

  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,

  getProjects,
  createProject,
  updateProject,
  deleteProject,

  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,

  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,

  getServices,
  createService,
  updateService,
  deleteService,

  getContactInfo,
  updateContactInfo,

  getMessages,
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,

  getFooterLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,

  getSiteSettings,
  updateSiteSettings,

  ensureRecordExists
};