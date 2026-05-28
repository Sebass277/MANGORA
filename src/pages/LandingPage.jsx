import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import CanModel from '../components/CanModel';

const FLAVORS = [
  {
    id: 'mango',
    name: 'Mango',
    primary: '#FF7B00',
    secondary: '#FF2A00',
    hue: '0deg',
    title: 'El sabor tropical',
    desc: 'Un cóctel artesanal premium. La dulzura vibrante del mango seleccionado, fusionada a la perfección con la intensidad de nuestro mejor ron.',
    notes: 'Notas cítricas y dulces'
  },
  {
    id: 'maracuya',
    name: 'Maracuyá',
    primary: '#FFD700',
    secondary: '#FF9D00',
    hue: '30deg',
    title: 'La pasión exótica',
    desc: 'La acidez perfecta del maracuyá fresco, balanceada con notas cálidas para una explosión de sabor inigualable.',
    notes: 'Notas intensas y exóticas'
  },
  {
    id: 'limon',
    name: 'Limón',
    primary: '#00FF40',
    secondary: '#A6FF00',
    hue: '90deg',
    title: 'El golpe refrescante',
    desc: 'Cítrico, atrevido y absolutamente refrescante. Limones seleccionados a mano para despertar todos tus sentidos.',
    notes: 'Notas ácidas y vibrantes'
  },
  {
    id: 'fresa',
    name: 'Fresa',
    primary: '#FF0040',
    secondary: '#990000',
    hue: '-30deg',
    title: 'La dulzura intensa',
    desc: 'El encanto salvaje de las fresas maduras mezclado con la fuerza del ron. Un sabor profundo y cautivador.',
    notes: 'Notas rojas y profundas'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentFlavorIdx, setCurrentFlavorIdx] = useState(0);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlavorIdx((prev) => (prev + 1) % FLAVORS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const flavor = FLAVORS[currentFlavorIdx];

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', flavor.primary);
    document.documentElement.style.setProperty('--accent-secondary', flavor.secondary);
  }, [flavor]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  return (
    <div className="landing-container" ref={containerRef} style={{ position: 'relative' }}>
      
      {/* 3D Canvas Background for Section 1 and 2 */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 15, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color={flavor.primary} />
          <directionalLight position={[-10, 10, -5]} intensity={1} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <CanModel flavorColor={flavor.primary} scrollProgress={scrollYProgress} isMobile={isMobile} />
            </Float>
            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
          </Suspense>
        </Canvas>
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: isMobile ? '16px 24px' : '24px 48px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13,13,13,0.8)', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', letterSpacing: '4px', margin: 0, transition: 'color 1s ease' }} className="text-gradient">MANGORA</h2>
        <button onClick={() => navigate('/checkout')} className="btn-outline" style={{ padding: isMobile ? '8px 16px' : '12px 28px', fontSize: isMobile ? '0.9rem' : '1rem', pointerEvents: 'auto' }}>Comprar</button>
      </nav>

      {/* Wrapper Scroll */}
      <div style={{ height: isMobile ? 'auto' : '200vh', position: 'relative' }}>
        
        {/* SECCIÓN 1 Y 2 */}
        <div style={{ 
          position: isMobile ? 'relative' : 'sticky', 
          top: 0, 
          height: isMobile ? 'auto' : '100vh', 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden' 
        }}>
          
          {/* SECCIÓN 1: HERO TEXTS */}
          <div style={{ 
            flex: 1, 
            minHeight: '100vh', 
            position: 'relative', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: isMobile ? '120px 24px 60px' : '0 8%',
            zIndex: 10
          }}>
            <AnimatePresence mode="wait">
              <motion.h1 
                key={flavor.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: isMobile ? '3rem' : '4.5rem', marginBottom: '24px', lineHeight: '1.1' }}
              >
                {flavor.title} <br/><span className="text-gradient">hecho leyenda</span>
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p 
                key={flavor.desc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: '1.2rem', color: '#A0A0A0', maxWidth: '400px', marginBottom: '40px' }}
              >
                {flavor.desc}
              </motion.p>
            </AnimatePresence>

            {!isMobile && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
                <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 1s ease' }}>↓ Haz scroll para descubrir</p>
              </motion.div>
            )}
          </div>

          {/* SPLASH BG Y ESPACIO PARA LATA 3D */}
          <div style={{ 
            flex: 1, 
            minHeight: isMobile ? '60vh' : '100vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative',
            zIndex: 5 // Behind 3D canvas
          }}>
            <img src="/splash_bg.png" alt="Splash" style={{ 
              position: 'absolute', 
              width: isMobile ? '150%' : '120%', 
              maxWidth: '800px', 
              opacity: 0.6,
              mixBlendMode: 'screen',
              zIndex: 0,
              filter: `hue-rotate(${flavor.hue})`,
              transition: 'filter 1s ease'
            }} />
          </div>
        </div>

        {/* SECCIÓN 2: EL SERVIDO */}
        {!isMobile && (
          <div style={{ 
            position: 'absolute', 
            top: '100vh', 
            left: 0, 
            width: '100%', 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 8%',
            pointerEvents: 'none'
          }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}>
              
              <img src="/vaso_mangora.png" alt="Vaso MANGORA" style={{ 
                height: '50vh', 
                objectFit: 'contain',
                position: 'relative',
                top: '100px',
                zIndex: 10
              }} />

              {/* Textos Flotantes */}
              <motion.div style={{ position: 'absolute', left: '10%', top: '20%', opacity: textOpacity, scale: textScale, color: 'var(--accent-secondary)', fontSize: '1.5rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)', transition: 'color 1s ease' }}>
                Rinde hasta 2 Vasos
              </motion.div>
              <motion.div style={{ position: 'absolute', right: '10%', bottom: '20%', opacity: textOpacity, scale: textScale, color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)', transition: 'color 1s ease' }}>
                {flavor.notes}
              </motion.div>

            </div>
            <div style={{ flex: 1 }}></div>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: OFERTA FINAL */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative', 
        zIndex: 30,
        padding: isMobile ? '60px 24px' : '48px',
        background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.02))'
      }}>
        <div className="glass-panel" style={{ 
          padding: isMobile ? '32px 24px' : '64px', 
          textAlign: 'center', 
          maxWidth: '900px', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', marginBottom: '16px' }}>Mix Pack 4 Sabores</h2>
          <p style={{ color: '#A0A0A0', marginBottom: '48px', fontSize: '1.1rem', maxWidth: '500px' }}>
            Prueba todos nuestros sabores (Mango, Maracuyá, Limón y Fresa) en un solo pack. Pide ahora y desbloquea regalos exclusivos.
          </p>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: isMobile ? '32px' : '48px',
            marginBottom: '48px',
            width: '100%'
          }}>
            
            <div style={{ textAlign: 'center' }}>
              <img src="/polo_mangora.png" alt="Polo Oficial" style={{ height: '200px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
              <p style={{ color: 'var(--accent-primary)', fontWeight: 600, marginTop: '16px', transition: 'color 1s ease' }}>+ 1 Polo Oficial</p>
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <img src="/MANGORA frontal.png" alt="Pack Mix" style={{ height: '280px', objectFit: 'contain', zIndex: 3, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8)) hue-rotate(0deg)' }} />
              <img src="/MANGORA etiqueta.png" alt="Etiqueta Fresa" style={{ height: '240px', objectFit: 'contain', position: 'absolute', left: '-60px', top: '20px', zIndex: 1, opacity: 0.8, filter: 'blur(1px) hue-rotate(-30deg)' }} />
              <img src="/MANGORA etiqueta.png" alt="Etiqueta Limon" style={{ height: '240px', objectFit: 'contain', position: 'absolute', right: '-60px', top: '20px', zIndex: 1, opacity: 0.8, filter: 'blur(1px) hue-rotate(90deg)' }} />
              <img src="/MANGORA etiqueta.png" alt="Etiqueta Maracuya" style={{ height: '260px', objectFit: 'contain', position: 'absolute', right: '-30px', top: '10px', zIndex: 2, opacity: 0.9, filter: 'blur(1px) hue-rotate(30deg)' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '-20px' }}>
                <img src="/vaso_mangora.png" alt="Vasos" style={{ height: '180px', objectFit: 'contain', marginRight: '-40px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
                <img src="/vaso_mangora.png" alt="Vasos" style={{ height: '180px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
              </div>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 600, marginTop: '16px', transition: 'color 1s ease' }}>+ 2 Vasos Grabados</p>
            </div>

          </div>

          <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Mix Pack 4 Latas</div>
          <div className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '32px' }}>S/ 48.00</div>

          <button className="btn-cta" style={{ padding: '18px 48px', fontSize: '1.2rem' }} onClick={() => navigate('/checkout')}>
            Comprar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
