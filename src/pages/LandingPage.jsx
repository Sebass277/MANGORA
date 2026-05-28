import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Html, useFBX, useTexture, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

function RotatingCan({ scrollYProgress }) {
  const fbx = useFBX('/monster-ultra-white/source/Monstercan_high.fbx');

  const baseColor = useTexture('/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_BaseColo.png');
  const normalMap = useTexture('/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_Normal.1.png');
  const metalnessMap = useTexture('/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_Metallic.png');
  const roughnessMap = useTexture('/monster-ultra-white/textures/Monstercan_low_aiStandardSurface1_Roughnes.png');

  baseColor.colorSpace = THREE.SRGBColorSpace;

  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        map: baseColor,
        normalMap: normalMap,
        metalnessMap: metalnessMap,
        roughnessMap: roughnessMap,
        color: 0xffffff,
        envMapIntensity: 1.5
      });
    }
  });

  const groupRef = useRef();
  
  const targetRotYRef = useRef(0);
  const isSpinning = useRef(true);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const scroll = scrollYProgress.get();
      
      let targetX, targetY, targetScale, rotX, rotZ;

      if (scroll < 0.5) {
        // De Sección 1 a Sección 2
        let t = scroll / 0.5; // normalizado de 0 a 1
        targetX = THREE.MathUtils.lerp(3, -3, t);
        targetY = -2;
        targetScale = 1.5;
        rotX = 0.2;
        rotZ = -0.1;
        
        // Girar continuamente
        isSpinning.current = true;
        groupRef.current.rotation.y += delta * 1.5; // Velocidad de giro
        targetRotYRef.current = groupRef.current.rotation.y;
      } else {
        // De Sección 2 a Sección 3
        let t = (scroll - 0.5) / 0.5; // normalizado de 0 a 1
        targetX = THREE.MathUtils.lerp(-3, 0, t);
        targetY = THREE.MathUtils.lerp(-2, -4, t); // Baja un poco para centrar el logo al hacer zoom
        targetScale = THREE.MathUtils.lerp(1.5, 4.0, t); // Zoom brutal
        rotX = THREE.MathUtils.lerp(0.2, 0, t); // Se endereza
        rotZ = THREE.MathUtils.lerp(-0.1, 0, t); // Se endereza
        
        if (isSpinning.current) {
          // Calcular el múltiplo de 2*PI más cercano y sumarle un offset para que muestre el logo.
          // Si vemos la tabla nutricional en 0, el logo suele estar en Math.PI o -Math.PI.
          // Prueba con Math.PI (media vuelta).
          const currentRot = targetRotYRef.current;
          const frontOffset = Math.PI; // Ajusta este valor si el logo no queda exactamente al frente (ej. Math.PI/2)
          
          // Encontrar el múltiplo de 2*PI más cercano
          const twoPi = Math.PI * 2;
          const remainder = currentRot % twoPi;
          const base = currentRot - remainder;
          
          let closestSnap = remainder > Math.PI ? base + twoPi : base;
          targetRotYRef.current = closestSnap + frontOffset;
          isSpinning.current = false;
        }
        
        // Transicionar suavemente hacia la pose frontal
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotYRef.current, 0.1);
      }

      // Aplicar transformaciones suavemente
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rotZ, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}

export default function LandingPage() {
  const containerRef = useRef();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animaciones para HTML (Sección 1)
  const section1Opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const section1Y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Animaciones para HTML (Sección 2)
  const section2Opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const section2Y = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [50, 0, -50]);

  // Animaciones para HTML (Sección 3)
  const section3Opacity = useTransform(scrollYProgress, [0.8, 1.0], [0, 1]);
  const section3Y = useTransform(scrollYProgress, [0.8, 1.0], [50, 0]);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '300vh', background: '#0D0D0D', color: 'white', position: 'relative' }}>
      
      {/* 3D Canvas Fijo de fondo */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <ambientLight intensity={0.7} color="#fff0e0" />
          <directionalLight position={[10, 10, 5]} intensity={2.5} color="#FF5500" />
          <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#FF0040" />
          <directionalLight position={[0, -10, 5]} intensity={1} color="#FFD700" />
          <Environment preset="sunset" />

          <Suspense fallback={<Html center><div style={{color:'white'}}>Cargando lata...</div></Html>}>
            <RotatingCan scrollYProgress={scrollYProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Contenido HTML Scrolleable */}
      
      {/* SECCIÓN 1 */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div style={{ 
          flex: 1, 
          padding: '0 8%', 
          opacity: section1Opacity, 
          y: section1Y 
        }}>
          <h1 style={{ fontSize: '7rem', margin: '0 0 20px 0', lineHeight: '1', fontWeight: '900', letterSpacing: '-2px' }}>
            Título de <br />
            <span style={{ background: 'linear-gradient(135deg, #FF7B00 0%, #FFB800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sección 1
            </span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#A0A0A0', maxWidth: '500px', marginTop: '20px', lineHeight: '1.6' }}>
            Este es un pequeño contenido descriptivo para la primera sección. Aquí puedes colocar la presentación de la bebida.
          </p>
          <div style={{ marginTop: '40px', color: '#FF7B00', letterSpacing: '2px', textTransform: 'uppercase' }}>
            ↓ Haz scroll
          </div>
        </motion.div>
        
        {/* Espacio vacío donde está la lata 3D en la sección 1 */}
        <div style={{ flex: 1 }}></div>
      </div>

      {/* SECCIÓN 2 */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ flex: 1 }}></div>
        <motion.div style={{ 
          flex: 1, 
          padding: '0 8%', 
          opacity: section2Opacity, 
          y: section2Y 
        }}>
          <h2 style={{ fontSize: '5rem', margin: '0 0 20px 0', lineHeight: '1', fontWeight: '800' }}>
            Título de<br/>la Sección 2
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#A0A0A0', maxWidth: '400px', lineHeight: '1.6' }}>
            Contenido de la segunda sección. Puedes usar este espacio para hablar sobre la fórmula, el sabor o la experiencia.
          </p>
        </motion.div>
      </div>

      {/* SECCIÓN 3: ZOOM BRUTAL E INFO A LOS COSTADOS */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div style={{ 
          flex: 1, 
          padding: '0 8%', 
          opacity: section3Opacity, 
          y: section3Y,
          textAlign: 'right'
        }}>
          <h3 style={{ fontSize: '2rem', color: '#FF7B00', marginBottom: '10px' }}>Información 1</h3>
          <p style={{ fontSize: '1.2rem', color: '#A0A0A0' }}>Detalle principal<br/>Dato importante<br/>Característica</p>
        </motion.div>

        {/* Espacio central donde está la lata GIGANTE */}
        <div style={{ flex: 1 }}></div>

        <motion.div style={{ 
          flex: 1, 
          padding: '0 8%', 
          opacity: section3Opacity, 
          y: section3Y 
        }}>
          <h3 style={{ fontSize: '2rem', color: '#FF7B00', marginBottom: '10px' }}>Información 2</h3>
          <p style={{ fontSize: '1.2rem', color: '#A0A0A0' }}>Beneficio clave<br/>Dato extra<br/>Especificación</p>
        </motion.div>
      </div>

    </div>
  );
}
