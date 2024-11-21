import React, { useEffect } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const LandingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('./forgetPassword'); // File-based routing requires the path
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ImageBackground
      source={require('../../assets/images/login.png')}
      style={styles.background}
    />
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default LandingScreen;
