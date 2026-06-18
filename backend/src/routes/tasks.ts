import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/httpError";

export const tasksRouter = Router();

const updateTaskSchema = z.object({
  name: z.string().trim().min(1).max(300).optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  priority: z.enum(["alta", "media", "baja"]).optional(),
  isOptional: z.boolean().optional(),
  dueDate: z.string().nullable().optional(), // "YYYY-MM-DD" or null
  tags: z.array(z.string()).nullable().optional(),
});

// Get a single task.
tasksRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { subtasks: true, production: true, campaign: true },
    });
    if (!task) throw new AppError(404, "Tarea no encontrada.");
    res.json(task);
  })
);

// Edit a proposed task (used by the review screen).
tasksRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Datos de tarea inválidos.", parsed.error.flatten());
    }
    const d = parsed.data;

    const data: Record<string, unknown> = {};
    if (d.name !== undefined) data.name = d.name;
    if (d.description !== undefined) data.description = d.description;
    if (d.priority !== undefined) data.priority = d.priority;
    if (d.isOptional !== undefined) data.isOptional = d.isOptional;
    if (d.dueDate !== undefined) {
      data.dueDate = d.dueDate ? new Date(`${d.dueDate}T00:00:00`) : null;
    }
    if (d.tags !== undefined) {
      data.tags = d.tags && d.tags.length ? d.tags.join(",") : null;
    }

    try {
      const task = await prisma.task.update({
        where: { id: req.params.id },
        data,
        include: { subtasks: true, production: true },
      });
      res.json(task);
    } catch {
      throw new AppError(404, "Tarea no encontrada.");
    }
  })
);

// Delete a task.
tasksRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      await prisma.task.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch {
      throw new AppError(404, "Tarea no encontrada.");
    }
  })
);

const subtaskSchema = z.object({
  name: z.string().trim().min(1).max(300),
});

// Add a subtask to a task.
tasksRouter.post(
  "/:id/subtasks",
  asyncHandler(async (req, res) => {
    const parsed = subtaskSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Nombre de subtarea inválido.");
    }
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) throw new AppError(404, "Tarea no encontrada.");

    const subtask = await prisma.subtask.create({
      data: { taskId: task.id, name: parsed.data.name },
    });
    res.status(201).json(subtask);
  })
);

const updateSubtaskSchema = z.object({
  name: z.string().trim().min(1).max(300).optional(),
  status: z.enum(["pending", "synced", "closed"]).optional(),
});

// Edit a subtask.
tasksRouter.patch(
  "/subtasks/:subId",
  asyncHandler(async (req, res) => {
    const parsed = updateSubtaskSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Datos de subtarea inválidos.");
    }
    try {
      const subtask = await prisma.subtask.update({
        where: { id: req.params.subId },
        data: parsed.data,
      });
      res.json(subtask);
    } catch {
      throw new AppError(404, "Subtarea no encontrada.");
    }
  })
);

// Delete a subtask.
tasksRouter.delete(
  "/subtasks/:subId",
  asyncHandler(async (req, res) => {
    try {
      await prisma.subtask.delete({ where: { id: req.params.subId } });
      res.status(204).end();
    } catch {
      throw new AppError(404, "Subtarea no encontrada.");
    }
  })
);
