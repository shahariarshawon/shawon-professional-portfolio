import { Router } from "express";
import prisma from "../../utils/prisma";

const router = Router();

// Rate limiting should be applied here at the router level

router.get("/profile", async (req, res) => {
  const profile = await prisma.heroSection.findFirst({
    include: {
      socialLinks: true,
      badges: true,
      techHighlights: true
    }
  });
  res.json({ success: true, data: profile });
});

router.get("/projects", async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { isEnabled: true },
    select: {
      name: true,
      slug: true,
      shortDescription: true,
      techStack: true,
      liveLink: true,
      githubLink: true,
      isFeatured: true
    },
    orderBy: { order: "asc" }
  });
  res.json({ success: true, data: projects });
});

router.get("/skills", async (req, res) => {
  const skills = await prisma.skillCategory.findMany({
    where: { isEnabled: true },
    include: {
      skills: {
        where: { isEnabled: true },
        orderBy: { order: "asc" }
      }
    },
    orderBy: { order: "asc" }
  });
  res.json({ success: true, data: skills });
});

export const PublicApiRouter = router;
