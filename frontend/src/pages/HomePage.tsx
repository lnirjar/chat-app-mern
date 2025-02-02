import { Helmet } from "react-helmet";
import { APP_NAME } from "@/lib/constants";
import { DashboardPage } from "@/pages/DashboardPage";

export const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>Home | {APP_NAME}</title>
      </Helmet>
      <DashboardPage />
    </div>
  );
};
