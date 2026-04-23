import { useMyPerfume } from "@/src/context/MyPerfumeContext";
import { Alert } from "react-native";

export const usePerfumeActions = () => {
  const { toggleHave } = useMyPerfume();

  // Shelf - common delete
  const confirmRemove = (
    perfId: string,
    perfumeName: string,
    onAfterRemove?: () => void,
  ) => {
    Alert.alert(
      `Say Goodbye to...`,
      `${perfumeName.toUpperCase()} 🥹`,
      [
        { text: "Not yet", style: "cancel" },
        {
          text: "Goodbye",
          style: "destructive",
          onPress: () => {
            toggleHave(perfId);
            if (onAfterRemove) onAfterRemove();
          },
        },
      ],
      { cancelable: true }, // Android - Allows closing the alert by tapping outside
    );
  };

  return { confirmRemove };
};
