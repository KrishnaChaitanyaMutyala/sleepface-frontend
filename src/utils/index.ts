// Utility functions for the Sleep Face app
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatScore = (score: number): string => {
  return score.toString();
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4CAF50';
  if (score >= 60) return '#FF9800';
  return '#F44336';
};



