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
      `say goodbye to '${perfumeName.toUpperCase()}'?`,
      `This perfume is ready to leave if you are. 🥹"`,
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
