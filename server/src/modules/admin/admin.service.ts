import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { Prisma } from "../../generated/prisma/client";
import { ActivityService } from "../activity/activity.service";

type TContactMessageStatus = "NEW" | "CONTACTED" | "REPLIED" | "ARCHIVED";
type TAnyObject = Record<string, any>;

const asObjectArray = (value: unknown): TAnyObject[] => {
  return Array.isArray(value) ? (value as TAnyObject[]) : [];
};

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
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
    totalCertifications,
    totalEducation,
    totalBlogs,
    totalAIQueries,
    totalPageViews,
    totalVisitors,
    recentMessages,
    recentActivities,
    popularProjects
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({
      where: {
        status: "NEW"
      }
    }),
    prisma.experience.count(),
    prisma.service.count(),
    prisma.certification.count(),
    prisma.education.count(),
    prisma.blog.count(),
    prisma.aIConversation.count(),
    prisma.pageView.count(),
    prisma.visitorSession.count(),
    prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    }),
    ActivityService.getRecentActivities(8),
    prisma.project.findMany({
      where: { isEnabled: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take: 4,
      include: {
        images: { take: 1 }
      }
    })
  ]);

  return {
    totals: {
      projects: totalProjects,
      skills: totalSkills,
      messages: totalMessages,
      unreadMessages,
      experiences: totalExperiences,
      services: totalServices,
      certifications: totalCertifications,
      education: totalEducation,
      blogs: totalBlogs,
      aiQueries: totalAIQueries,
      pageViews: totalPageViews,
      visitors: totalVisitors
    },
    recentMessages,
    recentActivities,
    popularProjects
  };
};

/* ---------------- Reorder Helper ---------------- */

const reorderItems = async (
  modelName:
    | "experience"
    | "skillCategory"
    | "skill"
    | "project"
    | "education"
    | "certification"
    | "service"
    | "navbarItem"
    | "footerLink",
  items: { id: string; order: number }[],
  adminId?: string
) => {
  const result = await prisma.$transaction(
    items.map((item) =>
      (prisma as any)[modelName].update({
        where: { id: item.id },
        data: { order: item.order }
      })
    )
  );

  await ActivityService.logActivity({
    adminId,
    action: "REORDER",
    entity: modelName.toUpperCase(),
    details: `Reordered ${items.length} items in ${modelName}`
  });

  return result;
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

const updateHero = async (payload: TAnyObject, adminId?: string) => {
  const existingHero = await prisma.heroSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  const { badges, techHighlights, socialLinks, ...heroData } = payload;

  let heroRecord;
  if (!existingHero) {
    heroRecord = await prisma.heroSection.create({
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
  } else {
    heroRecord = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
  }

  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "HERO",
    details: "Updated Hero section details"
  });

  return heroRecord;
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

const updateAbout = async (payload: TAnyObject, adminId?: string) => {
  const existingAbout = await prisma.aboutSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  const { quickFacts, ...aboutData } = payload;

  let aboutRecord;
  if (!existingAbout) {
    aboutRecord = await prisma.aboutSection.create({
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
  } else {
    aboutRecord = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
  }

  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "ABOUT",
    details: "Updated About section and quick facts"
  });

  return aboutRecord;
};

/* ---------------- Navbar ---------------- */

const getNavbarItems = async () => {
  return prisma.navbarItem.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createNavbarItem = async (payload: TAnyObject, adminId?: string) => {
  const result = await prisma.navbarItem.create({
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "NAVBAR",
    entityId: result.id,
    details: `Created navbar item: ${result.label}`
  });
  return result;
};

const updateNavbarItem = async (id: string, payload: TAnyObject, adminId?: string) => {
  const result = await prisma.navbarItem.update({
    where: { id },
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "NAVBAR",
    entityId: id,
    details: `Updated navbar item: ${result.label}`
  });
  return result;
};

const deleteNavbarItem = async (id: string, adminId?: string) => {
  const result = await prisma.navbarItem.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "NAVBAR",
    entityId: id,
    details: `Deleted navbar item: ${result.label}`
  });
  return result;
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

const createExperience = async (payload: TAnyObject, adminId?: string) => {
  const { bullets, metrics, ...experienceData } = payload;

  const result = await prisma.experience.create({
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

  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "EXPERIENCE",
    entityId: result.id,
    details: `Created experience at ${result.companyName} (${result.role})`
  });

  return result;
};

const updateExperience = async (id: string, payload: TAnyObject, adminId?: string) => {
  const { bullets, metrics, ...experienceData } = payload;

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.experience.update({
      where: { id },
      data: experienceData as any
    });

    if (Array.isArray(bullets)) {
      await tx.experienceBullet.deleteMany({
        where: { experienceId: id }
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
        where: { experienceId: id }
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
      where: { id },
      include: {
        bullets: {
          orderBy: { order: "asc" }
        },
        metrics: {
          orderBy: { order: "asc" }
        }
      }
    });
  });

  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "EXPERIENCE",
    entityId: id,
    details: `Updated experience at ${result?.companyName}`
  });

  return result;
};

