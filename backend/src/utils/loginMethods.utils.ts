import { User } from "../models/user.model";

export type LoginMethods = ("google" | "password")[];

export const getLoginMethods = (userObj: User) => {
  const loginMethods: LoginMethods = [];

  if (userObj.googleId) {
    loginMethods.push("google");
  }

  if (userObj.password) {
    loginMethods.push("password");
  }

  return loginMethods;
};
