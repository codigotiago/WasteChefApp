
import React from 'react';

const loadingMessages = [
    "Chopping the vegetables...",
    "Preheating the AI oven...",
    "Simmering creative ideas...",
    "Finding the perfect spice...",
    "Consulting the digital cookbook...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="text-center p-8 my-8 animate-fade-in">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
        </div>
    );
};
