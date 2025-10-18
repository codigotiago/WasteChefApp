
import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="text-center my-12 p-6 animate-fade-in">
      <ChefHatIcon />
      <h2 className="text-2xl font-bold text-gray-700 mt-4">Welcome to Waste-Not Chef AI</h2>
      <p className="mt-2 text-gray-500">
        Ready to cook up something amazing while saving the planet?
        <br />
        Upload a photo of your ingredients to get started!
      </p>
    </div>
  );
};
