import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useTheme } from '../contexts/ThemeContext';
import { AnalysisResult, DailySummary } from '../types';
import CustomIcon from '../components/CustomIcon';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getScoreColor, getScoreLabel, Gradients, getThemeColors, getThemeGradients, ButtonStyles } from '../design/DesignSystem';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const gradients = getThemeGradients(isDark);
  const { user, isGuest } = useAuth();
  const { 
    currentAnalysis, 
    dailySummary, 
    weeklyAnalysis,
    streakData, 
    isLoading,
    getDailySummary,
    getAnalysisHistory,
    getWeeklyAnalysis
  } = useAnalysis();
  
  const [refreshing, setRefreshing] = useState(false);
  const styles = createStyles(colors);

  useEffect(() => {
    loadTodayData();
    loadWeeklyAnalysis();
  }, []);

  const loadTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await getDailySummary(today);
      await getAnalysisHistory(7);
    } catch (error) {
      console.error('Error loading today data:', error);
    }
  };

  const loadWeeklyAnalysis = async () => {
    try {
      await getWeeklyAnalysis(7);
    } catch (error) {
      console.error('Error loading weekly analysis:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodayData();
    await loadWeeklyAnalysis();
    setRefreshing(false);
  };

  const handleScanPress = () => {
    navigation.navigate('Camera' as never);
  };

  const handleAnalysisPress = () => {
    if (currentAnalysis) {
      navigation.navigate('Analysis' as never);
    } else {
      Alert.alert(
        'No Analysis Yet',
        'Take a selfie to see your sleep and skin health scores!',
        [{ text: 'OK' }]
      );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View
        style={[styles.header, { backgroundColor: colors.background }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              {isGuest ? 'Welcome, Guest!' : `Hello, ${user?.displayName || 'User'}!`}
            </Text>
            <Text style={styles.subtitle}>
              {isGuest ? 'Sign in to save your progress' : 'Ready to check your glow?'}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIconContainer}>
              <CustomIcon name="profile" size={24} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Streak Card */}
      <LinearGradient
        colors={[Colors.primary + '10', Colors.accent + '10']}
        style={[styles.streakCard, { borderColor: colors.border }]}
      >
        <View style={styles.streakContent}>
          <CustomIcon name="trend" size={24} color={Colors.accent} />
          <View style={styles.streakText}>
            <Text style={styles.streakNumber}>{streakData.current_streak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>
        <Text style={styles.streakDescription}>
          Keep scanning daily to maintain your streak!
        </Text>
      </LinearGradient>

      {/* Today's Analysis */}
      {currentAnalysis ? (
        <LinearGradient
          colors={[Colors.primary + '10', Colors.accent + '10']}
          style={[styles.analysisCard, { borderColor: colors.border }]}
        >
          <Text style={styles.cardTitle}>Today's Analysis</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Sleep Score</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(currentAnalysis.sleep_score) }]}>
                {currentAnalysis.sleep_score}
              </Text>
              <Text style={styles.scoreDescription}>
                {getScoreLabel(currentAnalysis.sleep_score)}
              </Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Skin Health</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(currentAnalysis.skin_health_score) }]}>
                {currentAnalysis.skin_health_score}
              </Text>
              <Text style={styles.scoreDescription}>
                {getScoreLabel(currentAnalysis.skin_health_score)}
              </Text>
            </View>
          </View>
          <Text style={styles.funLabel}>{currentAnalysis.fun_label}</Text>
          <TouchableOpacity style={styles.viewDetailsButton} onPress={handleAnalysisPress}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <CustomIcon name="chevronRight" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={[Colors.primary + '10', Colors.accent + '10']}
          style={[styles.noAnalysisCard, { borderColor: colors.border }]}
        >
          <CustomIcon name="camera" size={48} color={Colors.textTertiary} />
          <Text style={styles.noAnalysisTitle}>No Analysis Yet</Text>
          <Text style={styles.noAnalysisDescription}>
            Take your first selfie to see your sleep and skin health scores!
          </Text>
          <TouchableOpacity style={ButtonStyles.secondary} onPress={handleScanPress}>
            <CustomIcon name="camera" size={20} color={Colors.primary} />
            <Text style={ButtonStyles.text.secondary}>Take Selfie</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Weekly Insights */}
      {weeklyAnalysis && (
        <LinearGradient
          colors={[Colors.primary + '10', Colors.accent + '10']}
          style={[styles.weeklyInsightsCard, { borderColor: colors.border }]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIcon}>
              <CustomIcon name="analytics" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Weekly Insights</Text>
          </View>
          
          {isGuest ? (
            // Guest user - show registration prompt
            <View style={styles.guestPromptContainer}>
              <View style={styles.guestPromptIcon}>
                <CustomIcon name="analytics" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.guestPromptTitle}>Unlock Weekly Insights</Text>
              <Text style={styles.guestPromptText}>
                Register to track your progress over time, get personalized recommendations, and see how your skincare routine is working!
              </Text>
              <TouchableOpacity 
                style={ButtonStyles.secondary}
                onPress={() => {
                  navigation.navigate('Register' as never);
                }}
              >
                <Text style={ButtonStyles.text.secondary}>Register Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Registered user - show weekly insights
            <View style={styles.weeklyContent}>
              <Text style={styles.weeklySummaryText}>
                {weeklyAnalysis.weekly_summary || "Take more selfies this week to get personalized insights about your routine effectiveness and skin trends!"}
              </Text>
              
              {weeklyAnalysis.weekly_insights && weeklyAnalysis.weekly_insights.length > 0 && (
                <View style={styles.insightsSection}>
                  <View style={styles.sectionHeader}>
                    <CustomIcon name="trend" size={18} color={Colors.primary} />
                    <Text style={styles.sectionTitle}>Trend Analysis</Text>
                  </View>
                  {weeklyAnalysis.weekly_insights.map((insight: any, index: number) => (
                    <View key={index} style={styles.insightItem}>
                      <View style={styles.insightBullet} />
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {weeklyAnalysis.weekly_recommendations && weeklyAnalysis.weekly_recommendations.length > 0 && (
                <View style={styles.recommendationsSection}>
                  <View style={styles.sectionHeader}>
                    <CustomIcon name="success" size={18} color={Colors.success} />
                    <Text style={styles.sectionTitle}>Weekly Recommendations</Text>
                  </View>
                  {weeklyAnalysis.weekly_recommendations.map((recommendation: any, index: number) => (
                    <View key={index} style={styles.recommendationItem}>
                      <View style={styles.recommendationBullet} />
                      <Text style={styles.recommendationText}>{recommendation}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={ButtonStyles.primaryFlex} onPress={handleScanPress}>
          <CustomIcon name="camera" size={20} color={Colors.textInverse} />
          <Text style={ButtonStyles.text.primary}>Scan Face</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={ButtonStyles.secondaryFlex} 
          onPress={() => navigation.navigate('History' as never)}
        >
          <CustomIcon name="analytics" size={20} color={Colors.primary} />
          <Text style={ButtonStyles.text.secondary}>View History</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: 'bold' as any,
    color: colors.textPrimary,
    fontFamily: Typography.fontFamily.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: Spacing.xs,
    fontFamily: Typography.fontFamily.secondary,
  },
  profileButton: {
    padding: Spacing.sm,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakCard: {
    margin: Spacing.lg,
    marginTop: -Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1,
    ...Shadows.md,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakText: {
    marginLeft: Spacing.md,
  },
  streakNumber: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: 'bold' as any,
    color: Colors.accent,
    fontFamily: Typography.fontFamily.primary,
  },
  streakLabel: {
    fontSize: Typography.fontSize.base,
    color: colors.textSecondary,
    fontFamily: Typography.fontFamily.secondary,
  },
  streakDescription: {
    fontSize: Typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.secondary,
  },
  analysisCard: {
    margin: Spacing.lg,
    marginTop: 0,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1,
    ...Shadows.md,
  },
  noAnalysisCard: {
    margin: Spacing.lg,
    marginTop: 0,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['3xl'],
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold' as any,
    color: colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.primary,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: Typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.secondary,
  },
  scoreValue: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: 'bold' as any,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.primary,
  },
  scoreDescription: {
    fontSize: Typography.fontSize.xs,
    color: colors.textSecondary,
    fontFamily: Typography.fontFamily.secondary,
  },
  scoreDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: Spacing.lg,
  },
  funLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold' as any,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.primary,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  viewDetailsText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: '600' as any,
    marginRight: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  noAnalysisTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold' as any,
    color: colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  noAnalysisDescription: {
    fontSize: Typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    fontFamily: Typography.fontFamily.secondary,
  },
  weeklyInsightsCard: {
    margin: Spacing.lg,
    marginTop: 0,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    ...Shadows.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  weeklyContent: {
    padding: Spacing.xl,
  },
  weeklySummaryText: {
    fontSize: Typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.xl,
    fontFamily: Typography.fontFamily.secondary,
  },
  insightsSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    color: colors.textPrimary,
    fontFamily: Typography.fontFamily.primary,
    marginLeft: Spacing.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  insightText: {
    fontSize: Typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    flex: 1,
    fontFamily: Typography.fontFamily.secondary,
  },
  recommendationsSection: {
    marginBottom: 0,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  recommendationText: {
    fontSize: Typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    flex: 1,
    fontFamily: Typography.fontFamily.secondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: 0,
    marginBottom: Spacing.lg,
  },
  bottomSpacing: {
    height: Spacing['3xl'],
  },
  // Guest prompt styles
  guestPromptContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
  },
  guestPromptIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  guestPromptTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700' as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  guestPromptText: {
    fontSize: Typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.xl,
    fontFamily: Typography.fontFamily.secondary,
  },
});

export default HomeScreen;
