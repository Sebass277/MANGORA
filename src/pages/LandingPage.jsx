import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animaciones para la lata (movimiento y rotación)
  const canX = useTransform(scrollYProgress, [0, 0.5], [0, -350]); // Mueve de derecha a izquierda
  const canY = useTransform(scrollYProgress, [0, 0.5], [0, 150]); // Baja ligeramente
  const canRotate = useTransform(scrollYProgress, [0, 0.5], [0, -45]); // Se inclina para servir

  // Opacidad y escala para los textos desenfocados
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  return (
    <div className="landing-container" ref={containerRef} style={{ height: '300vh', position: 'relative' }}>
      
      {/* Navbar Minimalista */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '24px 48px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', letterSpacing: '4px', margin: 0 }} className="text-gradient">MANGORA</h2>
        <button onClick={() => navigate('/checkout')} className="btn-outline">Comprar Ahora</button>
      </nav>

      {/* Hero Section Fija */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', overflow: 'hidden' }}>
        
        {/* Lado Izquierdo */}
        <div style={{ flex: 1, padding: '0 8%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: '4.5rem', marginBottom: '24px', lineHeight: '1.1' }}
          >
            El sabor tropical <br/><span className="text-gradient">hecho leyenda</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.2rem', color: '#A0A0A0', maxWidth: '400px', marginBottom: '40px' }}
          >
            Un cóctel artesanal donde la dulzura del mango seleccionado se encuentra con la intensidad del ron premium.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="btn-cta" onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}>
              Descubre la experiencia
            </button>
          </motion.div>

          {/* Vaso Receptor */}
          <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: '150px', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', height: '100%', borderRadius: '12px 12px 24px 24px', borderTop: 'none', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '10px', background: 'rgba(255,255,255,0.2)' }}></div>
              {/* Animación del líquido llenándose */}
              <motion.div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  background: 'var(--gradient-mango)',
                  opacity: 0.8,
                  height: useTransform(scrollYProgress, [0.4, 0.6], ['0%', '80%'])
                }}
              />
            </div>
          </div>
        </div>

        {/* Lado Derecho (Lata) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Círculo de fondo para resaltar */}
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'var(--accent-orange)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, zIndex: 0 }}></div>
          
          <motion.img 
            src="/MANGORA frontal.png" 
            alt="Lata MANGORA"
            className="animate-float"
            style={{ 
              height: '65vh', 
              objectFit: 'contain', 
              zIndex: 20,
              x: canX,
              y: canY,
              rotate: canRotate
            }}
          />

          {/* Textos Flotantes Desenfocados */}
          <motion.div style={{ position: 'absolute', left: '-50px', top: '30%', opacity: textOpacity, scale: textScale, filter: 'blur(1px)', color: 'var(--accent-yellow)', fontSize: '1.2rem', fontWeight: 600 }}>
            Cóctel Artesanal
          </motion.div>
          <motion.div style={{ position: 'absolute', right: '100px', top: '60%', opacity: textOpacity, scale: textScale, filter: 'blur(1px)', color: 'var(--accent-orange)', fontSize: '1.2rem', fontWeight: 600 }}>
            Mango Seleccionado
          </motion.div>
          <motion.div style={{ position: 'absolute', left: '-10px', bottom: '20%', opacity: textOpacity, scale: textScale, filter: 'blur(1px)', color: '#FFF', fontSize: '1.2rem', fontWeight: 600 }}>
            Ron Premium
          </motion.div>
        </div>
      </div>

      {/* Sección de Compra (Aparece al final del scroll) */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 30 }}>
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', maxWidth: '500px', width: '90%' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>La experiencia completa</h2>
          <p style={{ color: '#A0A0A0', marginBottom: '32px' }}>Lleva el sabor tropical a donde vayas. Perfecto para compartir (o no).</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <img src="/MANGORA frontal.png" alt="Pack de 4" style={{ height: '180px', objectFit: 'contain', margin: '0 -20px' }} />
            <img src="/MANGORA frontal.png" alt="Pack de 4" style={{ height: '190px', objectFit: 'contain', margin: '0 -20px', zIndex: 2 }} />
            <img src="/MANGORA frontal.png" alt="Pack de 4" style={{ height: '180px', objectFit: 'contain', margin: '0 -20px' }} />
          </div>

          <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Paquete de 4 Latas</div>
          <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '32px' }}>S/ 48.00</div>

          <button className="btn-cta" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/checkout')}>
            Pedir Pack
          </button>
        </div>
      </div>
    </div>
  );
}
