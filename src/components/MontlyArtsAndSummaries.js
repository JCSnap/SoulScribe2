import React, { useEffect } from "react";
import { View, Text, Image, Button, ScrollView, Alert } from "react-native";
import getUserData from "../utils/getUserData";
import TimeUntilNextMonthlyRecap from "./TimeUntilNextMonthlyRecap";

/**
 * Component displaying weekly arts and summaries generated based on entries.
 */
const MonthlyArtsAndSummaries = ({ isActiveMonthlyRecap, backToDefault }) => {
  // Define state variables for arts and summaries data and loading state
  const [artsAndSummaries, setArtsAndSummaries] = React.useState([
    {
      art: "",
      summary: "",
      endDate: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Set the start and end dates for the weekly summary
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1000); // Set start date as 7 days ago
  const endDate = new Date(); // Set end date as today
  endDate.setHours(endDate.getHours() + 8);

  useEffect(() => {
    console.log(isActiveMonthlyRecap);
    if (isActiveMonthlyRecap) {
      console.log("Weekly recap is active");
      renderMonthlySummary();
    }
  }, [isActiveMonthlyRecap]);

  /**
   * Render weekly summary and update the artsAndSummaries state.
   */
  const renderMonthlySummary = async () => {
    try {
      // Fetch user data
      const user = await getUserData();
      // Get weekly arts and summaries data
      const artsAndSummaries = await user.getMonthlyArtsAndSummaries(
        startDate,
        endDate
      );
      if (artsAndSummaries.length === 0) {
        Alert.alert(
          "No monthly summaries",
          "You have no monthly summaries yet, please enter some journal entries! Monthly summaries will be automatically generated at the end of each month."
        );
        backToDefault();
        return;
      }
      // Update state with fetched data
      setArtsAndSummaries(artsAndSummaries);
      setIsLoading(false); // Set loading state to false
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while fetching monthly recaps, please try again! " +
          error.message
      );
    }
  };

  const backToRecap = () => {
    setIsLoading(true);
    backToDefault();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: isLoading ? "center" : "space-between",
        flex: isLoading ? 1 : 0,
      }}
      style={{ backgroundColor: "fuchsia-50" }}
    >
      {/* Display loading message if data is still loading */}
      {isLoading ? (
        <View>
          <TimeUntilNextMonthlyRecap />
          <Image
            source={require("../assets/low_poly_folder.png")}
            className=" w-24 h-24 self-center"
          />
        </View>
      ) : (
        // Map over artsAndSummaries array and display each item
        <View className="items-center">
          <Button title="Back" onPress={backToRecap} />
          {artsAndSummaries.map((item, index) => {
            // Convert endDate to a Date object
            const endDateObject = item.endDate.toDate();

            const month = endDateObject.toLocaleString("default", {
              month: "long",
            });

            const year = endDateObject.getFullYear();

            return (
              <View key={index} className="flex-1 items-center">
                {/* Display the date range */}
                <Text className="text-xl font-bold mt-2">
                  {month} {year}
                </Text>

                {/* Display the art image */}
                <Image
                  source={{ uri: item.art }}
                  style={{ width: 250, height: 250 }}
                  onLoad={() => console.log("Image loaded!")}
                  onError={(error) => console.log("Image error: ", error)}
                  className="my-2"
                />

                {/* Display the summary text */}
                <Text className="text-sm font-bold text-justify leading-4 px-3">
                  {item.summary}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default MonthlyArtsAndSummaries;
