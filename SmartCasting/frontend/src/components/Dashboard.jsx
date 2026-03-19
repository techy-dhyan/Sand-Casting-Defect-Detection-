import React, { useState } from 'react';
import ProcessPredictionTab from './ProcessPredictionTab';
import ImageInspectionTab from './ImageInspectionTab';
import { Activity, Image as ImageIcon } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('process');

  return (
    <div className="glass-panel" style={{ padding: '24px', minHeight: '600px' }}>
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '24px' }}>
        <button 
          className={`tab-button ${activeTab === 'process' ? 'active' : ''}`}
          onClick={() => setActiveTab('process')}
        >
          <Activity size={20} />
          Process Prediction
        </button>
        <button 
          className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          <ImageIcon size={20} />
          Image Inspection
        </button>
      </div>

      <div className="tab-content animate-fade-in" key={activeTab}>
        {activeTab === 'process' ? <ProcessPredictionTab /> : <ImageInspectionTab />}
      </div>
    </div>
  );
}
