import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Loader2,
  Star,
  LogOut,
  Mail,
  User as UserIcon,
  Briefcase,
  Bell,
  BellOff,
  ExternalLink,
  FileText,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  uploadToCloudinary,
  uploadRawToCloudinary,
  type CloudinaryAsset,
} from "@/lib/cloudinary";
import type { FirestoreProject } from "@/hooks/useFirestoreProjects";
import { useContactMessages, type ContactMessage } from "@/hooks/useContactMessages";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Portfolio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const ADMIN_PASSCODE = "admin123";
const CATS = ["Web App", "AI/ML", "Mobile", "E-commerce"] as const;

type FormState = {
  id?: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
  category: (typeof CATS)[number];
  featured: boolean;
  media: CloudinaryAsset[];
};

const emptyForm: FormState = {
  title: "",
  description: "",
  longDescription: "",
  techStack: "",
  liveUrl: "",
  githubUrl: "",
  category: "Web App",
  featured: false,
  media: [],
};

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_authed") === "1") {
      setAuthed(true);
    }
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === ADMIN_PASSCODE) {
              localStorage.setItem("admin_authed", "1");
              setAuthed(true);
            } else {
              setErr("Incorrect passcode");
            }
          }}
          className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-soft)]"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter passcode to continue.</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setErr("");
            }}
            placeholder="Passcode"
            className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
          />
          {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            Default passcode: <code className="font-mono">admin123</code>
          </p>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { localStorage.removeItem("admin_authed"); setAuthed(false); }} />;
}

