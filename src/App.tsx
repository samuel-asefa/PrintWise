import React, { useState } from 'react';
import './App.css';

interface PrintSettings {
  temperature: string;
  bedTemp: string;
  speed: string;
  layerHeight: string;
  infill: string;
}

interface FilamentOption {
  name: string;
  description: string;
  strength: number;
  flexibility: number;
  ease: number;
  tempRange: string;
  bestFor: string[];
}

const App: React.FC = () => {
  const [projectType, setProjectType] = useState<string>('');
  const [requirements, setRequirements] = useState({
    strength: 5,
    flexibility: 5,
    detail: 5,
    outdoor: false,
    foodSafe: false
  });
  const [showResults, setShowResults] = useState(false);

  const filaments: Record<string, FilamentOption> = {
    pla: {
      name: 'PLA',
      description: 'Easy to print, biodegradable, great for beginners',
      strength: 6,
      flexibility: 3,
      ease: 10,
      tempRange: '190-220°C',
      bestFor: ['Prototypes', 'Decorative items', 'Low-stress parts']
    },
    abs: {
      name: 'ABS',
      description: 'Strong, heat-resistant, requires enclosed printer',
      strength: 8,
      flexibility: 4,
      ease: 6,
      tempRange: '220-250°C',
      bestFor: ['Functional parts', 'Automotive', 'Heat resistance']
    },
    petg: {
      name: 'PETG',
      description: 'Strong, flexible, food-safe options available',
      strength: 8,
      flexibility: 7,
      ease: 8,
      tempRange: '220-250°C',
      bestFor: ['Mechanical parts', 'Outdoor use', 'Containers']
    },
    tpu: {
      name: 'TPU',
      description: 'Highly flexible, rubber-like, wear resistant',
      strength: 7,
      flexibility: 10,
      ease: 5,
      tempRange: '210-230°C',
      bestFor: ['Phone cases', 'Seals', 'Flexible parts']
    }
  };

  const getRecommendation = (): { filament: string; data: FilamentOption; settings: PrintSettings; score: number } => {
    let bestMatch = 'pla';
    let bestScore = 0;

    Object.keys(filaments).forEach(key => {
      const fil = filaments[key];
      let score = 0;
      
      score += Math.abs(fil.strength - requirements.strength) * -1;
      score += Math.abs(fil.flexibility - requirements.flexibility) * -1;
      score += fil.ease * 0.5;
      
      if (requirements.outdoor && key === 'petg') score += 5;
      if (requirements.foodSafe && key === 'petg') score += 5;
      if (requirements.flexibility > 7 && key === 'tpu') score += 8;
      if (requirements.strength > 7 && (key === 'abs' || key === 'petg')) score += 3;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    });

    const settings: PrintSettings = {
      temperature: filaments[bestMatch].tempRange.split('-')[0],
      bedTemp: bestMatch === 'abs' ? '100°C' : bestMatch === 'tpu' ? '50°C' : '60°C',
      speed: bestMatch === 'tpu' ? '20-30 mm/s' : requirements.detail > 7 ? '40-50 mm/s' : '50-60 mm/s',
      layerHeight: requirements.detail > 7 ? '0.12mm' : '0.2mm',
      infill: requirements.strength > 7 ? '40-50%' : '15-20%'
    };

    return { filament: bestMatch, data: filaments[bestMatch], settings, score: bestScore };
  };

  const handleSubmit = () => {
    if (projectType.trim()) {
      setShowResults(true);
    }
  };

  const recommendation = showResults ? getRecommendation() : null;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header">
          <h1 className="title">Printwise</h1>
          <p className="subtitle">Find the best filament for your 3D print</p>
        </div>

        <div className="card form-card">
          <div className="input-group">
            <label className="label">What are you printing?</label>
            <input
              type="text"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="e.g., Phone case, vase, gear..."
              className="text-input"
            />
          </div>

          <div className="sliders-container">
            <div className="slider-group">
              <label className="label">Strength: {requirements.strength}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={requirements.strength}
                onChange={(e) => setRequirements({...requirements, strength: parseInt(e.target.value)})}
                className="slider"
              />
            </div>

            <div className="slider-group">
              <label className="label">Flexibility: {requirements.flexibility}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={requirements.flexibility}
                onChange={(e) => setRequirements({...requirements, flexibility: parseInt(e.target.value)})}
                className="slider"
              />
            </div>

            <div className="slider-group">
              <label className="label">Detail: {requirements.detail}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={requirements.detail}
                onChange={(e) => setRequirements({...requirements, detail: parseInt(e.target.value)})}
                className="slider"
              />
            </div>
          </div>

          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={requirements.outdoor}
                onChange={(e) => setRequirements({...requirements, outdoor: e.target.checked})}
                className="checkbox"
              />
              <span>Outdoor use</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={requirements.foodSafe}
                onChange={(e) => setRequirements({...requirements, foodSafe: e.target.checked})}
                className="checkbox"
              />
              <span>Food safe</span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!projectType.trim()}
            className="submit-button"
          >
            Get Recommendation
          </button>
        </div>

        {showResults && recommendation && (
          <div className="results-container">
            <div className="card">
              <h2 className="section-title">Recommended Filament</h2>
              <div className="filament-info">
                <h3 className="filament-name">{recommendation.data.name}</h3>
                <p className="filament-description">{recommendation.data.description}</p>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Strength:</span>
                    <span className="stat-value">{recommendation.data.strength}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Flexibility:</span>
                    <span className="stat-value">{recommendation.data.flexibility}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ease:</span>
                    <span className="stat-value">{recommendation.data.ease}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Temp:</span>
                    <span className="stat-value">{recommendation.data.tempRange}</span>
                  </div>
                </div>
                <div>
                  <p className="best-for-label">Best for:</p>
                  <div className="tags-container">
                    {recommendation.data.bestFor.map((use, i) => (
                      <span key={i} className="tag">{use}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Print Settings</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <p className="setting-label">Nozzle Temp</p>
                  <p className="setting-value">{recommendation.settings.temperature}</p>
                </div>
                <div className="setting-item">
                  <p className="setting-label">Bed Temp</p>
                  <p className="setting-value">{recommendation.settings.bedTemp}</p>
                </div>
                <div className="setting-item">
                  <p className="setting-label">Layer Height</p>
                  <p className="setting-value">{recommendation.settings.layerHeight}</p>
                </div>
                <div className="setting-item">
                  <p className="setting-label">Print Speed</p>
                  <p className="setting-value">{recommendation.settings.speed}</p>
                </div>
                <div className="setting-item">
                  <p className="setting-label">Infill</p>
                  <p className="setting-value">{recommendation.settings.infill}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;