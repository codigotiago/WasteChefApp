
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-md p-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Waste-Not Chef AI
        </h1>
        <p className="mt-2 text-lg opacity-90">
          Turn your leftovers into delicious meals.
        </p>
      </div>
    </header>
  );
};
