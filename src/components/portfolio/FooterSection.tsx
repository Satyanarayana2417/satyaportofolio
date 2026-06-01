import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { quoteFallbacks } from "@/data/portfolio";
import { useSiteProfile } from "@/hooks/useSiteProfile";

type Quote = { content: string; author: string };

export function FooterSection() {
  const profile = useSiteProfile();
  const [quotes, setQuotes] = useState<Quote[]>(quoteFallbacks);
  const [idx, setIdx] = useState(0);

  // Try to enrich pool from the quotes API (non-blocking; falls back gracefully)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const reqs = Array.from({ length: 8 }).map(() =>
          fetch("https://api.quotable.io/random?tags=technology|wisdom|inspirational&maxLength=120")
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        );
        const results = await Promise.all(reqs);
        const fetched = results
          .filter((d): d is { content: string; author: string } => !!d?.content)
          .map((d) => ({ content: d.content, author: d.author }));
        if (!cancelled && fetched.length) setQuotes((prev) => [...fetched, ...prev]);
      } catch {
        /* keep fallbacks */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Rotate every 2.5s
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % quotes.length), 2500);
    return () => clearInterval(t);
  }, [quotes.length]);

  const quote = quotes[idx];

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background pt-20 pb-8">
      <FooterSparkles />
      <div className="container-x relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-2xl font-bold tracking-tight text-foreground">
              Satya<span className="text-primary">.</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Building intelligent, beautifully engineered products at the intersection of full-stack and Gen AI.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Github, href: profile.github, label: "GitHub" },
                { Icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
                { Icon: Instagram, href: profile.instagram, label: "Instagram" },
                { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Navigate</div>
            <ul className="mt-4 space-y-2 text-sm">
              {["About", "Skills", "Projects", "Experience", "Contact"].map((l) => (
                <li key={l}>
                  <button
                    onClick={() =>
                      document
                        .getElementById(l.toLowerCase())
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Today's Spark</div>
            <blockquote className="relative mt-4 min-h-[7rem] overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <p className="font-display text-base leading-relaxed text-foreground">"{quote.content}"</p>
                  <footer className="mt-3 font-mono text-xs text-muted-foreground">— {quote.author}</footer>
                </motion.div>
              </AnimatePresence>
            </blockquote>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Chsatyanarayana. Every day is a chance to grow.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            Back to Top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterSparkles() {
  const sparkles = Array.from({ length: 16 });
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden"
    >
      {sparkles.map((_, i) => {
        const left = (i * 61) % 100;
        const width = i % 4 === 0 ? 2 : 1;
        const height = 18 + ((i * 9) % 28);
        const duration = 2.8 + ((i * 0.35) % 1.8);
        const delay = (i * 0.32) % 3;
        const drift = ((i % 5) - 2) * 8;
        const travel = 260 + ((i * 27) % 140);
        const color = i % 3 === 0 ? "var(--color-primary)" : "var(--color-foreground)";
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: -60,
              width,
              height,
              background: `linear-gradient(to bottom, transparent, ${color})`,
              boxShadow: `0 0 10px ${color}`,
              opacity: 0.7,
            }}
            initial={{ y: 0, x: 0, opacity: 0 }}
            animate={{
              y: [0, travel],
              x: [0, drift, 0],
              opacity: [0, 0.85, 0.5, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}
