import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Instagram, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { profile as staticProfile } from "@/data/portfolio";
import { useSiteProfile } from "@/hooks/useSiteProfile";

function Typewriter({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[i % words.length];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      const next = deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1);
      setText(next);
      if (!deleting && next === current) setTimeout(() => setDeleting(true), 1400);
      else if (deleting && next === "") {
        setDeleting(false);
        setI((v) => v + 1);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, words]);

  return (
    <span className="text-primary">
      {text}
      <span className="ml-0.5 inline-block h-[0.9em] w-[2px] -translate-y-[2px] animate-pulse bg-primary align-middle" />
    </span>
  );
}

export function HeroSection() {
  const profile = useSiteProfile();
  void staticProfile;
  return (
    <section id="home" className="relative mesh-bg overflow-hidden pt-20 pb-16 md:pt-24 md:pb-24">
      {/* Floating blobs */}
      <div className="pointer-events-none absolute -left-20 top-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-[float_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-10 top-10 h-72 w-72 rounded-full bg-warm/20 blur-3xl animate-[float_14s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-primary-soft/30 blur-3xl" />

      {/* Dot grid */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden>
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <div className="container-x relative grid grid-cols-1 items-center gap-12 md:grid-cols-12">
        {/* Left */}
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <span className="text-base">👋</span> Hey there, I'm
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[23rem] break-words font-display text-[3.15rem] font-extrabold leading-[0.95] tracking-tight text-foreground sm:max-w-none sm:text-6xl md:text-[5.5rem]"
          >
            Satya<span className="text-primary">narayana</span>
            <br />
            Chodisetti<span className="text-warm">.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 flex min-h-[3.5rem] flex-wrap items-center gap-x-2 gap-y-1 font-mono text-base font-medium md:min-h-0 md:text-lg"
          >
            <Sparkles className="h-4 w-4 text-warm" />
            <span className="text-muted-foreground">I'm a</span>
            <span className="block w-full md:inline md:w-auto">
              <Typewriter words={profile.roles} />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            {profile.heroSubtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elev)] transition-all hover:scale-[1.03] hover:shadow-[var(--shadow-lift)]"
            >
              View My Work
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Get In Touch
            </button>

            <div className="ml-1 flex items-center gap-2">
              {[
                { Icon: Github, href: profile.github, label: "GitHub" },
                { Icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
                { Icon: Instagram, href: profile.instagram, label: "Instagram" },
              ].map(({ Icon, href, label }, idx) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + idx * 0.08 }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative md:col-span-5"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* halo circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary-soft/20 to-warm/20 blur-2xl" />
            {/* spinning dashed ring */}
            <div className="absolute -inset-3 rounded-[2.5rem] border-2 border-dashed border-primary/40 animate-[spin_18s_linear_infinite]" />
            {/* frame */}
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-lift)] rotate-[-2deg]">
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-warm/10" />
            </div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-[var(--shadow-elev)]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-foreground">Open to Opportunities</span>
            </motion.div>

          </div>
        </motion.div>

        {/* Stats row */}
        <div className="md:col-span-12">
          <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-5">
            {profile.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="font-display text-4xl font-bold text-primary md:text-5xl">{s.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
