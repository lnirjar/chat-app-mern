export const TOAST_MESSAGES = {
  // Generic
  LOADING: "Loading...",
  UPDATING: "Updating...",
  SAVING: "Saving...",
  ERROR_SOMETHING_WENT_WRONG: "Something went wrong.",

  // Auth
  LOGIN_LOADING: "Logging in...",
  LOGIN_SUCCESS: "Login successful.",
  LOGIN_ERROR_USERNAME_EMAIL_NOT_FOUND:
    "No account found with this username or email. Please sign up if you don't already have an account.",
  LOGIN_ERROR_INVALID_PASSWORD: "Invalid password. Please try again.",

  SIGNUP_LOADING: "Signing up...",
  SIGNUP_SUCCESS: "Welcome aboard! Your account has been created successfully.",
  SIGNUP_ERROR_EXISTING_EMAIL:
    "This email is already registered. Please use a different email or log in.",

  LOGOUT_LOADING: "Logging out...",
  LOGOUT_SUCCESS: "You've been successfully logged out.",

  // Profile
  UPDATE_NAME_LOADING: "Updating your name...",
  UPDATE_NAME_SUCCESS: "Your name has been updated.",
  UPDATE_NAME_ERROR: "Failed to update your name. Please try again.",
  UPDATE_EMAIL_LOADING: "Updating your email...",
  UPDATE_EMAIL_SUCCESS: "Your email address has been updated.",
  UPDATE_EMAIL_ERROR: "Failed to update your email address. Please try again.",
  UPDATE_USERNAME_LOADING: "Updating your username...",
  UPDATE_USERNAME_SUCCESS: "Your username has been updated.",
  UPDATE_USERNAME_ERROR: "Failed to update your username. Please try again.",
  UPDATE_AVATAR_LOADING: "Updating your avatar...",
  UPDATE_AVATAR_SUCCESS: "Your avatar has been updated.",
  UPDATE_AVATAR_ERROR: "Failed to update your avatar. Please try again.",

  // Account
  CHANGE_PASSWORD_LOADING: "Updating your password...",
  CHANGE_PASSWORD_SUCCESS: "Your password has been changed.",
  CHANGE_PASSWORD_ERROR: "Failed to change your password. Please try again.",
  CHANGE_PASSWORD_ERROR_INVALID_PASSWORD:
    "Invalid Current Password. Please try again.",

  DELETE_ACCOUNT_LOADING: "Deleting your account...",
  DELETE_ACCOUNT_SUCCESS: "Your account has been deleted.",
  DELETE_ACCOUNT_ERROR: "Failed to delete your account. Please try again.",
  DELETE_ACCOUNT_ERROR_INVALID_PASSWORD: "Invalid Password. Please try again.",
};
