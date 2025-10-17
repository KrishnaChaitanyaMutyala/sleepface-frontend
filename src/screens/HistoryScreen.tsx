import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAnalysis } from '../contexts/AnalysisContext';
import { useTheme } from '../contexts/ThemeContext';
import { AnalysisResult } from '../types';
import CustomIcon from '../components/CustomIcon';
import { Colors, Typography, Spacing, BorderRadius, Shadows, getScoreColor, getScoreLabel, Gradients, getThemeColors, getThemeGradients } from '../design/DesignSystem';

const { width } = Dimensions.get('window');

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const gradients = getThemeGradients(isDark);
  const { analysisHistory, getAnalysisHistory, isLoading } = useAnalysis();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    loadHistory();
  }, [selectedPeriod]);

  const loadHistory = async () => {
    try {
      const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
      await getAnalysisHistory(days);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getAverageScore = (type: 'sleep' | 'skin') => {
    if (analysisHistory.length === 0) return 0;
    
    const total = analysisHistory.reduce((sum, analysis) => {
      return sum + (type === 'sleep' ? analysis.sleep_score : analysis.skin_health_score);
    }, 0);
    
    return Math.round(total / analysisHistory.length);
  };

  const getTrend = (type: 'sleep' | 'skin') => {
    if (analysisHistory.length < 2) return 'stable';
    
    const recent = analysisHistory.slice(0, 3);
    const older = analysisHistory.slice(-3);
    
    const recentAvg = recent.reduce((sum, analysis) => {
      return sum + (type === 'sleep' ? analysis.sleep_score : analysis.skin_health_score);
    }, 0) / recent.length;
    
    const olderAvg = older.reduce((sum, analysis) => {
      return sum + (type === 'sleep' ? analysis.sleep_score : analysis.skin_health_score);
    }, 0) / older.length;
    
    if (recentAvg > olderAvg + 5) return 'improving';
    if (recentAvg < olderAvg - 5) return 'declining';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return 'trend';
      case 'declining': return 'trendDown';
      default: return 'trendStable';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return '#10B981';
      case 'declining': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.background, colors.background]}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: Colors.primary }]}>Analysis History</Text>
        <Text style={[styles.headerSubtitle, { color: '#4DA6FF' }]}>
          Track your progress over time
        </Text>
      </LinearGradient>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['week', 'month', 'all'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && [styles.periodButtonActive, { backgroundColor: Colors.primary }]
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && [styles.periodButtonTextActive, { color: '#FFFFFF' }]
            ]}>
              {period === 'week' ? '7 Days' : period === 'month' ? '30 Days' : 'All Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Stats */}
      {analysisHistory.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Sleep Score</Text>
              <View style={styles.statValueContainer}>
                <Text style={[styles.statValue, { color: getScoreColor(getAverageScore('sleep')) }]}>
                  {getAverageScore('sleep')}
                </Text>
                <CustomIcon 
                  name={getTrendIcon(getTrend('sleep'))} 
                  size={16} 
                  color={getTrendColor(getTrend('sleep'))} 
                />
              </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Skin Health</Text>
              <View style={styles.statValueContainer}>
                <Text style={[styles.statValue, { color: getScoreColor(getAverageScore('skin')) }]}>
                  {getAverageScore('skin')}
                </Text>
                <CustomIcon 
                  name={getTrendIcon(getTrend('skin'))} 
                  size={16} 
                  color={getTrendColor(getTrend('skin'))} 
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* History List */}
      {analysisHistory.length > 0 ? (
        <View style={styles.historyContainer}>
          {analysisHistory.map((analysis, index) => (
            <TouchableOpacity
              key={`${analysis.date}-${index}`}
              style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => {
                // Navigate to analysis detail
                navigation.navigate('Analysis' as never);
              }}
            >
              <View style={styles.historyItemHeader}>
                <Text style={[styles.historyDate, { color: colors.textPrimary }]}>
                  {formatDate(analysis.date)}
                </Text>
                <Text style={[styles.historyLabel, { color: Colors.primary }]}>
                  {analysis.fun_label}
                </Text>
              </View>
              
              <View style={styles.historyScores}>
                <View style={styles.historyScoreItem}>
                  <Text style={[styles.historyScoreLabel, { color: colors.textSecondary }]}>Sleep</Text>
                  <Text style={[styles.historyScoreValue, { color: getScoreColor(analysis.sleep_score) }]}>
                    {analysis.sleep_score}
                  </Text>
                </View>
                <View style={styles.historyScoreItem}>
                  <Text style={[styles.historyScoreLabel, { color: colors.textSecondary }]}>Skin</Text>
                  <Text style={[styles.historyScoreValue, { color: getScoreColor(analysis.skin_health_score) }]}>
                    {analysis.skin_health_score}
                  </Text>
                </View>
              </View>
              
              <CustomIcon name="chevronRight" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <CustomIcon name="analytics" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No History Yet</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Start taking selfies to build your analysis history!
          </Text>
          <TouchableOpacity 
            style={[styles.emptyButton, { backgroundColor: Colors.primary }]}
            onPress={() => navigation.navigate('Camera' as never)}
          >
            <Text style={styles.emptyButtonText}>Take First Selfie</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 20,
    marginTop: -20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  historyContainer: {
    margin: 20,
    marginTop: 0,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItemHeader: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  historyLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  historyScores: {
    flexDirection: 'row',
    marginRight: 12,
  },
  historyScoreItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  historyScoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  historyScoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: 'BalooBhaijaan2-Regular',
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'BalooBhaijaan2-Regular',
  },
});

export default HistoryScreen;
