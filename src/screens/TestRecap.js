/**
 * Test Recap Screen: An interface for users to try out how a recap is being generated right away from their response.
 */

import React, { useState, useEffect } from "react";
import { DefaultScrollView } from "../components/View";
import { Alert, View, Text, Image } from "react-native";
import * as Progress from "react-native-progress";
import createAndUploadDailySummary from "../utils/createAndUploadDailySummary";
import createAndUploadSentence from "../utils/createAndUploadSentence";
import createAndUploadArt from "../utils/createAndUploadArt";
import getUserData from "../utils/getUserData";

const TestRecap = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0.1);
  const [status, setStatus] = useState("Starting...");
  const [summary, setSummary] = useState(null);
  const [art, setArt] = useState(null);

  const date = route.params?.date;

  const createDailySummary = async () => {
    setStatus("Generating summary...");
    await createAndUploadDailySummary(date);
  };

  const createHighlight = async () => {
    setStatus("Extracting highlight...");
    await createAndUploadSentence("day", date);
  };

  const createArt = async () => {
    setStatus("Generating art...");
    const userData = await getUserData();
    const artStyle = await userData.getStyle();
    await createAndUploadArt("day", date, artStyle);
  };

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  useEffect(() => {
    if (isLoading) {
      const generateRecap = async () => {
        try {
          await createDailySummary();
          setProgress(0.5);
          await createHighlight();
          setProgress(0.8);
          await createArt();
          setProgress(1);
          setIsLoading(false);
          await sleep(1000); // sleep for 1 second
        } catch (error) {
          Alert.alert(
            "Error",
            "An error occurred while generating recap. Sometimes the recap takes several attempts to load, so please try again! " +
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Write"),
                },
              ]
          );
        }
      };
      generateRecap();
    } else {
      const setData = async () => {
        try {
          const userData = await getUserData();
          const summaryDoc = await userData.getSummaryDoc("day", date);
          const art = summaryDoc.art;
          const summary = summaryDoc.summary;
          setSummary(summary);
          setArt(art);
        } catch (error) {
          Alert.alert(
            "Error",
            "An error occurred while trying to retrieve data: " + error.message,
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Write"),
              },
            ]
          );
        }
      };
      setData();
    }
  }, [isLoading]);

  return (
    <DefaultScrollView>
      {isLoading ? (
        <View className="flex-1 items-center">
          <Text className="font-bold text-lg">
            We are processing your entry!
          </Text>
          <Progress.Bar progress={progress} width={200} />
          <Text className="font-bold">{status}</Text>
        </View>
      ) : (
        <>
          {/* Format date as string */}
          {(() => {
            const readableDate = date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <View className="flex-1 items-center">
                {/* Display the date */}
                <Text className="text-xl font-bold mt-2">{readableDate}</Text>

                {/* Display the art image */}
                <Image
                  source={{ uri: art }}
                  style={{ width: 250, height: 250 }}
                  onLoad={() => console.log("Image loaded!")}
                  onError={(error) => console.log("Image error: ", error)}
                  className="my-2"
                />

                {/* Display the summary text */}
                <Text className="text-sm font-bold text-justify leading-4 px-3">
                  {summary}
                </Text>
                <Text className="text-sm pt-5">
                  This is a taste of how art and summary will be generated every
                  week from your entries!
                </Text>
              </View>
            );
          })()}
        </>
      )}
    </DefaultScrollView>
  );
};

export default TestRecap;
