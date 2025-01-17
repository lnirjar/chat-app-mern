export const MEMBER = "member";
export const OWNER = "owner";
export const ADMIN = "admin";

export const PUBLIC = "public";
export const PRIVATE = "private";
export type Visibility = typeof PUBLIC | typeof PRIVATE;

export const GROUP = "group";
export const DM = "dm";
export type ChatType = typeof GROUP | typeof DM;
