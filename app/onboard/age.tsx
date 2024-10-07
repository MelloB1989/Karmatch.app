import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import * as Animatable from "react-native-animatable";
import { User } from "@/types";
import DOB from "./dob";
import PreferredLanguagesScreen from "./languages";
import Bio from "./bio";

export default function GenderSelectionScreen() {
  const [userData, setUserData] = useState<User>({
    kid: "",
    username: "",
    full_name: "",
    email: "",
    phone: "",
    age: 0,
    date_of_birth: "",
    gender: "",
    location: "",
    country: "",
    languages: [],
    primary_language: "",
    profile_picture: "",
    gallery: [],
    bio: "",
    social_media: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
    },
  });
  const [current, setCurrent] = useState("age");

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const changeCurrent = (newCurrent: string) => {
    setCurrent(newCurrent);
  };

  const updateUser = (newData: User) => {
    setUserData(newData);
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
  ];

  const Age = () => {
    return (
      <View style={styles.container}>
        {/* Profile Icon */}
        <Animatable.View
          animation="fadeInDown"
          style={styles.profileIconContainer}
        >
          <Image
            source={
              userData.gender === "male"
                ? require("../../assets/images/Mark.jpg")
                : require("../../assets/images/Lisa.jpg")
            } // Replace with your profile icon URL
            style={styles.profileIcon}
          />
        </Animatable.View>

        {/* Title */}
        <Animatable.Text animation="fadeIn" delay={500} style={styles.title}>
          Select Your Gender
        </Animatable.Text>

        {/* Gender Picker */}
        <Animatable.View
          animation="fadeInUp"
          delay={800}
          style={styles.pickerContainer}
        >
          <RNPickerSelect
            onValueChange={(value) =>
              setUserData({
                ...userData,
                gender: value,
              })
            }
            items={genderOptions}
            style={{
              inputIOS: {
                color: "#FFF",
                fontSize: 18,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: "#d63384",
                borderRadius: 10,
                backgroundColor: "#1a1a1a",
                textAlign: "center",
                width: 200,
                alignSelf: "center",
              },
              inputAndroid: {
                color: "#FFF",
                fontSize: 18,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: "#d63384",
                borderRadius: 10,
                backgroundColor: "#1a1a1a",
                textAlign: "center",
                width: 200,
                alignSelf: "center",
              },
            }}
            placeholder={{ label: userData.gender, value: userData.gender }}
            useNativeAndroidPickerStyle={false}
            Icon={() => null}
          />
        </Animatable.View>

        {/* Continue Button */}
        <Animatable.View
          animation="fadeInUp"
          delay={1000}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              if (userData.gender === "") {
                alert("Please select a gender");
              } else {
                setCurrent("dob");
              }
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  };

  return current === "age" ? (
    <Age />
  ) : current === "dob" ? (
    <DOB user={userData} setUser={updateUser} changeCurrent={changeCurrent} />
  ) : current === "languages" ? (
    <PreferredLanguagesScreen
      user={userData}
      setUser={updateUser}
      changeCurrent={changeCurrent}
    />
  ) : current === "bio" ? (
    <Bio user={userData} setUser={updateUser} changeCurrent={changeCurrent} />
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIconContainer: {
    position: "absolute",
    top: 50,
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
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#d63384",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
