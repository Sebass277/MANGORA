import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Gift, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [packCount, setPackCount] = useState(1);
  const basePrice = 48.00;

  const handleIncrement = () => setPackCount(p => p + 1);
  const handleDecrement = () => setPackCount(p => (p > 1 ? p - 1 : 1));

  const total = packCount * basePrice;

  return (
    <div style={{ minHeight: '100vh', padding: '48px 8%', display: 'flex', flexDirection: 'column' }}>
      
      <button onClick={() => navigate('/')} className="btn-outline" style={{ alignSelf: 'flex-start', marginBottom: '32px', display: 'flex', gap: '8px', padding: '8px 16px' }}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', flex: 1 }}>
        
        {/* Lado Izquierdo: Resumen del Pedido y Regalos */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Tu Pedido</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid var(--glass-border)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src="/MANGORA frontal.png" alt="Pack MANGORA" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Mix Pack 4 Sabores MANGORA</h3>
                <p style={{ color: '#A0A0A0', margin: 0 }}>S/ {basePrice.toFixed(2)} c/u</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '50px' }}>
              <button onClick={handleDecrement} style={{ background: 'transparent', color: '#FFF', padding: '4px' }}><Minus size={16} /></button>
              <span style={{ fontWeight: '600', width: '20px', textAlign: 'center' }}>{packCount}</span>
              <button onClick={handleIncrement} style={{ background: 'transparent', color: '#FFF', padding: '4px' }}><Plus size={16} /></button>
            </div>
          </div>

          {/* Lógica de Regalos */}
          <div style={{ minHeight: '150px' }}>
            {packCount >= 2 && (
              <div style={{ background: 'rgba(255, 123, 0, 0.1)', border: '1px solid var(--accent-orange)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Gift color="var(--accent-orange)" size={24} style={{ marginTop: '2px' }} />
                  <div>
                    <h4 className="text-gradient" style={{ margin: 0, fontSize: '1.1rem' }}>
                      {packCount >= 4 ? '¡Súper Combo Desbloqueado!' : '¡Regalo Desbloqueado!'}
                    </h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ color: '#E0E0E0' }}>2x Vasos Grabados o con DTF</span>
                      <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>S/ 0.00</span>
                    </div>

                    {packCount >= 4 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ color: '#E0E0E0' }}>1x Polo Oficial MANGORA</span>
                        <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>S/ 0.00</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '1.2rem', color: '#A0A0A0' }}>Total a pagar:</span>
            <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>S/ {total.toFixed(2)}</span>
          </div>

        </div>

        {/* Lado Derecho: Formulario de Envío y Pago */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Datos de Envío</h2>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nombre Completo" required />
            <input type="text" placeholder="Dirección de Entrega" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input type="tel" placeholder="Teléfono" required />
              <input type="text" placeholder="Ciudad" required />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px' }}>Método de Pago</h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <div style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <CreditCard size={20} color="var(--accent-orange)" />
                <span style={{ fontWeight: '600' }}>Tarjeta</span>
              </div>
              <div style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', opacity: 0.5 }}>
                <span style={{ fontWeight: '600' }}>PayPal (Próximamente)</span>
              </div>
            </div>

            <button type="submit" className="btn-cta" style={{ width: '100%', justifyContent: 'center', fontSize: '1.2rem', padding: '18px' }}>
              Finalizar Pedido
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
