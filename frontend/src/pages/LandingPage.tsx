import { Helmet } from "react-helmet";
import { APP_NAME } from "@/lib/constants";

export const LandingPage = () => {
  return (
    <div className="">
      <Helmet>
        <title>Landing | {APP_NAME}</title>
      </Helmet>
      <h1>Landing Page</h1>
      <p className="typography-lead max-w-prose">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam commodi
        dicta nostrum sed! Modi commodi soluta eum expedita accusamus pariatur
        exercitationem voluptatum nulla cumque, deleniti molestiae voluptate
        neque tempora repudiandae.
      </p>
      <p className="max-w-prose">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi neque nisi
        quos hic culpa, ipsum quis aspernatur veniam fugit animi! Quod repellat
        maxime repudiandae quas fugit doloribus cum et eum.
      </p>
    </div>
  );
};
