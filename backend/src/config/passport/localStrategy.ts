import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

import { User, USER_SELECT_ALL_FIELDS } from "../../models/user.model";

export const configureLocalStrategy = (passport: PassportStatic) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "usernameOrEmail" },
      async (usernameOrEmail, password, done) => {
        try {
          const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
          })
            .select(USER_SELECT_ALL_FIELDS)
            .exec();

          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.password) {
            return done(null, false, {
              message:
                "It looks like you signed up with Google. Please log in using Google, or reset your password to set a new one.",
            });
          }

          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};
