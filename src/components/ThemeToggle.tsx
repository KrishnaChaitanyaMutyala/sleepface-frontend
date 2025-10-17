import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../design/DesignSystem';

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 24, style }) => {
  const { isDark, toggleTheme } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceSecondary }]}>
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={size}
          color={isDark ? '#FFD700' : '#007AFF'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle;



