
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded-r-lg" role="alert">
      <p className="font-bold">An Error Occurred</p>
      <p>{message}</p>
    </div>
  );
};
