import { Queue, Worker } from "bullmq";
import { generateBlogSummary } from "../modules/ai/chat.service";
import IORedis from "ioredis";
import { env } from "../config/env";

const connection = env.redisUrl ? new IORedis(env.redisUrl, { maxRetriesPerRequest: null }) : null;

// Define Queues
export const automationQueue = connection ? new Queue("brand-automation", { connection }) : null;
export const scheduledContentQueue = connection ? new Queue("content-scheduler", { connection }) : null;

// Initialize Workers
export const initWorkers = () => {
  if (process.env.NODE_ENV === "test" || !connection) {
    console.log("Redis not configured. Skipping worker initialization.");
    return;
  }

  const automationWorker = new Worker("brand-automation", async (job) => {
    console.log(`Processing automation job: ${job.id} of type ${job.name}`);
    
    if (job.name === "project-created") {
      const { projectId, content } = job.data;
      // In a real app, generate a draft blog post, linkedin post, etc using AI
      console.log(`Generating automated drafts for project ${projectId}`);
      const aiSummary = await generateBlogSummary(content);
      // save this to DB or notify admin...
    }
    
    // other job types...
  }, { connection });

  automationWorker.on('completed', job => {
    console.log(`Job with id ${job.id} has been completed`);
  });
  
  automationWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job?.id} has failed with ${err.message}`);
  });
  const contentWorker = new Worker("content-scheduler", async (job) => {
    console.log(`Processing content schedule: ${job.id}`);
    if (job.name === "publish-content") {
      const { contentId } = job.data;
      // Fetch ScheduledContent, post it, and mark as PUBLISHED
      console.log(`Publishing content ID: ${contentId}`);
    }
  }, { connection });

};

export const QueueService = {
  automationQueue,
  scheduledContentQueue,
  initWorkers
};