const deleteExperience = async (id: string, adminId?: string) => {
  const result = await prisma.experience.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "EXPERIENCE",
    entityId: id,
    details: `Deleted experience at ${result.companyName}`
  });
  return result;
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

const createSkillCategory = async (payload: TAnyObject, adminId?: string) => {
  const result = await prisma.skillCategory.create({
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "SKILL_CATEGORY",
    entityId: result.id,
    details: `Created skill category: ${result.name}`
  });
  return result;
};

const updateSkillCategory = async (id: string, payload: TAnyObject, adminId?: string) => {
  const result = await prisma.skillCategory.update({
    where: { id },
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "SKILL_CATEGORY",
    entityId: id,
    details: `Updated skill category: ${result.name}`
  });
  return result;
};

const deleteSkillCategory = async (id: string, adminId?: string) => {
  const result = await prisma.skillCategory.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "SKILL_CATEGORY",
    entityId: id,
    details: `Deleted skill category: ${result.name}`
  });
  return result;
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

const createSkill = async (payload: TAnyObject, adminId?: string) => {
  const result = await prisma.skill.create({
    data: payload as any,
    include: {
      category: true
    }
  });
  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "SKILL",
    entityId: result.id,
    details: `Created skill: ${result.name}`
  });
  return result;
};

const updateSkill = async (id: string, payload: TAnyObject, adminId?: string) => {
  const result = await prisma.skill.update({
    where: { id },
    data: payload as any,
    include: {
      category: true
    }
  });
  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "SKILL",
    entityId: id,
    details: `Updated skill: ${result.name}`
  });
  return result;
};

const deleteSkill = async (id: string, adminId?: string) => {
  const result = await prisma.skill.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "SKILL",
    entityId: id,
    details: `Deleted skill: ${result.name}`
  });
  return result;
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
      },
      technologies: {
        orderBy: {
          order: "asc"
        }
      },
      resultsList: {
        orderBy: {
          order: "asc"
        }
      },
      architectures: {
        orderBy: {
          order: "asc"
        }
      },
      caseStudy: true,
      links: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const createProject = async (payload: TAnyObject, adminId?: string) => {
  const {
    images,
    features,
    challenges,
    improvements,
    technologies,
    resultsList,
    architectures,
    caseStudy,
    links,
    ...projectData
  } = payload;

  const slug = projectData.slug
    ? slugify(projectData.slug)
    : slugify(projectData.name || "project");

  const result = await prisma.project.create({
    data: {
      ...projectData,
      slug,
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
      },
      technologies: {
        create: asObjectArray(technologies).map((tech, index) => ({
          name: tech.name,
          category: tech.category,
          icon: tech.icon,
          order: tech.order ?? index + 1
        }))
      },
      resultsList: {
        create: asObjectArray(resultsList).map((resItem, index) => ({
          metric: resItem.metric,
          label: resItem.label,
          description: resItem.description,
          order: resItem.order ?? index + 1
        }))
      },
      architectures: {
        create: asObjectArray(architectures).map((arch, index) => ({
          title: arch.title,
          description: arch.description,
          diagramUrl: arch.diagramUrl,
          order: arch.order ?? index + 1
        }))
      },
      caseStudy: caseStudy
        ? {
            create: {
              overview: caseStudy.overview,
              problemStatement: caseStudy.problemStatement,
              proposedSolution: caseStudy.proposedSolution,
              architectureDetails: caseStudy.architectureDetails,
              challengesFaced: caseStudy.challengesFaced,
              outcomes: caseStudy.outcomes,
              lessonsLearned: caseStudy.lessonsLearned
            }
          }
        : undefined,
      links: {
        create: asObjectArray(links).map((link, index) => ({
          label: link.label,
          url: link.url,
          type: link.type || "OTHER",
          order: link.order ?? index + 1
        }))
      }
    } as any,
    include: {
      images: true,
      features: true,
      challenges: true,
      improvements: true,
      technologies: true,
      resultsList: true,
      architectures: true,
      caseStudy: true,
      links: true
    }
  });

  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "PROJECT",
    entityId: result.id,
    details: `Created project: ${result.name}`
  });

  return result;
};

