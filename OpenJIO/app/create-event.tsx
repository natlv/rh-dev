import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Food",
    time: new Date(),
    location: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ["Food", "Sports", "Study", "Party", "Gaming", "Competition"];

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Event created:", formData);
    // Navigate back to home or category page
    router.back();
  };

  const onTimeChange = (event, selectedTime) => {
    setShowDatePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ ...prev, time: selectedTime }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-5">
        <Text className="text-2xl font-bold text-center my-5">Create New Event</Text>
        
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Event Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="Enter event name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Category</Text>
          <View className="border border-gray-300 rounded-lg">
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Time</Text>
          <CustomButton
            text={formData.time.toLocaleString()}
            containerStyle="border border-gray-300 rounded-lg p-3"
            textStyle="text-base text-black"
            handlePress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={formData.time}
              mode="datetime"
              is24Hour={true}
              onChange={onTimeChange}
            />
          )}
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Location</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="Enter location"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
          />
        </View>

        <CustomButton
          text="Create Event"
          containerStyle="w-full h-12 bg-blue-500 rounded-lg mb-8"
          textStyle="text-white text-lg font-semibold"
          handlePress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEvent;