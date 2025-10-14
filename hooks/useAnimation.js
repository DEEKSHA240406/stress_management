import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

// Fade In Animation
export const useFadeIn = (duration = 500, delay = 0) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return fadeAnim;
};

// Slide In Animation
export const useSlideIn = (direction = 'up', distance = 50, duration = 500) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return { translateY: slideAnim };
      case 'down':
        return { translateY: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        })};
      case 'left':
        return { translateX: slideAnim };
      case 'right':
        return { translateX: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        })};
      default:
        return { translateY: slideAnim };
    }
  };

  return { slideAnim, transform: getTransform() };
};

// Scale Animation
export const useScale = (initialScale = 0.8, targetScale = 1, duration = 500) => {
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: targetScale,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return scaleAnim;
};

// Bounce Animation
export const useBounce = (autoStart = true) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const startBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (autoStart) {
      startBounce();
    }
  }, []);

  return { bounceAnim, startBounce };
};

// Rotate Animation
export const useRotate = (duration = 1000, loop = false) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(rotateAnim, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    if (loop) {
      Animated.loop(animation).start();
    } else {
      animation.start();
    }
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { rotateAnim, rotate };
};

// Pulse Animation
export const usePulse = (minScale = 0.9, maxScale = 1.1, duration = 1000, loop = true) => {
  const pulseAnim = useRef(new Animated.Value(minScale)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: maxScale,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: minScale,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]);

    if (loop) {
      Animated.loop(animation).start();
    } else {
      animation.start();
    }
  }, []);

  return pulseAnim;
};

// Shake Animation
export const useShake = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return { shakeAnim, shake, transform: { translateX: shakeAnim } };
};

// Progress Animation
export const useProgress = (targetValue = 100, duration = 1000) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const animateProgress = (value) => {
    Animated.timing(progressAnim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animateProgress(targetValue);
  }, [targetValue]);

  return { progressAnim, animateProgress };
};

// Stagger Animation (for lists)
export const useStagger = (itemCount, staggerDelay = 100) => {
  const animations = useRef(
    [...Array(itemCount)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const staggerAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * staggerDelay,
        useNativeDriver: true,
      })
    );

    Animated.parallel(staggerAnimations).start();
  }, []);

  return animations;
};

// Combined Animation Hook
export const useAnimation = () => {
  return {
    useFadeIn,
    useSlideIn,
    useScale,
    useBounce,
    useRotate,
    usePulse,
    useShake,
    useProgress,
    useStagger,
  };
};

export default useAnimation;