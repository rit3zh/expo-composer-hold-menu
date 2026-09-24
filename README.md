# expo-composer-hold-menu

**ChatGPT-style** chat composer with a press-and-hold photo menu for React Native.

---

## ⚙️ Installation

```bash
git clone https://github.com/rit3zh/expo-composer-hold-menu
cd expo-composer-hold-menu
bun install
bunx expo prebuild
bun ios
```

Peer dependencies (already set up in this template):

```bash
bunx expo install react-native-reanimated react-native-worklets react-native-gesture-handler react-native-keyboard-controller react-native-safe-area-context react-native-svg expo-media-library expo-image expo-glass-effect expo-linear-gradient expo-backdrop
```

---

## 🚀 Usage

Wrap your app once in `GestureHandlerRootView` and `KeyboardProvider`.

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider enabled>
        <Stack screenOptions={{ headerShown: false }} />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
```

Then drop the composer into any screen:

```tsx
import { Composer } from '@/components';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export function Example() {
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Composer
        value={message}
        onChangeText={setMessage}
        onPhotoSelect={(photo) => console.log('attached', photo.uri)}
      />
    </KeyboardAvoidingView>
  );
}
```

## Preview

<!-- add your recording here -->

---

## 🧩 API

### `<Composer>`

| Prop             | Type                            | Default               | Description                                           |
| ---------------- | ------------------------------- | --------------------- | ----------------------------------------------------- |
| `value`          | `string`                        | none                  | Text in the input.                                    |
| `onChangeText`   | `(text: string) => void`        | none                  | Called when the text changes.                         |
| `placeholder`    | `string`                        | `"Ask ChatGPT"`       | Placeholder for the input.                            |
| `recentPhotos`   | `readonly TRecentPhoto[]`       | latest library photos | Photos shown in the hold menu. Overrides the library. |
| `onAttachPress`  | `() => void`                    | none                  | Called when the `+` button is tapped.                 |
| `onPhotoSelect`  | `(photo: TRecentPhoto) => void` | none                  | Called when a photo is attached from the hold menu.   |
| `onDictatePress` | `() => void`                    | none                  | Called when the microphone button is pressed.         |
| `onVoicePress`   | `() => void`                    | none                  | Called when the voice mode button is pressed.         |
| `style`          | `StyleProp<ViewStyle>`          | none                  | Style for the outer container.                        |

### Photo object (`TRecentPhoto`)

| Field | Type     | Description                                    |
| ----- | -------- | ---------------------------------------------- |
| `id`  | `string` | Required. Unique key for the photo.            |
| `uri` | `string` | Required. Image source passed to `expo-image`. |

---

## 🧱 Stack

[Expo SDK 57](https://expo.dev/changelog) · [React Native 0.86](https://reactnative.dev/) · [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) · [Worklets](https://docs.swmansion.com/react-native-worklets/) · [Gesture Handler 2](https://docs.swmansion.com/react-native-gesture-handler/) · [Keyboard Controller](https://kirillzyusko.github.io/react-native-keyboard-controller/) · [expo-glass-effect](https://docs.expo.dev/versions/latest/sdk/glass-effect/) · [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/) · [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) · [react-native-svg](https://github.com/software-mansion/react-native-svg) · [Expo Router](https://docs.expo.dev/router/introduction/)

---
