import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/httpError";

export const dashboardRouter = Router();

// Aggregated metrics for the dashboard.
dashboardRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const logs = await prisma.productionLog.findMany({
      include: { task: { include: { campaign: true } } },
    });

    // --- Total minutes / hours saved ---
    const totalSavedMinutes = logs.reduce(
      (sum, l) => sum + l.estimatedSavedMinutes,
      0
    );

    // --- Distribution by production mode ---
    const modeCounts: Record<string, number> = { ia: 0, hibrido: 0, manual: 0 };
    for (const l of logs) {
      modeCounts[l.mode] = (modeCounts[l.mode] ?? 0) + 1;
    }
    const totalClosed = logs.length;
    const modeDistribution = (["ia", "hibrido", "manual"] as const).map(
      (mode) => ({
        mode,
        count: modeCounts[mode],
        percentage:
          totalClosed > 0
            ? Math.round((modeCounts[mode] / totalClosed) * 1000) / 10
            : 0,
      })
    );

    // --- Hours saved grouped by campaign ---
    const byCampaign = new Map<
      string,
      { campaignId: string; campaignName: string; minutes: number; tasks: number }
    >();
    for (const l of logs) {
      const c = l.task.campaign;
      const entry = byCampaign.get(c.id) ?? {
        campaignId: c.id,
        campaignName: c.name,
        minutes: 0,
        tasks: 0,
      };
      entry.minutes += l.estimatedSavedMinutes;
      entry.tasks += 1;
      byCampaign.set(c.id, entry);
    }
    const savedByCampaign = Array.from(byCampaign.values())
      .map((e) => ({
        campaignId: e.campaignId,
        campaignName: e.campaignName,
        tasks: e.tasks,
        savedMinutes: e.minutes,
        savedHours: Math.round((e.minutes / 60) * 100) / 100,
      }))
      .sort((a, b) => b.savedMinutes - a.savedMinutes);

    // --- Deadline compliance (only tasks that had a due date) ---
    let onTime = 0;
    let late = 0;
    for (const l of logs) {
      const due = l.task.dueDate;
      if (!due) continue;
      // Closed on or before end-of-day of the due date counts as on time.
      const dueEnd = new Date(due);
      dueEnd.setHours(23, 59, 59, 999);
      if (l.closedAt.getTime() <= dueEnd.getTime()) onTime += 1;
      else late += 1;
    }
    const withDueDate = onTime + late;

    res.json({
      totalSavedMinutes,
      totalSavedHours: Math.round((totalSavedMinutes / 60) * 100) / 100,
      totalClosedTasks: totalClosed,
      modeDistribution,
      savedByCampaign,
      deadlineCompliance: {
        onTime,
        late,
        withDueDate,
        onTimePercentage:
          withDueDate > 0
            ? Math.round((onTime / withDueDate) * 1000) / 10
            : 0,
      },
    });
  })
);
