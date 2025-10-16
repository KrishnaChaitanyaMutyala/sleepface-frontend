import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useTheme } from '../contexts/ThemeContext';
import { RoutineData } from '../types';
import SkincareMultiSelect from '../components/SkincareMultiSelect';
import CustomIcon from '../components/CustomIcon';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients, getThemeColors, getThemeGradients, ButtonStyles } from '../design/DesignSystem';

const { width: screenWidth } = Dimensions.get('window');
const thumbSize = 24;

// Custom Slider Component - Simple and Working
const CustomSlider: React.FC<{
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit: string;
  color: string;
  colors: any;
}> = ({ value, onValueChange, min, max, step, label, unit, color, colors }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderWidth = screenWidth - 80; // Account for padding
  
  const percentage = ((value - min) / (max - min)) * 100;
  const thumbPosition = (percentage / 100) * (sliderWidth - 32); // 32 is thumb width

  const handlePanGesture = (event: any) => {
    const { translationX } = event.nativeEvent;
    const currentPosition = (percentage / 100) * (sliderWidth - 32);
    const newPosition = currentPosition + translationX;
    const newPercentage = Math.max(0, Math.min(100, (newPosition / (sliderWidth - 32)) * 100));
    const newValue = min + (newPercentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    onValueChange(Math.max(min, Math.min(max, steppedValue)));
  };

  const handleTrackPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const newPercentage = Math.max(0, Math.min(100, (locationX / sliderWidth) * 100));
    const newValue = min + (newPercentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    onValueChange(Math.max(min, Math.min(max, steppedValue)));
  };

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={[styles.sliderLabel, { color: colors.textPrimary }]}>{label}</Text>
        <View style={styles.sliderValueContainer}>
          <Text style={[styles.sliderValue, { color }]}>
            {value.toFixed(step < 1 ? 1 : 0)}
          </Text>
          <Text style={[styles.sliderUnit, { color: color + 'CC' }]}>{unit}</Text>
        </View>
      </View>
      
      <View style={styles.sliderWrapper}>
        <TouchableOpacity 
          style={[styles.sliderTrack, { backgroundColor: colors.surfaceSecondary }]}
          onPress={handleTrackPress}
          activeOpacity={1}
        >
          <View 
            style={[
              styles.sliderFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: color 
              }
            ]} 
          />
        </TouchableOpacity>
        
        <PanGestureHandler
          onGestureEvent={handlePanGesture}
          onHandlerStateChange={(event) => {
            if (event.nativeEvent.state === 1) { // BEGAN
              setIsDragging(true);
            } else if (event.nativeEvent.state === 5) { // END
              setIsDragging(false);
            }
          }}
          minDist={0}
          activeOffsetX={[-10, 10]}
        >
          <View 
            style={[
              styles.sliderThumb, 
              { 
                left: thumbPosition,
                backgroundColor: color,
                transform: [{ scale: isDragging ? 1.2 : 1 }],
                shadowColor: color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDragging ? 0.4 : 0.2,
                shadowRadius: isDragging ? 12 : 8,
                elevation: isDragging ? 8 : 6,
              }
            ]} 
          />
        </PanGestureHandler>
      </View>
      
      <View style={styles.sliderLabels}>
        <Text style={[styles.sliderMinLabel, { color: colors.textTertiary }]}>{min}{unit}</Text>
        <Text style={[styles.sliderMaxLabel, { color: colors.textTertiary }]}>{max}{unit}</Text>
      </View>
    </View>
  );
};

const SimpleCameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const gradients = getThemeGradients(isDark);
  const { analyzeImage, isLoading } = useAnalysis();
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [routineData, setRoutineData] = useState<RoutineData>({
    sleep_hours: 7.5,
    water_intake: 8,
    product_used: undefined,
    skincare_products: [],
    daily_note: undefined,
  });

  const takePicture = async () => {
    if (isCapturing) return;

    try {
      setIsCapturing(true);
      console.log('Requesting camera permissions...');
      
      // Request camera permissions first
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() }
          ]
        );
        return;
      }

      console.log('Opening camera...');
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
        setShowRoutineModal(true);
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
      console.log('Requesting media library permissions...');
      
      // Request media library permissions first
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!mediaPermission.granted) {
        Alert.alert(
          'Media Library Permission Required',
          'Please enable photo library access in your device settings to select photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() }
          ]
        );
        return;
      }

      console.log('Opening gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
        setShowRoutineModal(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;
    
    try {
      setIsCapturing(true);
      const analysisResult = await analyzeImage(selectedImage, routineData);
      setShowRoutineModal(false);
      // Reset routine data after successful analysis
      setRoutineData({
        sleep_hours: 7.5,
        water_intake: 8,
        product_used: undefined,
        skincare_products: [],
        daily_note: undefined,
      });
      navigation.navigate('Analysis' as never);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSkipRoutine = () => {
    setRoutineData({
      sleep_hours: undefined,
      water_intake: undefined,
      product_used: undefined,
      skincare_products: [],
      daily_note: undefined,
    });
    handleAnalyzeImage();
  };

  const handleCloseModal = () => {
    setShowRoutineModal(false);
    // Reset routine data when modal is closed without analysis
    setRoutineData({
      sleep_hours: 7.5,
      water_intake: 8,
      product_used: undefined,
      skincare_products: [],
      daily_note: undefined,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      {/* Header - Everything in one gradient like HomeScreen */}
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <CustomIcon name="chevronLeft" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.primary }]}>Take Selfie</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Camera Icon */}
        <View style={styles.cameraIconContainer}>
          <View style={styles.cameraIcon}>
            <CustomIcon name="camera" size={60} color={Colors.primary} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={[styles.instructionTitle, { color: colors.textPrimary }]}>Take Your Selfie</Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            Position your face in good lighting and take a clear selfie for analysis
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={ButtonStyles.primary}
            onPress={takePicture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="small" color={Colors.textInverse} />
            ) : (
              <>
                <CustomIcon name="camera" size={24} color={Colors.textInverse} />
                <Text style={ButtonStyles.text.primary}>Take Photo</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={ButtonStyles.secondary}
            onPress={pickFromGallery}
          >
            <CustomIcon name="camera" size={24} color={Colors.primary} />
            <Text style={ButtonStyles.text.secondary}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <LinearGradient
          colors={[Colors.primary + '10', Colors.accent + '10']}
          style={[styles.tips, { borderColor: colors.border }]}
        >
          <Text style={[styles.tipsTitle, { color: colors.textPrimary }]}>Tips for best results:</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Use good lighting</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Look directly at the camera</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Keep your face centered</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>• Avoid shadows on your face</Text>
        </LinearGradient>
      </LinearGradient>

      {/* Routine Input Modal */}
      <Modal
        visible={showRoutineModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={[colors.surface, colors.surfaceSecondary]}
            style={[styles.modalContainer, { borderBottomColor: colors.border }]}
          >
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View style={[styles.modalHandle, { backgroundColor: colors.textTertiary }]} />
              <View style={styles.modalHeaderContent}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Daily Routine</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={handleCloseModal}
                >
                  <CustomIcon name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={[styles.modalContent]} showsVerticalScrollIndicator={false}>
              <View style={styles.modalSubtitleContainer}>
                <Text style={[styles.modalSubtitle, { color: colors.textPrimary }]}>
                  📊 Share Your Daily Routine
                </Text>
                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  Help our AI provide personalized insights by sharing your daily habits
                </Text>
              </View>

              {/* Sleep Hours Slider */}
              <CustomSlider
                value={routineData.sleep_hours || 7.5}
                onValueChange={(value) => setRoutineData(prev => ({
                  ...prev,
                  sleep_hours: value
                }))}
                min={0}
                max={12}
                step={0.5}
                label="Sleep Hours Last Night"
                unit="h"
                color="#007AFF"
                colors={colors}
              />

              {/* Water Intake Slider */}
              <CustomSlider
                value={routineData.water_intake || 8}
                onValueChange={(value) => setRoutineData(prev => ({
                  ...prev,
                  water_intake: value
                }))}
                min={0}
                max={20}
                step={1}
                label="Water Intake Today"
                unit=" glasses"
                color="#34C759"
                colors={colors}
              />

              {/* Skin Care Products */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Skin Care Products Used</Text>
                <SkincareMultiSelect
                  selectedProducts={routineData.skincare_products || []}
                  onSelectionChange={(products) => setRoutineData(prev => ({
                    ...prev,
                    skincare_products: products,
                    product_used: products.length > 0 ? products.join(', ') : undefined
                  }))}
                  placeholder="Select your skincare products..."
                />
              </View>

              {/* Daily Note */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Daily Note (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, { backgroundColor: colors.surfaceSecondary, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Any additional notes about your day..."
                  placeholderTextColor={colors.textTertiary}
                  value={routineData.daily_note || ''}
                  onChangeText={(text) => setRoutineData(prev => ({
                    ...prev,
                    daily_note: text || undefined
                  }))}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={ButtonStyles.secondary}
                  onPress={handleSkipRoutine}
                >
                  <Text style={ButtonStyles.text.secondary}>Skip</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={ButtonStyles.primary}
                  onPress={handleAnalyzeImage}
                  disabled={isCapturing}
                >
                  {isCapturing ? (
                    <ActivityIndicator size="small" color={Colors.textInverse} />
                  ) : (
                    <Text style={ButtonStyles.text.primary}>Analyze Photo</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600' as any,
    color: '#007AFF',
    fontFamily: Typography.fontFamily.primary,
  },
  cameraIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  instructions: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  instructionTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.primary,
  },
  instructionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    fontFamily: Typography.fontFamily.secondary,
  },
  buttonContainer: {
    gap: Spacing.md,
    marginBottom: Spacing['3xl'],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  galleryButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  buttonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textInverse,
    fontFamily: Typography.fontFamily.primary,
  },
  galleryButtonText: {
    color: Colors.primary,
  },
  tips: {
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    ...Shadows.md,
  },
  tipsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textInverse,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  tipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.secondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    ...Shadows.lg,
  },
  modalHeader: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.textTertiary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700' as any,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.primary,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: Spacing.xl,
    backgroundColor: 'transparent',
  },
  modalSubtitleContainer: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.md,
  },
  modalSubtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700' as any,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  modalDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.secondary,
  },
  // Slider styles
  sliderContainer: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sliderLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700' as any,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.primary,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800' as any,
    fontFamily: Typography.fontFamily.primary,
    color: Colors.primary,
  },
  sliderUnit: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600' as any,
    fontFamily: Typography.fontFamily.primary,
    color: Colors.primary + 'CC',
    marginLeft: Spacing.xs,
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  sliderButtonText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700' as any,
    fontFamily: Typography.fontFamily.primary,
  },
  sliderWrapper: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    top: -12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sliderMinLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.primary,
    fontWeight: '600' as any,
  },
  sliderMaxLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.primary,
    fontWeight: '600' as any,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.primary,
  },
  textInput: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.secondary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  skipButton: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
  },
  skipButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.primary,
  },
  analyzeButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    color: Colors.textInverse,
    fontFamily: Typography.fontFamily.primary,
  },
  bottomSpacing: {
    height: Spacing['3xl'],
  },
});

export default SimpleCameraScreen;
