import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-yellow-400" />
            ) : (
                <Sun className="w-5 h-5 text-gray-700" />
            )}
        </button>
    );
};