const updateProject = async (id: string, payload: TAnyObject, adminId?: string) => {
  const {
    images,
    features,
    challenges,
    improvements,
    technologies,
    resultsList,
    architectures,
    caseStudy,
    links,
    ...projectData
  } = payload;

  if (projectData.slug) {
    projectData.slug = slugify(projectData.slug);
  }

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.project.update({
      where: { id },
      data: projectData as any
    });

    if (Array.isArray(images)) {
      await tx.projectImage.deleteMany({
        where: { projectId: id }
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
        where: { projectId: id }
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
        where: { projectId: id }
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
        where: { projectId: id }
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

    if (Array.isArray(technologies)) {
      await tx.projectTechnology.deleteMany({
        where: { projectId: id }
      });

      if (technologies.length) {
        await tx.projectTechnology.createMany({
          data: asObjectArray(technologies).map((tech, index) => ({
            name: tech.name,
            category: tech.category,
            icon: tech.icon,
            order: tech.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    if (Array.isArray(resultsList)) {
      await tx.projectResult.deleteMany({
        where: { projectId: id }
      });

      if (resultsList.length) {
        await tx.projectResult.createMany({
          data: asObjectArray(resultsList).map((resItem, index) => ({
            metric: resItem.metric,
            label: resItem.label,
            description: resItem.description,
            order: resItem.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    if (Array.isArray(architectures)) {
      await tx.projectArchitecture.deleteMany({
        where: { projectId: id }
      });

      if (architectures.length) {
        await tx.projectArchitecture.createMany({
          data: asObjectArray(architectures).map((arch, index) => ({
            title: arch.title,
            description: arch.description,
            diagramUrl: arch.diagramUrl,
            order: arch.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    if (caseStudy) {
      await tx.projectCaseStudy.upsert({
        where: { projectId: id },
        create: {
          projectId: id,
          overview: caseStudy.overview,
          problemStatement: caseStudy.problemStatement,
          proposedSolution: caseStudy.proposedSolution,
          architectureDetails: caseStudy.architectureDetails,
          challengesFaced: caseStudy.challengesFaced,
          outcomes: caseStudy.outcomes,
          lessonsLearned: caseStudy.lessonsLearned
        },
        update: {
          overview: caseStudy.overview,
          problemStatement: caseStudy.problemStatement,
          proposedSolution: caseStudy.proposedSolution,
          architectureDetails: caseStudy.architectureDetails,
          challengesFaced: caseStudy.challengesFaced,
          outcomes: caseStudy.outcomes,
          lessonsLearned: caseStudy.lessonsLearned
        }
      });
    }

    if (Array.isArray(links)) {
      await tx.projectLink.deleteMany({
        where: { projectId: id }
      });

      if (links.length) {
        await tx.projectLink.createMany({
          data: asObjectArray(links).map((link, index) => ({
            label: link.label,
            url: link.url,
            type: link.type || "OTHER",
            order: link.order ?? index + 1,
            projectId: id
          }))
        });
      }
    }

    return tx.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        features: { orderBy: { order: "asc" } },
        challenges: { orderBy: { order: "asc" } },
        improvements: { orderBy: { order: "asc" } },
        technologies: { orderBy: { order: "asc" } },
        resultsList: { orderBy: { order: "asc" } },
        architectures: { orderBy: { order: "asc" } },
        caseStudy: true,
        links: { orderBy: { order: "asc" } }
      }
    });
  });

  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "PROJECT",
    entityId: id,
    details: `Updated project: ${result?.name}`
  });

  return result;
};

const deleteProject = async (id: string, adminId?: string) => {
  const result = await prisma.project.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "PROJECT",
    entityId: id,
    details: `Deleted project: ${result.name}`
  });
  return result;
};

/* ---------------- Education ---------------- */

const getEducation = async () => {
  return prisma.education.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createEducation = async (payload: TAnyObject, adminId?: string) => {
  const result = await prisma.education.create({
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "EDUCATION",
    entityId: result.id,
    details: `Created education: ${result.degree} at ${result.institution}`
  });
  return result;
};

const updateEducation = async (id: string, payload: TAnyObject, adminId?: string) => {
  const result = await prisma.education.update({
    where: { id },
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "EDUCATION",
    entityId: id,
    details: `Updated education: ${result.degree}`
  });
  return result;
};

const deleteEducation = async (id: string, adminId?: string) => {
  const result = await prisma.education.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "EDUCATION",
    entityId: id,
    details: `Deleted education: ${result.degree}`
  });
  return result;
};

/* ---------------- Certifications ---------------- */

const getCertifications = async () => {
  return prisma.certification.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const normalizeCertificationPayload = (payload: TAnyObject) => {
  const name = payload.name || payload.title || "Certification";
  const title = payload.title || payload.name || "Certification";
  const issuingOrganization = payload.issuingOrganization || payload.issuer || "";
  const issuer = payload.issuer || payload.issuingOrganization || "";
  const credentialLink = payload.credentialLink || payload.credentialUrl || null;
  const credentialUrl = payload.credentialUrl || payload.credentialLink || null;
  const certificateFileUrl = payload.certificateFileUrl || payload.imageUrl || null;
  const imageUrl = payload.imageUrl || payload.certificateFileUrl || null;

  return {
    ...payload,
    name,
    title,
    issuingOrganization,
    issuer,
    credentialLink,
    credentialUrl,
    certificateFileUrl,
    imageUrl
  };
};

const createCertification = async (payload: TAnyObject, adminId?: string) => {
  const normalized = normalizeCertificationPayload(payload);
  const result = await prisma.certification.create({
    data: normalized as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "CERTIFICATION",
    entityId: result.id,
    details: `Created certification: ${result.name}`
  });
  return result;
};

const updateCertification = async (id: string, payload: TAnyObject, adminId?: string) => {
  const normalized = normalizeCertificationPayload(payload);
  const result = await prisma.certification.update({
    where: { id },
    data: normalized as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "CERTIFICATION",
    entityId: id,
    details: `Updated certification: ${result.name}`
  });
  return result;
};

const deleteCertification = async (id: string, adminId?: string) => {
  const result = await prisma.certification.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "CERTIFICATION",
    entityId: id,
    details: `Deleted certification: ${result.name}`
  });
  return result;
};

/* ---------------- Services ---------------- */

const getServices = async () => {
  return prisma.service.findMany({
    orderBy: {
      order: "asc"
    },
    include: {
      features: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const createService = async (payload: TAnyObject, adminId?: string) => {
  const { features, ...serviceData } = payload;

  const result = await prisma.service.create({
    data: {
      ...serviceData,
      features: {
        create: asObjectArray(features).map((feat, index) => ({
          text: feat.text,
          order: feat.order ?? index + 1
        }))
      }
    } as any,
    include: {
      features: true
    }
  });

  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "SERVICE",
    entityId: result.id,
    details: `Created service: ${result.title}`
  });

  return result;
};

const updateService = async (id: string, payload: TAnyObject, adminId?: string) => {
  const { features, ...serviceData } = payload;

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.service.update({
      where: { id },
      data: serviceData as any
    });

    if (Array.isArray(features)) {
      await tx.serviceFeature.deleteMany({
        where: { serviceId: id }
      });

      if (features.length) {
        await tx.serviceFeature.createMany({
          data: asObjectArray(features).map((feat, index) => ({
            text: feat.text,
            order: feat.order ?? index + 1,
            serviceId: id
          }))
        });
      }
    }

    return tx.service.findUnique({
      where: { id },
      include: {
        features: {
          orderBy: { order: "asc" }
        }
      }
    });
  });

  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "SERVICE",
    entityId: id,
    details: `Updated service: ${result?.title}`
  });

  return result;
};

const deleteService = async (id: string, adminId?: string) => {
  const result = await prisma.service.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "SERVICE",
    entityId: id,
    details: `Deleted service: ${result.title}`
  });
  return result;
};

/* ---------------- Contact Info and Messages ---------------- */

const getContactInfo = async () => {
  return prisma.contactInfo.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });
};

const updateContactInfo = async (payload: TAnyObject, adminId?: string) => {
  const existingContactInfo = await prisma.contactInfo.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  let result;
  if (!existingContactInfo) {
    result = await prisma.contactInfo.create({
      data: payload as any
    });
  } else {
    result = await prisma.contactInfo.update({
      where: {
        id: existingContactInfo.id
      },
      data: payload as any
    });
  }

  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "CONTACT_INFO",
    details: "Updated contact information"
  });

  return result;
};

const getMessages = async (status?: string) => {
  const validStatuses = ["NEW", "CONTACTED", "REPLIED", "ARCHIVED"];
  const validStatus = validStatuses.includes(status || "")
    ? (status as TContactMessageStatus)
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

const updateMessageStatus = async (
  id: string,
  status: TContactMessageStatus,
  adminId?: string
) => {
  const result = await prisma.contactMessage.update({
    where: { id },
    data: { status }
  });

  await ActivityService.logActivity({
    adminId,
    action: "STATUS_TOGGLE",
    entity: "MESSAGE",
    entityId: id,
    details: `Updated message from ${result.name} to ${status}`
  });

  return result;
};

const deleteMessage = async (id: string, adminId?: string) => {
  const result = await prisma.contactMessage.delete({
    where: { id }
  });

  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "MESSAGE",
    entityId: id,
    details: `Deleted message from ${result.name}`
  });

  return result;
};

/* ---------------- Footer Links ---------------- */

const getFooterLinks = async () => {
  return prisma.footerLink.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

const createFooterLink = async (payload: TAnyObject, adminId?: string) => {
  const result = await prisma.footerLink.create({
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "CREATE",
    entity: "FOOTER_LINK",
    entityId: result.id,
    details: `Created footer link: ${result.label}`
  });
  return result;
};

const updateFooterLink = async (id: string, payload: TAnyObject, adminId?: string) => {
  const result = await prisma.footerLink.update({
    where: { id },
    data: payload as any
  });
  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "FOOTER_LINK",
    entityId: id,
    details: `Updated footer link: ${result.label}`
  });
  return result;
};

const deleteFooterLink = async (id: string, adminId?: string) => {
  const result = await prisma.footerLink.delete({
    where: { id }
  });
  await ActivityService.logActivity({
    adminId,
    action: "DELETE",
    entity: "FOOTER_LINK",
    entityId: id,
    details: `Deleted footer link: ${result.label}`
  });
  return result;
};

/* ---------------- Site Settings ---------------- */

const getSiteSettings = async () => {
  return prisma.siteSetting.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });
};

const updateSiteSettings = async (payload: TAnyObject, adminId?: string) => {
  const existingSettings = await prisma.siteSetting.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });

  let result;
  if (!existingSettings) {
    result = await prisma.siteSetting.create({
      data: payload as any
    });
  } else {
    result = await prisma.siteSetting.update({
      where: {
        id: existingSettings.id
      },
      data: payload as any
    });
  }

  await ActivityService.logActivity({
    adminId,
    action: "UPDATE",
    entity: "SITE_SETTINGS",
    details: "Updated site title, SEO configuration, or color tokens"
  });

  return result;
};

/* ---------------- Safe Record Exists Wrapper ---------------- */

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
  reorderItems,

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
  updateMessageStatus,
  deleteMessage,

  getFooterLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,

  getSiteSettings,
  updateSiteSettings,

  ensureRecordExists
};