import React from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../Common/ThemeToggle';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 relative overflow-auto">
                <div className="absolute top-4 right-6 z-50">
                    <ThemeToggle />
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};
