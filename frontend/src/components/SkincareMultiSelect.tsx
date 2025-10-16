import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SKINCARE_PRODUCTS, getProductsByCategory } from '../data/skincareProducts';
import { SkincareProduct } from '../types';
import CustomIcon from './CustomIcon';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients } from '../design/DesignSystem';

interface SkincareMultiSelectProps {
  selectedProducts: string[];
  onSelectionChange: (products: string[]) => void;
  placeholder?: string;
}

const SkincareMultiSelect: React.FC<SkincareMultiSelectProps> = ({
  selectedProducts,
  onSelectionChange,
  placeholder = "Select skincare products..."
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'treatment', 'mask', 'toner', 'exfoliant'];
  
  const getCategoryIcon = (category: string) => {
    const icons = {
      cleanser: 'water',
      moisturizer: 'leaf',
      serum: 'flask',
      sunscreen: 'sunny',
      treatment: 'medical',
      mask: 'happy',
      toner: 'refresh',
      exfoliant: 'diamond'
    };
    return icons[category as keyof typeof icons] || 'ellipse';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      cleanser: '#007AFF',
      moisturizer: '#10B981',
      serum: '#007AFF',
      sunscreen: '#F59E0B',
      treatment: '#EF4444',
      mask: '#EC4899',
      toner: '#06B6D4',
      exfoliant: '#84CC16'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onSelectionChange(selectedProducts.filter(id => id !== productId));
    } else {
      onSelectionChange([...selectedProducts, productId]);
    }
  };

  const getSelectedProductNames = () => {
    return selectedProducts.map(id => {
      const product = SKINCARE_PRODUCTS.find(p => p.id === id);
      return product ? product.name : id;
    });
  };

  const renderProduct = ({ item }: { item: SkincareProduct }) => {
    const isSelected = selectedProducts.includes(item.id);
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity
        style={[
          styles.productItem,
          isSelected && styles.selectedProduct,
          { borderLeftColor: categoryColor }
        ]}
        onPress={() => toggleProduct(item.id)}
      >
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={[styles.productName, isSelected && styles.selectedText]}>
              {item.name}
            </Text>
            <CustomIcon
              name={isSelected ? 'success' : 'remove'}
              size={20}
              color={isSelected ? Colors.success : Colors.textSecondary}
            />
          </View>
          <Text style={[styles.productCategory, isSelected && styles.selectedSubText]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)} • {item.usage}
          </Text>
          <Text style={[styles.productBenefits, isSelected && styles.selectedSubText]}>
            {item.benefits.slice(0, 2).join(', ')}
            {item.benefits.length > 2 && '...'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategorySection = (category: string) => {
    const products = getProductsByCategory(category);
    const categoryColor = getCategoryColor(category);
    const categoryIcon = getCategoryIcon(category);
    
    return (
      <View key={category} style={styles.categorySection}>
        <View style={[styles.categoryHeader, { backgroundColor: categoryColor + '20' }]}>
          <CustomIcon name={categoryIcon} size={20} color={categoryColor} />
          <Text style={[styles.categoryTitle, { color: categoryColor }]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}s
          </Text>
        </View>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedProducts.length > 0 ? (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedCount}>
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </Text>
              <Text style={styles.selectedNames} numberOfLines={2}>
                {getSelectedProductNames().join(', ')}
              </Text>
            </View>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
          <CustomIcon name="chevronDown" size={20} color={Colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={Gradients.primary as any}
            style={styles.modalHeader}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <CustomIcon name="close" size={24} color={Colors.textInverse} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Skincare Products</Text>
              <View style={styles.headerSpacer} />
            </View>
          </LinearGradient>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {categories.map(category => renderCategorySection(category))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>
                Done ({selectedProducts.length} selected)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedContainer: {
    flex: 1,
  },
  selectedCount: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedNames: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  placeholder: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  modalHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: Colors.textInverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600' as any,
    fontFamily: Typography.fontFamily.primary,
  },
  closeButton: {
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'BalooBhaijaan2-SemiBold',
  },
  productItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedProduct: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'BalooBhaijaan2-SemiBold',
  },
  selectedText: {
    color: '#10B981',
  },
  productCategory: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  selectedSubText: {
    color: '#6EE7B7',
  },
  productBenefits: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 16,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'BalooBhaijaan2-SemiBold',
  },
});

export default SkincareMultiSelect;
