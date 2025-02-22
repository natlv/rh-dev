import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const GroupCard = ({ group }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/event/${group.groupId}`)}
      className="bg-white h-32 rounded-xl mb-3 flex justify-center p-4"
      activeOpacity={0.9}
    >
      <Text className="text-xl font-psemibold">{group.name}</Text>
      <Text className="text-lg font-pregular">Location: {group.location}</Text>
      <Text className="text-lg font-pregular">Time: {group.time}</Text>
    </TouchableOpacity>
    //test
  );
};

export default GroupCard;
