import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/httpError";
import { interpretBrief } from "../services/aiInterpreter";
import {
  isTranscriptionConfigured,
  transcribeAudio,
} from "../services/transcription";

export const briefsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

// --- helpers -------------------------------------------------------------

function campaignInclude() {
  return {
    tasks: {
      orderBy: { priority: "asc" as const },
      include: { subtasks: true, production: true },
    },
  };
}

// --- routes --------------------------------------------------------------

// Whether audio transcription is available (frontend uses this to enable UI).
briefsRouter.get(
  "/config/transcription",
  asyncHandler(async (_req, res) => {
    res.json({ enabled: isTranscriptionConfigured() });
  })
);

// List all campaigns (most recent first).
briefsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: campaignInclude(),
    });
    res.json(campaigns);
  })
);

const createBriefSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  objective: z.string().trim().max(2000).optional(),
  rawBrief: z.string().trim().min(1, "El brief no puede estar vacío."),
  sourceType: z.enum(["text", "audio"]).default("text"),
});

// Create a new brief/campaign (status: draft). Does NOT call the AI yet.
briefsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createBriefSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Datos del brief inválidos.", parsed.error.flatten());
    }
    const { name, objective, rawBrief, sourceType } = parsed.data;

    const campaign = await prisma.campaign.create({
      data: {
        name: name ?? "Campaña sin título",
        objective: objective ?? null,
        rawBrief,
        sourceType,
        status: "draft",
      },
      include: campaignInclude(),
    });

    res.status(201).json(campaign);
  })
);

// Transcribe an uploaded audio file into text (stub until configured).
briefsRouter.post(
  "/transcribe",
  upload.single("audio"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError(400, "No se recibió ningún archivo de audio.");
    }
    const text = await transcribeAudio(req.file.buffer, req.file.originalname);
    res.json({ text });
  })
);

// Get a single campaign with its tasks/subtasks/production logs.
briefsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: campaignInclude(),
    });
    if (!campaign) throw new AppError(404, "Campaña no encontrada.");
    res.json(campaign);
  })
);

// Interpret the stored brief with the AI and persist the proposed tasks.
briefsRouter.post(
  "/:id/interpret",
  asyncHandler(async (req, res) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
    });
    if (!campaign) throw new AppError(404, "Campaña no encontrada.");

    const plan = await interpretBrief(campaign.rawBrief);

    // Re-interpreting replaces any previous *pending* tasks so we don't
    // accumulate duplicates. Already-synced/closed tasks are left untouched.
    await prisma.task.deleteMany({
      where: { campaignId: campaign.id, status: "pending" },
    });

    for (const t of plan.tasks) {
      await prisma.task.create({
        data: {
          campaignId: campaign.id,
          name: t.name,
          description: t.description || null,
          priority: t.priority,
          isOptional: t.isOptional,
          dueDate: t.dueDate ? new Date(`${t.dueDate}T00:00:00`) : null,
          tags: t.tags.length ? t.tags.join(",") : null,
          status: "pending",
          subtasks: {
            create: t.subtasks.map((s) => ({ name: s })),
          },
        },
      });
    }

    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        name: plan.campaignName || campaign.name,
        objective: plan.objective || campaign.objective,
        status: "reviewed",
      },
      include: campaignInclude(),
    });

    res.json(updated);
  })
);
