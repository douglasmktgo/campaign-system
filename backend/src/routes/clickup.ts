import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/httpError";
import {
  createList,
  createTask,
  resolveProductionFields,
} from "../services/clickupClient";
import { getSetting } from "../lib/settings";

export const clickupRouter = Router();

// Sync a campaign's pending tasks to ClickUp. Only runs on explicit user
// confirmation from the review screen — never automatically after AI parsing.
clickupRouter.post(
  "/sync/:campaignId",
  asyncHandler(async (req, res) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.campaignId },
      include: { tasks: { include: { subtasks: true } } },
    });
    if (!campaign) throw new AppError(404, "Campaña no encontrada.");

    // 1. Ensure a ClickUp List exists for this campaign.
    let listId = campaign.clickupListId;
    if (!listId) {
      const spaceId = getSetting("clickupSpaceId") ?? "";
      listId = await createList(spaceId, campaign.name);
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { clickupListId: listId },
      });
    }

    // 2. Check the production Custom Fields exist (non-blocking warning).
    let fieldWarning: string | null = null;
    try {
      const fields = await resolveProductionFields(listId);
      if (fields.missing.length) {
        fieldWarning =
          `Faltan Custom Fields en la Lista de ClickUp: ${fields.missing.join(
            ", "
          )}. ` +
          "Créalos manualmente en ClickUp (dropdown 'Modo de producción' con IA 100% / Híbrido / Manual 100%, " +
          "y número 'Tiempo ahorrado (min)') para poder registrar la producción. Ver README.";
      }
    } catch (err) {
      fieldWarning =
        err instanceof AppError
          ? `No se pudieron verificar los Custom Fields: ${err.message}`
          : "No se pudieron verificar los Custom Fields de ClickUp.";
    }

    // 3. Create each pending task (and its subtasks) in ClickUp.
    const pending = campaign.tasks.filter((t) => t.status === "pending");
    const created: { id: string; name: string; clickupUrl: string }[] = [];

    for (const task of pending) {
      const ctask = await createTask(listId, {
        name: task.name,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
      });

      await prisma.task.update({
        where: { id: task.id },
        data: {
          clickupTaskId: ctask.id,
          clickupUrl: ctask.url,
          status: "synced",
        },
      });

      for (const sub of task.subtasks) {
        const csub = await createTask(listId, {
          name: sub.name,
          parent: ctask.id,
        });
        await prisma.subtask.update({
          where: { id: sub.id },
          data: { clickupTaskId: csub.id, status: "synced" },
        });
      }

      created.push({ id: task.id, name: task.name, clickupUrl: ctask.url });
    }

    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "synced" },
    });

    res.json({
      campaignId: campaign.id,
      clickupListId: listId,
      createdCount: created.length,
      created,
      warning: fieldWarning,
    });
  })
);
