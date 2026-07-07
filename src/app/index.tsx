import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppleInvites from "./AppleInvites";

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppleInvites />
    </GestureHandlerRootView>
  )
}

