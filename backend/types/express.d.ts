import { Document } from "mongoose";
import { User as UserType } from "../src/models/user.model";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends UserType, Document<unknown, {}, UserType> {}
  }
}
