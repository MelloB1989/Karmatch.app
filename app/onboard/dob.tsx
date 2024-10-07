import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { User } from "@/types";

export default function DateOfBirthScreen({
  user,
  setUser,
  changeCurrent,
}: {
  user: User;
  setUser: (data: any) => void;
  changeCurrent: (current: string) => void;
}) {
  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2000");

  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 100 }, (_, i) => (2024 - i).toString());

  const handleContinue = () => {
    setUser({
      ...user,
      date_of_birth: `${selectedDay}-${selectedMonth}-${selectedYear}`,
    });
    changeCurrent("languages");
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <Image
        source={
          user.gender === "male"
            ? require("../../assets/images/Mark.jpg")
            : require("../../assets/images/Lisa.jpg")
        }
        style={styles.profileIcon}
      />

      <Text style={styles.title}>Select Your Date of Birth</Text>

      {/* Date Picker */}
      <Animated.View style={[styles.pickerContainer, { opacity: fadeAnim }]}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedDay}
            onValueChange={(itemValue) => setSelectedDay(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode="dropdown" // Dropdown mode looks better on Android
          >
            {days.map((day) => (
              <Picker.Item key={day} label={day} value={day} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode="dropdown" // Dropdown mode looks better on Android
          >
            {months.map((month) => (
              <Picker.Item key={month} label={month} value={month} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode="dropdown" // Dropdown mode looks better on Android
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>
      </Animated.View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark Mode Background
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    width: 150,
    height: 150,
    borderRadius: 40,
    marginBottom: 30,
    borderColor: "#FF1493", // Dark Pink Primary Color
    borderWidth: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  pickerWrapper: {
    width: 80,
    height: Platform.OS === "android" ? 120 : 150, // Shorter height on Android
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    paddingTop: Platform.OS === "android" ? 0 : 10, // Android padding adjustment
  },
  picker: {
    width: Platform.OS === "android" ? 110 : 100,
    height: Platform.OS === "android" ? 120 : 150, // Adjust height for Android
    color: "#FF1493",
  },
  pickerItem: {
    color: "#FFFFFF",
    fontSize: Platform.OS === "android" ? 14 : 16, // Smaller font size for Android
  },
  continueButton: {
    backgroundColor: "#FF1493",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
