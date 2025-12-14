import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
const queue = new Queue("file-processing", { connection });

new Worker(
  "file-processing",
  async (job) => {
    const { modelFileId } = job.data as { modelFileId: string };
    // Simplified processing placeholder
    await prisma.modelFile.update({ where: { id: modelFileId }, data: { status: "READY", dimensionsX: 100, dimensionsY: 100, dimensionsZ: 100, volumeMm3: 1_000_000 } });
  },
  { connection }
);

console.log("Worker started");
