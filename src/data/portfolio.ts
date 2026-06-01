import profileAsset from "@/assets/profile.jpg.asset.json";
import resumeAsset from "@/assets/satya-resume.pdf.asset.json";

export const profile = {
  name: "Satyanarayana Chodisetti",
  firstName: "Satyanarayana",
  monogram: "Satya.",
  tagline: "Gen AI Full Stack Developer",
  roles: [
    "Gen AI Full Stack Developer",
    "Web Application Builder",
    "AI Integration Specialist",
  ],
  bio:
    "I design and develop modern web applications with a focus on full-stack development and Generative AI. I love learning new technologies and applying them through hands-on projects.",
  heroSubtext:
    "I craft fast, intelligent and beautifully engineered products — blending modern web stacks with Generative AI to ship experiences that feel inevitable.",
  profileImageUrl: profileAsset.url,
  resumeUrl: resumeAsset.url,
  email: "snsnarayanac@gmail.com",
  phone: "+91 9121055512",
  linkedin: "https://www.linkedin.com/in/satyanarayanach2417",
  github: "https://github.com/Satyanarayana2417",
  instagram: "https://www.instagram.com/dreamy__ai_world______/",
  location: "India",
  stats: [
    { value: "1+", label: "Year of Experience" },
    { value: "5+", label: "Projects Built" },
    { value: "∞", label: "Always Improving" },
    { value: "100%", label: "Dedication" },
  ],
};

export const whatIDo = [
  { title: "Full Stack Web Dev", desc: "End-to-end products with React, Node and modern data stacks.", icon: "Layers" },
  { title: "Gen AI Integration", desc: "LLM workflows, RAG, agents and AI-native UX baked into apps.", icon: "Sparkles" },
  { title: "UI / UX Design", desc: "Premium interfaces with motion, hierarchy and intent.", icon: "Palette" },
  { title: "ML Basics & Tools", desc: "Practical ML — predictions, vision and data pipelines.", icon: "Brain" },
];

export const skills = [
  {
    category: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "Vite"],
    accent: "#4F6EF7",
  },
  {
    category: "Backend",
    items: ["Python", "Java (Basics)", "Firebase"],
    accent: "#7C9DFF",
  },
  {
    category: "Generative AI",
    items: ["Prompt Engineering", "OpenAI", "Claude"],
    accent: "#FF7B54",
  },
  {
    category: "Data & ML",
    items: ["Python", "Pandas", "NumPy", "scikit-learn", "TensorFlow", "Jupyter"],
    accent: "#22C55E",
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Vercel", "PyCharm"],
    accent: "#8B5CF6",
  },
];

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  category: "Web App" | "AI/ML" | "Mobile" | "E-commerce";
  featured?: boolean;
  gradient: string;
  coverImage?: string;
};

export const projects: Project[] = [
  {
    id: "mana-nivasam",
    title: "Mana Nivasam",
    description: "A real estate discovery platform delivered as a polished mobile experience.",
    longDescription:
      "Mana Nivasam helps buyers browse, shortlist and contact property owners with a fast mobile-first UI. Built end-to-end with focus on listings, search and a clean lead funnel.",
    techStack: ["React", "Android", "REST API", "Realtime DB"],
    liveUrl: "https://play.google.com/store/apps/details?id=co.median.android.mpynbb",
    category: "Mobile",
    featured: true,
    gradient: "from-indigo-500/30 via-blue-500/20 to-cyan-400/30",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dre-real-estates",
    title: "DRE Real Estates",
    description: "Modern real-estate website with refined property browsing and lead capture.",
    longDescription:
      "Devi Real Estates — a marketing and listings site with motion-rich sections, project galleries and contact flows tuned for conversions.",
    techStack: ["React", "Tailwind", "Vercel"],
    liveUrl: "https://devi-real-estates.vercel.app/",
    category: "Web App",
    gradient: "from-violet-500/30 via-indigo-500/20 to-blue-500/30",
    coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sreerasthu-silvers",
    title: "Sreerasthu Silvers",
    description: "Elegant jewellery e-commerce storefront with catalog, cart and checkout.",
    longDescription:
      "A boutique silver jewellery store with curated collections, product detail pages, cart management and a clean checkout — built to feel premium and load fast.",
    techStack: ["React", "Tailwind", "E-commerce"],
    liveUrl: "https://sreerasthusilvers.vercel.app/",
    category: "E-commerce",
    featured: true,
    gradient: "from-amber-400/30 via-rose-400/20 to-fuchsia-500/30",
    coverImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ignite-gym",
    title: "Ignite Gym Platform",
    description: "A bold gym experience site with classes, programs and membership flows.",
    longDescription:
      "Ignite Prime is a high-energy gym website with hero storytelling, class schedules and membership inquiry — designed to convert visitors into members.",
    techStack: ["React", "Tailwind", "Motion"],
    liveUrl: "https://ignite-prime-experience.vercel.app/",
    category: "Web App",
    gradient: "from-orange-500/30 via-red-500/20 to-rose-500/30",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "flight-price",
    title: "Flight Ticket Price Predictor",
    description: "ML-powered web app predicting flight ticket prices from key features.",
    longDescription:
      "Trained on real flight data, this app predicts ticket prices given route, date and class. Built as a clean web UI on top of a Python ML model.",
    techStack: ["Python", "scikit-learn", "Flask", "React"],
    liveUrl: "https://skyprice-predictor-m6qk.vercel.app/",
    category: "AI/ML",
    featured: true,
    gradient: "from-emerald-400/30 via-teal-500/20 to-cyan-500/30",
    coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  },
];

export const experience = [
  {
    company: "Dream Team Services",
    role: "Gen AI Full Stack Developer Intern",
    type: "Internship",
    startDate: "Feb 2025",
    endDate: "Present",
    current: true,
    description:
      "Building Gen AI-powered full-stack features — LLM integrations, RAG flows, internal tools and production UI. Owning slices end-to-end from data to interface.",
  },
  {
    company: "Miracle Software Systems. INC",
    role: "Python Summer Intern",
    type: "Internship",
    startDate: "May 2026",
    endDate: "Jun 2026",
    current: false,
    description:
      "Completed industry-focused training in Python, React.js, FastAPI, Databases, Generative AI, and Cloud Technologies.",
  },
];

export const certifications = [
  { title: "Data Science Master Virtual Internship", issuer: "EduSkills · APSCHE & Altair", date: "2024" },
  { title: "TensorFlow & Object Detection", issuer: "Google Developer Courses", date: "2024" },
  { title: "AI Tools Workshop", issuer: "be10x", date: "2025" },
  { title: "AI Fundamentals", issuer: "Google · Coursera", date: "2026" },
  { title: "AI-ML Virtual Internship", issuer: "Google for Developers", date: "2024" },
];

export const education = [
  {
    degree: "B.Tech, Data Science",
    institution: "KIET Engineering College",
    period: "2023 – 2027",
    description: "Specializing in Data Science with focus on AI, ML and modern web engineering.",
  },
  {
    degree: "Intermediate · MPC",
    institution: "Sri Chaitanya Junior College",
    period: "2021 – 2023",
    description: "Mathematics, Physics and Chemistry foundation.",
  },
  {
    degree: "Secondary Education",
    institution: "Dr. KKR's Gowtham School",
    period: "Until 2021",
    description: "Strong academic and co-curricular base.",
  },
];

export const quoteFallbacks = [
  { content: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { content: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { content: "The function of good software is to make the complex appear simple.", author: "Grady Booch" },
  { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { content: "Programs must be written for people to read.", author: "Harold Abelson" },
  { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
];

export const fallbackQuote = quoteFallbacks[0];
