import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const renderStar = (index) => {
    if (index < filledStars) {
      return <Ionicons key={index} name="star" size={20} color="red" />;
    } else if (index === filledStars && hasHalfStar) {
      return (
        <Ionicons key={index} name="star-half-sharp" size={20} color="red" />
      );
    } else {
      return <Ionicons key={index} name="star-outline" size={20} color="red" />;
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(5)].map((_, index) => renderStar(index))}
    </View>
  );
};

export default StarRating;
