// 'use client'
// import { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// // Function to convert radians to degrees
// const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);

// // Function to convert degrees to radians
// const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

// const RobotView = () => {
//     const sceneRef = useRef<HTMLDivElement>(null);
//     const [joint1Angle, setJoint1Angle] = useState(0);
//     const [joint2Angle, setJoint2Angle] = useState(0);
//     const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//     const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//     const joint1Ref = useRef<THREE.Group | null>(null);
//     const joint2Ref = useRef<THREE.Group | null>(null);

//     useEffect(() => {
//         // Clear previous scene
//         if (sceneRef.current) {
//             sceneRef.current.innerHTML = '';
//         }

//         // Create scene
//         const scene = new THREE.Scene();

//         // Create camera
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         camera.position.set(0, 1, 5);
//         camera.lookAt(0, 1, 0);
//         cameraRef.current = camera;

//         // Create renderer
//         const renderer = new THREE.WebGLRenderer();
//         renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
//         if (sceneRef.current) {
//             sceneRef.current.appendChild(renderer.domElement);
//         }
//         rendererRef.current = renderer;

//         // Create arm group
//         const armGroup = new THREE.Group();

//         // Create base
//         const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
//         const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
//         const base = new THREE.Mesh(baseGeometry, baseMaterial);
//         base.rotation.x = Math.PI / 2;
//         armGroup.add(base);

//         // Create joint1 and arm1
//         const joint1 = new THREE.Group();
//         const arm1Geometry = new THREE.BoxGeometry(2, 0.3, 0.3);
//         const arm1Material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
//         const arm1 = new THREE.Mesh(arm1Geometry, arm1Material);
//         arm1.position.x = 1; // Position the arm along the x-axis
//         joint1.add(arm1);
//         joint1.position.y = 0.5; // Position the joint above the base
//         armGroup.add(joint1);

//         // Create joint2 and arm2
//         const joint2 = new THREE.Group();
//         const arm2Geometry = new THREE.BoxGeometry(1.5, 0.2, 0.2);
//         const arm2Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//         const arm2 = new THREE.Mesh(arm2Geometry, arm2Material);
//         arm2.position.x = 0.75; // Position the arm along the x-axis
//         joint2.add(arm2);
//         joint2.position.x = 2; // Position the joint at the end of arm1
//         joint1.add(joint2);

//         scene.add(armGroup);
//         joint1Ref.current = joint1;
//         joint2Ref.current = joint2;

//         // Add controls
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;

//         // Animation loop
//         const animate = () => {
//             requestAnimationFrame(animate);
//             if (joint1Ref.current) {
//                 joint1Ref.current.rotation.z = degreesToRadians(joint1Angle);
//             }
//             if (joint2Ref.current) {
//                 joint2Ref.current.rotation.z = degreesToRadians(joint2Angle);
//             }
//             controls.update();
//             renderer.render(scene, camera);
//         };
//         animate();

//         // Handle window resize
//         const handleResize = () => {
//             if (rendererRef.current) {
//                 rendererRef.current.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
//             }
//             if (cameraRef.current) {
//                 cameraRef.current.aspect = window.innerWidth / window.innerHeight;
//                 cameraRef.current.updateProjectionMatrix();
//             }
//         };
//         window.addEventListener('resize', handleResize);
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, [joint1Angle, joint2Angle]);

//     const adjustJoint = (joint: number, delta: number) => {
//         if (joint === 1) {
//             setJoint1Angle(prev => prev + delta);
//         } else if (joint === 2) {
//             setJoint2Angle(prev => prev + delta);
//         }
//     };

//     const saveAngles = () => {
//         const filename = prompt('Enter filename for saving angles:');
//         if (filename) {
//             const data = `Joint 1: ${joint1Angle}\nJoint 2: ${joint2Angle}`;
//             const blob = new Blob([data], { type: 'text/plain' });
//             const link = document.createElement('a');
//             link.href = URL.createObjectURL(blob);
//             link.download = `${filename}.txt`;
//             link.click();
//         }
//     };

//     return (
//         <div className="w-full h-full flex  items-center justify-center p-4 bg-gray-800">
//             <div id="3d-model" ref={sceneRef} className="w-full h-64 md:h-80 lg:h-96"></div>
//             <div id="controls" className="mt-4 flex flex-col items-center">
//                 <div className="mb-4 flex flex-col items-center space-y-2">
//                     <div className="flex items-center space-x-2">
//                         <button onClick={() => adjustJoint(1, -1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 1 -</button>
//                         <input type="text" value={joint1Angle} readOnly className="w-20 text-center border border-gray-300 rounded" />
//                         <button onClick={() => adjustJoint(1, 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 1 +</button>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <button onClick={() => adjustJoint(2, -1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 2 -</button>
//                         <input type="text" value={joint2Angle} readOnly className="w-20 text-center border border-gray-300 rounded" />
//                         <button onClick={() => adjustJoint(2, 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 2 +</button>
//                     </div>
//                 </div>
//                 <button onClick={saveAngles} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
//             </div>
//         </div>
//     );
// };

