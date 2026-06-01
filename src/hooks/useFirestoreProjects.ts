import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CloudinaryAsset } from "@/lib/cloudinary";

export type FirestoreProject = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  category: "Web App" | "AI/ML" | "Mobile" | "E-commerce";
  featured?: boolean;
  gradient?: string;
  media?: CloudinaryAsset[];
  createdAt?: Timestamp;
};

export function useFirestoreProjects() {
  const [projects, setProjects] = useState<FirestoreProject[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setProjects(data);
        setLoading(false);
      },
      (err) => {
        console.error("[useFirestoreProjects]", err);
        setProjects([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { projects, loading };
}
