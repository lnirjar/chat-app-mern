import createHttpError from "http-errors";
import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UploadApiResponse } from "cloudinary";
import mongoose from "mongoose";

import { User, USER_SELECT_ALL_FIELDS } from "../../models/user.model";
import { uploadAvatarToCloudinary } from "../../utils/cloudinary.utils";
import { getAvatarWithInitials } from "../../utils/avatar.utils";

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
          const existingUser = await User.findOne({ googleId: profile.id })
            .select(USER_SELECT_ALL_FIELDS)
            .exec();

          if (existingUser) {
            return done(null, existingUser);
          }

          const email = profile.emails?.[0].value;
          const googleAvatar = profile.photos?.[0].value;

          if (!email) {
            throw new createHttpError.InternalServerError(
              "No email found in the Google profile (Google OAuth)",
            );
          }

          const _id = new mongoose.Types.ObjectId();

          // Save the avatar in cloudinary
          let uploadResult: UploadApiResponse | undefined;
          if (googleAvatar) {
            const avatarUrl = googleAvatar.split("=")[0] + "=s512-c";
            uploadResult = await uploadAvatarToCloudinary(
              avatarUrl,
              _id.toString(),
            );
          }

          const user = await User.create({
            _id,
            googleId: profile.id,
            name: profile.displayName,
            email,
            avatar: googleAvatar
              ? uploadResult?.secure_url
              : getAvatarWithInitials(profile.displayName),
          });

          return done(null, user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
};