// export default RobotView;

'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);
const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const RobotView = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [joint1Angle, setJoint1Angle] = useState(0);
    const [joint2Angle, setJoint2Angle] = useState(0);
    const [joint3Angle, setJoint3Angle] = useState(0);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const joint1Ref = useRef<THREE.Group | null>(null);
    const joint2Ref = useRef<THREE.Group | null>(null);
    const joint3Ref = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (sceneRef.current) {
            sceneRef.current.innerHTML = '';
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1, 5);
        camera.lookAt(0, 1, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
        if (sceneRef.current) {
            sceneRef.current.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        const armGroup = new THREE.Group();

        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.rotation.x = Math.PI / 2;
        armGroup.add(base);

        const joint1 = new THREE.Group();
        const arm1Geometry = new THREE.BoxGeometry(2, 0.3, 0.3);
        const arm1Material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const arm1 = new THREE.Mesh(arm1Geometry, arm1Material);
        arm1.position.x = 1;
        joint1.add(arm1);
        joint1.position.y = 0.5;
        armGroup.add(joint1);

        const joint2 = new THREE.Group();
        const arm2Geometry = new THREE.BoxGeometry(1.5, 0.2, 0.2);
        const arm2Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const arm2 = new THREE.Mesh(arm2Geometry, arm2Material);
        arm2.position.x = 0.75;
        joint2.add(arm2);
        joint2.position.x = 2;
        joint1.add(joint2);

        const joint3 = new THREE.Group();
        const arm3Geometry = new THREE.BoxGeometry(1, 0.15, 0.15);
        const arm3Material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const arm3 = new THREE.Mesh(arm3Geometry, arm3Material);
        arm3.position.x = 0.5;
        joint3.add(arm3);
        joint3.position.x = 1.5;
        joint2.add(joint3);

        scene.add(armGroup);
        joint1Ref.current = joint1;
        joint2Ref.current = joint2;
        joint3Ref.current = joint3;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const animate = () => {
            requestAnimationFrame(animate);
            if (joint1Ref.current) {
                joint1Ref.current.rotation.z = degreesToRadians(joint1Angle);
            }
            if (joint2Ref.current) {
                joint2Ref.current.rotation.z = degreesToRadians(joint2Angle);
            }
            if (joint3Ref.current) {
                joint3Ref.current.rotation.z = degreesToRadians(joint3Angle);
            }
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (rendererRef.current) {
                rendererRef.current.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
            }
            if (cameraRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [joint1Angle, joint2Angle, joint3Angle]);

    const adjustJoint = (joint: number, delta: number) => {
        if (joint === 1) {
            setJoint1Angle(prev => prev + delta);
        } else if (joint === 2) {
            setJoint2Angle(prev => prev + delta);
        } else if (joint === 3) {
            setJoint3Angle(prev => prev + delta);
        }
    };

    const saveAngles = () => {
        const filename = prompt('Enter filename for saving angles:');
        if (filename) {
            const data = `Joint 1: ${joint1Angle}°\nJoint 2: ${joint2Angle}°\nJoint 3: ${joint3Angle}°`;
            const blob = new Blob([data], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.txt`;
            link.click();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-800">
            <div id="3d-model" ref={sceneRef} className="w-full h-64 md:h-80 lg:h-96 rounded-lg"></div>
            <div id="controls" className="mt-4 flex flex-col items-center">
                <div className="mb-4 flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => adjustJoint(1, -1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 1 -</button>
                        <input type="text" value={`${joint1Angle}°`} readOnly className="w-20 text-center border border-gray-300 rounded" />
                        <button onClick={() => adjustJoint(1, 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 1 +</button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => adjustJoint(2, -1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 2 -</button>
                        <input type="text" value={`${joint2Angle}°`} readOnly className="w-20 text-center border border-gray-300 rounded" />
                        <button onClick={() => adjustJoint(2, 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 2 +</button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => adjustJoint(3, -1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 3 -</button>
                        <input type="text" value={`${joint3Angle}°`} readOnly className="w-20 text-center border border-gray-300 rounded" />
                        <button onClick={() => adjustJoint(3, 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Joint 3 +</button>
                    </div>
                </div>
                <button onClick={saveAngles} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
            </div>
        </div>
    );
};

export default RobotView;

