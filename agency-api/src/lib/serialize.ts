import { Prisma } from "@prisma/client";

/** Shape an Agency row into the public API contract (tasks → array). */
export function serializeAgency(row: {
  id: number;
  name: string;
  category: string;
  shortDesc: string;
  goal: string;
  tasks: string;
  modelRelevance: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  let tasks: string[] = [];
  try {
    const parsed = JSON.parse(row.tasks);
    if (Array.isArray(parsed)) tasks = parsed.filter((t) => typeof t === "string");
  } catch {
    tasks = [];
  }
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    shortDesc: row.shortDesc,
    goal: row.goal,
    tasks,
    modelRelevance: row.modelRelevance,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Prisma error → HTTP-friendly classification. */
export function classifyError(err: unknown): { status: number; message: string } {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint violation
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      return { status: 409, message: `A record with that ${target} already exists.` };
    }
    // P2025 = record not found (used in update/delete with where)
    if (err.code === "P2025") {
      return { status: 404, message: "Agency not found." };
    }
    return { status: 400, message: `Database error: ${err.code}` };
  }
  return { status: 500, message: "Internal server error." };
}