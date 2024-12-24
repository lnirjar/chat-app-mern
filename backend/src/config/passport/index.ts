import { PassportStatic } from "passport";

import { configureGoogleStrategy } from "./googleStrategy";
import { configureLocalStrategy } from "./localStrategy";
import { User, USER_SELECT_ALL_FIELDS } from "../../models/user.model";

export const configurePassport = (passport: PassportStatic) => {
  configureGoogleStrategy(passport);
  configureLocalStrategy(passport);

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
        .select(USER_SELECT_ALL_FIELDS)
        .exec();
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
