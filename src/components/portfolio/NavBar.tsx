import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useSiteProfile } from "@/hooks/useSiteProfile";

const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export function NavBar() {
  const profile = useSiteProfile();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", ...NAV.map((n) => n.id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container-x">
        <nav
          className={`flex items-center justify-between gap-4 rounded-2xl border border-border px-4 py-2.5 transition-all duration-300 ${
            scrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-transparent border-transparent"
          }`}
        >
          <button onClick={() => handleNav("home")} className="group flex items-center gap-2 cursor-pointer">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              {profile.monogram.split(".")[0]}
              <span className="text-primary">.</span>
              {profile.monogram.split(".")[1]}
            </span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:scale-[1.03] hover:bg-primary md:inline-flex"
            >
              View Resume <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-border bg-surface/60 p-2 md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-0 z-40 bg-background/30 backdrop-blur-sm md:hidden"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="container-x fixed inset-x-0 top-[68px] z-50 md:hidden"
            >
              <div className="rounded-2xl border border-border bg-background/95 p-4 shadow-[var(--shadow-elev)] backdrop-blur-xl">
                <MobileTimeline items={NAV} active={active} onSelect={handleNav} />
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-between rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background"
                >
                  View Resume <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileTimeline({
  items,
  active,
  onSelect,
}: {
  items: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const activeIndex = useMemo(() => {
    const i = items.findIndex((it) => it.id === active);
    return i === -1 ? 0 : i;
  }, [items, active]);

  // Progress along the timeline (0..1)
  const progress = items.length > 1 ? activeIndex / (items.length - 1) : 0;

  return (
    <div className="relative pl-6">
      {/* Track */}
      <span className="absolute left-2 top-3 bottom-3 w-px bg-border" aria-hidden />
      {/* Animated progress line */}
      <motion.span
        aria-hidden
        className="absolute left-2 top-3 w-px origin-top bg-gradient-to-b from-primary via-primary to-primary/30"
        initial={false}
        animate={{ scaleY: progress }}
        style={{ bottom: "0.75rem" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      <ul className="flex flex-col gap-1">
        {items.map((item, i) => {
          const isActive = active === item.id;
          const isPassed = i < activeIndex;
          return (
            <li key={item.id} className="relative">
              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  scale: isActive ? 1.35 : 1,
                  backgroundColor: isActive || isPassed ? "var(--color-primary)" : "var(--color-background)",
                  borderColor: isActive || isPassed ? "var(--color-primary)" : "var(--color-border)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute -left-[18px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2"
              >
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary/50"
                    animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.span>
              <button
                onClick={() => onSelect(item.id)}
                className={`relative w-full overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-foreground hover:bg-secondary"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 -z-0 rounded-xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
