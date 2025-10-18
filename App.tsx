
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { RecipeDisplay } from './components/RecipeDisplay';
import { Loader } from './components/Loader';
import { SustainabilityTip } from './components/SustainabilityTip';
import { WelcomeMessage } from './components/WelcomeMessage';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateRecipeFromImage, generateSustainabilityTip, textToSpeech } from './services/geminiService';
import { playAudio, stopAudio } from './utils/audioUtils';
import type { Recipe } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [sustainabilityTip, setSustainabilityTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (err) => reject(err);
    });
  };

  const resetState = () => {
    setImageFile(null);
    setRecipe(null);
    setSustainabilityTip(null);
    setError(null);
    setIsLoading(false);
    if (isSpeaking) {
      handleStopAudio();
    }
  };

  const handleImageUpload = useCallback(async (file: File) => {
    resetState();
    setImageFile(file);
    setIsLoading(true);
    setError(null);

    try {
      const base64Image = await fileToBase64(file);
      const generatedRecipe = await generateRecipeFromImage(base64Image, file.type);
      setRecipe(generatedRecipe);

      if (generatedRecipe && generatedRecipe.ingredients) {
        const tip = await generateSustainabilityTip(generatedRecipe.ingredients);
        setSustainabilityTip(tip);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate a recipe. The AI might be busy, or the image could not be processed. Please try another image.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTextToSpeech = useCallback(async (text: string) => {
    if (isSpeaking) {
      handleStopAudio();
      return;
    }
    
    setError(null);
    setIsSpeaking(true);

    try {
      if (!audioContextRef.current) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioBuffer = await textToSpeech(text, audioContextRef.current);
      const source = await playAudio(audioBuffer, audioContextRef.current);
      audioSourceRef.current = source;
      source.onended = () => {
        setIsSpeaking(false);
        audioSourceRef.current = null;
      };
    } catch (err) {
      console.error(err);
      setError('Could not play audio. Please try again.');
      setIsSpeaking(false);
    }
  }, [isSpeaking]);
  
  const handleStopAudio = () => {
    if (audioSourceRef.current) {
        stopAudio(audioSourceRef.current);
        audioSourceRef.current = null;
    }
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 antialiased">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-10">
            <ImageUploader onImageUpload={handleImageUpload} currentImage={imageFile} disabled={isLoading} />

            {error && <ErrorDisplay message={error} />}

            {isLoading && <Loader />}

            {!isLoading && !recipe && !imageFile && <WelcomeMessage />}
            
            {!isLoading && recipe && (
              <div className="mt-8 space-y-8">
                <RecipeDisplay 
                  recipe={recipe} 
                  onTextToSpeech={handleTextToSpeech} 
                  isSpeaking={isSpeaking}
                />
                {sustainabilityTip && <SustainabilityTip tip={sustainabilityTip} />}
              </div>
            )}
          </div>
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by Gemini API. Designed for a sustainable future.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
