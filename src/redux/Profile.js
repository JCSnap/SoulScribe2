import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    bg_colour: "bg-fuchsia-50",
    username: "",
    gender: "",
    email: "",
    art_selected: "",
    coins: 0,
    entries: 0,
    loaded: false,
  },
  reducers: {
    changeColour: (state, action) => {
      state.bg_colour = action.payload;
    }, 
    changeUsername: (state, action) => {
      state.username = action.payload;
    }, 
    changeGender: (state, action) => {
      state.gender = action.payload;
    }, 
    setEmail: (state, action) => {
      state.email = action.payload;
    }, 
    changeArtSelected: (state, action) => {
      state.art_selected = action.payload;
    }, 
    changeCoins: (state, action) => {
      state.coins = action.payload;
    }, 
    addCoins: (state, action) => {
      state.coins += action.payload;
    }, 
    deductCoins: (state, action) => {
      state.coins -= action.payload;
    }, 
    changeEntries: (state, action) => {
      state.entries = action.payload;
    }, 
    addDailyEntry: (state) => {
      state.entries += 1;
    }, 
    setLoaded: (state) => {
      state.loaded = true;
    }, 
    reset: (state) => {
      state.bg_colour = "bg-fuchsia-50";
      state.username = "";
      state.gender = "";
      state.email = "";
      state.art_selected = "";
      state.coins = 0;
      state.entries = 0;
      state.loaded = false;
      console.log("reset!");
    },
  }
});

// Action creators are generated for each case reducer function
export const { 
  reset,
  addDailyEntry,
  changeEntries,
  changeColour, 
  changeUsername, 
  changeGender,
  setEmail, 
  changeArtSelected, 
  changeCoins, 
  addCoins,
  deductCoins,
  setLoaded } = profileSlice.actions;

export default profileSlice.reducer;