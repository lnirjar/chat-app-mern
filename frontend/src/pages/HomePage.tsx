import { Helmet } from "react-helmet";
import { useAppSelector } from "@/hooks/react-redux-hooks";
import { APP_NAME } from "@/lib/constants";

export const HomePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (user) {
    return (
      <div>
        <Helmet>
          <title>Home | {APP_NAME}</title>
        </Helmet>
        <h1>Data from the Store</h1>
        {user ? (
          <>
            {user.avatar && (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-32 rounded-full"
              />
            )}
            <ul>
              <li>Name: {user.name}</li>
              <li>Email: {user.email}</li>
              <li>Username: {user.username}</li>
              <li>LastPasswordChange: {user.lastPasswordChange}</li>
            </ul>
          </>
        ) : (
          <p>User Not Found</p>
        )}
      </div>
    );
  }
};
