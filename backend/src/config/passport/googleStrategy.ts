import createHttpError from "http-errors";
import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { User, USER_SELECT_ALL_FIELDS } from "../../models/user.model";

export const configureGoogleStrategy = (passport: PassportStatic) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.BASE_URL;

  if (!clientID) {
    throw new createHttpError.InternalServerError(
      "GOOGLE_CLIENT_ID is required",
    );
  }

  if (!clientSecret) {
    throw new createHttpError.InternalServerError(
      "GOOGLE_CLIENT_SECRET is required",
    );
  }

  if (!baseUrl) {
    throw new createHttpError.InternalServerError("BASE_URL is required");
  }

  const callbackURL = `${baseUrl}/api/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id })
            .select(USER_SELECT_ALL_FIELDS)
            .exec();

          if (!user) {
            const email = profile.emails?.[0].value;
            const avatar = profile.photos?.[0].value;

            if (!email) {
              throw new createHttpError.InternalServerError(
                "No email found in the Google profile (Google OAuth)",
              );
            }

            // TODO: Save the avatar in cloudinary

            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              avatar,
            });
          }

          return done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
};
