import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const features = [
  "Supports Group Chats and DMs",
  "Create Multiple Workspaces",
  "Join a workspace using invitation links",
];

export const LandingPage = () => {
  return (
    <div className="px-16">
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      <h1 className="text-4xl font-bold mb-4">Chat App (MERN Stack)</h1>

      <h2 className="text-2xl font-bold mb-2">Features</h2>
      <ul className="mb-4">
        {features.map((feature, i) => (
          <li key={i}>✔ {feature}</li>
        ))}
      </ul>

      <Button asChild>
        <Link to="/signup" className="[&.active]:hidden animate-fade-in">
          Get Started
        </Link>
      </Button>
      <p className="typography-lead max-w-prose"></p>
      <p className="max-w-prose"></p>
    </div>
  );
};
