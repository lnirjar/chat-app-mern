import { Document } from "mongoose";
import { User } from "../src/models/user.model";

declare global {
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      user: User & Document<unknown, {}, User>;
    }
  }
}
