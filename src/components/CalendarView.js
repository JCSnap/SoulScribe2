import React, { useState } from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import getUserData from "../utils/getUserData";
import { Dimensions } from "react-native";

const CalendarView = ({ onDayPress, datesWithEntry }) => {
  return (
    <Calendar
      onDayPress={(date) => {
        onDayPress(date);
      }}
      markedDates={datesWithEntry}
      style={{
        width: Dimensions.get("window").width,
        height: 380,
      }}
      className=" bg-fuchsia-50"
    />
  );
};

export default CalendarView;
