import { motion } from "framer-motion";
import { useState } from "react";
import { skills } from "@/data/portfolio";
import { SectionHeader } from "./SectionHeader";

const TICKER = [
  "HTML", "CSS", "JavaScript", "Vite", "Python", "Java", "Firebase",
  "Prompt Engineering", "OpenAI", "Claude", "Pandas", "NumPy", "scikit-learn",
  "TensorFlow", "Git", "GitHub", "VS Code", "Vercel", "PyCharm",
];

export function SkillsSection() {
  const [active, setActive] = useState(0);
  return (
    <section id="skills" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          label="Capabilities"
          title={
            <>
              Tools sharpened for <span className="text-primary">building things that work.</span>
            </>
          }
          subtitle="A focused stack picked for shipping speed, AI integration and beautiful interfaces."
          align="center"
        />

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {skills.map((s, i) => (
            <button
              key={s.category}
              onClick={() => setActive(i)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                active === i
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.category}
            </button>
          ))}
        </div>

        {/* Pills */}
        <motion.div
          key={active}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3"
        >
          {skills[active].items.map((item) => (
            <motion.span
              key={item}
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="cursor-default rounded-full border border-border bg-surface px-5 py-2.5 font-mono text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-soft)]"
              style={{ ["--tw-shadow-color" as never]: skills[active].accent }}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* Marquee */}
        <div className="relative mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max gap-10 animate-[marquee_30s_linear_infinite]">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span
                key={i}
                className="font-display text-2xl font-bold text-muted-foreground/40 md:text-3xl"
              >
                {t} <span className="text-primary/60">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
