import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomIcon from '../components/CustomIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnalysis } from '../contexts/AnalysisContext';
import { AnalysisResult } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getScoreColor, getScoreLabel, Gradients } from '../design/DesignSystem';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const PhotoGalleryScreen: React.FC = () => {
  const { analyses } = useAnalysis();
  const [selectedPhoto, setSelectedPhoto] = useState<AnalysisResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  const openPhotoModal = (analysis: AnalysisResult) => {
    setSelectedPhoto(analysis);
    setModalVisible(true);
  };

  const closePhotoModal = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
  };

  const renderPhotoCard = ({ item }: { item: AnalysisResult }) => (
    <TouchableOpacity
      style={styles.photoCard}
      onPress={() => openPhotoModal(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {item.image_uri ? (
          <Image source={{ uri: item.image_uri }} style={styles.photoImage} />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Ionicons name="camera-outline" size={40} color="rgba(255, 255, 255, 0.5)" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
          style={styles.imageOverlay}
        />
        <View style={styles.cardBadge}>
          <Text style={styles.badgeText}>{item.fun_label}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
        
        <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Sleep</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.sleep_score) }]}>
              {item.sleep_score}
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Skin</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.skin_health_score) }]}>
              {item.skin_health_score}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPhotoModal = () => (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={closePhotoModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closePhotoModal}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          {selectedPhoto && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalImageContainer}>
                {selectedPhoto.image_uri ? (
                  <Image
                    source={{ uri: selectedPhoto.image_uri }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.modalNoImage}>
                    <Ionicons name="camera-outline" size={80} color="rgba(255, 255, 255, 0.5)" />
                    <Text style={styles.modalNoImageText}>No Image Available</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.modalDetails}>
                <Text style={styles.modalDate}>{formatDate(selectedPhoto.date)}</Text>
                <Text style={styles.modalLabel}>{selectedPhoto.fun_label}</Text>
                
                <View style={styles.modalScores}>
                  <View style={styles.modalScoreItem}>
                    <Text style={styles.modalScoreLabel}>Sleep Score</Text>
                    <Text style={[styles.modalScoreValue, { color: getScoreColor(selectedPhoto.sleep_score) }]}>
                      {selectedPhoto.sleep_score}/100
                    </Text>
                    <Text style={styles.modalScoreDescription}>
                      {getScoreLabel(selectedPhoto.sleep_score)}
                    </Text>
                  </View>
                  
                  <View style={styles.modalScoreItem}>
                    <Text style={styles.modalScoreLabel}>Skin Health</Text>
                    <Text style={[styles.modalScoreValue, { color: getScoreColor(selectedPhoto.skin_health_score) }]}>
                      {selectedPhoto.skin_health_score}/100
                    </Text>
                    <Text style={styles.modalScoreDescription}>
                      {getScoreLabel(selectedPhoto.skin_health_score)}
                    </Text>
                  </View>
                </View>
                
                {selectedPhoto.routine && (
                  <View style={styles.modalRoutine}>
                    <Text style={styles.modalRoutineTitle}>Daily Routine</Text>
                    {selectedPhoto.routine.sleep_hours && (
                      <Text style={styles.modalRoutineItem}>
                        💤 Sleep: {selectedPhoto.routine.sleep_hours} hours
                      </Text>
                    )}
                    {selectedPhoto.routine.water_intake && (
                      <Text style={styles.modalRoutineItem}>
                        💧 Water: {selectedPhoto.routine.water_intake} glasses
                      </Text>
                    )}
                    {selectedPhoto.routine.product_used && (
                      <Text style={styles.modalRoutineItem}>
                        🧴 Product: {selectedPhoto.routine.product_used}
                      </Text>
                    )}
                    {selectedPhoto.routine.daily_note && (
                      <Text style={styles.modalRoutineItem}>
                        📝 Note: {selectedPhoto.routine.daily_note}
                      </Text>
                    )}
                  </View>
                )}
                
                <View style={styles.modalFeatures}>
                  <Text style={styles.modalFeaturesTitle}>Analysis Details</Text>
                  <View style={styles.featuresGrid}>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Dark Circles</Text>
                      <Text style={styles.featureValue}>{selectedPhoto.features.dark_circles}%</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Puffiness</Text>
                      <Text style={styles.featureValue}>{selectedPhoto.features.puffiness}%</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Brightness</Text>
                      <Text style={styles.featureValue}>{selectedPhoto.features.brightness}%</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Wrinkles</Text>
                      <Text style={styles.featureValue}>{selectedPhoto.features.wrinkles}%</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Texture</Text>
                      <Text style={styles.featureValue}>{selectedPhoto.features.texture}%</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Confidence</Text>
                      <Text style={styles.featureValue}>{selectedPhoto.confidence}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Photo Gallery</Text>
        <Text style={styles.headerSubtitle}>
          {analyses.length} {analyses.length === 1 ? 'photo' : 'photos'} captured
        </Text>
      </LinearGradient>

      {analyses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="camera-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <Text style={styles.emptySubtitle}>
            Take your first selfie to start tracking your sleep and skin health!
          </Text>
        </View>
      ) : (
        <FlatList
          data={analyses}
          renderItem={renderPhotoCard}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.galleryContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderPhotoModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'BalooBhaijaan2-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  galleryContainer: {
    padding: 20,
  },
  photoCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
    marginHorizontal: 5,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  cardBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'BalooBhaijaan2-Medium',
  },
  cardContent: {
    padding: 12,
  },
  cardDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginBottom: 2,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'BalooBhaijaan2-Bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 8,
    fontFamily: 'BalooBhaijaan2-Bold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalImageContainer: {
    height: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalNoImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalNoImageText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  modalDetails: {
    padding: 20,
  },
  modalDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  modalLabel: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'BalooBhaijaan2-Bold',
  },
  modalScores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  modalScoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  modalScoreLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  modalScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'BalooBhaijaan2-Bold',
  },
  modalScoreDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  modalRoutine: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalRoutineTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'BalooBhaijaan2-Bold',
  },
  modalRoutineItem: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  modalFeatures: {
    marginBottom: 20,
  },
  modalFeaturesTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'BalooBhaijaan2-Bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  featureLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  featureValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'BalooBhaijaan2-Bold',
  },
});

export default PhotoGalleryScreen;


