import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Mail, Phone, Github, Linkedin, Instagram, Send, Check, Loader2, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { useSiteProfile } from "@/hooks/useSiteProfile";
import { SectionHeader } from "./SectionHeader";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export function ContactSection() {
  const profile = useSiteProfile();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = contactSchema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      subject: data.get("subject"),
      message: data.get("message"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "contacts"), {
        ...parsed.data,
        read: false,
        createdAt: serverTimestamp(),
      });
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 5000);
    } catch (err: any) {
      setError(err?.message || "Failed to send. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeader
            label="Let's Talk"
            title={
              <>
                Got an idea?
                <br />
                <span className="text-primary">Let's build it.</span>
              </>
            }
            subtitle="I'm open to internships, freelance work, and AI-product collaborations. The fastest way to reach me is below."
          />

          <div className="mt-10 space-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="font-medium text-foreground">{profile.email}</div>
              </div>
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm/10 text-warm">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Phone</div>
                <div className="font-medium text-foreground">{profile.phone}</div>
              </div>
            </a>
          </div>

          <div className="mt-6 flex gap-3">
            {[
              { Icon: Github, href: profile.github, label: "GitHub" },
              { Icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
              { Icon: Instagram, href: profile.instagram, label: "Instagram" },
            ].map(({ Icon, href, label }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ) : null
            )}
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for new projects
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-elev)] md:p-8"
        >
          <h3 className="font-display text-2xl font-bold text-foreground">Send a message</h3>
          <p className="mt-1 text-sm text-muted-foreground">I'll get back to you within 24 hours.</p>

          <div className="mt-6 space-y-4">
            {[
              { name: "name", label: "Your Name", type: "text" },
              { name: "email", label: "Email Address", type: "email" },
              { name: "subject", label: "Subject", type: "text" },
            ].map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  required
                  maxLength={f.name === "email" ? 255 : 200}
                  className="w-full border-0 border-b-2 border-border bg-transparent px-0 py-2 text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                maxLength={2000}
                className="w-full resize-none border-0 border-b-2 border-border bg-transparent px-0 py-2 text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || sent}
              className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-soft px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] disabled:opacity-70"
            >
              {sent ? (
                <><Check className="h-4 w-4" /> Message sent</>
              ) : submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                <>Send Message <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
