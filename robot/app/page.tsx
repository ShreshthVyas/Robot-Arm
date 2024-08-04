'use client'
import { useState } from 'react';
import CameraView from '../components/CameraView';
import RobotView from '../components/RobotView';

const Home = () => {
    const [view, setView] = useState<'camera' | 'robot'>('camera');

    const handleToggle = () => {
        setView(prev => (prev === 'camera' ? 'robot' : 'camera'));
    };

    return (
        <div className="h-screen flex flex-col">
            <header className="w-full bg-gray-800 text-white p-4 flex items-center justify-between">
                <img src="/logo.svg" alt="Logo" className="w-12 md:w-16" />
                <button onClick={handleToggle} className="px-4 py-2 bg-blue-500 text-white rounded">
                    {view === 'camera' ? 'Switch to Robot View' : 'Switch to Camera View'}
                </button>
            </header>
            <main className="flex-grow flex items-center justify-center">
                {view === 'camera' ? <CameraView /> : <RobotView />}
            </main>
        </div>
    );
};

export default Home;
