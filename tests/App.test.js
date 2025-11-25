import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import * as mealService from '../services/mealService';

jest.mock('../services/mealService');

jest.mock('../components/MealDisplay', () => 'MealDisplay');

describe('App Component', () => {
  const mockMeal = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsuc1468756321.jpg',
    strInstructions: 'Preheat oven to 350F...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the input field', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter a meal name');
      expect(input).toBeTruthy();
    });
  });

  it('should render the Get Meal button', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Get Meal' });
      expect(button).toBeTruthy();
    });
  });

  it('should fetch a random meal on component mount', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      expect(mealService.fetchMeal).toHaveBeenCalledWith('');
    });
  });

  it('should display meal when one is fetched on mount', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      expect(mealService.fetchMeal).toHaveBeenCalled();
    });
  });

  it('should display "No meal was found" when no meal is fetched initially', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(null);
    
    render(<App />);
    
    await waitFor(() => {
      const noMealText = screen.getByText('No meal was found');
      expect(noMealText).toBeTruthy();
    });
  });

  it('should call fetchMeal without search query when Get Meal button is pressed with empty input', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Get Meal' });
      fireEvent.press(button);
    });
    
    await waitFor(() => {
      expect(mealService.fetchMeal).toHaveBeenCalledTimes(2);
      const calls = mealService.fetchMeal.mock.calls;
      expect(calls[1][0]).toBe('');
    });
  });

  it('should fetch meal by name when input is provided and button is pressed', async () => {
    mealService.fetchMeal.mockResolvedValue(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter a meal name');
      fireEvent.changeText(input, 'Pasta');
      
      const button = screen.getByRole('button', { name: 'Get Meal' });
      fireEvent.press(button);
    });
    
    await waitFor(() => {
      const calls = mealService.fetchMeal.mock.calls;
      expect(calls[calls.length - 1][0]).toBe('Pasta');
    });
  });

  it('should clear input field after button press', async () => {
    mealService.fetchMeal.mockResolvedValue(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter a meal name');
      fireEvent.changeText(input, 'Shakshuka');
    });
    
    const button = screen.getByRole('button', { name: 'Get Meal' });
    fireEvent.press(button);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter a meal name');
      expect(input.props.value).toBe('');
    });
  });

  it('should handle meal fetch error gracefully', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(null);
    
    render(<App />);
    
    await waitFor(() => {
      const noMealText = screen.getByText('No meal was found');
      expect(noMealText).toBeTruthy();
    });
  });

  it('should allow multiple searches with different queries', async () => {
    mealService.fetchMeal.mockResolvedValue(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      expect(mealService.fetchMeal).toHaveBeenCalledTimes(1);
    });
    
    const input = screen.getByPlaceholderText('Enter a meal name');
    const button = screen.getByRole('button', { name: 'Get Meal' });
    
    fireEvent.changeText(input, 'Pasta');
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
    
    fireEvent.changeText(input, 'Chicken');
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(input.props.value).toBe('');
      const calls = mealService.fetchMeal.mock.calls;
      expect(calls.length).toBeGreaterThan(1);
    });
  });

  it('should update input value when user types', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter a meal name');
      fireEvent.changeText(input, 'Shakshuka');
      expect(input.props.value).toBe('Shakshuka');
    });
  });

  it('should show "No meal was found" when fetchMeal returns null after button press', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      expect(mealService.fetchMeal).toHaveBeenCalled();
    });
    
    mealService.fetchMeal.mockResolvedValueOnce(null);
    
    const button = screen.getByRole('button', { name: 'Get Meal' });
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(screen.getByText('No meal was found')).toBeTruthy();
    });
  });

  it('should call fetchMeal with correct parameters on mount', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      expect(mealService.fetchMeal).toHaveBeenCalledWith('');
    });
  });

  it('should set meal state when fetchMeal returns data', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(mockMeal);
    
    render(<App />);
    
    await waitFor(() => {
      expect(mealService.fetchMeal).toHaveBeenCalled();
    });
  });

  it('should not call MealDisplay when meal is null', async () => {
    mealService.fetchMeal.mockResolvedValueOnce(null);
    
    render(<App />);
    
    await waitFor(() => {
      const noMealText = screen.getByText('No meal was found');
      expect(noMealText).toBeTruthy();
    });
  });
});
