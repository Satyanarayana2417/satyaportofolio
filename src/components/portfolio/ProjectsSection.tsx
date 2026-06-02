import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { ArrowUpRight, ExternalLink, Star, X, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { projects as staticProjects, type Project } from "@/data/portfolio";
import { useFirestoreProjects, type FirestoreProject } from "@/hooks/useFirestoreProjects";
import { SectionHeader } from "./SectionHeader";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const CATS = ["All", "Web App", "AI/ML", "Mobile", "E-commerce"] as const;

type AnyProject = (Project | FirestoreProject) & { media?: FirestoreProject["media"] };

export function ProjectsSection() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [open, setOpen] = useState<AnyProject | null>(null);
  const [mediaIdx, setMediaIdx] = useState(0);
  useBodyScrollLock(!!open);

  const { projects: fsProjects } = useFirestoreProjects();

  const sourceProjects: AnyProject[] = useMemo(() => {
    if (fsProjects && fsProjects.length > 0) return fsProjects as AnyProject[];
    return staticProjects as AnyProject[];
  }, [fsProjects]);

  const filtered = cat === "All" ? sourceProjects : sourceProjects.filter((p) => p.category === cat);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    setMediaIdx(0);
  }, [open]);

  const gradientFor = (p: AnyProject) =>
    p.gradient || "from-indigo-500/30 via-blue-500/20 to-cyan-400/30";

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            label="Selected Work"
            title={
              <>
                Projects I've <span className="text-primary">built</span>.
              </>
            }
            subtitle="A snapshot of products I've built — across real estate, e-commerce and AI/ML."
          />
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  cat === c
                    ? "bg-foreground text-background"
                    : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-12 grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const cover = p.media?.find((m) => m.type === "image") ?? p.media?.[0];
              const fallbackImage =
                (p as Project).coverImage ??
                staticProjects.find((sp) => sp.id === p.id)?.coverImage;
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => setOpen(p)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all hover:-translate-y-2 hover:border-primary hover:shadow-[var(--shadow-lift)] md:rounded-3xl"
                >
                  <div className={`relative aspect-square overflow-hidden bg-gradient-to-br md:aspect-[16/10] ${gradientFor(p)}`}>
                    {cover ? (
                      cover.type === "video" ? (
                        <video
                          src={cover.url}
                          className="absolute inset-0 h-full w-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : (
                        <img
                          src={cover.url}
                          alt={p.title}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      )
                    ) : fallbackImage ? (
                      <img
                        src={fallbackImage}
                        alt={p.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="font-display text-4xl font-bold text-foreground/30 md:text-5xl">
                            {p.title.charAt(0)}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
                      </>
                    )}
                    <div className="absolute right-2 top-2 flex gap-2 md:right-4 md:top-4">
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-background backdrop-blur md:px-2.5 md:py-1 md:text-[10px]">
                          <Star className="h-3 w-3 fill-current" /> <span className="hidden md:inline">Featured</span>
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 hidden md:block md:bottom-4 md:left-4">
                      <span className="rounded-full bg-surface/80 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 md:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary md:text-xl">
                        {p.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary md:h-5 md:w-5" />
                    </div>
                    <p className="mt-2 hidden line-clamp-2 text-sm text-muted-foreground md:block">{p.description}</p>
                    <div className="mt-4 hidden flex-wrap gap-1.5 md:flex">
                      {p.techStack.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] font-medium text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-lift)]"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>

              {open.media && open.media.length > 0 ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-black">
                  {open.media[mediaIdx].type === "video" ? (
                    <video
                      key={open.media[mediaIdx].url}
                      src={open.media[mediaIdx].url}
                      className="h-full w-full object-contain"
                      controls
                      playsInline
                    />
                  ) : (
                    <img
                      src={open.media[mediaIdx].url}
                      alt={open.title}
                      className="h-full w-full object-contain"
                    />
                  )}
                  {open.media.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setMediaIdx((i) => (i - 1 + open.media!.length) % open.media!.length)
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setMediaIdx((i) => (i + 1) % open.media!.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {open.media.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setMediaIdx(i)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === mediaIdx ? "w-6 bg-primary" : "w-1.5 bg-background/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className={`aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br ${gradientFor(open)}`}>
                  <div className="flex h-full items-center justify-center font-display text-7xl font-bold text-foreground/30">
                    {open.title.charAt(0)}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {open.category}
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold text-foreground">{open.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{open.longDescription}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {open.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-xs font-medium text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {open.liveUrl && (
                    <a
                      href={open.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Live Demo <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {open.githubUrl && (
                    <a
                      href={open.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                    >
                      <Github className="h-4 w-4" /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
