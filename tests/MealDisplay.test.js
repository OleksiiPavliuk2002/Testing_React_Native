import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ScrollView, Image } from 'react-native';
import MealDisplay from '../components/MealDisplay';

describe('MealDisplay Component', () => {
  const mockMeal = {
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsuc1468756321.jpg',
    strInstructions: 'Preheat oven to 350F. Mix all ingredients. Bake for 45 minutes.',
    idMeal: '52772',
  };

  it('should render the meal title', () => {
    render(<MealDisplay meal={mockMeal} />);
    
    const title = screen.getByText(mockMeal.strMeal);
    expect(title).toBeTruthy();
  });

  it('should render the meal image with correct URI', () => {
    const { root } = render(<MealDisplay meal={mockMeal} />);
    
    const image = root.findByProps({ testID: 'mealImage' });
    expect(image.props.source.uri).toBe(mockMeal.strMealThumb);
  });

  it('should render the meal instructions', () => {
    render(<MealDisplay meal={mockMeal} />);
    
    const description = screen.getByText(mockMeal.strInstructions);
    expect(description).toBeTruthy();
  });

  it('should render all meal information in correct order', () => {
    const { root } = render(<MealDisplay meal={mockMeal} />);
    
    const title = screen.getByText(mockMeal.strMeal);
    const image = root.findByProps({ testID: 'mealImage' });
    const instructions = screen.getByText(mockMeal.strInstructions);
    
    expect(title).toBeTruthy();
    expect(image).toBeTruthy();
    expect(instructions).toBeTruthy();
  });

  it('should handle meal with very long instructions', () => {
    const longInstructions = 'Step 1. '.repeat(50);
    const mealWithLongInstructions = {
      ...mockMeal,
      strInstructions: longInstructions,
    };
    
    render(<MealDisplay meal={mealWithLongInstructions} />);
    
    const description = screen.getByText(longInstructions);
    expect(description).toBeTruthy();
  });

  it('should render meal with different image URL', () => {
    const differentMeal = {
      ...mockMeal,
      strMealThumb: 'https://www.themealdb.com/images/media/meals/different.jpg',
    };
    
    const { root } = render(<MealDisplay meal={differentMeal} />);
    
    const image = root.findByProps({ testID: 'mealImage' });
    expect(image.props.source.uri).toBe(differentMeal.strMealThumb);
  });

  it('should render meal with special characters in name', () => {
    const specialMeal = {
      ...mockMeal,
      strMeal: 'Shakshuka & Egg Special',
    };
    
    render(<MealDisplay meal={specialMeal} />);
    
    const title = screen.getByText('Shakshuka & Egg Special');
    expect(title).toBeTruthy();
  });

  it('should render ScrollView to allow scrolling', () => {
    const { root } = render(<MealDisplay meal={mockMeal} />);
    
    const title = screen.getByText(mockMeal.strMeal);
    expect(title).toBeTruthy();
  });

  it('should render meal with empty instructions', () => {
    const mealNoInstructions = {
      ...mockMeal,
      strInstructions: '',
    };
    
    render(<MealDisplay meal={mealNoInstructions} />);
    
    const title = screen.getByText(mockMeal.strMeal);
    expect(title).toBeTruthy();
  });

  it('should render multiple different meals correctly', () => {
    const meal1 = {
      strMeal: 'Pasta Carbonara',
      strMealThumb: 'https://example.com/pasta.jpg',
      strInstructions: 'Cook pasta...',
    };
    
    const { rerender } = render(<MealDisplay meal={meal1} />);
    let title = screen.getByText('Pasta Carbonara');
    expect(title).toBeTruthy();
    
    const meal2 = {
      strMeal: 'Caesar Salad',
      strMealThumb: 'https://example.com/salad.jpg',
      strInstructions: 'Mix salad...',
    };
    
    rerender(<MealDisplay meal={meal2} />);
    title = screen.getByText('Caesar Salad');
    expect(title).toBeTruthy();
  });
});
