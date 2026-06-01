import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Briefcase, X, Calendar, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { experience } from "@/data/portfolio";
import { SectionHeader } from "./SectionHeader";

type Exp = (typeof experience)[number];

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          label="Experience"
          title={
            <>
              Where I've been <span className="text-primary">building.</span>
            </>
          }
          align="center"
        />

        <div ref={containerRef} className="relative mx-auto mt-16 max-w-3xl">
          {/* Background track */}
          <div className="absolute left-4 top-0 h-full w-[2px] rounded-full bg-border md:left-1/2 md:-translate-x-1/2" />
          {/* Animated progress fill */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 top-0 w-[2px] origin-top rounded-full bg-gradient-to-b from-primary via-primary to-primary-soft shadow-[0_0_20px_var(--color-primary)] md:left-1/2 md:-translate-x-1/2"
          />

          {experience.map((e, i) => (
            <TimelineItem
              key={i}
              item={e}
              index={i}
              onOpen={() => setOpenIdx(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIdx !== null && (
          <ExperienceModal
            item={experience[openIdx]}
            onClose={() => setOpenIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function TimelineItem({
  item: e,
  index: i,
  onOpen,
}: {
  item: Exp;
  index: number;
  onOpen: () => void;
}) {
  const flip = i % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className={`relative mb-10 flex items-start gap-6 md:gap-10 ${
        flip ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Dot */}
      <div className="absolute left-4 top-8 z-10 -translate-x-1/2 md:left-1/2">
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
          <span className="absolute inline-flex h-7 w-7 rounded-full bg-primary/20 blur-md" />
          <span className="relative inline-flex h-4 w-4 rounded-full border-[3px] border-background bg-primary shadow-[0_0_12px_var(--color-primary)]" />
        </span>
      </div>

      <div
        className={`ml-12 flex-1 md:ml-0 ${
          flip ? "md:pl-12" : "md:pr-12 md:text-right"
        }`}
      >
        <button
          type="button"
          onClick={onOpen}
          className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface p-6 text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-elev)] md:cursor-default md:hover:-translate-y-1"
        >
          {/* hover gradient */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-warm/5 opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {e.startDate} — {e.endDate}
                </span>
                {e.current && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Current
                  </span>
                )}
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                {e.role}
              </h3>
              <div className="text-sm font-medium text-primary">{e.company}</div>

              {/* Description: hidden on mobile, visible on md+ */}
              <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground md:block">
                {e.description}
              </p>

              {/* Mobile-only tap hint */}
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary md:hidden">
                Tap to read more
              </span>
            </div>
          </div>
        </button>
      </div>
      <div className="hidden flex-1 md:block" />
    </motion.div>
  );
}

function ExperienceModal({ item: e, onClose }: { item: Exp; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 backdrop-blur-md sm:items-center"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(ev) => ev.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lift)]"
      >
        <div className="relative h-28 bg-gradient-to-br from-primary via-primary-soft to-warm">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:14px_14px]" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full bg-background/90 p-2 text-foreground shadow-md transition hover:scale-110"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute -bottom-7 left-6 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-surface bg-primary text-primary-foreground shadow-[var(--shadow-elev)]">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-10">

          {e.current && (
            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Currently here
            </span>
          )}

          <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
            {e.role}
          </h3>
          <div className="text-base font-semibold text-primary">{e.company}</div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
              <Calendar className="h-3 w-3" />
              {e.startDate} — {e.endDate}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
              <MapPin className="h-3 w-3" />
              {e.type}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {e.description}
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background transition hover:bg-primary"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
