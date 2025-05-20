import store from "@/redux/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}

