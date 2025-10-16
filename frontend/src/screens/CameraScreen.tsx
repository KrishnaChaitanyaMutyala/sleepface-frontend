import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomIcon from '../components/CustomIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useTheme } from '../contexts/ThemeContext';
import { RoutineData } from '../types';
import { Colors, getThemeColors } from '../design/DesignSystem';

const { width, height } = Dimensions.get('window');

const CameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const { analyzeImage, isLoading } = useAnalysis();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    try {
      console.log('Requesting camera permissions...');
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings to take selfies for analysis.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => getCameraPermissions() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
      Alert.alert('Error', 'Failed to request camera permission. Please try again.');
    }
  };

  const takePicture = async () => {
    if (isCapturing || !cameraRef.current || !cameraReady) {
      console.log('Cannot take picture:', { isCapturing, cameraRef: !!cameraRef.current, cameraReady });
      return;
    }

    try {
      console.log('Taking picture...');
      setIsCapturing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      console.log('Picture taken:', photo?.uri);
      
      if (photo?.uri) {
        const routineData = await showRoutineInput();
        console.log('Routine data:', routineData);
        const analysisResult = await analyzeImage(photo.uri, routineData);
        console.log('Analysis result:', analysisResult);
        navigation.navigate('Analysis' as never);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      console.log('Opening gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets[0]?.uri) {
        const routineData = await showRoutineInput();
        const analysisResult = await analyzeImage(result.assets[0].uri, routineData);
        navigation.navigate('Analysis' as never);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const flipCamera = () => {
    console.log('Flipping camera from', cameraType, 'to', cameraType === CameraType.back ? CameraType.front : CameraType.back);
    setCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlash = () => {
    const newFlashMode = flashMode === 'off' ? 'on' : flashMode === 'on' ? 'auto' : 'off';
    console.log('Toggling flash from', flashMode, 'to', newFlashMode);
    setFlashMode(newFlashMode);
  };

  const showRoutineInput = (): Promise<RoutineData> => {
    return new Promise((resolve) => {
      Alert.prompt(
        'Sleep & Skin Routine',
        'How many hours did you sleep last night?',
        [
          {
            text: 'Skip',
            onPress: () => resolve({
              sleep_hours: null,
              water_intake: null,
              product_used: null,
              daily_note: null,
            }),
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: (sleepHours) => {
              resolve({
                sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
                water_intake: null,
                product_used: null,
                daily_note: null,
              });
            },
          },
        ],
        'plain-text',
        '7',
        'numeric'
      );
    });
  };

  const onCameraReady = () => {
    console.log('Camera is ready');
    setCameraReady(true);
  };

  const onCameraError = (error: any) => {
    console.error('Camera error:', error);
    Alert.alert('Camera Error', 'There was an issue with the camera. Please try again.');
    setCameraReady(false);
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[styles.permissionText, { color: colors.textPrimary }]}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="camera-outline" size={80} color={colors.textTertiary} />
        <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>Camera Access Required</Text>
        <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
          Please enable camera access in your device settings to take selfies for analysis.
        </Text>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: Colors.primary }]} onPress={getCameraPermissions}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
          <Text style={[styles.galleryButtonText, { color: Colors.primary }]}>Use Gallery Instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.primary }]}>Take Selfie</Text>
        <TouchableOpacity style={styles.headerButton} onPress={pickFromGallery}>
          <Ionicons name="images-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={flashMode}
          ratio="4:3"
          onCameraReady={onCameraReady}
          onMountError={onCameraError}
        >
          {/* Camera Overlay */}
          <View style={styles.overlay}>
            {/* Face Guide */}
            <View style={styles.faceGuide}>
              <View style={styles.faceGuideInner} />
            </View>
            
            {/* Instructions */}
            <View style={styles.instructions}>
              <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
                Position your face in the circle
              </Text>
              <Text style={[styles.instructionSubtext, { color: colors.textSecondary }]}>
                Make sure you have good lighting
              </Text>
            </View>

            {/* Camera Status */}
            {!cameraReady && (
              <View style={styles.cameraStatus}>
                <ActivityIndicator size="small" color={colors.textPrimary} />
                <Text style={[styles.cameraStatusText, { color: colors.textPrimary }]}>Initializing camera...</Text>
              </View>
            )}
          </View>
        </Camera>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <LinearGradient
          colors={['transparent', isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)']}
          style={styles.bottomGradient}
        >
          {/* Top Row - Flash and Flip */}
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Ionicons 
                name={flashMode === 'off' ? 'flash-off' : flashMode === 'on' ? 'flash' : 'flash-outline'} 
                size={24} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
            
            <View style={styles.spacer} />
            
            <TouchableOpacity style={styles.controlButton} onPress={flipCamera}>
              <Ionicons name="camera-reverse-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Bottom Row - Capture Button */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={[
                styles.captureButton, 
                (!cameraReady || isCapturing) && styles.captureButtonDisabled
              ]}
              onPress={takePicture}
              disabled={!cameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color={colors.textPrimary} />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  galleryButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuideInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  instructions: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginBottom: 5,
  },
  instructionSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  cameraStatus: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  cameraStatusText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  bottomRow: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
});

export default CameraScreen;