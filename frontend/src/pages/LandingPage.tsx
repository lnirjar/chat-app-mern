import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Section } from "@/components/landing/section";
import { CodeBlock } from "@/components/landing/code-block";
import { List } from "@/components/landing/list";
import { LinkItem } from "@/components/landing/link-item";
import { Footer } from "@/components/landing/footer";

import { APP_NAME } from "@/lib/constants";

const features: { icon: string; title: string; description: string }[] = [
  {
    icon: "🏢",
    title: "Workspaces",
    description: "Organize conversations by workspace",
  },
  {
    icon: "💬",
    title: "Group Chats & DMs",
    description: "Chat with teams or individuals in real time",
  },
  {
    icon: "🔗",
    title: "Invite Members",
    description: "Share invitation links to add people to workspaces",
  },
  {
    icon: "👥",
    title: "Workspace Members List",
    description: "See all members within a workspace",
  },
  {
    icon: "👤",
    title: "Profile & Account Settings",
    description: "Update user info and preferences",
  },
  {
    icon: "🔒",
    title: "Authentication",
    description: "Local and Google OAuth via Passport.js",
  },
  {
    icon: "🖼️",
    title: "User Avatars",
    description: "Profile pictures stored using Cloudinary",
  },
  {
    icon: "🌙",
    title: "Dark Mode Toggle",
    description: "Seamless light/dark theme support",
  },
  {
    icon: "⚡",
    title: "Real-time Messaging",
    description: "Powered by Socket.io",
  },
  {
    icon: "🧾",
    title: "Form Validation",
    description: "Using Zod and React Hook Form",
  },
  {
    icon: "🧠",
    title: "State Management",
    description: "Redux Toolkit and React Query for data fetching",
  },
  {
    icon: "📱",
    title: "Responsive Design",
    description: "Built with Tailwind CSS and Shadcn UI",
  },
];

export const LandingPage = () => {
  return (
    <div className="px-16 pb-4">
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>

      <main className="flex flex-col gap-6 max-w-2xl my-12">
        <h1 className="text-6xl font-bold">💬 Chat App</h1>
        <p>
          This is a full-featured <strong>team chat application</strong> built
          with the <strong>MERN stack</strong> and <strong>TypeScript</strong>,
          designed for work-related communication.
        </p>
        <p>
          It supports <strong>workspaces</strong>, <strong>group chats</strong>,
          and <strong>direct messages</strong>, aiming to provide a Slack-like
          experience with a clean and responsive UI.
        </p>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/signup" className="[&.active]:hidden animate-fade-in">
              Get Started
            </Link>
          </Button>
        </div>
      </main>
      <Section title="🚀 Live Demo">
        <div className="flex flex-col gap-4">
          <ul className="space-y-2">
            <LinkItem
              label="Live URL"
              url="https://chat-app-mern-0pdu.onrender.com"
              icon="🌐"
            />
            <LinkItem
              label="GitHub Repo"
              url="https://github.com/lnirjar/chat-app-mern"
              icon="💻"
            />
          </ul>
          <section className="flex flex-col gap-1 max-w-sm mt-2">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <UserIcon /> Demo User
            </h3>
            <CodeBlock code={`Username: demo \nPassword: abc123`} />
          </section>
        </div>
      </Section>

      <Section title="🛠️ Tech Stack">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Frontend</h3>
            <List
              items={[
                "React (Vite + TypeScript)",
                "React Router",
                "Redux Toolkit",
                "React Query",
                "React Hook Form + Zod",
                "Tailwind CSS + Shadcn UI",
                "Axios",
                "Socket.io (client)",
                "TypeScript",
              ]}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Backend</h3>
            <List
              items={[
                "Node.js + Express.js",
                "MongoDB + Mongoose",
                "Passport.js (Local & Google OAuth)",
                "Multer for file uploads",
                "Cloudinary for media storage",
                "Socket.io (server)",
                "TypeScript",
                "Zod for schema validation",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="✨ Features">
        <div className="flex flex-col gap-2">
          {features.map(({ icon, title, description }, index) => (
            <div key={index}>
              {icon} <strong>{title}</strong> — {description}
            </div>
          ))}
        </div>
      </Section>
      <Footer />
    </div>
  );
};
