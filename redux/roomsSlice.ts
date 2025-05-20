import { createSlice } from "@reduxjs/toolkit";


const initialState : any[]= [];

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
setRoom: (_state, action) => {
  return action.payload;
}

  },
});

export const { setRoom} = roomsSlice.actions;

export const selectRooms = (state : any) => state.rooms;

export default roomsSlice.reducer;
