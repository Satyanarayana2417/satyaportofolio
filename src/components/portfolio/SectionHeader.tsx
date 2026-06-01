import { motion } from "framer-motion";
import { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
      <span className="h-px w-8 bg-primary/60" />
      {children}
    </div>
  );
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl ${className}`}
    >
      {children}
    </motion.h2>
  );
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
}: {
  label: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <SectionLabel>{label}</SectionLabel>
      <SectionTitle>{title}</SectionTitle>
      {subtitle && (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
