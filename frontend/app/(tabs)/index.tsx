// // index.tsx
// import { useEffect, useContext } from "react";
// import { AuthContext } from "../AuthContext";
// import { useRouter } from "expo-router";
// import { View, Text } from "react-native";

// export default function Index() {
//   const router = useRouter();
//   const { userToken } = useContext(AuthContext);

//   useEffect(() => {
//     if (userToken) {
//       router.replace("/(tabs)");
//     } else {
//       router.replace("/login");
//     }
//   }, [userToken]);

//   return (
//     <View>
//       <Text>Loading...</Text>
//     </View>
//   );
// }
