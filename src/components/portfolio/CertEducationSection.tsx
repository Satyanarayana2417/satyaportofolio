import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";
import { certifications, education } from "@/data/portfolio";
import { SectionHeader } from "./SectionHeader";

export function CertEducationSection() {
  return (
    <section id="education" className="relative py-24 md:py-32">
      <div className="container-x grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Certifications */}
        <div>
          <SectionHeader
            label="Certifications"
            title={
              <>
                Trained &<br />
                <span className="text-primary">credentialed.</span>
              </>
            }
          />
          <div className="mt-10 space-y-3">
            {certifications.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group flex items-start gap-4 rounded-2xl border border-border border-l-4 border-l-primary bg-surface p-5 shadow-[var(--shadow-soft)] transition-all hover:rotate-[0.5deg] hover:shadow-[var(--shadow-elev)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warm/10 text-warm">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-semibold leading-tight text-foreground">
                    {c.title}
                  </h3>
                  <div className="mt-1 text-sm text-muted-foreground">{c.issuer}</div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground/80">{c.date}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <SectionHeader
            label="Education"
            title={
              <>
                Roots &<br />
                <span className="text-primary">foundations.</span>
              </>
            }
          />
          <div className="mt-10 space-y-3">
            {education.map((e, i) => (
              <motion.div
                key={e.degree}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
                      {e.period}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-bold text-foreground">{e.degree}</h3>
                    <div className="text-sm font-medium text-primary">{e.institution}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
