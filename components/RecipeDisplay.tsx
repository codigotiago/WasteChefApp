
import React from 'react';
import type { Recipe } from '../types';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { StopIcon } from './icons/StopIcon';

interface RecipeDisplayProps {
  recipe: Recipe;
  isSpeaking: boolean;
  onTextToSpeech: (text: string) => void;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onTextToSpeech, isSpeaking }) => {
    const instructionsText = recipe.instructions.join('\n');

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-green-200 pb-2 mb-4">
                {recipe.title}
            </h2>
            <p className="text-gray-600 mb-6">{recipe.description}</p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-semibold text-green-700 mb-3">Ingredients</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="text-xl font-semibold text-green-700">Instructions</h3>
                         <button 
                            onClick={() => onTextToSpeech(instructionsText)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                isSpeaking 
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                         >
                           {isSpeaking ? <StopIcon /> : <SpeakerIcon />}
                           <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
                         </button>
                    </div>
                   
                    <ol className="list-decimal list-inside space-y-4 text-gray-700">
                        {recipe.instructions.map((step, index) => (
                            <li key={index} className="pl-2 leading-relaxed">{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};
