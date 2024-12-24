import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomePage() {
  return (
    <View>
      <Text>Trang chủ</Text>
      <Link
        href="/RecordScreen"
        style={{ marginTop: 20, color: "blue", fontSize: 18 }}
      >
        Bắt đầu ghi
      </Link>
      <Link
        href={{
          pathname: "/PlayRecord",
          params: { recordId: "9UELvWdBNpsb02gf2byk" },
        }}
        style={{ marginTop: 20, color: "blue", fontSize: 18 }}
      >
        Xem bản ghi
      </Link>
      <Link
        href="/components/DropdownComponent"
        style={{ marginTop: 20, color: "blue", fontSize: 18 }}
      >
        Test Component
      </Link>
      <Link href="/Screens/Welcome/OnboardingScreens">Onboarding</Link>
      <Link href="/Screens/Login/LoginScreen">Login</Link>
      <Link href="/Screens/Register/RegisterScreen">Register</Link>
      <Link href="/Screens/Home/HomeScreen">HomeScreen</Link>
    </View>
  );
}
