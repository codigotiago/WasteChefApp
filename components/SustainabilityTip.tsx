
import React from 'react';
import { LeafIcon } from './icons/LeafIcon';

interface SustainabilityTipProps {
  tip: string;
}

export const SustainabilityTip: React.FC<SustainabilityTipProps> = ({ tip }) => {
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg animate-fade-in" role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <LeafIcon />
        </div>
        <div className="ml-3">
          <p className="font-bold">Sustainability Tip</p>
          <p className="text-sm">{tip}</p>
        </div>
      </div>
    </div>
  );
};
