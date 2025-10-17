import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AnalysisResult } from '../types';
import CustomIcon from '../components/CustomIcon';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getScoreColor, getScoreLabel, getFeatureLabel, getFeatureColor, getFeatureStatus, Gradients, getThemeColors, getThemeGradients, ButtonStyles } from '../design/DesignSystem';

const { width } = Dimensions.get('window');

const AnalysisScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const gradients = getThemeGradients(isDark);
  const { currentAnalysis } = useAnalysis();
  const { isGuest } = useAuth();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (currentAnalysis) {
      // Use the smart summary from the current analysis directly
      if (currentAnalysis.smart_summary) {
        setSummary(currentAnalysis.smart_summary);
      } else {
        // Fallback: generate a basic summary from current analysis
        setSummary(generateBasicSummary(currentAnalysis));
      }
    }
  }, [currentAnalysis]);

  const generateBasicSummary = (analysis: AnalysisResult) => {
    // Use AI-generated insights from backend if available
    if (analysis.smart_summary) {
      console.log("🧠 Using AI-generated insights from backend");
      return {
        daily_summary: analysis.smart_summary.daily_summary || "Analysis completed successfully.",
        key_insights: analysis.smart_summary.key_insights || [],
        recommendations: analysis.smart_summary.recommendations || []
      };
    }
    
    // Generate detailed insights based on actual analysis data
    console.log("⚠️ AI insights not available, generating detailed fallback");
    const sleepScore = analysis.sleep_score;
    const skinScore = analysis.skin_health_score;
    const features = analysis.features;
    const routine = analysis.routine;
    
    // Generate detailed daily summary
    const overallHealth = (sleepScore + skinScore) / 2;
    let dailySummary = "";
    
    if (overallHealth < 30) {
      dailySummary = `Analysis Complete: Your Sleep Score (${sleepScore}/100) and Skin Health Score (${skinScore}/100) show great potential for improvement. We've identified some key areas where small lifestyle changes can make a big difference in how you look and feel.`;
    } else if (overallHealth < 50) {
      dailySummary = `Health Assessment: Your Sleep Score (${sleepScore}/100) and Skin Health Score (${skinScore}/100) show a good foundation with room to grow. Our analysis found specific opportunities to enhance your wellness and skin health.`;
    } else if (overallHealth < 80) {
      dailySummary = `Great Health Metrics: Your Sleep Score (${sleepScore}/100) and Skin Health Score (${skinScore}/100) show you're doing well! Our analysis confirms you're on the right track with potential for even better results.`;
    } else {
      dailySummary = `Outstanding Results: Your Sleep Score (${sleepScore}/100) and Skin Health Score (${skinScore}/100) are excellent! Our analysis shows you're maintaining fantastic health habits that are clearly working for you.`;
    }
    
    // Generate detailed insights based on features
    const insights = [];
    
    // Dark Circles Analysis
    if (features.dark_circles < -50) {
      insights.push("Under-Eye Area Focus: Your under-eye area shows room for improvement. Better sleep quality, increased hydration, and gentle eye care can help brighten this area.");
    } else if (features.dark_circles < -20) {
      insights.push("Under-Eye Enhancement: Your under-eye area has mild pigmentation that can be improved with consistent sleep, proper hydration, and targeted skincare.");
    } else if (features.dark_circles > 20) {
      insights.push("Excellent Under-Eye Area: Your orbital region looks bright and healthy. Your sleep patterns and circulation are working well for this area.");
    }
    
    // Puffiness Analysis
    if (features.puffiness < -50) {
      insights.push("Eye Area Refresh: Your eye area shows some puffiness that can be reduced with better sleep position, reduced sodium intake, and gentle lymphatic massage.");
    } else if (features.puffiness < -20) {
      insights.push("Eye Area Care: Your eye area has mild puffiness that can be improved with adequate sleep, proper hydration, and gentle eye care techniques.");
    } else if (features.puffiness > 20) {
      insights.push("Perfect Eye Contour: Your eye area looks well-defined and refreshed. Your sleep and hydration habits are working great for this area.");
    }
    
    // Skin Brightness Analysis
    if (features.brightness < -50) {
      insights.push("Skin Glow Enhancement: Your skin could benefit from more radiance. Regular exfoliation, increased hydration, and vitamin C can help bring back that healthy glow.");
    } else if (features.brightness < -20) {
      insights.push("Skin Brightness Boost: Your skin has room for more radiance. Gentle exfoliation, proper hydration, and antioxidant-rich products can enhance your natural glow.");
    } else if (features.brightness > 20) {
      insights.push("Beautiful Skin Radiance: Your complexion has a lovely natural glow. Your skincare routine and lifestyle habits are working perfectly for healthy, radiant skin.");
    }
    
    // Wrinkle Analysis
    if (features.wrinkles < -50) {
      insights.push("Skin Smoothness Focus: Your skin could benefit from more smoothing treatments. Retinol, hyaluronic acid, and consistent sun protection can help improve skin texture.");
    } else if (features.wrinkles < -20) {
      insights.push("Skin Smoothness Enhancement: Your skin has some fine lines that can be improved with preventive skincare, proper hydration, and sun protection.");
    } else if (features.wrinkles > 20) {
      insights.push("Excellent Skin Smoothness: Your skin looks smooth and youthful. Your anti-aging routine and sun protection habits are working beautifully.");
    }
    
    // Texture Analysis
    if (features.texture < -50) {
      insights.push("Skin Texture Improvement: Your skin could benefit from smoother texture. Gentle exfoliation, consistent moisturizing, and proper hydration can help create a more even surface.");
    } else if (features.texture < -20) {
      insights.push("Skin Texture Enhancement: Your skin has some texture that can be improved with regular exfoliation, proper hydration, and consistent skincare routine.");
    } else if (features.texture > 20) {
      insights.push("Beautiful Skin Texture: Your skin feels smooth and even. Your skincare routine and hydration habits are creating perfect skin texture.");
    }
    
    // Pore Size Analysis
    if (features.pore_size < -50) {
      insights.push("Pore Refinement Focus: Your pores could benefit from tightening treatments. Niacinamide, retinol, and gentle exfoliation can help minimize pore appearance.");
    } else if (features.pore_size < -20) {
      insights.push("Pore Size Enhancement: Your pores have room for improvement. Consistent cleansing, pore-minimizing products, and proper hydration can help refine their appearance.");
    } else if (features.pore_size > 20) {
      insights.push("Excellent Pore Condition: Your pores look refined and well-maintained. Your skincare routine is working beautifully for pore health.");
    }
    
    // Generate comprehensive recommendations
    const recommendations = [];
    
    // Sleep Quality Recommendations
    if (sleepScore < 30) {
      recommendations.push("Sleep Optimization Protocol: Implement a 7-9 hour sleep schedule with consistent bedtime. Create a pre-sleep routine including 1-hour screen-free period, cool room temperature (65-68°F), and relaxation techniques.");
      recommendations.push("Circadian Rhythm Reset: Establish consistent sleep-wake times, even on weekends. Use blue light blocking glasses 2 hours before bed and consider melatonin supplementation under medical supervision.");
    } else if (sleepScore < 50) {
      recommendations.push("Sleep Quality Improvement: Aim for 8 hours of uninterrupted sleep. Focus on sleep hygiene: avoid caffeine after 2 PM, limit alcohol consumption, and maintain regular exercise routine.");
    } else if (sleepScore > 80) {
      recommendations.push("Maintain Excellent Sleep Habits: Your sleep patterns are optimal. Continue your current routine and consider advanced sleep tracking to monitor REM cycles and deep sleep quality.");
    }
    
    // Skin Health Recommendations
    if (skinScore < 30) {
      recommendations.push("Hydration Protocol: Increase water intake to 2.5-3 liters daily. Add electrolytes and consider hyaluronic acid supplements. Use a humidifier in your bedroom to maintain 40-60% humidity.");
      recommendations.push("Skincare Foundation: Implement a basic routine: gentle cleanser (pH 5.5), broad-spectrum SPF 30+ sunscreen, and fragrance-free moisturizer. Apply products on damp skin to lock in moisture.");
    } else if (skinScore < 50) {
      recommendations.push("Targeted Skincare: Add vitamin C serum in the morning and retinol at night (start with 0.25% concentration). Use gentle chemical exfoliants 2-3 times weekly and maintain consistent routine.");
    } else if (skinScore > 80) {
      recommendations.push("Advanced Skincare Maintenance: Your skin health is excellent. Consider professional treatments like microdermabrasion or chemical peels for further enhancement. Maintain your current routine and add antioxidant serums for long-term protection.");
    }
    
    // Feature-Specific Recommendations
    if (features.dark_circles < -20) {
      recommendations.push("Under-Eye Treatment: Use caffeine-based eye creams, cold compresses for 10 minutes daily, and consider professional treatments like PRP or dermal fillers for severe cases.");
    }
    
    if (features.puffiness < -20) {
      recommendations.push("Puffiness Reduction: Reduce sodium intake to <2g daily, elevate head while sleeping, use cold therapy, and consider lymphatic drainage massage.");
    }
    
    if (features.brightness < -20) {
      recommendations.push("Radiance Enhancement: Use vitamin C serum (15-20% L-ascorbic acid), gentle exfoliation with glycolic acid, and brightening ingredients like niacinamide, arbutin, or licorice root extract.");
    }
    
    if (features.wrinkles < -20) {
      recommendations.push("Anti-Aging Protocol: Start with retinol 0.25% twice weekly, increase to daily over 8 weeks. Use peptides, growth factors, and always apply SPF 50+ sunscreen.");
    }
    
    if (features.texture < -20) {
      recommendations.push("Texture Improvement: Use gentle chemical exfoliants (AHA/BHA) 2-3 times weekly, maintain consistent moisturization, and consider professional treatments like microdermabrasion or chemical peels.");
    }
    
    if (features.pore_size < -20) {
      recommendations.push("Pore Minimizing Protocol: Use niacinamide 4-5% twice daily, gentle BHA exfoliant 2-3 times weekly, and always apply non-comedogenic sunscreen. Consider professional treatments like microneedling for severe cases.");
    }
    
    return {
      daily_summary: dailySummary,
      key_insights: insights,
      recommendations: recommendations
    };
  };

  if (!currentAnalysis) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <CustomIcon name="warning" size={64} color={Colors.textTertiary} />
          <Text style={styles.errorTitle}>No Analysis Data</Text>
          <Text style={styles.errorText}>
            Please take a selfie first to see your analysis results.
          </Text>
        </View>
      </View>
    );
  }

  const getFeatureIcon = (feature: string) => {
    const icons: { [key: string]: string } = {
      dark_circles: 'darkCircles',
      puffiness: 'puffiness',
      brightness: 'brightness',
      wrinkles: 'wrinkles',
      texture: 'texture',
      pore_size: 'pore_size',
    };
    return icons[feature] || 'info';
  };

  const getFeatureStatus = (value: number) => {
    // Updated for 0-100 scale (higher is better)
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    if (value >= 20) return 'Room for Growth';
    return 'Focus Area';
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        message: `My Sleep Face analysis: ${currentAnalysis.fun_label}\nSleep Score: ${currentAnalysis.sleep_score}\nSkin Health: ${currentAnalysis.skin_health_score}`,
        title: 'Sleep Face Analysis',
      };
      
      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = () => {
    Alert.alert(
      'Save Analysis',
      'Your analysis has been saved to your history!',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Insights' } as never)}
          >
            <CustomIcon name="chevronLeft" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: Colors.primary }]}>Analysis Results</Text>
            <Text style={[styles.headerSubtitle, { color: '#4DA6FF' }]}>
              {new Date(currentAnalysis.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* Main Scores */}
      <LinearGradient
        colors={[Colors.primary + '10', Colors.accent + '10']}
        style={styles.scoresCard}
      >
        <View style={styles.scoreContainer}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Sleep Score</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(currentAnalysis.sleep_score) }]}>
              {currentAnalysis.sleep_score}
            </Text>
            <Text style={[styles.scoreDescription, { color: colors.textSecondary }]}>
              {getScoreLabel(currentAnalysis.sleep_score)}
            </Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Skin Health</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(currentAnalysis.skin_health_score) }]}>
              {currentAnalysis.skin_health_score}
            </Text>
            <Text style={[styles.scoreDescription, { color: colors.textSecondary }]}>
              {getScoreLabel(currentAnalysis.skin_health_score)}
            </Text>
          </View>
        </View>
        <Text style={[styles.funLabel, { color: colors.textPrimary }]}>{currentAnalysis.fun_label}</Text>
      </LinearGradient>


      {/* Feature Breakdown */}
      <LinearGradient
        colors={[Colors.primary + '10', Colors.accent + '10']}
        style={styles.featuresCard}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Feature Analysis</Text>
        {Object.entries(currentAnalysis.features).map(([feature, value]) => (
          <View key={feature} style={styles.featureItem}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIconContainer}>
                <CustomIcon 
                  name={getFeatureIcon(feature) as any} 
                  size={20} 
                  color={getFeatureColor(value, feature)} 
                />
              </View>
              <Text style={[styles.featureName, { color: colors.textPrimary }]}>
                {getFeatureLabel(feature)}
              </Text>
              <View style={styles.featureValueContainer}>
                <Text style={[styles.featureValue, { color: getFeatureColor(value, feature) }]}>
                  {value.toFixed(1)}
                </Text>
                <Text style={[styles.featureStatus, { color: getFeatureColor(value, feature) }]}>
                  {getFeatureStatus(value)}
                </Text>
              </View>
            </View>
            <View style={styles.featureBar}>
              <View 
                  style={[
                  styles.featureBarFill,
                  {
                    width: `${Math.min(value, 100)}%`,
                    backgroundColor: getFeatureColor(value, feature),
                  }
                ]}
              />
            </View>
          </View>
        ))}
      </LinearGradient>

      {/* Routine Data */}
      {currentAnalysis.routine && (
        <LinearGradient
          colors={[Colors.primary + '10', Colors.accent + '10']}
          style={styles.routineCard}
        >
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Your Daily Routine</Text>
          <View style={styles.routineContent}>
            {currentAnalysis.routine.sleep_hours && (
              <View style={styles.routineItem}>
                <CustomIcon name="sleep" size={20} color={Colors.primary} />
                <Text style={[styles.routineLabel, { color: colors.textSecondary }]}>Sleep Hours</Text>
                <Text style={[styles.routineValue, { color: colors.textPrimary }]}>
                  {currentAnalysis.routine.sleep_hours}h
                </Text>
              </View>
            )}
            {currentAnalysis.routine.water_intake && (
              <View style={styles.routineItem}>
                <CustomIcon name="waterGlass" size={20} color={Colors.primary} />
                <Text style={[styles.routineLabel, { color: colors.textSecondary }]}>Water Intake</Text>
                <Text style={[styles.routineValue, { color: colors.textPrimary }]}>
                  {currentAnalysis.routine.water_intake} glasses
                </Text>
              </View>
            )}
            {currentAnalysis.routine.product_used && (
              <View style={styles.routineItem}>
                <CustomIcon name="serum" size={20} color={Colors.primary} />
                <Text style={[styles.routineLabel, { color: colors.textSecondary }]}>Product Used</Text>
                <Text style={[styles.routineValue, { color: colors.textPrimary }]}>
                  {currentAnalysis.routine.product_used}
                </Text>
              </View>
            )}
            {currentAnalysis.routine.daily_note && (
              <View style={styles.routineItem}>
                <CustomIcon name="info" size={20} color={Colors.primary} />
                <Text style={[styles.routineLabel, { color: colors.textSecondary }]}>Daily Note</Text>
                <Text style={[styles.routineValue, { color: colors.textPrimary }]}>
                  {currentAnalysis.routine.daily_note}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      )}

      {/* Current Analysis */}
      {summary && (
        <LinearGradient
          colors={[Colors.primary + '10', Colors.accent + '10']}
          style={styles.summaryCard}
        >
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Current Analysis</Text>
          <Text style={[styles.summaryText, { color: colors.textPrimary }]}>{summary.daily_summary}</Text>
          
          {summary.key_insights.length > 0 && (
            <View style={styles.insightsContainer}>
              <Text style={[styles.insightsTitle, { color: colors.textPrimary }]}>Current Insights:</Text>
              {summary.key_insights.map((insight: any, index: number) => (
                <Text key={index} style={[styles.insightItem, { color: colors.textSecondary }]}>
                  • {insight}
                </Text>
              ))}
            </View>
          )}

          {summary.recommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={[styles.recommendationsTitle, { color: colors.textPrimary }]}>Recommendations:</Text>
              {summary.recommendations.map((recommendation: any, index: number) => (
                <Text key={index} style={[styles.recommendationItem, { color: colors.textSecondary }]}>
                  • {recommendation}
                </Text>
              ))}
            </View>
          )}
        </LinearGradient>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={ButtonStyles.successFlex} onPress={handleSave}>
          <CustomIcon name="save" size={20} color={Colors.textInverse} />
          <Text style={ButtonStyles.text.success}>Save Analysis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={ButtonStyles.secondaryFlex} onPress={handleShare}>
          <CustomIcon name="share" size={20} color={Colors.primary} />
          <Text style={ButtonStyles.text.secondary}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Guest Registration Prompt */}
      {isGuest && (
        <View style={styles.guestPromptCard}>
          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={styles.guestPromptGradient}
          >
            <View style={styles.guestPromptIcon}>
              <CustomIcon name="analytics" size={28} color={Colors.primary} />
            </View>
            <Text style={[styles.guestPromptTitle, { color: colors.textPrimary }]}>Unlock Full Features</Text>
            <Text style={[styles.guestPromptText, { color: colors.textSecondary }]}>
              Register to save your analysis history, track progress over time, and get personalized weekly insights!
            </Text>
               <TouchableOpacity
                 style={styles.registerButton}
                 onPress={() => {
                   navigation.navigate('Register' as never);
                 }}
               >
                 <LinearGradient
                   colors={Gradients.primary as any}
                   style={styles.registerButtonGradient}
                 >
                   <Text style={styles.registerButtonText}>Register Now</Text>
                 </LinearGradient>
               </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700' as any,
    color: '#007AFF',
    fontFamily: Typography.fontFamily.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: '#4DA6FF',
    fontFamily: Typography.fontFamily.secondary,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  scoresCard: {
    margin: Spacing.lg,
    marginTop: -Spacing.sm,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    ...Shadows.md,
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
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.secondary,
  },
  scoreValue: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: 'bold' as any,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.primary,
  },
  scoreDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.secondary,
  },
  scoreDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.lg,
  },
  funLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold' as any,
    color: Colors.primary,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.primary,
  },
  featuresCard: {
    margin: Spacing.lg,
    marginTop: 0,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    ...Shadows.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold' as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.primary,
  },
  featureItem: {
    marginBottom: Spacing.md,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureName: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.primary,
  },
  featureValueContainer: {
    alignItems: 'flex-end',
  },
  featureValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700' as any,
    fontFamily: Typography.fontFamily.primary,
  },
  featureStatus: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '500' as any,
    fontFamily: Typography.fontFamily.secondary,
    marginTop: 2,
  },
  featureBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  featureBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  routineCard: {
    margin: Spacing.lg,
    marginTop: 0,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    ...Shadows.md,
  },
  routineContent: {
    marginTop: Spacing.md,
  },
  routineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  routineLabel: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.primary,
    marginLeft: Spacing.sm,
  },
  routineValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700' as any,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.primary,
  },
  summaryCard: {
    margin: Spacing.lg,
    marginTop: 0,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    ...Shadows.md,
  },
  summaryText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.secondary,
  },
  insightsContainer: {
    marginBottom: Spacing.md,
  },
  insightsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  insightItem: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.secondary,
  },
  recommendationsContainer: {
    marginTop: Spacing.sm,
  },
  recommendationsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  recommendationItem: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.secondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    margin: Spacing.lg,
    marginTop: 0,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    marginLeft: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  actionButtonTextSecondary: {
    color: Colors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600' as any,
    marginLeft: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  // Guest prompt styles
  guestPromptCard: {
    margin: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  guestPromptGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  guestPromptIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  guestPromptTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700' as any,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.primary,
  },
  guestPromptText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.xl,
    fontFamily: Typography.fontFamily.secondary,
  },
  registerButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
  registerButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  registerButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.fontSize.base,
    fontWeight: '700' as any,
    fontFamily: Typography.fontFamily.primary,
  },
});

export default AnalysisScreen;