type Tab = "projects" | "profile" | "messages";

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("projects");
  const { messages } = useContactMessages();
  const unread = messages.filter((m) => !m.read).length;

  // Notifications
  const [notifEnabled, setNotifEnabled] = useState(false);
  const seenIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setNotifEnabled(Notification.permission === "granted");
    }
  }, []);

  // Detect new messages → fire notification
  useEffect(() => {
    if (!initialized.current) {
      messages.forEach((m) => seenIds.current.add(m.id));
      initialized.current = true;
      return;
    }
    messages.forEach((m) => {
      if (!seenIds.current.has(m.id)) {
        seenIds.current.add(m.id);
        if (notifEnabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification(`New message from ${m.name}`, {
              body: m.subject ? `${m.subject}` : m.message.slice(0, 120),
              icon: "/favicon.ico",
              tag: m.id,
            });
          } catch {
            /* ignore */
          }
        }
      }
    });
  }, [messages, notifEnabled]);

  const requestNotif = async () => {
    if (typeof Notification === "undefined") {
      alert("Notifications are not supported in this browser.");
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifEnabled(perm === "granted");
    if (perm === "granted") {
      new Notification("Notifications enabled", { body: "You'll get a ping when someone messages you." });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <h1 className="font-display text-xl font-bold">Portfolio Admin</h1>
            <p className="text-xs text-muted-foreground">Projects, profile, messages</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={requestNotif}
              title={notifEnabled ? "Notifications on" : "Enable notifications"}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${
                notifEnabled
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {notifEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              <span className="hidden sm:inline">{notifEnabled ? "On" : "Enable alerts"}</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="container-x flex gap-1 overflow-x-auto pb-3">
          <TabBtn active={tab === "projects"} onClick={() => setTab("projects")} icon={<Briefcase className="h-4 w-4" />} label="Projects" />
          <TabBtn active={tab === "profile"} onClick={() => setTab("profile")} icon={<UserIcon className="h-4 w-4" />} label="Profile" />
          <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} icon={<Mail className="h-4 w-4" />} label="Messages" badge={unread} />
        </div>
      </header>

      <main className="container-x py-8">
        {tab === "projects" && <ProjectsTab />}
        {tab === "profile" && <ProfileTab />}
        {tab === "messages" && <MessagesTab messages={messages} />}
      </main>
    </div>
  );
}

function TabBtn({
  active, onClick, icon, label, badge,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      {badge ? (
        <span className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
          active ? "bg-primary-foreground text-primary" : "bg-red-500 text-white"
        }`}>
          {badge}
        </span>
      ) : null}
    </button>
  );
}

/* ----------------- PROJECTS TAB ----------------- */

function ProjectsTab() {
  const [items, setItems] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormState | null>(null);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await deleteDoc(doc(db, "projects", id));
  };

  const startEdit = (p: FirestoreProject) =>
    setEditing({
      id: p.id,
      title: p.title,
      description: p.description ?? "",
      longDescription: p.longDescription ?? "",
      techStack: (p.techStack ?? []).join(", "),
      liveUrl: p.liveUrl ?? "",
      githubUrl: p.githubUrl ?? "",
      category: (p.category as any) ?? "Web App",
      featured: !!p.featured,
      media: p.media ?? [],
    });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Projects</h2>
        <button
          onClick={() => setEditing({ ...emptyForm })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">No projects yet. Click "New Project" to add your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const cover = p.media?.find((m) => m.type === "image") ?? p.media?.[0];
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="relative aspect-video bg-secondary">
                  {cover ? (
                    cover.type === "video" ? (
                      <video src={cover.url} className="h-full w-full object-cover" muted />
                    ) : (
                      <img src={cover.url} alt={p.title} className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No media</div>
                  )}
                  {p.featured && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold">{p.title}</h3>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(p)} className="rounded-lg p-2 hover:bg-secondary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-500/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <ProjectFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (form) => {
            const payload = {
              title: form.title,
              description: form.description,
              longDescription: form.longDescription,
              techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
              liveUrl: form.liveUrl,
              githubUrl: form.githubUrl || null,
              category: form.category,
              featured: form.featured,
              media: form.media,
            };
            if (form.id) {
              await updateDoc(doc(db, "projects", form.id), payload as any);
            } else {
              await addDoc(collection(db, "projects"), {
                ...payload,
                createdAt: serverTimestamp(),
              });
            }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

/* ----------------- PROFILE TAB ----------------- */

type ProfileDoc = {
  profileImageUrl?: string;
  resumeUrl?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
};

function ProfileTab() {
  const [data, setData] = useState<ProfileDoc>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ref = doc(db, "site", "profile");
    getDoc(ref).then((snap) => {
      setData((snap.data() as ProfileDoc) ?? {});
      setLoading(false);
    });
  }, []);

  const save = async (next: ProfileDoc) => {
    setSaving(true);
    setMsg("");
    try {
      await setDoc(doc(db, "site", "profile"), next, { merge: true });
      setData(next);
      setMsg("Saved");
      setTimeout(() => setMsg(""), 2000);
    } catch (e: any) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImage = async (file: File | undefined) => {
    if (!file) return;
    setUploadingImg(true);
    try {
      const asset = await uploadToCloudinary(file);
      await save({ ...data, profileImageUrl: asset.url });
    } catch (e: any) {
      setMsg(e.message || "Upload failed");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleResume = async (file: File | undefined) => {
    if (!file) return;
    setUploadingResume(true);
    try {
      const asset = await uploadRawToCloudinary(file);
      await save({ ...data, resumeUrl: asset.url });
    } catch (e: any) {
      setMsg(e.message || "Upload failed");
    } finally {
      setUploadingResume(false);
    }
  };

  const removeImage = () => save({ ...data, profileImageUrl: "" });
  const removeResume = () => save({ ...data, resumeUrl: "" });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const socials = data.socials ?? {};

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Photo */}
      <Card title="Profile Photo">
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-border bg-secondary">
            {data.profileImageUrl ? (
              <img src={data.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {uploadingImg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {data.profileImageUrl ? "Replace" : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} disabled={uploadingImg} />
            </label>
            {data.profileImageUrl && (
              <button onClick={removeImage} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Resume */}
      <Card title="Resume (PDF)">
        <div className="flex flex-col gap-3">
          {data.resumeUrl ? (
            <a href={data.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <FileText className="h-4 w-4" /> View current resume <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">No resume uploaded.</p>
          )}
          <div className="flex gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {uploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {data.resumeUrl ? "Replace PDF" : "Upload PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleResume(e.target.files?.[0])} disabled={uploadingResume} />
            </label>
            {data.resumeUrl && (
              <button onClick={removeResume} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Socials */}
      <Card title="Social & Contact Links" className="lg:col-span-2">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await save({
              ...data,
              socials: {
                github: String(fd.get("github") || "").trim(),
                linkedin: String(fd.get("linkedin") || "").trim(),
                instagram: String(fd.get("instagram") || "").trim(),
                twitter: String(fd.get("twitter") || "").trim(),
                website: String(fd.get("website") || "").trim(),
                email: String(fd.get("email") || "").trim(),
                phone: String(fd.get("phone") || "").trim(),
              },
            });
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          {[
            { name: "email", label: "Email", placeholder: "you@example.com" },
            { name: "phone", label: "Phone", placeholder: "+91 ..." },
            { name: "github", label: "GitHub URL", placeholder: "https://github.com/…" },
            { name: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/…" },
            { name: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/…" },
            { name: "twitter", label: "Twitter / X URL", placeholder: "https://x.com/…" },
            { name: "website", label: "Website URL", placeholder: "https://…" },
          ].map((f) => (
            <label key={f.name} className="block">
              <span className="text-sm font-medium">{f.label}</span>
              <input
                name={f.name}
                defaultValue={(socials as any)[f.name] || ""}
                placeholder={f.placeholder}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          ))}
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Links
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-6 ${className}`}>
      <h3 className="font-display text-base font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ----------------- MESSAGES TAB ----------------- */

function MessagesTab({ messages }: { messages: ContactMessage[] }) {
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const markRead = async (m: ContactMessage, read: boolean) => {
    await updateDoc(doc(db, "contacts", m.id), { read });
  };

  const remove = async (m: ContactMessage) => {
    if (!confirm("Delete this message?")) return;
    await deleteDoc(doc(db, "contacts", m.id));
    if (selected?.id === m.id) setSelected(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="font-display text-sm font-bold">Inbox</h3>
          <span className="text-xs text-muted-foreground">{messages.length} total</span>
        </div>
        {messages.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No messages yet.</div>
        ) : (
          <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
            {messages.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => {
                    setSelected(m);
                    if (!m.read) markRead(m, true);
                  }}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-secondary ${
                    selected?.id === m.id ? "bg-secondary" : ""
                  }`}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-border" : "bg-primary"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${m.read ? "font-medium text-foreground" : "font-bold text-foreground"}`}>{m.name}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString() : ""}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{m.subject || m.message}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        {selected ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold">{selected.subject || "(no subject)"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  From <span className="font-medium text-foreground">{selected.name}</span> &middot;{" "}
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selected.createdAt?.toDate ? selected.createdAt.toDate().toLocaleString() : ""}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => markRead(selected, !selected.read)} className="rounded-lg border border-border px-3 py-1.5 text-xs">
                  Mark {selected.read ? "unread" : "read"}
                </button>
                <button onClick={() => remove(selected)} className="rounded-lg p-2 text-red-500 hover:bg-red-500/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mt-5 whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
              {selected.message}
            </div>
            <div className="mt-5 flex gap-2">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + (selected.subject || ""))}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Mail className="h-4 w-4" /> Reply via email
              </a>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-muted-foreground">
            Select a message to read it.
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------- PROJECT MODAL (unchanged) ----------------- */

function ProjectFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial: FormState;
  onClose: () => void;
  onSave: (form: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: CloudinaryAsset[] = [];
      for (const file of Array.from(files)) {
        const asset = await uploadToCloudinary(file);
        uploaded.push(asset);
      }
      setForm((f) => ({ ...f, media: [...f.media, ...uploaded] }));
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (idx: number) =>
    setForm((f) => ({ ...f, media: f.media.filter((_, i) => i !== idx) }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 hover:bg-secondary" aria-label="Close"><X className="h-5 w-5" /></button>
        <h2 className="font-display text-xl font-bold">{form.id ? "Edit Project" : "New Project"}</h2>

        <form
          className="mt-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            try {
              await onSave(form);
            } catch (err: any) {
              setError(err.message || "Save failed");
              setSaving(false);
            }
          }}
        >
          <Field label="Title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          </Field>

          <Field label="Short description">
            <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
          </Field>

          <Field label="Long description">
            <textarea rows={4} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} className="input" />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="input">
                {CATS.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </Field>
            <Field label="Tech stack (comma separated)">
              <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, Tailwind, Firebase" className="input" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Live URL">
              <input type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="input" />
            </Field>
            <Field label="GitHub URL (optional)">
              <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="input" />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured project
          </label>

          <div>
            <label className="text-sm font-medium">Photos & Videos</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {form.media.map((m, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
                  {m.type === "video" ? (
                    <video src={m.url} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  )}
                  <button type="button" onClick={() => removeMedia(i)} className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary">
                {uploading ? (<Loader2 className="h-5 w-5 animate-spin" />) : (<><Upload className="h-5 w-5" /><span className="mt-1">Upload</span></>)}
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {form.id ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
