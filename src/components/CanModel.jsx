import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function CanModel({ flavorColor, scrollProgress, isMobile }) {
  const groupRef = useRef();

  // Load the FBX geometry
  const fbx = useFBX('/monster-ultra-white/source/Monstercan_high.fbx');

  // Load PBR Textures (assuming Surface 1 is the main can body)
  const [baseColor, normalMap, metalnessMap, roughnessMap] = useTexture([
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_BaseColo.png',
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_Normal.1.png',
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_Metallic.png',
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_Roughnes.png'
  ]);

  // Load secondary textures if needed (Surface 2, usually the metallic top/bottom)
  const [baseColor2, normalMap2, metalnessMap2, roughnessMap2] = useTexture([
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface2_BaseColo.png',
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface2_Normal.1.png',
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface2_Metallic.png',
    '/monster-ultra-white/textures/Monstercan_low_aiStandardSurface2_Roughnes.png'
  ]);

  // Configure textures (flipY is often needed for FBX textures in Three.js)
  useMemo(() => {
    const textures = [baseColor, normalMap, metalnessMap, roughnessMap, baseColor2, normalMap2, metalnessMap2, roughnessMap2];
    textures.forEach(t => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      // Depending on the export, flipY might be needed. We'll leave it default first.
    });
    // Normal maps need correct color space
    baseColor.colorSpace = THREE.SRGBColorSpace;
    baseColor2.colorSpace = THREE.SRGBColorSpace;
  }, [baseColor, normalMap, metalnessMap, roughnessMap, baseColor2, normalMap2, metalnessMap2, roughnessMap2]);

  // Apply materials to the FBX meshes
  useMemo(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        // We assume material names or just apply Surface 1 to the first mesh and Surface 2 to the second
        // A safer way is to check the name, but for now we'll just apply Surface 1 to everything, 
        // or try to match if multiple materials exist.
        
        // Since it's a Monster can, we'll try to apply material 1 or 2 based on mesh name if available
        // If not, we'll just apply material 1 (the main body).
        const materialIndex = (child.name && child.name.toLowerCase().includes('top')) ? 2 : 1;
        
        child.material = new THREE.MeshStandardMaterial({
          map: materialIndex === 1 ? baseColor : baseColor2,
          normalMap: materialIndex === 1 ? normalMap : normalMap2,
          metalnessMap: materialIndex === 1 ? metalnessMap : metalnessMap2,
          roughnessMap: materialIndex === 1 ? roughnessMap : roughnessMap2,
          envMapIntensity: 1.5, // Boost reflections
          color: new THREE.Color(0xffffff) // Base white
        });
      }
    });
  }, [fbx, baseColor, normalMap, metalnessMap, roughnessMap, baseColor2, normalMap2, metalnessMap2, roughnessMap2]);

  // Target Color for Tinting based on flavor
  const targetColor = useMemo(() => new THREE.Color(flavorColor), [flavorColor]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smoothly tint the material color to match the flavor
    fbx.traverse((child) => {
      if (child.isMesh && child.material) {
        // Only tint the main body (assuming it's material 1, we can just tint everything slightly or just a specific mesh)
        child.material.color.lerp(targetColor, 0.05);
      }
    });

    // We can use scrollProgress to rotate and move the can
    // scrollProgress is passed as a spring or raw value from framer-motion, wait, framer-motion values are React state?
    // Actually, in R3F, it's better to pass the raw number or use framer-motion-3d.
    // For now, we'll just do a simple idle rotation.
    
    // Idle rotation
    groupRef.current.rotation.y += 0.005;

    // Scroll interaction (we will pass scroll as a raw prop, or we can just let framer-motion handle the canvas wrapper)
    // Actually, handling scroll inside R3F gives best 3D results.
    // Let's assume scrollProgress is a value between 0 and 1.
    const scroll = scrollProgress || 0;
    
    // Base position
    const startY = isMobile ? 0 : 0;
    const endY = isMobile ? 0 : -2;
    
    const startRotX = 0;
    const endRotX = isMobile ? 0 : -Math.PI / 3; // Tilt to pour
    
    groupRef.current.position.y = THREE.MathUtils.lerp(startY, endY, scroll);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(startRotX, endRotX, scroll);
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={[0.1, 0.1, 0.1]}>
      <primitive object={fbx} />
    </group>
  );
}
