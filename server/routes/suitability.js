const express = require('express');
const router = express.Router();

const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Prefer ML service; fall back to rule-based scoring if ML call fails
router.post('/recommend', async (req, res) => {
  try {
    const mlPayload = {
      district: req.body.district || '',
      season: req.body.season || 'Maha',
      soil_ph: Number(req.body.soilPH ?? 6.3),
      soil_type: req.body.soilType || 'Loam',
      drainage: req.body.drainage || 'Moderate',
      slope: req.body.slope || 'Flat',
      irrigation: req.body.irrigation !== undefined ? !!req.body.irrigation : true,
      rainfall_mm: Number(req.body.rainfall ?? 1100),
      temperature_c: Number(req.body.temperature ?? 28),
      land_size_ha: Number(req.body.landSizeHa ?? 1.0)
    };

    const mlResp = await axios.post(`${AI_SERVICE_URL}/suitability/predict`, mlPayload, { timeout: 5000 });
    if (mlResp?.data?.recommendations) {
      return res.json({ recommendations: mlResp.data.recommendations, source: 'ml', inputs: mlPayload });
    }
  } catch (err) {
    console.error('ML suitability call failed, falling back to rules:', err.message);
  }

  // Rule-based fallback
  const {
    season = 'Maha',
    soilPH = 6.0,
    soilType = 'Loam',
    drainage = 'Moderate',
    slope = 'Flat',
    irrigation = true,
    rainfall = 1200,
    temperature = 28,
  } = req.body || {};

  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  const components = {
    Rice: {
      ph: clamp01(1 - Math.abs((soilPH - 6.3) / 1.5)),
      rain: clamp01((rainfall - 900) / (1800 - 900)),
      temp: clamp01(1 - Math.abs((temperature - 27.5) / 7)),
      irr: irrigation ? 1 : (season === 'Yala' ? 0.6 : 0.8),
      slope: slope === 'Flat' ? 1 : slope === 'Gentle' ? 0.7 : 0.3,
      drainage: drainage === 'Moderate' ? 1 : drainage === 'Poor' ? 0.8 : 0.9,
      soil: soilType === 'Clay' ? 0.9 : soilType === 'Loam' ? 1 : 0.6,
    },
    Tea: {
      ph: clamp01(1 - Math.abs((soilPH - 5.0) / 1.0)),
      rain: clamp01((rainfall - 1200) / (2500 - 1200)),
      temp: clamp01(1 - Math.abs((temperature - 24) / 6)),
      irr: irrigation ? 0.9 : 0.8,
      slope: slope === 'Steep' ? 0.9 : slope === 'Gentle' ? 0.8 : 0.7,
      drainage: drainage === 'Good' ? 1 : drainage === 'Moderate' ? 0.9 : 0.6,
      soil: soilType === 'Loam' ? 1 : soilType === 'Sandy' ? 0.7 : 0.85,
    },
    Chili: {
      ph: clamp01(1 - Math.abs((soilPH - 6.8) / 1.2)),
      rain: clamp01((rainfall - 700) / (1200 - 700)),
      temp: clamp01(1 - Math.abs((temperature - 29) / 6)),
      irr: irrigation ? 1 : 0.5,
      slope: slope === 'Flat' ? 1 : slope === 'Gentle' ? 0.8 : 0.5,
      drainage: drainage === 'Good' ? 1 : 0.7,
      soil: soilType === 'Sandy' ? 0.9 : soilType === 'Loam' ? 1 : 0.7,
    },
  };

  const weights = { ph: 0.2, rain: 0.2, temp: 0.2, irr: 0.15, slope: 0.1, drainage: 0.075, soil: 0.075 };

  function scoreCrop(name, c) {
    const score01 = (
      c.ph * weights.ph +
      c.rain * weights.rain +
      c.temp * weights.temp +
      c.irr * weights.irr +
      c.slope * weights.slope +
      c.drainage * weights.drainage +
      c.soil * weights.soil
    );
    const score = score01 * 100;
    let reason = `${name} suits ${season} season with pH ${soilPH}, rainfall ${rainfall}mm, temperature ${temperature}°C.`;
    if (!irrigation) reason += ' Limited irrigation reduces suitability.';
    if (name === 'Rice' && slope !== 'Flat') reason += ' Flat fields preferred for rice.';
    if (name === 'Tea' && soilPH > 6) reason += ' Tea prefers acidic soils (pH ~4.5-5.5).';
    if (name === 'Chili' && drainage !== 'Good') reason += ' Chili prefers well-drained soils.';
    const notes = `Weights: pH ${weights.ph}, rainfall ${weights.rain}, temperature ${weights.temp}.`;
    return { crop: name, score, reason, notes };
  }

  const recs = [
    scoreCrop('Rice', components.Rice),
    scoreCrop('Tea', components.Tea),
    scoreCrop('Chili', components.Chili),
  ].sort((a, b) => b.score - a.score);

  return res.json({ recommendations: recs, source: 'rules', inputs: req.body });
});

module.exports = router;
