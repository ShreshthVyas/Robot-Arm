'use client'

import { useEffect, useRef } from 'react';

const CameraView = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    videoRef.current!.srcObject = stream;
                })
                .catch(error => console.error('Error accessing camera', error));
        }
    }, []);

    return (
        
        <div className="bg-gray-800">
            <video ref={videoRef} autoPlay className="w-auto h-auto rounded-lg shadow-lg"></video>
        </div>
        
    );
};

export default CameraView;
