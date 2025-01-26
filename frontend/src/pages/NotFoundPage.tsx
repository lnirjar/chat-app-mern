import { Helmet } from "react-helmet";
import { APP_NAME } from "@/lib/constants";

export const NotFoundPage = () => {
  return (
    <div>
      <Helmet>
        <title>404 | {APP_NAME}</title>
      </Helmet>
      <h1>404 - Page Not Found</h1>
    </div>
  );
};
