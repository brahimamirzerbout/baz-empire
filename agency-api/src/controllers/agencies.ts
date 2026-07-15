import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { serializeAgency, classifyError } from "../lib/serialize";
import { createAgencySchema, updateAgencySchema } from "../schemas/agency";

/**
 * GET /api/agencies
 * Query: ?search=<term>  (case-insensitive contains across name, shortDesc,
 *                         goal, modelRelevance, and the tasks JSON blob)
 *        ?category=<cat>  (exact category match)
 * Both filters compose (AND).
 */
export async function listAgencies(req: Request, res: Response, next: NextFunction) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim() : "";

    const where: Prisma.AgencyWhereInput = {};
    if (category) where.category = category;
    if (search) {
      // SQLite LIKE is case-insensitive for ASCII by default, so `contains`
      // already satisfies the case-insensitive requirement without `mode`.
      where.OR = [
        { name: { contains: search } },
        { shortDesc: { contains: search } },
        { goal: { contains: search } },
        { modelRelevance: { contains: search } },
        { tasks: { contains: search } }, // matches text inside the JSON blob
      ];
    }

    const rows = await prisma.agency.findMany({
      where,
      orderBy: { id: "asc" },
    });

    res.json({ count: rows.length, data: rows.map(serializeAgency) });
  } catch (err) {
    next(err);
  }
}

/** GET /api/agencies/:id */
export async function getAgency(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "id must be an integer." });
      return;
    }
    const row = await prisma.agency.findUnique({ where: { id } });
    if (!row) {
      res.status(404).json({ error: "Agency not found." });
      return;
    }
    res.json({ data: serializeAgency(row) });
  } catch (err) {
    next(err);
  }
}

/** POST /api/agencies */
export async function createAgency(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createAgencySchema.parse(req.body);
    const row = await prisma.agency.create({
      data: {
        name: input.name,
        category: input.category,
        shortDesc: input.shortDesc,
        goal: input.goal,
        tasks: JSON.stringify(input.tasks), // store as JSON string for SQLite
        modelRelevance: input.modelRelevance,
      },
    });
    res.status(201).json({ data: serializeAgency(row) });
  } catch (err) {
    next(err);
  }
}

/** PUT /api/agencies/:id */
export async function updateAgency(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "id must be an integer." });
      return;
    }
    const input = updateAgencySchema.parse(req.body);
    if (Object.keys(input).length === 0) {
      res.status(400).json({ error: "No valid fields supplied for update." });
      return;
    }
    // Separate `tasks` (string[] over the wire) from scalar fields so the
    // spread matches AgencyUpdateInput (tasks column is a JSON string).
    const { tasks, ...rest } = input;
    const data: Prisma.AgencyUpdateInput = { ...rest };
    if (tasks) data.tasks = JSON.stringify(tasks);

    const row = await prisma.agency.update({ where: { id }, data });
    res.json({ data: serializeAgency(row) });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/agencies/:id */
export async function deleteAgency(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "id must be an integer." });
      return;
    }
    await prisma.agency.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    // normalize Prisma P2025 (not found) to 404 via the shared classifier
    const { status, message } = classifyError(err);
    if (status === 404) {
      res.status(404).json({ error: message });
      return;
    }
    next(err);
  }
}