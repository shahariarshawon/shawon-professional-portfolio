import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({
  adapter
});

async function clearPortfolioData() {
  await prisma.$transaction([
    prisma.resumeSkill.deleteMany(),
    prisma.resumeProject.deleteMany(),
    prisma.resumeSection.deleteMany(),
    prisma.resume.deleteMany(),

    prisma.footerLink.deleteMany(),
    prisma.siteSetting.deleteMany(),

    prisma.contactMessage.deleteMany(),
    prisma.contactInfo.deleteMany(),

    prisma.service.deleteMany(),
    prisma.certification.deleteMany(),
    prisma.education.deleteMany(),

    prisma.projectImage.deleteMany(),
    prisma.projectFeature.deleteMany(),
    prisma.projectChallenge.deleteMany(),
    prisma.projectImprovement.deleteMany(),
    prisma.project.deleteMany(),

    prisma.skill.deleteMany(),
    prisma.skillCategory.deleteMany(),

    prisma.experienceBullet.deleteMany(),
    prisma.experienceMetric.deleteMany(),
    prisma.experience.deleteMany(),

    prisma.quickFact.deleteMany(),
    prisma.aboutSection.deleteMany(),

    prisma.socialLink.deleteMany(),
    prisma.heroBadge.deleteMany(),
    prisma.heroTechHighlight.deleteMany(),
    prisma.heroSection.deleteMany(),

    prisma.navbarItem.deleteMany()
  ]);
}

