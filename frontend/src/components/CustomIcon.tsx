import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Icons, Colors } from '../design/DesignSystem';

interface CustomIconProps {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  style?: any;
}

const CustomIcon: React.FC<CustomIconProps> = ({ 
  name, 
  size = 24, 
  color = Colors.textPrimary,
  style 
}) => {
  const iconName = Icons[name] as keyof typeof Ionicons.glyphMap;
  
  return (
    <Ionicons 
      name={iconName} 
      size={size} 
      color={color} 
      style={style}
    />
  );
};

export default CustomIcon;
