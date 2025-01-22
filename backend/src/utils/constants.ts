export const MEMBER = "member";
export const OWNER = "owner";
export const ADMIN = "admin";

export const PUBLIC = "public";
export const PRIVATE = "private";
export type Visibility = typeof PUBLIC | typeof PRIVATE;

export const GROUP = "group";
export const DM = "dm";
export type ChatType = typeof GROUP | typeof DM;

export const SEND_MESSAGE = "send_message";
export const RECEIVE_MESSAGE = "receive_message";
export const EDIT_MESSAGE = "edit_message";
export const DELETE_MESSAGE = "delete_message";
export const JOIN_CHAT_ROOM = "join_chat_room";
