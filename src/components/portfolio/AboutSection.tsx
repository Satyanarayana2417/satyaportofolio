import { motion } from "framer-motion";
import { Layers, Sparkles, Palette, Brain } from "lucide-react";
import { whatIDo } from "@/data/portfolio";
import { useSiteProfile } from "@/hooks/useSiteProfile";
import { SectionHeader } from "./SectionHeader";

const icons = { Layers, Sparkles, Palette, Brain } as const;

export function AboutSection() {
  const profile = useSiteProfile();
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container-x grid grid-cols-1 items-start gap-16 md:grid-cols-12">
        {/* Left image stack */}
        <div className="relative md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] max-w-sm">
            <div className="absolute -left-6 top-6 h-full w-full rounded-[2rem] border border-border bg-secondary" />
            <div className="absolute -right-4 -top-2 h-full w-full rounded-[2rem] border border-border-strong bg-surface" />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-lift)]">
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            {/* orbiting chips */}
            {["React", "Python", "Gen AI"].map((chip, i) => (
              <motion.div
                key={chip}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{
                  top: `${[10, 50, 80][i]}%`,
                  left: i % 2 === 0 ? "-12%" : "auto",
                  right: i % 2 === 1 ? "-12%" : "auto",
                }}
                className="absolute rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-medium text-foreground shadow-[var(--shadow-soft)]"
              >
                {chip}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right text */}
        <div className="md:col-span-7">
          <SectionHeader
            label="Who I Am"
            title={
              <>
                Engineer by craft, <br />
                <span className="text-primary">designer</span> by instinct.
              </>
            }
          />
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{profile.bio}</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Currently building AI-native full-stack products as a Gen AI Developer Intern — shipping ideas
            from data layer to pixel-perfect UI. I obsess over motion, hierarchy, and how interfaces feel
            in the hand.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {whatIDo.map((item, i) => {
              const Icon = icons[item.icon as keyof typeof icons];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-elev)]"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-display text-lg font-semibold text-foreground">{item.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
