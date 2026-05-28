import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animaciones para la lata (movimiento y rotación) desde la Sec 1 a la Sec 2
  // En móvil deshabilitamos el scroll animado complejo para evitar desbordes
  const canX = useTransform(scrollYProgress, [0, 0.5], [0, isMobile ? 0 : -300]); 
  const canY = useTransform(scrollYProgress, [0, 0.5], [0, isMobile ? 0 : 400]); 
  const canRotate = useTransform(scrollYProgress, [0, 0.5], [0, isMobile ? 0 : -60]); 
  const canScale = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 1 : 0.8]);

  // Textos Sección 2
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  return (
    <div className="landing-container" ref={containerRef} style={{ position: 'relative' }}>
      
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: isMobile ? '16px 24px' : '24px 48px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13,13,13,0.8)', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', letterSpacing: '4px', margin: 0 }} className="text-gradient">MANGORA</h2>
        <button onClick={() => navigate('/checkout')} className="btn-outline" style={{ padding: isMobile ? '8px 16px' : '12px 28px', fontSize: isMobile ? '0.9rem' : '1rem' }}>Comprar</button>
      </nav>

      {/* Wrapper para el Scroll (Solo en Desktop es 200vh para la animación, en móvil es normal) */}
      <div style={{ height: isMobile ? 'auto' : '200vh', position: 'relative' }}>
        
        {/* SECCIÓN 1 Y 2 FIJAS DURANTE EL SCROLL EN DESKTOP */}
        <div style={{ 
          position: isMobile ? 'relative' : 'sticky', 
          top: 0, 
          height: isMobile ? 'auto' : '100vh', 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden' 
        }}>
          
          {/* SECCIÓN 1: HERO */}
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
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: isMobile ? '3rem' : '4.5rem', marginBottom: '24px', lineHeight: '1.1' }}
            >
              El sabor tropical <br/><span className="text-gradient">hecho leyenda</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontSize: '1.2rem', color: '#A0A0A0', maxWidth: '400px', marginBottom: '40px' }}
            >
              Un cóctel artesanal premium. La dulzura vibrante del mango seleccionado, fusionada a la perfección con la intensidad de nuestro mejor ron.
            </motion.p>
            {!isMobile && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
                <p style={{ color: 'var(--accent-orange)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>↓ Haz scroll para descubrir</p>
              </motion.div>
            )}
          </div>

          {/* LATA Y SPLASH (Dinamico en Desktop, Estático en Móvil) */}
          <div style={{ 
            flex: 1, 
            minHeight: isMobile ? '60vh' : '100vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative',
            zIndex: 20
          }}>
            {/* Splash BG */}
            <img src="/splash_bg.png" alt="Splash" style={{ 
              position: 'absolute', 
              width: isMobile ? '150%' : '120%', 
              maxWidth: '800px', 
              opacity: 0.6,
              mixBlendMode: 'screen',
              zIndex: 0
            }} />
            
            <motion.img 
              src="/MANGORA frontal.png" 
              alt="Lata MANGORA"
              style={{ 
                height: isMobile ? '50vh' : '70vh', 
                objectFit: 'contain', 
                zIndex: 20,
                x: canX,
                y: canY,
                rotate: canRotate,
                scale: canScale,
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))'
              }}
            />
          </div>
        </div>

        {/* SECCIÓN 2: EL SERVIDO (Solo visible en la parte inferior del scroll en desktop) */}
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
              <motion.div style={{ position: 'absolute', left: '10%', top: '20%', opacity: textOpacity, scale: textScale, color: 'var(--accent-yellow)', fontSize: '1.5rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Rinde hasta 2 Vasos
              </motion.div>
              <motion.div style={{ position: 'absolute', right: '10%', bottom: '20%', opacity: textOpacity, scale: textScale, color: 'var(--accent-orange)', fontSize: '1.5rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Notas cítricas y refrescantes
              </motion.div>

            </div>
            <div style={{ flex: 1 }}></div>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: OFERTA FINAL (Conversión) */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative', 
        zIndex: 30,
        padding: isMobile ? '60px 24px' : '48px',
        background: 'linear-gradient(to bottom, transparent, rgba(255, 123, 0, 0.05))'
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
          <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', marginBottom: '16px' }}>La Experiencia Completa</h2>
          <p style={{ color: '#A0A0A0', marginBottom: '48px', fontSize: '1.1rem', maxWidth: '500px' }}>
            Lleva el sabor tropical a otro nivel. Pide ahora y desbloquea regalos exclusivos para disfrutar como se debe.
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
              <p style={{ color: 'var(--accent-orange)', fontWeight: 600, marginTop: '16px' }}>+ 1 Polo Oficial</p>
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <img src="/MANGORA frontal.png" alt="Pack de 4" style={{ height: '280px', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))' }} />
              <img src="/MANGORA etiqueta.png" alt="Etiqueta" style={{ height: '240px', objectFit: 'contain', position: 'absolute', left: '-40px', top: '20px', zIndex: 1, opacity: 0.5, filter: 'blur(2px)' }} />
              <img src="/MANGORA etiqueta.png" alt="Etiqueta" style={{ height: '240px', objectFit: 'contain', position: 'absolute', right: '-40px', top: '20px', zIndex: 1, opacity: 0.5, filter: 'blur(2px)' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '-20px' }}>
                <img src="/vaso_mangora.png" alt="Vasos" style={{ height: '180px', objectFit: 'contain', marginRight: '-40px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
                <img src="/vaso_mangora.png" alt="Vasos" style={{ height: '180px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
              </div>
              <p style={{ color: 'var(--accent-orange)', fontWeight: 600, marginTop: '16px' }}>+ 2 Vasos Grabados</p>
            </div>

          </div>

          <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Paquete de 4 Latas</div>
          <div className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '32px' }}>S/ 48.00</div>

          <button className="btn-cta" style={{ padding: '18px 48px', fontSize: '1.2rem' }} onClick={() => navigate('/checkout')}>
            Comprar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
