import { NativeWindStyleSheet } from "nativewind";
import React from "react";
import { ThemeProvider } from "react-native-elements";
import "./src/backend/firebase/firebase";
import RootNavigation from "./src/navigation";
import "react-native-url-polyfill/auto";
import "text-encoding-polyfill";
import { Provider } from "react-redux";
import store from "./src/redux/Store";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigation></RootNavigation>
      </ThemeProvider>
    </Provider>
  );
}
