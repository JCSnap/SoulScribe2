import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const TimeUntilNextMonthlyRecap = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextMonth());

  function getTimeUntilNextMonth() {
    const now = new Date();

    // Create a new date object for the first day of the next month at 00:00:00
    const nextMonth = new Date(
      now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear(),
      (now.getMonth() + 1) % 12,
      1
    );
    nextMonth.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const diffMs = nextMonth.getTime() - now.getTime();

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
      setTimeLeft(getTimeUntilNextMonth());
    }, 1000); // Update every second

    // Clear interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <View className="items-center w-screen">
      <Text className="pb-5 text-md">
        Time until next Monthly Recap Generation:
      </Text>
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

export default TimeUntilNextMonthlyRecap;
