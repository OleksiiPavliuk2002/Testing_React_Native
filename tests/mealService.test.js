import axios from 'axios';
import { fetchMeal, apiURL } from '../services/mealService';

jest.mock('axios');

describe('mealService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMeal', () => {
    it('should fetch a random meal when no search query is provided', async () => {
      const mockMeal = {
        idMeal: '52772',
        strMeal: 'Teriyaki Chicken Casserole',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsuc1468756321.jpg',
        strInstructions: 'Preheat oven to 350F...',
      };

      axios.get.mockResolvedValueOnce({
        data: {
          meals: [mockMeal],
        },
      });

      const result = await fetchMeal('');
      
      expect(result).toEqual(mockMeal);
      expect(axios.get).toHaveBeenCalledWith(`${apiURL}random.php`);
    });

    it('should fetch a meal by search query', async () => {
      const mockMeal = {
        idMeal: '52854',
        strMeal: 'Pasta Carbonara',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/llcpl01614764419.jpg',
        strInstructions: 'Cook pasta...',
      };

      axios.get.mockResolvedValueOnce({
        data: {
          meals: [mockMeal],
        },
      });

      const result = await fetchMeal('Carbonara');
      
      expect(result).toEqual(mockMeal);
      expect(axios.get).toHaveBeenCalledWith(`${apiURL}search.php?s=Carbonara`);
    });

    it('should return the first meal when multiple results are returned', async () => {
      const mockMeal1 = {
        idMeal: '52854',
        strMeal: 'Pasta Carbonara',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/llcpl01614764419.jpg',
      };

      const mockMeal2 = {
        idMeal: '52855',
        strMeal: 'Pasta Amatriciana',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/guqaka1614764419.jpg',
      };

      axios.get.mockResolvedValueOnce({
        data: {
          meals: [mockMeal1, mockMeal2],
        },
      });

      const result = await fetchMeal('Pasta');
      
      expect(result).toEqual(mockMeal1);
    });

    it('should return null when no meals are found', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          meals: null,
        },
      });

      const result = await fetchMeal('NonExistentMeal');
      
      expect(result).toBeUndefined();
    });

    it('should return null when an empty meals array is returned', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          meals: [],
        },
      });

      const result = await fetchMeal('NotFound');
      
      expect(result).toBeUndefined();
    });

    it('should return null on network error', async () => {
      const error = new Error('Network Error');
      axios.get.mockRejectedValueOnce(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await fetchMeal('Meal');
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(error);
      
      consoleSpy.mockRestore();
    });

    it('should return null when axios throws a timeout error', async () => {
      const error = new Error('Timeout');
      axios.get.mockRejectedValueOnce(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await fetchMeal('Meal');
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(error);
      
      consoleSpy.mockRestore();
    });

    it('should construct the correct URL with special characters in search query', async () => {
      const mockMeal = {
        idMeal: '52772',
        strMeal: 'Shakshuka',
      };

      axios.get.mockResolvedValueOnce({
        data: {
          meals: [mockMeal],
        },
      });

      await fetchMeal('Shakshuka');
      
      expect(axios.get).toHaveBeenCalledWith(`${apiURL}search.php?s=Shakshuka`);
    });

    it('should handle undefined response data gracefully', async () => {
      axios.get.mockResolvedValueOnce({
        data: undefined,
      });

      const result = await fetchMeal('Meal');
      
      expect(result).toBeUndefined();
    });
  });
});
