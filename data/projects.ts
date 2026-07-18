export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  tags: string[];
  role: string;
  year: string;
  image: string; 
  liveUrl: string;
}

export const projectsData: Project[] = [
  {
    id: "marlow-club",
    title: "The Next Evolution of High-Performance Luxury",
    client: "The Marlow Club",
    description: "A premium digital ecosystem for Buckinghamshire's premier wellness destination. Features high-converting multi-step lead capture pipelines, secure admin controls, and custom mobile-first fluid grids.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript", "Responsive Optimization"],
    role: "Lead Frontend Engineer",
    year: "2026",
    image: "/screenshots/marlow-hero.jpg",
    liveUrl: "https://marlow-club.vercel.app/"
  },
  {
    id: "iron-haven",
    title: "Raw Athleticism Meets High-Fidelity Engineering",
    client: "Iron Haven Gym",
    description: "A bold, high-contrast digital platform built for a hardcore athletic facility. Features aggressive, brutalist design aesthetics balanced with seamless member scheduling and lightning-fast asset loading.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript", "Brutalist Design"],
    role: "Full-Stack Developer",
    year: "2026",
    image: "/screenshots/iron-hero.jpg",
    liveUrl: "https://iron-haven-gym-ochre.vercel.app/"
  }
];