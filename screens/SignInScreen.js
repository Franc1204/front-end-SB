import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Video de fondo */}
      <Video
        source={require('../assets/Login.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFillObject}
      />

      {/* Botón de regreso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Contenedor de campos de texto y botón */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in</Text>

        <TextInput
          placeholder="Enter Username Or Email"
          placeholderTextColor="#FFF"
          style={styles.input}
          keyboardAppearance="dark"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#FFF"
          secureTextEntry
          style={styles.input}
          keyboardAppearance="dark"
        />

        <TouchableOpacity>
          <Text style={styles.recoveryText}>Recovery Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>


        {/* Botón de depuración para navegar a HomeScreen */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.debugButtonText}>Go to Home (Debug)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  recoveryText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spotifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1DB954',
    marginBottom: 20,
  },
  spotifyText: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  debugButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
