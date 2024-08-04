'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);
const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const adjustAngle = (angle: number) => {
    return angle < 0 ? angle + 360 : angle;
};

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
        scene.background = new THREE.Color(0x000000); // Black background

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(3, 3, 5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if (sceneRef.current) {
            sceneRef.current.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7); // Adjusted light position
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 20;
        scene.add(directionalLight);

        const armGroup = new THREE.Group();

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 1, true);
        const baseMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf0f0f0,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.rotation.x = Math.PI / 2;
        base.castShadow = true;
        base.receiveShadow = true;
        armGroup.add(base);

        // Joint 1
        const joint1 = new THREE.Group();
        const arm1Geometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 32);
        const arm1Material = new THREE.MeshPhysicalMaterial({
            color: 0x3182ce,
            metalness: 0.7,
            roughness: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const arm1 = new THREE.Mesh(arm1Geometry, arm1Material);
        arm1.rotation.z = Math.PI / 2;
        arm1.position.x = 1;
        arm1.castShadow = true;
        arm1.receiveShadow = true;
        joint1.add(arm1);
        joint1.position.y = 0.5;
        armGroup.add(joint1);

        // Joint 2
        const joint2 = new THREE.Group();
        const arm2Geometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32);
        const arm2Material = new THREE.MeshPhysicalMaterial({
            color: 0xe53e3e,
            metalness: 0.7,
            roughness: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const arm2 = new THREE.Mesh(arm2Geometry, arm2Material);
        arm2.rotation.z = Math.PI / 2;
        arm2.position.x = 0.75;
        arm2.castShadow = true;
        arm2.receiveShadow = true;
        joint2.add(arm2);
        joint2.position.x = 2;
        joint1.add(joint2);

        // Joint 3
        const joint3 = new THREE.Group();
        const arm3Geometry = new THREE.CylinderGeometry(0.075, 0.075, 1, 32);
        const arm3Material = new THREE.MeshPhysicalMaterial({
            color: 0x38a169,
            metalness: 0.7,
            roughness: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const arm3 = new THREE.Mesh(arm3Geometry, arm3Material);
        arm3.rotation.z = Math.PI / 2;
        arm3.position.x = 0.5;
        arm3.castShadow = true;
        arm3.receiveShadow = true;
        joint3.add(arm3);
        joint3.position.x = 1.5;
        joint2.add(joint3);

        scene.add(armGroup);
        joint1Ref.current = joint1;
        joint2Ref.current = joint2;
        joint3Ref.current = joint3;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Add grid
const gridSize = 10;
const gridDivisions = 10;
const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xffffff, 0xffffff);
gridHelper.position.y = -0.5; // Position it slightly below the base of the arm
scene.add(gridHelper);

// Optional: Add a plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x111111, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

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
            const data = `
                Joint 1: ${joint1Angle}° (${adjustAngle(joint1Angle)}°)
                Joint 2: ${joint2Angle}° (${adjustAngle(joint2Angle)}°)
                Joint 3: ${joint3Angle}° (${adjustAngle(joint3Angle)}°)
            `;
            const blob = new Blob([data.trim()], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.txt`;
            link.click();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-black">
            <div id="3d-model" ref={sceneRef} className="w-full h-64 md:h-80 lg:h-96 rounded-lg shadow-lg"></div>
            <div id="controls" className="mt-8 flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-6 flex flex-col items-center space-y-6">
                    {[1, 2, 3].map(jointNum => (
                        <div key={jointNum} className="flex items-center space-x-4">
                            <button onClick={() => adjustJoint(jointNum, -1)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                                Joint {jointNum} -
                            </button>
                            <input
                                type="text"
                                value={
                                    eval(`joint${jointNum}Angle`) < 0
                                        ? `${eval(`joint${jointNum}Angle`)}° (${adjustAngle(eval(`joint${jointNum}Angle`))}°)`
                                        : `${eval(`joint${jointNum}Angle`)}°`
                                }
                                readOnly
                                className="w-24 text-center bg-gray-700 text-white border border-gray-600 rounded-lg"
                            />
                            <button onClick={() => adjustJoint(jointNum, 1)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                                Joint {jointNum} +
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={saveAngles} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Save Angles
                </button>
            </div>
        </div>
    );
};

export default RobotView;