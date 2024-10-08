import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadFile } from "@/lib/functions";
import { User } from "@/types";
import axios from "axios";
import { config } from "@/config";
import { useSession } from "../ctx";
import { router } from "expo-router";

export default function ProfileSetupScreen({
  user,
  setUser,
  changeCurrent,
}: {
  user: User;
  setUser: (data: any) => void;
  changeCurrent: (current: string) => void;
}) {
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
    github: "",
  });

  const [image, setImage] = useState<string | null>(null);
  const { session } = useSession();

  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const selectProfilePicture = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const i = await fetchImageFromUri(result.assets[0].uri);
      const url = await uploadFile(i);
      setUser({ ...user, profile_picture: url.data });
    }
  };

  const handleInputChange = (platform: string, value: string) => {
    setSocialLinks({ ...socialLinks, [platform]: value });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={selectProfilePicture}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: image
                  ? image
                  : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541", // Default placeholder profile image
              }}
            />
            <Text style={styles.changePicText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Full Name"
          placeholderTextColor="#888"
          value={bio}
          onChangeText={setBio}
          multiline={true}
          maxLength={250}
        />
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          placeholder="Write a short bio"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          multiline={true}
          maxLength={250}
        />

        <Text style={styles.label}>Social Media Links</Text>

        <TextInput
          style={styles.input}
          placeholder="LinkedIn URL"
          placeholderTextColor="#888"
          value={socialLinks.linkedin}
          onChangeText={(value) => handleInputChange("linkedin", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Instagram URL"
          placeholderTextColor="#888"
          value={socialLinks.instagram}
          onChangeText={(value) => handleInputChange("instagram", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Facebook URL"
          placeholderTextColor="#888"
          value={socialLinks.facebook}
          onChangeText={(value) => handleInputChange("facebook", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Twitter URL"
          placeholderTextColor="#888"
          value={socialLinks.twitter}
          onChangeText={(value) => handleInputChange("twitter", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="GitHub URL"
          placeholderTextColor="#888"
          value={socialLinks.github}
          onChangeText={(value) => handleInputChange("github", value)}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            setUser({ ...user, bio, social_links: socialLinks });
            console.log(session);
            const r = await axios.post(
              `${config.api}/${config.api_v}/auth/register`,
              {
                ...user,
                email: JSON.parse(
                  Buffer.from(
                    (session ? session : "").split(".")[1],
                    "base64",
                  ).toString("utf-8"),
                ).email,
                bio,
                full_name: name,
                country: "India",
                username:
                  name.split(" ")[0] +
                  Math.floor(100000 + Math.random() * 900000).toString(),
                age:
                  new Date().getFullYear() -
                  new Date(user.date_of_birth.split("-")[2]).getFullYear(),
                social_links: socialLinks,
              },
              {
                headers: {
                  Authorization: `Bearer ${session}`,
                },
              },
            );
            console.log(r.data);
            router.replace("/");
          }}
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FF1493",
    marginBottom: 10,
  },
  changePicText: {
    color: "#FF1493",
    fontSize: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#FF1493",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
