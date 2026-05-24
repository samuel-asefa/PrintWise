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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filaments: Record<string, FilamentOption> = {
    pla: {
      name: 'PLA',
      description: 'Easy to print, biodegradable, and great for beginners. Ideal for everyday models.',
      strength: 4,
      flexibility: 3,
      ease: 10,
      tempRange: '190-220°C',
      bestFor: ['Prototypes', 'Decorative items', 'Low-stress parts']
    },
    silk_pla: {
      name: 'Silk PLA',
      description: 'Provides a glossy, metallic finish for beautiful display pieces. Slightly more brittle than standard PLA.',
      strength: 3,
      flexibility: 3,
      ease: 9,
      tempRange: '200-230°C',
      bestFor: ['Art', 'Statues', 'Vases']
    },
    petg: {
      name: 'PETG',
      description: 'Strong, slightly flexible, and durable. Good chemical and water resistance.',
      strength: 7,
      flexibility: 5,
      ease: 7,
      tempRange: '220-250°C',
      bestFor: ['Mechanical parts', 'Containers', 'Snap-fits']
    },
    abs: {
      name: 'ABS',
      description: 'Strong, heat-resistant, and can be smoothed. Requires an enclosed printer due to fumes and warping.',
      strength: 8,
      flexibility: 4,
      ease: 4,
      tempRange: '220-250°C',
      bestFor: ['Functional parts', 'Automotive', 'Heat resistance']
    },
    asa: {
      name: 'ASA',
      description: 'A highly UV-resistant and weather-proof alternative to ABS. Great for outdoor use.',
      strength: 8,
      flexibility: 4,
      ease: 5,
      tempRange: '230-260°C',
      bestFor: ['Outdoor items', 'Automotive fixtures', 'Functional parts']
    },
    tpu: {
      name: 'TPU',
      description: 'Highly flexible, rubber-like material with excellent impact and wear resistance.',
      strength: 5,
      flexibility: 10,
      ease: 3,
      tempRange: '210-230°C',
      bestFor: ['Phone cases', 'Seals/Gaskets', 'Wearables']
    },
    nylon: {
      name: 'Nylon',
      description: 'Extremely durable, impact-resistant, and low friction. Prone to absorbing moisture.',
      strength: 9,
      flexibility: 6,
      ease: 2,
      tempRange: '240-260°C',
      bestFor: ['Gears', 'Hinges', 'High-wear mechanical parts']
    },
    pc: {
      name: 'Polycarbonate',
      description: 'Incredibly strong and highly heat-resistant, but very difficult to print without high-end equipment.',
      strength: 10,
      flexibility: 4,
      ease: 1,
      tempRange: '260-310°C',
      bestFor: ['Impact resistance', 'High heat applications', 'Drones']
    }
  };

  const getRecommendation = (): { filament: string; data: FilamentOption; settings: PrintSettings; score: number } => {
    let bestMatch = 'pla';
    let bestScore = -Infinity;
    let scores: Record<string, number> = {};

    Object.keys(filaments).forEach(key => {
      const fil = filaments[key];
      let score = 80; // Baseline score
      
      // Penalize heavily for mismatched strength and flexibility
      const strengthDiff = Math.abs(fil.strength - requirements.strength);
      const flexDiff = Math.abs(fil.flexibility - requirements.flexibility);
      
      score -= (strengthDiff * 4); 
      score -= (flexDiff * 4);
      
      // Bonus for ease of printing
      score += (fil.ease * 1.5);
      
      // Strict conditions
      if (requirements.outdoor) {
        if (['asa', 'petg'].includes(key)) score += 20;
        if (['pla', 'silk_pla'].includes(key)) score -= 30; // Melts/degrades easily
        if (key === 'abs') score -= 10; // UV degrades ABS
      }
      
      if (requirements.foodSafe) {
        if (key === 'petg') score += 20;
        if (['abs', 'asa', 'pc'].includes(key)) score -= 40; // Generally toxic or porous
      }
      
      if (requirements.flexibility >= 8) {
        if (key === 'tpu') score += 30;
        else score -= 40;
      }
      
      if (requirements.strength >= 8) {
        if (['pc', 'nylon', 'abs', 'asa', 'petg'].includes(key)) score += 15;
        if (['pla', 'silk_pla'].includes(key)) score -= 25;
      }

      scores[key] = score;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    });

    // Normalize final score to a pleasant percentage (max 99%)
    let finalPercentage = Math.min(Math.max(Math.round(bestScore), 30), 99);
    
    const settings: PrintSettings = {
      temperature: filaments[bestMatch].tempRange.split('-')[0],
      bedTemp: ['abs', 'asa', 'pc', 'nylon'].includes(bestMatch) ? '90-110°C' : bestMatch === 'tpu' ? '50°C' : '60°C',
      speed: bestMatch === 'tpu' ? '20-30 mm/s' : requirements.detail > 7 ? '40-50 mm/s' : '50-60 mm/s',
      layerHeight: requirements.detail > 7 ? '0.12mm' : '0.2mm',
      infill: requirements.strength > 7 ? '40-60% (Gyroid)' : '15-20% (Grid)'
    };

    return { filament: bestMatch, data: filaments[bestMatch], settings, score: finalPercentage };
  };

  const handleSubmit = () => {
    if (projectType.trim()) {
      setShowResults(false);
      setIsAnalyzing(true);
      
      // Simulate algorithm calculation time for better UX
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
        // Scroll to results
        setTimeout(() => {
           window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }, 1200);
    }
  };

  const recommendation = showResults ? getRecommendation() : null;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="header">
          <h1 className="title">PrintWise</h1>
          <p className="subtitle">Find the best filament and optimal settings for your 3D print</p>
        </div>

        <div className="card form-card">
          <div className="input-group">
            <label className="label">What are you printing?</label>
            <input
              type="text"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="e.g., Drone frame, custom vase, robot gear..."
              className="text-input"
            />
          </div>

          <div className="sliders-container">
            <div className="slider-group">
              <div className="slider-header">
                <span className="label">Strength Required</span>
                <span className="slider-value">{requirements.strength}/10</span>
              </div>
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
              <div className="slider-header">
                <span className="label">Flexibility Required</span>
                <span className="slider-value">{requirements.flexibility}/10</span>
              </div>
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
              <div className="slider-header">
                <span className="label">Detail / Quality</span>
                <span className="slider-value">{requirements.detail}/10</span>
              </div>
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
              <span>Exposed to Weather (UV/Rain)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={requirements.foodSafe}
                onChange={(e) => setRequirements({...requirements, foodSafe: e.target.checked})}
                className="checkbox"
              />
              <span>Food Safe / Drinking Contact</span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!projectType.trim() || isAnalyzing}
            className="submit-button"
          >
            {isAnalyzing ? 'Analyzing Requirements...' : 'Get Recommendation'}
          </button>
        </div>

        {isAnalyzing && (
          <div className="analyzing-container">
            <div className="spinner"></div>
            <p className="analyzing-text">Calculating optimal material match...</p>
          </div>
        )}

        {showResults && recommendation && (
          <div className="results-container">
            <div className="card">
              <h2 className="section-title">Recommended Filament</h2>
              <div className="filament-info">
                <div className="filament-name-wrapper">
                  <h3 className="filament-name">{recommendation.data.name}</h3>
                  <span className="filament-score">{recommendation.score}% Match</span>
                </div>
                <p className="filament-description">{recommendation.data.description}</p>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Strength</span>
                    <span className="stat-value">{recommendation.data.strength}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Flexibility</span>
                    <span className="stat-value">{recommendation.data.flexibility}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ease of Print</span>
                    <span className="stat-value">{recommendation.data.ease}/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Temp Range</span>
                    <span className="stat-value">{recommendation.data.tempRange}</span>
                  </div>
                </div>
                <div>
                  <p className="best-for-label">Best uses:</p>
                  <div className="tags-container">
                    {recommendation.data.bestFor.map((use, i) => (
                      <span key={i} className="tag">{use}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Optimal Print Settings</h2>
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