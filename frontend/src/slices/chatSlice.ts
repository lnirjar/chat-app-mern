import { ChatType, MemberRole, Visibility } from "@/lib/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Chat {
  _id: string;
  name: string;
  visibility: Visibility;
  chatType: ChatType;
  role: MemberRole;
  members?: { user: { name: string; _id: string } }[];
}

type InitialState = {
  allChats: Chat[];
  currentChat: Chat | null;
};

const initialState: InitialState = {
  allChats: [],
  currentChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAllChats: (state, action: PayloadAction<Chat[]>) => {
      const chats = action.payload;
      state.allChats = chats;
      if (chats.length !== 0) {
        state.currentChat = chats[0];
      } else {
        state.currentChat = null;
      }
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      const chat = action.payload;
      state.allChats.push(chat);
      state.currentChat = chat;
    },
    removeChat: (state, action: PayloadAction<Chat>) => {
      const filteredChats = state.allChats.filter(
        (chat) => chat._id !== action.payload._id,
      );

      state.allChats = filteredChats;

      if (filteredChats.length === 0) {
        state.currentChat = null;
      } else if (action.payload._id === state.currentChat?._id) {
        state.currentChat = filteredChats[0];
      }
    },
    setCurrentChat: (state, action: PayloadAction<Chat>) => {
      const chat = action.payload;
      state.currentChat = chat;
    },
  },
});

export default chatSlice.reducer;
export const chatActions = chatSlice.actions;
