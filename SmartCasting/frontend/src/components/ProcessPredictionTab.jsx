import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, CheckCircle, Info, Wifi } from 'lucide-react';

export default function ProcessPredictionTab() {
  // Global sensor connection state
  const [sensorStatus, setSensorStatus] = useState('disconnected'); // 'disconnected', 'fetching', 'connected'
  
  // Track toggle state for individual inputs
  const [useSensor, setUseSensor] = useState({
    moisture_percent: false,
    pouring_temp_C: false,
    permeability: false, // Currently ESP32 doesn't send this, but keeping it flexible
    mold_hardness: false // Currently ESP32 doesn't send this, but keeping it flexible
  });

  const [formData, setFormData] = useState({
    moisture_percent: 5.2,
    permeability: 100,
    mold_hardness: 95,
    pouring_temp_C: 1450
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // If ANY of the inputs are relying on the sensor, we need to poll
    const needsPolling = Object.values(useSensor).some(val => val === true);
    let interval;

    if (needsPolling) {
      if (sensorStatus === 'disconnected') setSensorStatus('fetching');
      
      interval = setInterval(() => {
        axios.get('http://127.0.0.1:5000/get-sensor-data')
          .then(res => {
            const data = res.data;
            if (data && Object.keys(data).length > 0) {
              setSensorStatus('connected');
              
              setFormData(prev => ({
                ...prev,
                // Only override the form data if the specific parameter has sensor polling toggled on
                moisture_percent: (useSensor.moisture_percent && data.moisture !== undefined) ? data.moisture : prev.moisture_percent,
                pouring_temp_C: (useSensor.pouring_temp_C && data.temperature !== undefined) ? data.temperature : prev.pouring_temp_C
                // Note: since ESP32 currently only sends moisture and temp, permeability/mold_hardness won't update
              }));
            } else {
              setSensorStatus('fetching'); 
            }
          })
          .catch(err => {
            console.error("Sensor fetch error", err);
            setSensorStatus('disconnected');
          });
      }, 3000);
    } else {
      setSensorStatus('disconnected');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [useSensor, sensorStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || value
    }));
  };

  const toggleSensor = (field) => {
    setUseSensor(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict-process', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Prediction error", error);
      setResult({
        status: 'error',
        prediction: 'API Connection Error',
        recommendation: 'Ensure the Flask backend is running on port 5000.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Process Parameter Analysis</h2>
        
        {Object.values(useSensor).some(val => val === true) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--panel-border)', fontSize: '0.85rem' }}>
            <span style={{color: 'var(--text-secondary)'}}>Global Sensor Status:</span>
            <Wifi size={16} color={sensorStatus === 'connected' ? 'var(--success)' : sensorStatus === 'fetching' ? 'var(--warning)' : 'var(--danger)' } />
            <span style={{ color: sensorStatus === 'connected' ? 'var(--success)' : sensorStatus === 'fetching' ? 'var(--warning)' : 'var(--danger)' }}>
              {sensorStatus === 'connected' ? 'Live' : sensorStatus === 'fetching' ? 'Waiting...' : 'Offline'}
            </span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Moisture Input */}
          <div className="input-group" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="label" style={{ marginBottom: 0 }}>Moisture (%)</label>
              <button 
                type="button" 
                onClick={() => toggleSensor('moisture_percent')}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', 
                  color: useSensor.moisture_percent ? 'var(--accent)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '4px', padding: 0
                }}
              >
                <div style={{ width: '24px', height: '14px', background: useSensor.moisture_percent ? 'var(--accent)' : 'rgba(255,255,255,0.2)', borderRadius: '14px', position: 'relative', transition: '0.2s' }}>
                  <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: useSensor.moisture_percent ? '12px' : '2px', transition: '0.2s' }} />
                </div>
                {useSensor.moisture_percent ? 'Auto' : 'Manual'}
              </button>
            </div>
            <input 
              type="number" 
              step="0.1"
              name="moisture_percent" 
              className="glass-input" 
              value={formData.moisture_percent}
              onChange={handleChange}
              disabled={useSensor.moisture_percent}
              style={{ opacity: useSensor.moisture_percent ? 0.7 : 1, background: useSensor.moisture_percent ? 'rgba(47, 129, 247, 0.1)' : '' }}
              required
            />
          </div>
          
          {/* Permeability Input */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="label" style={{ marginBottom: 0 }}>Permeability</label>
            </div>
            <input 
              type="number" 
              name="permeability" 
              className="glass-input" 
              value={formData.permeability}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mold Hardness Input */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
             <label className="label" style={{ marginBottom: 0 }}>Mold Hardness</label>
            </div>
            <input 
              type="number" 
              name="mold_hardness" 
              className="glass-input" 
              value={formData.mold_hardness}
              onChange={handleChange}
              required
            />
          </div>

          {/* Temperature Input */}
          <div className="input-group">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="label" style={{ marginBottom: 0 }}>Temperature (°C)</label>
              <button 
                type="button" 
                onClick={() => toggleSensor('pouring_temp_C')}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', 
                  color: useSensor.pouring_temp_C ? 'var(--accent)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '4px', padding: 0
                }}
              >
                <div style={{ width: '24px', height: '14px', background: useSensor.pouring_temp_C ? 'var(--accent)' : 'rgba(255,255,255,0.2)', borderRadius: '14px', position: 'relative', transition: '0.2s' }}>
                  <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: useSensor.pouring_temp_C ? '12px' : '2px', transition: '0.2s' }} />
                </div>
                {useSensor.pouring_temp_C ? 'Auto' : 'Manual'}
              </button>
            </div>
            <input 
              type="number" 
              name="pouring_temp_C" 
              className="glass-input" 
              value={formData.pouring_temp_C}
              onChange={handleChange}
              disabled={useSensor.pouring_temp_C}
              style={{ opacity: useSensor.pouring_temp_C ? 0.7 : 1, background: useSensor.pouring_temp_C ? 'rgba(47, 129, 247, 0.1)' : '' }}
              required
            />
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="glass-button" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Analyzing Parameters...' : (
              <>
                <Activity size={18} />
                Predict Defect Risk
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className={`result-card animate-fade-in ${
          result.status === 'error' ? 'danger' : 
          result.prediction === 'No Defect' ? 'success' : 'warning'
        }`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ marginTop: '2px' }}>
              {result.status === 'error' ? <AlertTriangle color="var(--danger)" /> :
               result.prediction === 'No Defect' ? <CheckCircle color="var(--success)" /> : 
               <Info color="var(--warning)" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px 0', color: result.prediction === 'No Defect' ? 'var(--success)' : (result.status === 'error' ? 'var(--danger)' : 'var(--warning)') }}>
                {result.status === 'error' ? 'Prediction Failed' : `Defect Risk: ${result.prediction}`}
              </h3>
              {result.recommendation && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.95rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Recommendation:</strong> {result.recommendation}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
