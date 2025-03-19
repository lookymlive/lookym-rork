import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  useSharedValue,
} from 'react-native-reanimated';
import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface PostCarouselProps {
  images: string[];
  onDoubleTap: () => void;
}

export default function PostCarousel({ images, onDoubleTap }: PostCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDoubleTap = () => {
    onDoubleTap();
    // Animate heart
    heartScale.value = withSequence(
      withTiming(1.2, { duration: 300 }),
      withTiming(1, { duration: 300 }),
      withDelay(500, withTiming(0, { duration: 300 }))
    );
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(500, withTiming(0, { duration: 300 }))
    );
  };

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
      opacity: heartOpacity.value,
    };
  });

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(contentOffsetX / width);
    setActiveIndex(activeIndex);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleDoubleTap}>
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} contentFit="cover" transition={300} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === 'web' && (
        <Animated.View style={[styles.heartContainer, heartAnimatedStyle]}>
          {/* Heart size (80) fill='white' color='red' */}
        </Animated.View>
      )}
      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  carouselContainer: {
    position: 'relative',
    width: '100%',
    height: width,
  },
  imageContainer: {
    width,
    height: width,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 10,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 2,
  },
  paginationDotActive: {
    backgroundColor: '#3897f0',
  },
});