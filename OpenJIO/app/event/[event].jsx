// import { View, Text, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLocalSearchParams } from "expo-router";
// import { React, useState, useEffect } from "react";
// import { GROUPS } from "../constants/groups"; 
// import { checkJoined } from "../lib/services";

// const EventPage = () => {
//   const { groupId } = useLocalSearchParams(); 
//   const group = GROUPS.find((g) => g.groupId === groupId); 

//   if (!group) {
//     return (
//       <SafeAreaView className="h-full flex justify-center items-center bg-red-100">
//         <Text className="text-xl text-red-600">Event Not Found</Text>
//       </SafeAreaView>
//     );
//   }

//   const [group, setGroups] = useState(null);
//   const [joined, setJoined] = useState(false);

//   useEffect(() => setJoined(checkJoined(groupId)));

  

//   return (
//     <SafeAreaView className="h-full bg-gray-100 p-4">
//       <Text className="text-2xl font-bold text-center">{group.name}</Text>
//       <Text className="text-md text-center text-gray-700 mt-2">
//         {group.category} Event
//       </Text>
//       <View className="bg-white rounded-lg p-4 mt-4 shadow-lg">
//         <Text className="text-lg font-semibold">Time</Text>
//         <Text className="text-md text-gray-600">{group.time}</Text>

//         <Text className="text-lg font-semibold mt-4">Location</Text>
//         <Text className="text-md text-gray-600">{group.location}</Text>

//         <Text className="text-lg font-semibold mt-4">Members</Text>
//         {group.members.map((member, index) => (
//           <Text key={index} className="text-md text-gray-600">
//             • {member}
//           </Text>
//         ))}

//       </View>
//       {
//         group.joined ? 
//         <TouchableOpacity className="text-lg font-semibold mt-4 bg-sky-300 p-4 rounded-lg mt-auto mb-8">
//             <Text className="text-white">
//                 Join Telegram Group
//             </Text>
//         </TouchableOpacity>
//         :
//         <TouchableOpacity 
         
//           // onPress={() => }

//           className="text-lg font-semibold mt-4 bg-lime-500 p-4 rounded-lg mt-auto mb-8">
//             <Text className="text-lg">
//                 Join Event
//             </Text>
//         </TouchableOpacity>
//       }
        
//     </SafeAreaView>
//   );
// };

// export default EventPage;

import { View, Text, TouchableOpacity, Image, Modal, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { GROUPS } from "../constants/groups";
import AsyncStorage from "@react-native-async-storage/async-storage";

const currentUser = "Myself"; 

const EventPage = () => {
  const { event } = useLocalSearchParams(); 
  const groupIndex = GROUPS.findIndex((g) => g.groupId === event);
  
  if (groupIndex === -1) {
    return (
      <SafeAreaView className="h-full flex justify-center items-center bg-red-100">
        <Text className="text-xl text-red-600">Event Not Found</Text>
      </SafeAreaView>
    );
  }

  const [members, setMembers] = useState(GROUPS[groupIndex].members);
  const [hasJoined, setHasJoined] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadMembershipState = async () => {
    try {
      const storedMembers = await AsyncStorage.getItem(`event_${event}_members`);
      if (storedMembers) {
        const parsedMembers = JSON.parse(storedMembers);
        setMembers(parsedMembers);
        setHasJoined(parsedMembers.includes(currentUser));
      }
    } catch (error) {
      console.error("Error loading membership state:", error);
    }
  };

  useEffect(() => {
    loadMembershipState();
  }, []);

  const saveMembershipState = async (updatedMembers) => {
    try {
      await AsyncStorage.setItem(`event_${event}_members`, JSON.stringify(updatedMembers));
    } catch (error) {
      console.error("Error saving membership state:", error);
    }
  };

  const handleJoin = async () => {
    if (!hasJoined) {
      const updatedMembers = [...members, currentUser];
      setMembers(updatedMembers);
      setHasJoined(true);
      await saveMembershipState(updatedMembers);
      
      setShowPopup(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide pop-up after 2 seconds
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowPopup(false));
      }, 2000);
    }
  };

  const handleLeave = async () => {
    const updatedMembers = members.filter((member) => member !== currentUser);
    setMembers(updatedMembers);
    setHasJoined(false);
    await saveMembershipState(updatedMembers);
  };

  return (
    <SafeAreaView className="h-full bg-gray-100 p-4">
      {showPopup && (
        <Animated.View
          style={{
            position: "absolute",
            top: 60,
            left: 20,
            right: 20,
            backgroundColor: "#38a169", // Green color
            padding: 10,
            borderRadius: 10,
            opacity: fadeAnim, // Animated opacity
            zIndex: 10,
          }}
        >
          <Text className="text-white text-center font-bold">Joined Event Successfully!</Text>
        </Animated.View>
      )}

      <Text className="text-2xl font-bold text-center">{GROUPS[groupIndex].name}</Text>
      <Text className="text-md text-center text-gray-700 mt-2">
        {GROUPS[groupIndex].category} Event
      </Text>
      <View className="bg-white rounded-lg p-4 mt-4 shadow-lg">
        <Text className="text-lg font-semibold">Time</Text>
        <Text className="text-md text-gray-600">{GROUPS[groupIndex].time}</Text>

        <Text className="text-lg font-semibold mt-4">Location</Text>
        <Text className="text-md text-gray-600">{GROUPS[groupIndex].location}</Text>

        <Text className="text-lg font-semibold mt-4">Members</Text>
        {members.map((member, index) => (
          <Text key={index} className="text-md text-gray-600">
            • {member}
          </Text>
        ))}
      </View>

      {/* Join Button */}
      {!hasJoined ? (
        <TouchableOpacity 
          className="w-full mt-6 py-3 bg-green-500 rounded-lg"
          onPress={handleJoin}
          activeOpacity={0.7}
        >
          <Text className="text-center text-white text-lg font-bold">Join</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-full mt-6 py-3 bg-blue-500 rounded-lg flex flex-row items-center justify-center">
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" }} 
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text className="text-white text-lg font-bold">Join Telegram Group</Text>
        </View>
      )}

      {/* Leave Button (Only visible if user has joined) */}
      {hasJoined && (
        <TouchableOpacity 
          className="w-full mt-4 py-3 bg-red-500 rounded-lg"
          onPress={handleLeave}
          activeOpacity={0.7}
        >
          <Text className="text-center text-white text-lg font-bold">Leave Event</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default EventPage;