import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients, getThemeColors } from '../design/DesignSystem';
import ThemeToggle from '../components/ThemeToggle';

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const { analyses, streakData, resetAllData } = useAnalysis();
  const { user, isGuest, logout, loginAsGuest } = useAuth();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const getTotalScans = () => analyses.length;
  const getAverageSleepScore = () => {
    if (analyses.length === 0) return 0;
    const total = analyses.reduce((sum, analysis) => sum + analysis.sleep_score, 0);
    return Math.round(total / analyses.length);
  };
  const getAverageSkinScore = () => {
    if (analyses.length === 0) return 0;
    const total = analyses.reduce((sum, analysis) => sum + analysis.skin_health_score, 0);
    return Math.round(total / analyses.length);
  };

  const getBadges = () => {
    const badges = [];
    
    if (streakData.current_streak >= 7) {
      badges.push({ name: 'Week Warrior', icon: 'trophy', color: Colors.accent });
    }
    if (streakData.current_streak >= 30) {
      badges.push({ name: 'Month Master', icon: 'medal', color: Colors.primary });
    }
    if (getAverageSleepScore() >= 80) {
      badges.push({ name: 'Sleep Champion', icon: 'sleep', color: Colors.success });
    }
    if (getTotalScans() >= 50) {
      badges.push({ name: 'Dedicated Tracker', icon: 'analytics', color: Colors.error });
    }
    
    return badges;
  };

  const badges = getBadges();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.header}
      >
        {/* Theme Toggle */}
        <View style={styles.themeToggleContainer}>
          <ThemeToggle size={20} />
        </View>
        
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <CustomIcon name="profile" size={60} color={Colors.primary} />
            </View>
          </View>
          <Text style={[styles.userName, { color: '#007AFF' }]}>
            {user ? user.displayName : (isGuest ? 'Guest User' : 'Sleep Tracker')}
          </Text>
          <Text style={[styles.userEmail, { color: '#4DA6FF' }]}>
            {user ? user.email : (isGuest ? 'Continue as guest or register for full features' : 'Track your glow, every day')}
          </Text>
        </Animated.View>
      </LinearGradient>

        {/* Stats Section */}
        <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={[styles.statCard, { borderColor: colors.border }]}
          >
            <View style={[styles.statIconContainer]}>
              <CustomIcon name="trend" size={24} color={Colors.accent} />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{streakData.current_streak}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={[styles.statCard, { borderColor: colors.border }]}
          >
            <View style={[styles.statIconContainer]}>
              <CustomIcon name="camera" size={24} color={Colors.success} />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{getTotalScans()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Scans</Text>
          </LinearGradient>

          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={[styles.statCard, { borderColor: colors.border }]}
          >
            <View style={[styles.statIconContainer]}>
              <CustomIcon name="sleep" size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{getAverageSleepScore()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Sleep</Text>
          </LinearGradient>

          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={[styles.statCard, { borderColor: colors.border }]}
          >
            <View style={[styles.statIconContainer]}>
              <CustomIcon name="skin" size={24} color={Colors.accent} />
            </View>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{getAverageSkinScore()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Skin</Text>
          </LinearGradient>
        </Animated.View>

        {/* Achievements */}
        {badges.length > 0 && (
          <Animated.View style={[styles.achievementsSection, { opacity: fadeAnim }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Achievements</Text>
            <LinearGradient
              colors={[Colors.primary + '10', Colors.accent + '10']}
              style={[styles.badgesGrid, { borderColor: colors.border }]}
            >
              {badges.map((badge, index) => (
                <View key={index} style={[styles.badgeItem, { borderColor: colors.border }]}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                    <CustomIcon name="success" size={20} color="white" />
                  </View>
                  <Text style={[styles.badgeName, { color: colors.textPrimary }]}>{badge.name}</Text>
                </View>
              ))}
            </LinearGradient>
          </Animated.View>
        )}

        {/* Settings Sections */}
        <Animated.View style={[styles.settingsSection, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account</Text>
          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={[styles.settingsGroup, { borderColor: colors.border }]}
          >
            {!user && !isGuest && (
              <TouchableOpacity 
                style={[styles.settingItem, { borderColor: colors.border }]}
                onPress={() => {
                  // Navigate to login screen - this will be handled by the navigation
                  Alert.alert('Login', 'Please use the login screen to sign in to your account.');
                }}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconContainer]}>
                    <CustomIcon name="login" size={20} color={Colors.primary} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.textPrimary }]}>Sign In</Text>
                </View>
                <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}

            {!user && !isGuest && (
              <TouchableOpacity 
                style={[styles.settingItem, { borderColor: colors.border }]}
                onPress={() => {
                  // Navigate to register screen - this will be handled by the navigation
                  Alert.alert('Register', 'Please use the register screen to create a new account.');
                }}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconContainer]}>
                    <CustomIcon name="userPlus" size={20} color={Colors.primary} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.textPrimary }]}>Create Account</Text>
                </View>
                <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}

            {isGuest && (
              <TouchableOpacity 
                style={[styles.settingItem, { borderColor: colors.border }]}
                onPress={() => {
                  Alert.alert('Register', 'Please use the register screen to create a new account.');
                }}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconContainer]}>
                    <CustomIcon name="userPlus" size={20} color={Colors.primary} />
                  </View>
                  <Text style={[styles.settingText, { color: colors.textPrimary }]}>Register for Full Features</Text>
                </View>
                <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}

            {user && (
              <TouchableOpacity 
                style={[styles.settingItem, styles.dangerItem, { borderColor: colors.border }]}
                onPress={() => {
                  Alert.alert(
                    'Sign Out',
                    'Are you sure you want to sign out?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Sign Out', 
                        style: 'destructive',
                        onPress: logout
                      }
                    ]
                  );
                }}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconContainer, { backgroundColor: Colors.error + '20' }]}>
                    <CustomIcon name="logout" size={20} color={Colors.error} />
                  </View>
                  <Text style={[styles.settingText, { color: Colors.error }]}>Sign Out</Text>
                </View>
                <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.settingItem, { borderColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer]}>
                  <CustomIcon name="info" size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>Notifications</Text>
              </View>
              <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, { borderColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer]}>
                  <CustomIcon name="settings" size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>Privacy & Security</Text>
              </View>
              <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, { borderColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer]}>
                  <CustomIcon name="analytics" size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>Data & Storage</Text>
              </View>
              <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.settingsSection, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Support</Text>
          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={[styles.settingsGroup, { borderColor: colors.border }]}
          >
            <TouchableOpacity style={[styles.settingItem, { borderColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer]}>
                  <CustomIcon name="info" size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>Help & Support</Text>
              </View>
              <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, { borderColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer]}>
                  <CustomIcon name="score" size={20} color={Colors.accent} />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>Rate App</Text>
              </View>
              <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, { borderColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer]}>
                  <CustomIcon name="info" size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>About</Text>
              </View>
              <CustomIcon name="chevronRight" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View style={[styles.settingsSection, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Danger Zone</Text>
          <LinearGradient
            colors={[Colors.primary + '10', Colors.accent + '10']}
            style={[styles.settingsGroup, { borderColor: colors.border }]}
          >
            <TouchableOpacity 
              style={[styles.settingItem, styles.dangerItem, { borderColor: colors.border }]}
              onPress={() => {
                Alert.alert(
                  'Reset All Data',
                  'Are you sure you want to delete all your analysis data? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Reset', 
                      style: 'destructive',
                      onPress: resetAllData
                    }
                  ]
                );
              }}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: Colors.error + '20' }]}>
                  <CustomIcon name="refresh" size={20} color={Colors.error} />
                </View>
                <Text style={[styles.settingText, { color: Colors.error }]}>Reset All Data</Text>
              </View>
              <CustomIcon name="chevronRight" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: Spacing.lg,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: Spacing.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 3,
    borderColor: Colors.border,
  },
  userName: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: 'bold' as any,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily.primary,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse + 'CC',
    fontFamily: Typography.fontFamily.secondary,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.lg,
    marginBottom: Spacing['2xl'],
    gap: Spacing.xs,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.md,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold' as any,
    color: Colors.textPrimary,
    marginBottom: 2,
    fontFamily: Typography.fontFamily.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.secondary,
    lineHeight: 14,
  },
  achievementsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600' as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.primary,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  badgeIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  badgeName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.secondary,
  },
  settingsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  settingsGroup: {
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    ...Shadows.md,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.primary,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  bottomSpacing: {
    height: Spacing['3xl'],
  },
});

export default ProfileScreen;