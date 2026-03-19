import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Image as ImageIcon, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export default function ImageInspectionTab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Casting Visual Inspection</h2>
      
      {!previewUrl ? (
        <div 
          className="upload-area" 
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <Upload size={48} style={{ margin: '0 auto 16px', color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Upload Casting Image</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Drag and drop or click to select a file</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--panel-border)', background: '#000' }}>
            <img 
              src={previewUrl} 
              alt="Casting preview" 
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block' }} 
            />
            <button 
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setResult(null);
              }}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
            >
              Change Image
            </button>
          </div>
          
          <button 
            className="glass-button" 
            onClick={handleSubmit} 
            disabled={loading} 
            style={{ width: '100%', padding: '16px' }}
          >
            {loading ? 'Analyzing Image Component...' : (
              <>
                <ImageIcon size={20} />
                Analyze Casting Image
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className={`result-card animate-fade-in ${
          result.status === 'error' ? 'danger' : 
          result.prediction === 'No Defect' ? 'success' : 'danger'
        }`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ marginTop: '2px' }}>
              {result.status === 'error' ? <AlertCircle color="var(--danger)" /> :
               result.prediction === 'No Defect' ? <CheckCircle color="var(--success)" /> : 
               <AlertTriangle color="var(--danger)" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px 0', color: result.prediction === 'No Defect' ? 'var(--success)' : 'var(--danger)' }}>
                {result.status === 'error' ? 'Analysis Failed' : `Identification: ${result.prediction}`}
              </h3>
              {result.recommendation && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.95rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Action Required:</strong> {result.recommendation}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
