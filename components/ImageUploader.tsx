
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  currentImage: File | null;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage ? URL.createObjectURL(currentImage) : null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-500 hover:bg-green-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
            <UploadIcon />
          <p className="text-gray-600 font-semibold">
            {currentImage ? 'Upload a different photo' : 'Click to upload a photo of your ingredients'}
          </p>
          <p className="text-sm text-gray-400">PNG, JPG, or WEBP</p>
        </div>
      </button>

      {previewUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Your Ingredients:</h3>
          <img
            src={previewUrl}
            alt="Uploaded ingredients"
            className="mt-2 mx-auto rounded-lg shadow-md max-h-80 object-contain"
          />
        </div>
      )}
    </div>
  );
};
