import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { profile as staticProfile } from "@/data/portfolio";

export type SiteProfileOverrides = {
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

export type MergedProfile = typeof staticProfile & {
  profileImageUrl: string;
  resumeUrl: string;
};

export function useSiteProfile(): MergedProfile {
  const [override, setOverride] = useState<SiteProfileOverrides | null>(null);

  useEffect(() => {
    const ref = doc(db, "site", "profile");
    const unsub = onSnapshot(
      ref,
      (snap) => setOverride((snap.data() as SiteProfileOverrides) ?? null),
      () => setOverride(null)
    );
    return () => unsub();
  }, []);

  return {
    ...staticProfile,
    profileImageUrl: override?.profileImageUrl || staticProfile.profileImageUrl,
    resumeUrl: override?.resumeUrl || staticProfile.resumeUrl,
    email: override?.socials?.email || staticProfile.email,
    phone: override?.socials?.phone || staticProfile.phone,
    github: override?.socials?.github || staticProfile.github,
    linkedin: override?.socials?.linkedin || staticProfile.linkedin,
    instagram: override?.socials?.instagram || staticProfile.instagram,
  };
}
