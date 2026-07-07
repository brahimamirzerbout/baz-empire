"use client";
import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Copy, X } from "lucide-react";
import { Block, newBlock, blockDefaults, renderLandingBlock, renderEmailBlock } from "@/lib/blocks";
import clsx from "clsx";

interface Props {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  mode: "landing" | "email";
}

export function BlockEditor({ blocks, onChange, mode }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const defaults = blockDefaults();
  const groups = Array.from(new Set(defaults.map((d) => d.group)));
  const selected = blocks.find((b) => b.id === selectedId);

  function add(type: Block["type"]) {
    const b = newBlock(type);
    onChange([...blocks, b]);
    setSelectedId(b.id);
    setPaletteOpen(false);
  }
  function update(id: string, patch: Partial<Block>) {
    onChange(blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)));
  }
  function remove(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }
  function duplicate(id: string) {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const copy = JSON.parse(JSON.stringify(blocks[idx]));
    copy.id = Math.random().toString(36).slice(2, 10);
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  }
  function move(id: string, dir: -1 | 1) {
    const idx = blocks.findIndex((b) => b.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  }

  return (
    <div className="grid grid-cols-[260px_1fr_300px] gap-4 h-full">
      {/* Block palette */}
      <div className="card overflow-y-auto scrollbar-thin">
        <div className="p-3 border-b" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="text-sm font-semibold">Blocks</div>
          <div className="text-xs muted">Click to add</div>
        </div>
        <div className="p-3 space-y-4">
          {groups.map((group) => (
            <div key={group}>
              <div className="text-[10px] uppercase font-bold muted mb-1.5 tracking-wider">
                {group}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {defaults
                  .filter((d) => d.group === group)
                  .map((d) => (
                    <button
                      key={d.type}
                      onClick={() => add(d.type)}
                      className="flex flex-col items-center justify-center p-2 rounded-md border hover:border-[color-mix(in srgb,var(--accent),white 5%)] hover:bg-[rgba(var(--theme-brand-rgb),0.055)] transition-colors text-xs"
                      style={{ borderColor: "rgb(var(--border))" }}
                    >
                      <div className="text-xl mb-0.5">{d.icon}</div>
                      <div className="leading-tight">{d.label}</div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="card overflow-y-auto scrollbar-thin bg-slate-50 dark:bg-zinc-800/50">
        <div
          className="bg-white dark:bg-zinc-900 max-w-[720px] mx-auto my-6 rounded-lg shadow-sm border"
          style={{ borderColor: "rgb(var(--border))" }}
        >
          {blocks.length === 0 && (
            <div className="p-16 text-center muted">
              <div className="text-lg mb-2">Empty canvas</div>
              <div className="text-sm">Add blocks from the left to get started</div>
            </div>
          )}
          {blocks.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              className={clsx(
                "relative group cursor-pointer border-2 border-transparent",
                selectedId === b.id && "border-[var(--accent)]",
              )}
            >
              {selectedId === b.id && (
                <div
                  className="absolute top-2 right-2 z-10 flex gap-1 bg-white dark:bg-zinc-900 rounded shadow border"
                  style={{ borderColor: "rgb(var(--border))" }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      move(b.id, -1);
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      move(b.id, 1);
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicate(b.id);
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 dark:bg-zinc-800 dark:hover:bg-white/5"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(b.id);
                    }}
                    className="p-1.5 hover:bg-rose-50 text-rose-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div
                dangerouslySetInnerHTML={{
                  __html: mode === "landing" ? renderLandingBlock(b) : renderEmailBlock(b),
                }}
              />
            </div>
          ))}
          {blocks.length > 0 && (
            <div className="p-4 border-t" style={{ borderColor: "rgb(var(--border))" }}>
              <button
                onClick={() => setPaletteOpen(true)}
                className="w-full p-3 border-2 border-dashed rounded text-sm muted hover:border-[color-mix(in srgb,var(--accent),white 5%)] hover:text-[color-mix(in srgb,var(--accent),black 20%)]"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                <Plus className="w-4 h-4 inline mr-1" /> Add block
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inspector */}
      <div className="card overflow-y-auto scrollbar-thin">
        <div className="p-3 border-b" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="text-sm font-semibold">{selected ? "Edit block" : "Inspector"}</div>
          <div className="text-xs muted">{selected ? selected.type : "Select a block to edit"}</div>
        </div>
        <div className="p-3">
          {selected ? (
            <BlockInspector block={selected} onChange={(patch) => update(selected.id, patch)} />
          ) : (
            <div className="text-xs muted text-center py-8">
              <div className="mb-2">No block selected</div>
              <div>
                Click any block on the canvas to edit its content, or pick one from the palette.
              </div>
            </div>
          )}
        </div>
      </div>

      {paletteOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Add block</h3>
              <button onClick={() => setPaletteOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {groups.map((group) => (
              <div key={group} className="mb-4">
                <div className="text-[10px] uppercase font-bold muted mb-2 tracking-wider">
                  {group}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {defaults
                    .filter((d) => d.group === group)
                    .map((d) => (
                      <button
                        key={d.type}
                        onClick={() => add(d.type)}
                        className="flex flex-col items-center p-3 rounded-md border hover:border-[color-mix(in srgb,var(--accent),white 5%)] hover:bg-[rgba(var(--theme-brand-rgb),0.055)]"
                        style={{ borderColor: "rgb(var(--border))" }}
                      >
                        <div className="text-2xl mb-1">{d.icon}</div>
                        <div className="text-xs">{d.label}</div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BlockInspector({
  block,
  onChange,
}: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
}) {
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
  const Txt = ({ label, k, ...rest }: { label: string; k: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <Field label={label}>
      <input
        className="input"
        value={(block as Record<string, unknown>)[k] ?? ""}
        onChange={(e) => onChange({ [k]: e.target.value })}
        {...rest}
      />
    </Field>
  );
  const Area = ({ label, k }: { label: string; k: string }) => (
    <Field label={label}>
      <textarea
        className="textarea"
        rows={4}
        value={(block as Record<string, unknown>)[k] ?? ""}
        onChange={(e) => onChange({ [k]: e.target.value })}
      />
    </Field>
  );
  const Num = ({ label, k }: { label: string; k: string }) => (
    <Field label={label}>
      <input
        type="number"
        className="input"
        value={(block as Record<string, unknown>)[k] ?? 0}
        onChange={(e) => onChange({ [k]: +e.target.value })}
      />
    </Field>
  );

  switch (block.type) {
    case "heading":
      return (
        <>
          <Txt label="Text" k="text" />
          <Field label="Level">
            <select
              className="input"
              value={block.level}
              onChange={(e) => onChange({ level: +e.target.value as unknown as number })}
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
          </Field>
          <Field label="Align">
            <select
              className="input"
              value={block.align || "left"}
              onChange={(e) => onChange({ align: e.target.value as unknown as string })}
            >
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
            </select>
          </Field>
        </>
      );
    case "text":
      return <Area label="HTML content" k="html" />;
    case "image":
      return (
        <>
          <Txt label="Image URL" k="src" placeholder="https://..." />
          <Txt label="Alt text" k="alt" />
          <Txt label="Width (e.g. 80%)" k="width" />
        </>
      );
    case "button":
      return (
        <>
          <Txt label="Label" k="label" />
          <Txt label="URL" k="href" />
          <Field label="Align">
            <select
              className="input"
              value={block.align || "center"}
              onChange={(e) => onChange({ align: e.target.value as unknown as string })}
            >
              <option>left</option>
              <option>center</option>
              <option>right</option>
            </select>
          </Field>
          <Txt label="Background color" k="color" placeholder="var(--accent)" />
        </>
      );
    case "divider":
      return <div className="text-xs muted">No options</div>;
    case "spacer":
      return <Num label="Height (px)" k="height" />;
    case "video":
      return (
        <>
          <Txt label="Video URL" k="src" />
          <Txt label="Poster image URL" k="poster" />
        </>
      );
    case "quote":
      return (
        <>
          <Area label="Quote" k="text" />
          <Txt label="Cite (author)" k="cite" />
        </>
      );
    case "list":
      return (
        <>
          <Field label="Ordered">
            <select
              className="input"
              value={block.ordered ? "yes" : "no"}
              onChange={(e) => onChange({ ordered: e.target.value === "yes" })}
            >
              <option value="no">Bulleted</option>
              <option value="yes">Numbered</option>
            </select>
          </Field>
          <label className="label mt-3">Items (one per line)</label>
          <textarea
            className="textarea"
            rows={5}
            value={block.items.join("\n")}
            onChange={(e) => onChange({ items: e.target.value.split("\n") })}
          />
        </>
      );
    case "html":
      return <Area label="Raw HTML" k="html" />;
    case "hero":
      return (
        <>
          <Txt label="Headline" k="headline" />
          <Area label="Sub-headline" k="sub" />
          <Field label="Button label">
            <input
              className="input"
              value={block.cta?.label || ""}
              onChange={(e) =>
                onChange({
                  cta: { ...(block.cta || { label: "", href: "" }), label: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Button URL">
            <input
              className="input"
              value={block.cta?.href || ""}
              onChange={(e) =>
                onChange({
                  cta: { ...(block.cta || { label: "", href: "" }), href: e.target.value },
                })
              }
            />
          </Field>
          <Txt label="Background color" k="bg" />
        </>
      );
    case "features":
      return (
        <>
          <label className="label">Feature items</label>
          <div className="space-y-2">
            {block.items.map((f, i) => (
              <div
                key={i}
                className="border rounded p-2 space-y-1"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                <input
                  className="input"
                  placeholder="Icon (emoji)"
                  value={f.icon || ""}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = { ...items[i], icon: e.target.value };
                    onChange({ items });
                  }}
                />
                <input
                  className="input"
                  placeholder="Title"
                  value={f.title}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = { ...items[i], title: e.target.value };
                    onChange({ items });
                  }}
                />
                <textarea
                  className="textarea"
                  placeholder="Body"
                  rows={2}
                  value={f.body}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = { ...items[i], body: e.target.value };
                    onChange({ items });
                  }}
                />
              </div>
            ))}
          </div>
          <button
            className="btn btn-secondary w-full mt-2"
            onClick={() => onChange({ items: [...block.items, { title: "New", body: "..." }] })}
          >
            Add feature
          </button>
        </>
      );
    case "cta":
      return (
        <>
          <Txt label="Headline" k="headline" />
          <Area label="Body" k="body" />
          <Field label="Button label">
            <input
              className="input"
              value={block.button.label}
              onChange={(e) => onChange({ button: { ...block.button, label: e.target.value } })}
            />
          </Field>
          <Field label="Button URL">
            <input
              className="input"
              value={block.button.href}
              onChange={(e) => onChange({ button: { ...block.button, href: e.target.value } })}
            />
          </Field>
          <Txt label="Background" k="bg" />
        </>
      );
    case "testimonial":
      return (
        <>
          <Area label="Quote" k="quote" />
          <Txt label="Author" k="author" />
          <Txt label="Role / company" k="role" />
        </>
      );
    case "pricing":
      return (
        <>
          <label className="label">Plans</label>
          {block.plans.map((p, i) => (
            <div
              key={i}
              className="border rounded p-2 space-y-1 mb-2"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <input
                className="input"
                placeholder="Name"
                value={p.name}
                onChange={(e) => {
                  const plans = [...block.plans];
                  plans[i] = { ...plans[i], name: e.target.value };
                  onChange({ plans });
                }}
              />
              <div className="grid grid-cols-2 gap-1">
                <input
                  className="input"
                  placeholder="Price"
                  value={p.price}
                  onChange={(e) => {
                    const plans = [...block.plans];
                    plans[i] = { ...plans[i], price: e.target.value };
                    onChange({ plans });
                  }}
                />
                <input
                  className="input"
                  placeholder="Period"
                  value={p.period || ""}
                  onChange={(e) => {
                    const plans = [...block.plans];
                    plans[i] = { ...plans[i], period: e.target.value };
                    onChange({ plans });
                  }}
                />
              </div>
              <textarea
                className="textarea"
                placeholder="Features (one per line)"
                rows={3}
                value={p.features.join("\n")}
                onChange={(e) => {
                  const plans = [...block.plans];
                  plans[i] = { ...plans[i], features: e.target.value.split("\n") };
                  onChange({ plans });
                }}
              />
              <input
                className="input"
                placeholder="CTA label"
                value={p.cta.label}
                onChange={(e) => {
                  const plans = [...block.plans];
                  plans[i] = { ...plans[i], cta: { ...plans[i].cta, label: e.target.value } };
                  onChange({ plans });
                }}
              />
              <input
                className="input"
                placeholder="CTA URL"
                value={p.cta.href}
                onChange={(e) => {
                  const plans = [...block.plans];
                  plans[i] = { ...plans[i], cta: { ...plans[i].cta, href: e.target.value } };
                  onChange({ plans });
                }}
              />
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={!!p.highlight}
                  onChange={(e) => {
                    const plans = [...block.plans];
                    plans[i] = { ...plans[i], highlight: e.target.checked };
                    onChange({ plans });
                  }}
                />{" "}
                Highlight
              </label>
            </div>
          ))}
          <button
            className="btn btn-secondary w-full"
            onClick={() =>
              onChange({
                plans: [
                  ...block.plans,
                  { name: "Plan", price: "$0", features: [], cta: { label: "Get", href: "#" } },
                ],
              })
            }
          >
            Add plan
          </button>
        </>
      );
    case "faq":
      return (
        <>
          <label className="label">Questions</label>
          {block.items.map((f, i) => (
            <div
              key={i}
              className="border rounded p-2 space-y-1 mb-2"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <input
                className="input"
                placeholder="Question"
                value={f.q}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...items[i], q: e.target.value };
                  onChange({ items });
                }}
              />
              <textarea
                className="textarea"
                placeholder="Answer"
                rows={2}
                value={f.a}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...items[i], a: e.target.value };
                  onChange({ items });
                }}
              />
            </div>
          ))}
          <button
            className="btn btn-secondary w-full"
            onClick={() => onChange({ items: [...block.items, { q: "Question?", a: "Answer." }] })}
          >
            Add question
          </button>
        </>
      );
    case "form":
      return (
        <>
          <Txt label="Heading" k="heading" />
          <Txt label="Submit label" k="submitLabel" />
          <Txt label="Success message" k="successMessage" />
          <label className="label mt-3">Fields</label>
          {block.fields.map((f, i) => (
            <div
              key={i}
              className="border rounded p-2 space-y-1 mb-2"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <div className="grid grid-cols-2 gap-1">
                <input
                  className="input"
                  placeholder="Name"
                  value={f.name}
                  onChange={(e) => {
                    const fields = [...block.fields];
                    fields[i] = { ...fields[i], name: e.target.value };
                    onChange({ fields });
                  }}
                />
                <input
                  className="input"
                  placeholder="Label"
                  value={f.label}
                  onChange={(e) => {
                    const fields = [...block.fields];
                    fields[i] = { ...fields[i], label: e.target.value };
                    onChange({ fields });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <select
                  className="input"
                  value={f.type || "text"}
                  onChange={(e) => {
                    const fields = [...block.fields];
                    fields[i] = { ...fields[i], type: e.target.value };
                    onChange({ fields });
                  }}
                >
                  <option>text</option>
                  <option>email</option>
                  <option>tel</option>
                  <option>textarea</option>
                </select>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={!!f.required}
                    onChange={(e) => {
                      const fields = [...block.fields];
                      fields[i] = { ...fields[i], required: e.target.checked };
                      onChange({ fields });
                    }}
                  />{" "}
                  Required
                </label>
              </div>
            </div>
          ))}
          <button
            className="btn btn-secondary w-full"
            onClick={() =>
              onChange({ fields: [...block.fields, { name: "field", label: "Field" }] })
            }
          >
            Add field
          </button>
        </>
      );
    case "footer":
      return (
        <>
          <Txt label="Copyright" k="copyright" />
          <label className="label mt-3">Links (label|url per line)</label>
          <textarea
            className="textarea"
            rows={4}
            value={(block.links || []).map((l) => `${l.label}|${l.href}`).join("\n")}
            onChange={(e) =>
              onChange({
                links: e.target.value
                  .split("\n")
                  .filter(Boolean)
                  .map((l) => {
                    const [label, href] = l.split("|");
                    return { label: label || "Link", href: href || "#" };
                  }),
              })
            }
          />
        </>
      );
    case "columns":
      return (
        <>
          <label className="label">Columns ({block.items.length})</label>
          {block.items.map((c, i) => (
            <div
              key={i}
              className="border rounded p-2 space-y-1 mb-2"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <input
                className="input"
                placeholder="Heading"
                value={c.heading || ""}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...items[i], heading: e.target.value };
                  onChange({ items });
                }}
              />
              <textarea
                className="textarea"
                placeholder="Text"
                rows={2}
                value={c.text || ""}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...items[i], text: e.target.value };
                  onChange({ items });
                }}
              />
              <input
                className="input"
                placeholder="Image URL"
                value={c.image || ""}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...items[i], image: e.target.value };
                  onChange({ items });
                }}
              />
              <div className="grid grid-cols-2 gap-1">
                <input
                  className="input"
                  placeholder="Button label"
                  value={c.button?.label || ""}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = {
                      ...items[i],
                      button: {
                        ...(items[i].button || { label: "", href: "" }),
                        label: e.target.value,
                      },
                    };
                    onChange({ items });
                  }}
                />
                <input
                  className="input"
                  placeholder="Button URL"
                  value={c.button?.href || ""}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = {
                      ...items[i],
                      button: {
                        ...(items[i].button || { label: "", href: "" }),
                        href: e.target.value,
                      },
                    };
                    onChange({ items });
                  }}
                />
              </div>
            </div>
          ))}
          <button
            className="btn btn-secondary w-full"
            onClick={() => onChange({ items: [...block.items, { text: "Column" }] })}
          >
            Add column
          </button>
        </>
      );
  }
}
