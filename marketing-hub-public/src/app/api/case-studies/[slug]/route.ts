import { json } from "@/lib/api-helpers";
import { CASES } from "@/app/case-studies/_data";

export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const c = CASES.find((x) => x.slug === slug);
  if (!c) return json({ error: "not found" }, 404);
  return json(c);
}