async function main() {
  console.log("Starting database seed...");

  await clearPortfolioData();

  const hashedPassword = await bcrypt.hash("admin123456", 12);

  await prisma.adminUser.upsert({
    where: {
      email: "admin@shawon.dev"
    },
    update: {
      name: "AL Shahariar Arafat Shawon",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true
    },
    create: {
      name: "AL Shahariar Arafat Shawon",
      email: "admin@shawon.dev",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true
    }
  });

  await prisma.siteSetting.create({
    data: {
      siteTitle: "AL Shahariar Arafat Shawon | Backend Developer",
      seoTitle: "AL Shahariar Arafat Shawon - Backend Developer Portfolio",
      seoDescription:
        "Professional backend-focused developer portfolio of AL Shahariar Arafat Shawon, featuring Node.js, Express.js, TypeScript, PostgreSQL, MongoDB, Next.js, and scalable web applications.",
      seoKeywords: [
        "Backend Developer",
        "Software Engineer",
        "Full-Stack Developer",
        "Node.js",
        "Express.js",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "Next.js"
      ],
      accentColor: "#599692",
      backgroundColor: "#11172a",
      normalTextColor: "#626c7d",
      highlightedTextColor: "#dfe5ec"
    }
  });

  await prisma.navbarItem.createMany({
    data: [
      { label: "Home", href: "#home", order: 1 },
      { label: "About", href: "#about", order: 2 },
      { label: "Experience", href: "#experience", order: 3 },
      { label: "Skills", href: "#skills", order: 4 },
      { label: "Projects", href: "#projects", order: 5 },
      { label: "Education", href: "#education", order: 6 },
      { label: "Services", href: "#services", order: 7 },
      { label: "Contact", href: "#contact", order: 8 }
    ]
  });

  const hero = await prisma.heroSection.create({
    data: {
      name: "AL Shahariar Arafat Shawon",
      designation:
        "Backend Developer | Backend-Focused Full-Stack Developer | Software Engineer",
      introduction:
        "I build secure, scalable, and database-driven web applications using Node.js, Express.js, TypeScript, Next.js, and modern backend technologies. I enjoy working with REST APIs, authentication systems, database design, and production-ready software architecture.",
      isGetInTouchEnabled: true,
      isViewResumeEnabled: true,
      isDownloadResumeEnabled: true,
      badges: {
        create: [
          { text: "Backend Developer Intern", order: 1 },
          { text: "Open to Remote Opportunities", order: 2 },
          { text: "Available for Junior Software Engineer Roles", order: 3 }
        ]
      },
      techHighlights: {
        create: [
          { name: "Node.js", order: 1 },
          { name: "Express.js", order: 2 },
          { name: "TypeScript", order: 3 },
          { name: "PostgreSQL", order: 4 },
          { name: "Next.js", order: 5 }
        ]
      },
      socialLinks: {
        create: [
          { platform: "GitHub", url: "#", order: 1 },
          { platform: "LinkedIn", url: "#", order: 2 },
          { platform: "Portfolio", url: "#", order: 3 },
          { platform: "Codeforces", url: "#", order: 4 }
        ]
      }
    }
  });

  const about = await prisma.aboutSection.create({
    data: {
      currentStatus:
        "I am a backend-focused developer from Bangladesh with hands-on experience building RESTful APIs, authentication systems, and database-driven applications.",
      programmingJourney:
        "My programming journey started with problem solving and gradually moved toward building real-world web applications.",
      workEnjoyment:
        "I enjoy designing clean backend architectures, working with databases, building secure authentication systems, and connecting frontend applications with powerful APIs.",
      backendInterest:
        "Currently, I am doing an internship as a backend developer and improving my skills in production-level backend development. I am strengthening my knowledge of Node.js, Express.js, TypeScript, PostgreSQL, NestJS, backend architecture, and scalable system design.",
      futurePlan:
        "My future goal is to become a strong backend/software engineer who can design scalable systems, write clean code, work with cloud-based infrastructure, and contribute to professional engineering teams globally.",
      personality:
        "I enjoy solving problems, learning new technologies, and building applications that are useful for real users.",
      hobbies:
        "Outside programming, I like exploring technology, improving my communication skills, and continuously learning to become a better software engineer."
    }
  });

  await prisma.quickFact.createMany({
    data: [
      {
        label: "Location",
        value: "Uttara, Dhaka, Bangladesh",
        order: 1,
        aboutId: about.id
      },
      {
        label: "Current Role",
        value: "Backend Developer Intern",
        order: 2,
        aboutId: about.id
      },
      {
        label: "Target Roles",
        value: "Backend Developer, Software Engineer, Full-Stack Developer",
        order: 3,
        aboutId: about.id
      },
      {
        label: "Focus Area",
        value: "REST APIs, Authentication, Database Design, Backend Architecture",
        order: 4,
        aboutId: about.id
      },
      {
        label: "Open To",
        value: "Remote and On-site Opportunities",
        order: 5,
        aboutId: about.id
      }
    ]
  });

  const experience = await prisma.experience.create({
    data: {
      companyName: "[Add Internship Company Name]",
      role: "Backend Developer Intern",
      status: "CURRENTLY_WORKING",
      startDate: "[Add Start Date]",
      endDate: "Present",
      location: "Bangladesh / Remote / On-site",
      description:
        "Working as a backend developer intern, contributing to backend APIs, debugging, database-related tasks, authentication flows, and application feature development.",
      order: 1,
      isEnabled: true
    }
  });

  await prisma.experienceBullet.createMany({
    data: [
      {
        text: "Developed and maintained RESTful APIs using Node.js and Express.js.",
        order: 1,
        experienceId: experience.id
      },
      {
        text: "Worked on authentication and authorization-related backend features.",
        order: 2,
        experienceId: experience.id
      },
      {
        text: "Fixed backend bugs and improved API response reliability.",
        order: 3,
        experienceId: experience.id
      },
      {
        text: "Collaborated with frontend developers to integrate APIs.",
        order: 4,
        experienceId: experience.id
      },
      {
        text: "Worked with database models, queries, and data validation.",
        order: 5,
        experienceId: experience.id
      },
      {
        text: "Faced and solved challenges related to debugging, API structure, authentication issues, and data flow.",
        order: 6,
        experienceId: experience.id
      },
      {
        text: "Improved understanding of production-ready backend development.",
        order: 7,
        experienceId: experience.id
      }
    ]
  });

  await prisma.experienceMetric.createMany({
    data: [
      {
        label: "Reduced API response errors by",
        value: "[Admin editable value]",
        order: 1,
        experienceId: experience.id
      },
      {
        label: "Fixed bugs",
        value: "[Admin editable number]",
        order: 2,
        experienceId: experience.id
      },
      {
        label: "Improved feature delivery speed by",
        value: "[Admin editable value]",
        order: 3,
        experienceId: experience.id
      },
      {
        label: "Supported modules/features",
        value: "[Admin editable value]",
        order: 4,
        experienceId: experience.id
      },
      {
        label: "Revenue/business impact",
        value: "[Admin editable if applicable]",
        order: 5,
        experienceId: experience.id
      }
    ]
  });

  const skillCategories = [
    {
      name: "Languages",
      order: 1,
      skills: ["JavaScript", "TypeScript", "C", "C++"]
    },
    {
      name: "Backend",
      order: 2,
      skills: [
        "Node.js",
        "Express.js",
        "RESTful APIs",
        "JWT Authentication",
        "PostgreSQL",
        "MongoDB",
        "MySQL",
        "Prisma",
        "Drizzle",
        "NestJS"
      ]
    },
    {
      name: "Frontend",
      order: 3,
      skills: ["React.js", "Next.js", "Redux", "Tailwind CSS", "Shadcn UI"]
    },
    {
      name: "Database",
      order: 4,
      skills: ["PostgreSQL", "NeonDB", "MongoDB", "MySQL"]
    },
    {
      name: "Tools",
      order: 5,
      skills: ["Git", "GitHub", "Vercel", "Render", "Postman", "Figma", "AI Tools"]
    },
    {
      name: "Other",
      order: 6,
      skills: [
        "Data Structures and Algorithms",
        "Problem Solving",
        "API Documentation",
        "Database Schema Design",
        "Debugging"
      ]
    }
  ];

  for (const category of skillCategories) {
    const createdCategory = await prisma.skillCategory.create({
      data: {
        name: category.name,
        order: category.order,
        isEnabled: true
      }
    });

    await prisma.skill.createMany({
      data: category.skills.map((skill, index) => ({
        name: skill,
        order: index + 1,
        categoryId: createdCategory.id,
        isEnabled: true
      }))
    });
  }

  const shelfShare = await prisma.project.create({
    data: {
      name: "ShelfShare – Team Project",
      slug: "shelfshare-team-project",
      shortDescription:
        "Collaborative book-sharing platform connecting book enthusiasts to lend, borrow, and discover books with community features and personalized recommendations.",
      fullDescription:
        "ShelfShare is a collaborative book-sharing platform that helps book enthusiasts lend, borrow, and discover books through a community-driven experience.",
      purpose:
        "This project was created for users who want to share, borrow, lend, and discover books through a community-based platform.",
      targetUsers:
        "Book readers, students, book clubs, and community members who want a digital platform for borrowing and lending books.",
      uniqueCapabilities:
        "Book-sharing focused workflow, Stripe payment integration, AI-powered book assistant, and community-based lending and borrowing experience.",
      techStack: [
        "Next.js",
        "React.js",
        "TypeScript",
        "Redux",
        "NextAuth",
        "Shadcn UI",
        "Stripe"
      ],
      isFeatured: true,
      isEnabled: true,
      order: 1
    }
  });

  await prisma.projectFeature.createMany({
    data: [
      {
        text: "Built secure authentication and protected routes using Next.js and NextAuth.",
        type: "backend",
        order: 1,
        projectId: shelfShare.id
      },
      {
        text: "Integrated Stripe payment flow for borrowing and lending transactions.",
        type: "backend",
        order: 2,
        projectId: shelfShare.id
      },
      {
        text: "Developed reusable responsive UI components.",
        type: "frontend",
        order: 3,
        projectId: shelfShare.id
      },
      {
        text: "Connected frontend with RESTful APIs.",
        type: "backend",
        order: 4,
        projectId: shelfShare.id
      },
      {
        text: "Implemented an AI-powered assistant to handle user book-related queries.",
        type: "general",
        order: 5,
        projectId: shelfShare.id
      }
    ]
  });

  await prisma.projectChallenge.createMany({
    data: [
      {
        challenge:
          "Designing a smooth book borrowing and lending workflow with authentication and payment flow.",
        solution:
          "Separated user actions into clear protected flows and integrated Stripe-based transaction handling.",
        order: 1,
        projectId: shelfShare.id
      }
    ]
  });

  await prisma.projectImprovement.createMany({
    data: [
      {
        improvement:
          "Add advanced book recommendation, real-time chat, and improved admin moderation features.",
        order: 1,
        projectId: shelfShare.id
      }
    ]
  });

  const careerIo = await prisma.project.create({
    data: {
      name: "Career.io",
      slug: "career-io",
      shortDescription:
        "Job portal connecting job seekers and recruiters for job postings, applications, profile building, and efficient hiring workflows.",
      fullDescription:
        "Career.io is a job portal platform designed to connect job seekers and recruiters through job posting, application, profile, and hiring workflow features.",
      purpose:
        "This project was created to simplify the connection between recruiters and job seekers.",
      targetUsers:
        "Recruiters, job seekers, junior developers, hiring teams, and companies looking for a structured hiring platform.",
      uniqueCapabilities:
        "Separate recruiter and job seeker roles, job posting and application management, secure role-based authentication, and end-to-end hiring workflow.",
      techStack: [
        "Next.js",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "Redux"
      ],
      isFeatured: true,
      isEnabled: true,
      order: 2
    }
  });

  await prisma.projectFeature.createMany({
    data: [
      {
        text: "Developed RESTful APIs using Express.js and MongoDB.",
        type: "backend",
        order: 1,
        projectId: careerIo.id
      },
      {
        text: "Implemented JWT-based authentication.",
        type: "backend",
        order: 2,
        projectId: careerIo.id
      },
      {
        text: "Added role-based access for recruiters and job seekers.",
        type: "backend",
        order: 3,
        projectId: careerIo.id
      },
      {
        text: "Designed scalable database schemas using Mongoose.",
        type: "database",
        order: 4,
        projectId: careerIo.id
      },
      {
        text: "Built responsive frontend interfaces.",
        type: "frontend",
        order: 5,
        projectId: careerIo.id
      },
      {
        text: "Integrated APIs for complete hiring workflows.",
        type: "general",
        order: 6,
        projectId: careerIo.id
      }
    ]
  });

  await prisma.projectChallenge.createMany({
    data: [
      {
        challenge:
          "Managing different access permissions for recruiters and job seekers.",
        solution:
          "Implemented role-based access control and separated protected API behavior based on user role.",
        order: 1,
        projectId: careerIo.id
      }
    ]
  });

  await prisma.projectImprovement.createMany({
    data: [
      {
        improvement:
          "Add resume parsing, recruiter analytics, saved jobs, and better application tracking.",
        order: 1,
        projectId: careerIo.id
      }
    ]
  });

  const dailyDrafts = await prisma.project.create({
    data: {
      name: "DailyDrafts",
      slug: "daily-drafts",
      shortDescription:
        "Community blogging platform for creating, sharing, editing, and discovering personalized content with moderation tools.",
      fullDescription:
        "DailyDrafts is a community blogging platform where users can create, edit, share, and discover personalized blog content.",
      purpose:
        "This project was created for users who want to write, share, edit, and discover blog content in a simple community platform.",
      targetUsers:
        "Writers, students, bloggers, and community users who want a simple platform to publish and manage content.",
      uniqueCapabilities:
        "Content-focused user experience, secure authentication, full blog CRUD system, and backend-driven content management.",
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
      isFeatured: true,
      isEnabled: true,
      order: 3
    }
  });

  await prisma.projectFeature.createMany({
    data: [
      {
        text: "Built JWT-based authentication for secure user access.",
        type: "backend",
        order: 1,
        projectId: dailyDrafts.id
      },
      {
        text: "Implemented full CRUD functionality for blog posts.",
        type: "backend",
        order: 2,
        projectId: dailyDrafts.id
      },
      {
        text: "Developed responsive UI.",
        type: "frontend",
        order: 3,
        projectId: dailyDrafts.id
      },
      {
        text: "Integrated REST APIs for seamless content interaction.",
        type: "backend",
        order: 4,
        projectId: dailyDrafts.id
      },
      {
        text: "Managed backend data flow using Node.js, Express.js, and MongoDB.",
        type: "backend",
        order: 5,
        projectId: dailyDrafts.id
      }
    ]
  });

  await prisma.projectChallenge.createMany({
    data: [
      {
        challenge:
          "Building secure content creation and editing flow with authenticated users.",
        solution:
          "Used JWT authentication and protected backend routes to ensure only authorized users could create, update, or delete content.",
        order: 1,
        projectId: dailyDrafts.id
      }
    ]
  });

  await prisma.projectImprovement.createMany({
    data: [
      {
        improvement:
          "Add rich text editing, content moderation dashboard, image uploads, and search filtering.",
        order: 1,
        projectId: dailyDrafts.id
      }
    ]
  });

  await prisma.education.create({
    data: {
      institution:
        "IUBAT – International University of Business Agriculture & Technology",
      degree: "B.Sc. in Computer Science and Engineering",
      duration: "2024 – 2028",
      location: "Dhaka, Bangladesh",
      description:
        "Currently studying Computer Science and Engineering with a focus on software development, backend engineering, data structures, algorithms, databases, and web technologies.",
      order: 1,
      isEnabled: true
    }
  });

  await prisma.certification.create({
    data: {
      name: "[Add Certification Name]",
      issuingOrganization: "[Add Issuing Organization]",
      issueDate: "[Add Issue Date]",
      credentialId: "[Add Credential ID]",
      credentialLink: "#",
      order: 1,
      isEnabled: false
    }
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Backend API Development",
        description:
          "I build secure, scalable, and maintainable RESTful APIs using Node.js, Express.js, TypeScript, and modern backend practices.",
        order: 1,
        isEnabled: true
      },
      {
        title: "Database Design and Integration",
        description:
          "I design and integrate structured database systems using PostgreSQL, MongoDB, MySQL, and ORM tools.",
        order: 2,
        isEnabled: true
      },
      {
        title: "Authentication and Authorization",
        description:
          "I implement secure authentication systems using JWT, sessions, protected routes, and role-based access control.",
        order: 3,
        isEnabled: true
      },
      {
        title: "Full-Stack Web Application Development",
        description:
          "I can build complete web applications using Next.js, React.js, backend APIs, and database integration.",
        order: 4,
        isEnabled: true
      },
      {
        title: "Bug Fixing and Debugging",
        description:
          "I help identify, debug, and fix application issues related to APIs, databases, authentication, and data flow.",
        order: 5,
        isEnabled: true
      },
      {
        title: "Portfolio and Business Website Development",
        description:
          "I create responsive, modern, and professional websites for individuals, startups, and small businesses.",
        order: 6,
        isEnabled: true
      }
    ]
  });

  await prisma.contactInfo.create({
    data: {
      email: "shahariarshawon.dev@gmail.com",
      phone: "+880-1518-935876",
      whatsapp: "+880-1518-935876",
      location: "Uttara, Dhaka, Bangladesh"
    }
  });

  await prisma.footerLink.createMany({
    data: [
      { label: "Home", href: "#home", order: 1 },
      { label: "About", href: "#about", order: 2 },
      { label: "Experience", href: "#experience", order: 3 },
      { label: "Skills", href: "#skills", order: 4 },
      { label: "Projects", href: "#projects", order: 5 },
      { label: "Education", href: "#education", order: 6 },
      { label: "Services", href: "#services", order: 7 },
      { label: "Contact", href: "#contact", order: 8 }
    ]
  });

  const resume = await prisma.resume.create({
    data: {
      title: "Backend Developer Resume",
      targetRole: "BACKEND_DEVELOPER",
      isActive: true,
      name: "AL Shahariar Arafat Shawon",
      designation: "Backend Developer | Backend-Focused Full-Stack Developer",
      email: "shahariarshawon.dev@gmail.com",
      phone: "+880-1518-935876",
      location: "Uttara, Dhaka, Bangladesh",
      github: "#",
      linkedin: "#",
      portfolio: "#",
      summary:
        "Backend-focused developer with hands-on experience building RESTful APIs, authentication systems, and database-driven applications using Node.js, Express.js, TypeScript, MongoDB, PostgreSQL, and modern web technologies.",
      language: "Bangla, English"
    }
  });

  await prisma.resumeSkill.createMany({
    data: [
      {
        category: "Backend",
        skills: [
          "Node.js",
          "Express.js",
          "TypeScript",
          "RESTful API",
          "JWT Authentication",
          "Role-Based Access Control"
        ],
        order: 1,
        resumeId: resume.id
      },
      {
        category: "Database",
        skills: ["PostgreSQL", "MongoDB", "MySQL", "Prisma", "Database Design"],
        order: 2,
        resumeId: resume.id
      },
      {
        category: "Frontend",
        skills: ["Next.js", "React.js", "Redux", "Tailwind CSS"],
        order: 3,
        resumeId: resume.id
      },
      {
        category: "Tools",
        skills: ["Git", "GitHub", "Postman", "Vercel", "Render"],
        order: 4,
        resumeId: resume.id
      }
    ]
  });

  await prisma.resumeProject.createMany({
    data: [
      {
        name: "ShelfShare – Team Project",
        description:
          "Collaborative book-sharing platform with authentication, protected routes, Stripe payment flow, API integration, and AI-powered assistant.",
        techStack: [
          "Next.js",
          "React.js",
          "TypeScript",
          "Redux",
          "NextAuth",
          "Stripe"
        ],
        order: 1,
        resumeId: resume.id
      },
      {
        name: "Career.io",
        description:
          "Job portal with RESTful APIs, JWT authentication, role-based access for recruiters and job seekers, scalable schemas, and hiring workflow integration.",
        techStack: [
          "Next.js",
          "React.js",
          "Node.js",
          "Express.js",
          "MongoDB",
          "JWT"
        ],
        order: 2,
        resumeId: resume.id
      },
      {
        name: "DailyDrafts",
        description:
          "Community blogging platform with JWT authentication, blog CRUD operations, REST API integration, and backend-driven content management.",
        techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
        order: 3,
        resumeId: resume.id
      }
    ]
  });

  await prisma.resumeSection.createMany({
    data: [
      {
        title: "Education",
        content:
          "B.Sc. in Computer Science and Engineering, IUBAT – International University of Business Agriculture & Technology, 2024 – 2028, Dhaka, Bangladesh.",
        order: 1,
        resumeId: resume.id
      },
      {
        title: "Language",
        content: "Bangla, English",
        order: 2,
        resumeId: resume.id
      }
    ]
  });

  console.log("Database seed completed successfully.");
  console.log("Admin email: admin@shawon.dev");
  console.log("Admin password: admin123456");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });