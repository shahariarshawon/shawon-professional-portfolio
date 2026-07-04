import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

const getNavbar = async () => {
  return prisma.navbarItem.findMany({
    where: {
      isEnabled: true
    },
    orderBy: {
      order: "asc"
    }
  });
};

const getHero = async () => {
  return prisma.heroSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      badges: {
        where: {
          isEnabled: true
        },
        orderBy: {
          order: "asc"
        }
      },
      techHighlights: {
        where: {
          isEnabled: true
        },
        orderBy: {
          order: "asc"
        }
      },
      socialLinks: {
        where: {
          isEnabled: true
        },
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const getAbout = async () => {
  return prisma.aboutSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      quickFacts: {
        where: {
          isEnabled: true
        },
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const getExperiences = async () => {
  return prisma.experience.findMany({
    where: {
      isEnabled: true
    },
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

const getSkills = async () => {
  return prisma.skillCategory.findMany({
    where: {
      isEnabled: true
    },
    orderBy: {
      order: "asc"
    },
    include: {
      skills: {
        where: {
          isEnabled: true
        },
        orderBy: {
          order: "asc"
        }
      }
    }
  });
};

const getProjects = async () => {
  return prisma.project.findMany({
    where: {
      isEnabled: true
    },
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
        },
        take: 1
      },
      features: {
        orderBy: {
          order: "asc"
        },
        take: 5
      }
    }
  });
};

const getProjectBySlug = async (slug: string) => {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      isEnabled: true
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

  if (!project) {
    throw new AppError(404, "Project not found");
  }

  return project;
};

const getEducation = async () => {
  return prisma.education.findMany({
    where: {
      isEnabled: true
    },
    orderBy: {
      order: "asc"
    }
  });
};

const getCertifications = async () => {
  return prisma.certification.findMany({
    where: {
      isEnabled: true
    },
    orderBy: {
      order: "asc"
    }
  });
};

const getServices = async () => {
  return prisma.service.findMany({
    where: {
      isEnabled: true
    },
    orderBy: {
      order: "asc"
    }
  });
};

const getContactInfo = async () => {
  return prisma.contactInfo.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });
};

const getFooter = async () => {
  const footerLinks = await prisma.footerLink.findMany({
    where: {
      isEnabled: true
    },
    orderBy: {
      order: "asc"
    }
  });

  const hero = await prisma.heroSection.findFirst({
    orderBy: {
      updatedAt: "desc"
    },
    select: {
      name: true,
      socialLinks: {
        where: {
          isEnabled: true
        },
        orderBy: {
          order: "asc"
        }
      }
    }
  });

  return {
    name: hero?.name || "AL Shahariar Arafat Shawon",
    tagline: "Backend Developer building secure and scalable web applications.",
    copyright:
      "© 2026 AL Shahariar Arafat Shawon. All rights reserved.",
    quickLinks: footerLinks,
    socialLinks: hero?.socialLinks || []
  };
};

const getSiteSettings = async () => {
  return prisma.siteSetting.findFirst({
    orderBy: {
      updatedAt: "desc"
    }
  });
};

const getFullPortfolio = async () => {
  const [
    navbar,
    hero,
    about,
    experience,
    skills,
    projects,
    education,
    certifications,
    services,
    contactInfo,
    footer,
    siteSettings
  ] = await Promise.all([
    getNavbar(),
    getHero(),
    getAbout(),
    getExperiences(),
    getSkills(),
    getProjects(),
    getEducation(),
    getCertifications(),
    getServices(),
    getContactInfo(),
    getFooter(),
    getSiteSettings()
  ]);

  return {
    navbar,
    hero,
    about,
    experience,
    skills,
    projects,
    education,
    certifications,
    services,
    contactInfo,
    footer,
    siteSettings
  };
};

export const PublicService = {
  getNavbar,
  getHero,
  getAbout,
  getExperiences,
  getSkills,
  getProjects,
  getProjectBySlug,
  getEducation,
  getCertifications,
  getServices,
  getContactInfo,
  getFooter,
  getSiteSettings,
  getFullPortfolio
};