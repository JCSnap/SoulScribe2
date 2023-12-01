import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const TimeUntilNextWeeklyRecap = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextMonday());

  function getTimeUntilNextMonday() {
    const now = new Date();
    const dayOfWeek = now.getDay() == 0 ? 6 : now.getDay() - 1; // 0 (Sunday) to 6 (Saturday)
    const daysUntilNextMonday = (7 - dayOfWeek) % 7 || 7; // This gives 1 for Sunday, 7 for Monday, 6 for Tuesday, etc.

    // Create a new date object for next Monday at 00:00:00
    const nextMonday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextMonday
    );
    nextMonday.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const diffMs = nextMonday.getTime() - now.getTime();

    // Convert to hours, minutes, and seconds
    const diffSecs = Math.floor(diffMs / 1000);
    const seconds = diffSecs % 60;
    const diffMins = Math.floor(diffSecs / 60);
    const minutes = diffMins % 60;
    const diffHrs = Math.floor(diffMins / 60);
    const hours = diffHrs % 24;
    const days = Math.floor(diffHrs / 24);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextMonday());
    }, 1000); // Update every second

    // Clear interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <View className="items-center w-screen">
      <Text className="pb-5 text-md">Time until next Recap Generation:</Text>
      <View className="flex-row justify-between w-full px-10">
        <View className="items-center">
          <Text className="text-lg">Days</Text>
          <Text className="text-xl font-bold">{timeLeft.days}</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg">Hours</Text>
          <Text className="text-xl font-bold">{timeLeft.hours}</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg">Minutes</Text>
          <Text className="text-xl font-bold">{timeLeft.minutes}</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg">Seconds</Text>
          <Text className="text-xl font-bold">{timeLeft.seconds}</Text>
        </View>
      </View>
    </View>
  );
};

export default TimeUntilNextWeeklyRecap;
