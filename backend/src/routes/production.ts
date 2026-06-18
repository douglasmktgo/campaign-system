import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler } from "../lib/httpError";
import {
  resolveProductionFields,
  setTaskCustomField,
} from "../services/clickupClient";

export const productionRouter = Router();

// Human label shown in the ClickUp "Modo de producción" dropdown per mode.
const MODE_LABELS: Record<string, string> = {
  ia: "ia 100%",
  hibrido: "híbrido",
  manual: "manual 100%",
};

const productionSchema = z.object({
  mode: z.enum(["ia", "hibrido", "manual"]),
  estimatedSavedMinutes: z.number().int().min(0).max(100000),
  actualMinutes: z.number().int().min(0).max(100000).optional(),
});

// Close a task: record how it was produced + minutes saved, and mirror the
// data into ClickUp's Custom Fields when possible.
productionRouter.post(
  "/:taskId",
  asyncHandler(async (req, res) => {
    const parsed = productionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        400,
        "Datos de producción inválidos.",
        parsed.error.flatten()
      );
    }
    const { mode, estimatedSavedMinutes, actualMinutes } = parsed.data;

    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      include: { campaign: true },
    });
    if (!task) throw new AppError(404, "Tarea no encontrada.");

    // 1. Persist the production log locally (upsert: closing twice updates it).
    const log = await prisma.productionLog.upsert({
      where: { taskId: task.id },
      create: {
        taskId: task.id,
        mode,
        estimatedSavedMinutes,
        actualMinutes: actualMinutes ?? null,
      },
      update: {
        mode,
        estimatedSavedMinutes,
        actualMinutes: actualMinutes ?? null,
        closedAt: new Date(),
      },
    });

    // 2. Mark the task closed.
    await prisma.task.update({
      where: { id: task.id },
      data: { status: "closed" },
    });

    // 3. Best-effort mirror to ClickUp Custom Fields. Failure here must not
    //    lose the local record, so we surface a warning instead of throwing.
    let clickupWarning: string | null = null;
    if (task.clickupTaskId && task.campaign.clickupListId) {
      try {
        const fields = await resolveProductionFields(task.campaign.clickupListId);

        if (fields.savedFieldId) {
          await setTaskCustomField(
            task.clickupTaskId,
            fields.savedFieldId,
            estimatedSavedMinutes
          );
        }
        if (fields.modeFieldId && fields.modeOptions) {
          const optionId = fields.modeOptions[MODE_LABELS[mode]];
          if (optionId) {
            await setTaskCustomField(
              task.clickupTaskId,
              fields.modeFieldId,
              optionId
            );
          } else {
            clickupWarning =
              "No se encontró la opción de dropdown correspondiente en ClickUp para el modo seleccionado.";
          }
        }
        if (fields.missing.length) {
          clickupWarning =
            `Custom Fields faltantes en ClickUp: ${fields.missing.join(", ")}.`;
        }
      } catch (err) {
        clickupWarning =
          err instanceof AppError
            ? `No se pudo actualizar ClickUp: ${err.message}`
            : "No se pudo actualizar ClickUp.";
      }
    } else {
      clickupWarning =
        "La tarea no está sincronizada con ClickUp; se guardó solo localmente.";
    }

    res.json({ productionLog: log, warning: clickupWarning });
  })
);
