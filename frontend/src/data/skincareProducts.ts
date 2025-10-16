import { SkincareProduct } from '../types';

export const SKINCARE_PRODUCTS: SkincareProduct[] = [
  // Cleansers
  {
    id: 'gentle_cleanser',
    name: 'Gentle Cleanser',
    category: 'cleanser',
    benefits: ['Removes dirt', 'Maintains pH balance', 'Non-stripping'],
    usage: 'both'
  },
  {
    id: 'foaming_cleanser',
    name: 'Foaming Cleanser',
    category: 'cleanser',
    benefits: ['Deep cleansing', 'Removes oil', 'Refreshing'],
    usage: 'both'
  },
  {
    id: 'oil_cleanser',
    name: 'Oil Cleanser',
    category: 'cleanser',
    benefits: ['Removes makeup', 'Dissolves oil', 'Gentle'],
    usage: 'evening'
  },
  {
    id: 'micellar_water',
    name: 'Micellar Water',
    category: 'cleanser',
    benefits: ['Quick cleansing', 'No rinsing needed', 'Gentle'],
    usage: 'both'
  },

  // Moisturizers
  {
    id: 'light_moisturizer',
    name: 'Light Moisturizer',
    category: 'moisturizer',
    benefits: ['Hydration', 'Non-greasy', 'Quick absorption'],
    usage: 'both'
  },
  {
    id: 'rich_moisturizer',
    name: 'Rich Moisturizer',
    category: 'moisturizer',
    benefits: ['Deep hydration', 'Barrier repair', 'Anti-aging'],
    usage: 'evening'
  },
  {
    id: 'gel_moisturizer',
    name: 'Gel Moisturizer',
    category: 'moisturizer',
    benefits: ['Lightweight', 'Oil-free', 'Cooling'],
    usage: 'both'
  },
  {
    id: 'night_cream',
    name: 'Night Cream',
    category: 'moisturizer',
    benefits: ['Intensive repair', 'Anti-aging', 'Rich texture'],
    usage: 'evening'
  },

  // Serums
  {
    id: 'vitamin_c_serum',
    name: 'Vitamin C Serum',
    category: 'serum',
    benefits: ['Brightening', 'Antioxidant', 'Collagen boost'],
    usage: 'morning'
  },
  {
    id: 'hyaluronic_acid',
    name: 'Hyaluronic Acid Serum',
    category: 'serum',
    benefits: ['Intense hydration', 'Plumping', 'Smoothing'],
    usage: 'both'
  },
  {
    id: 'niacinamide_serum',
    name: 'Niacinamide Serum',
    category: 'serum',
    benefits: ['Pore minimizing', 'Oil control', 'Anti-inflammatory'],
    usage: 'both'
  },
  {
    id: 'peptide_serum',
    name: 'Peptide Serum',
    category: 'serum',
    benefits: ['Anti-aging', 'Firmness', 'Collagen support'],
    usage: 'evening'
  },

  // Sunscreens
  {
    id: 'mineral_sunscreen',
    name: 'Mineral Sunscreen',
    category: 'sunscreen',
    benefits: ['Physical protection', 'Gentle', 'Immediate protection'],
    usage: 'morning'
  },
  {
    id: 'chemical_sunscreen',
    name: 'Chemical Sunscreen',
    category: 'sunscreen',
    benefits: ['Lightweight', 'No white cast', 'Broad spectrum'],
    usage: 'morning'
  },
  {
    id: 'tinted_sunscreen',
    name: 'Tinted Sunscreen',
    category: 'sunscreen',
    benefits: ['UV protection', 'Light coverage', 'Even skin tone'],
    usage: 'morning'
  },

  // Treatments
  {
    id: 'retinol',
    name: 'Retinol',
    category: 'treatment',
    benefits: ['Anti-aging', 'Cell turnover', 'Wrinkle reduction'],
    usage: 'evening'
  },
  {
    id: 'retinoid',
    name: 'Retinoid',
    category: 'treatment',
    benefits: ['Stronger anti-aging', 'Acne treatment', 'Skin renewal'],
    usage: 'evening'
  },
  {
    id: 'alpha_hydroxy_acid',
    name: 'Alpha Hydroxy Acid (AHA)',
    category: 'treatment',
    benefits: ['Exfoliation', 'Brightening', 'Texture improvement'],
    usage: 'evening'
  },
  {
    id: 'beta_hydroxy_acid',
    name: 'Beta Hydroxy Acid (BHA)',
    category: 'treatment',
    benefits: ['Pore cleansing', 'Acne treatment', 'Oil control'],
    usage: 'evening'
  },
  {
    id: 'azelaic_acid',
    name: 'Azelaic Acid',
    category: 'treatment',
    benefits: ['Anti-inflammatory', 'Acne treatment', 'Hyperpigmentation'],
    usage: 'both'
  },

  // Masks
  {
    id: 'hydrating_mask',
    name: 'Hydrating Mask',
    category: 'mask',
    benefits: ['Intense moisture', 'Plumping', 'Soothing'],
    usage: 'evening'
  },
  {
    id: 'clay_mask',
    name: 'Clay Mask',
    category: 'mask',
    benefits: ['Oil absorption', 'Pore tightening', 'Deep cleansing'],
    usage: 'evening'
  },
  {
    id: 'sheet_mask',
    name: 'Sheet Mask',
    category: 'mask',
    benefits: ['Intensive treatment', 'Hydration boost', 'Relaxing'],
    usage: 'evening'
  },

  // Toners
  {
    id: 'hydrating_toner',
    name: 'Hydrating Toner',
    category: 'toner',
    benefits: ['pH balancing', 'Hydration', 'Prep for serums'],
    usage: 'both'
  },
  {
    id: 'exfoliating_toner',
    name: 'Exfoliating Toner',
    category: 'toner',
    benefits: ['Gentle exfoliation', 'Brightening', 'Smoothing'],
    usage: 'evening'
  },

  // Exfoliants
  {
    id: 'physical_exfoliant',
    name: 'Physical Exfoliant',
    category: 'exfoliant',
    benefits: ['Manual exfoliation', 'Immediate results', 'Smoothing'],
    usage: 'evening'
  },
  {
    id: 'enzyme_exfoliant',
    name: 'Enzyme Exfoliant',
    category: 'exfoliant',
    benefits: ['Gentle exfoliation', 'Natural', 'Suitable for sensitive skin'],
    usage: 'evening'
  }
];

export const getProductsByCategory = (category: string) => {
  return SKINCARE_PRODUCTS.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return SKINCARE_PRODUCTS.find(product => product.id === id);
};

export const getProductBenefits = (productIds: string[]) => {
  return productIds.map(id => {
    const product = getProductById(id);
    return product ? product.benefits : [];
  }).flat();
};
