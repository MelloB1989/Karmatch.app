import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { User } from "@/types";

export default function PreferredLanguagesScreen({
  user,
  setUser,
  changeCurrent,
}: {
  user: User;
  setUser: (data: any) => void;
  changeCurrent: (current: string) => void;
}) {
  const languages = [
    "English",
    "Telugu",
    "Hindi",
    "Marathi",
    "Gujrati",
    "German",
    "Punjabi",
    "Japanese",
  ];
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [primaryLanguage, setPrimaryLanguage] = useState(null);

  const toggleLanguage = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language],
    );
  };

  const selectPrimaryLanguage = (language) => {
    setPrimaryLanguage(language);
  };

  const handleContinue = () => {
    if (!primaryLanguage) {
      Alert.alert("Please select a primary language.");
    } else if (selectedLanguages.length === 0) {
      Alert.alert("Please select at least one preferred language.");
    } else {
      setUser({
        ...user,
        primary_language: primaryLanguage,
        languages: selectedLanguages,
      });
      changeCurrent("bio");
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Select Your Preferred Languages</Text>

      {/* Preferred Languages (Tiles) */}
      <ScrollView
        style={styles.languageList}
        contentContainerStyle={styles.languageContainer}
      >
        {languages.map((language) => (
          <TouchableOpacity
            key={language}
            style={[
              styles.languageTile,
              selectedLanguages.includes(language) && styles.selectedTile,
            ]}
            onPress={() => toggleLanguage(language)}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguages.includes(language) && styles.selectedText,
              ]}
            >
              {language}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Primary Language (Tiles) */}
      <Text style={styles.primaryTitle}>Select Primary Language</Text>
      <View style={styles.languageContainer}>
        {selectedLanguages.map((language) => (
          <TouchableOpacity
            key={language}
            style={[
              styles.primaryTile,
              primaryLanguage === language && styles.selectedTile,
            ]}
            onPress={() => selectPrimaryLanguage(language)}
          >
            <Text
              style={[
                styles.languageText,
                primaryLanguage === language && styles.selectedText,
              ]}
            >
              {language}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  languageList: {
    width: "100%",
    marginBottom: 30,
  },
  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  languageTile: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#d63384",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  selectedTile: {
    backgroundColor: "#d63384",
  },
  languageText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  selectedText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  primaryTitle: {
    color: "#FFF",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  primaryTile: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#d63384",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  continueButton: {
    backgroundColor: "#d63384",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 30,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
