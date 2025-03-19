import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react-native";

interface PostActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

export default function PostActions({
  isLiked,
  isSaved,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        <TouchableOpacity onPress={onLike} styles={styles.actionButton}>
          <Heart
            size={26}
            color={isLiked ? "#ED4956" : "#000"}
            fill={isLiked ? "#ED4956" : "transparent"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onComment} styles={styles.actionButton}>
          <MessageCircle size={26} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.actionButton}>
          <Send size={26} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onSave}>
        <Bookmark
          size={26}
          color="#000"
          fill={isSaved ? "#000" : "transparent"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 16,
  },
});
