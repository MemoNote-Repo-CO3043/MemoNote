import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function HomePage() {
  return (
    <View>
      <Text>Trang chủ</Text>
      <Link href="/cameranote" style={{ marginTop: 20, color: "blue", fontSize: 18 }}>
        Bắt đầu ghi
      </Link>
      <Link href="/playrecord" style={{ marginTop: 20, color: "blue", fontSize: 18 }}>
        Xem bản ghi
      </Link>
    </View>
  );
}
