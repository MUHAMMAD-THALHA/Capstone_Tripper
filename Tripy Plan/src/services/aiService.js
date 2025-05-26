import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const aiService = {
  // Get tour suggestions based on user input
  getTourSuggestions: async (query) => {
    try {
      const response = await axios.post(`${API_URL}/ai/suggestions`, { query });
      return response.data;
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return [];
    }
  },

  // Get personalized travel recommendations
  getPersonalizedRecommendations: async (userPreferences) => {
    try {
      const response = await axios.post(`${API_URL}/ai/recommendations`, userPreferences);
      return response.data;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return [];
    }
  },

  // Get destination autocomplete suggestions
  getDestinationSuggestions: async (input) => {
    try {
      const response = await axios.post(`${API_URL}/ai/destinations`, { input });
      return response.data;
    } catch (error) {
      console.error('Error getting destination suggestions:', error);
      return [];
    }
  }
}; 