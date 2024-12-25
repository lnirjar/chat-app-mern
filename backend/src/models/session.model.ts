import mongoose, { InferSchemaType, Schema } from "mongoose";

const sessionSchema = new Schema({
  session: {
    passport: {
      user: Schema.Types.ObjectId,
    },
  },
});

sessionSchema.index({ "session.passport.user": 1 });

export type SessionModel = InferSchemaType<typeof sessionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SessionModel = mongoose.model("Session", sessionSchema);
