import * as Linking from "expo-linking";
import { fetchAPI } from "./fetch";

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, signUp, setActive } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home", {
        scheme: "myapp",
      }),
    });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });

        if (signUp.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }

        return {
          success: true,
          code: "SUCCESS",
          message: "You have successfully authenticated",
        };
      }
    }

    return {
      success: false,
      code: "SUCCESS",
      message: "An error occured",
    };
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      code: error.code,
      message: error?.errors[0]?.longMessage,
    };
  }
};
