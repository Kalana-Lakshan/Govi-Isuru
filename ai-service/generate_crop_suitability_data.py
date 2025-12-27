"""
Generate comprehensive crop suitability training data for Sri Lankan agriculture
Based on agronomic best practices for Rice, Tea, and Chili cultivation
"""

import pandas as pd
import numpy as np
from itertools import product

# Sri Lankan districts by climate zone
DISTRICTS = {
    'Wet': ['Colombo', 'Gampaha', 'Kalutara', 'Galle', 'Matara', 'Ratnapura', 'Kegalle', 'Kandy', 'NuwaraEliya'],
    'Dry': ['Anuradhapura', 'Polonnaruwa', 'Ampara', 'Batticaloa', 'Trincomalee', 'Jaffna', 'Kilinochchi', 'Mullaitivu', 'Mannar', 'Vavuniya', 'Hambantota'],
    'Intermediate': ['Kurunegala', 'Puttalam', 'Matale', 'Badulla', 'Monaragala']
}

# Crop optimal conditions (based on agricultural research)
CROP_CONDITIONS = {
    'Rice': {
        'soil_ph': (5.5, 7.0, 6.3),  # (min, max, optimal)
        'rainfall_mm': (900, 2000, 1200),
        'temperature_c': (24, 32, 28),
        'preferred_soil': ['Clay', 'Loam'],
        'preferred_drainage': ['Moderate', 'Poor'],
        'preferred_slope': ['Flat'],
        'requires_irrigation': True,
        'zones': ['Wet', 'Dry', 'Intermediate']
    },
    'Tea': {
        'soil_ph': (4.5, 5.5, 5.0),
        'rainfall_mm': (1500, 3000, 2000),
        'temperature_c': (18, 27, 22),
        'preferred_soil': ['Loam', 'Sandy'],
        'preferred_drainage': ['Good'],
        'preferred_slope': ['Gentle', 'Steep'],
        'requires_irrigation': False,
        'zones': ['Wet', 'Intermediate']
    },
    'Chili': {
        'soil_ph': (6.0, 7.5, 6.7),
        'rainfall_mm': (600, 1200, 900),
        'temperature_c': (25, 33, 30),
        'preferred_soil': ['Sandy', 'Loam'],
        'preferred_drainage': ['Good', 'Moderate'],
        'preferred_slope': ['Flat', 'Gentle'],
        'requires_irrigation': True,
        'zones': ['Dry', 'Intermediate']
    }
}

SEASONS = ['Maha', 'Yala']
SOIL_TYPES = ['Clay', 'Loam', 'Sandy', 'Silt']
DRAINAGE = ['Good', 'Moderate', 'Poor']
SLOPES = ['Flat', 'Gentle', 'Steep']
LAND_SIZES = [0.5, 1.0, 1.5, 2.0, 3.0]

def generate_sample_for_crop(crop, conditions, n_samples=100):
    """Generate realistic samples for a specific crop"""
    samples = []
    
    for _ in range(n_samples):
        # Pick random district from suitable zones
        suitable_zones = conditions['zones']
        zone = np.random.choice(suitable_zones)
        district = np.random.choice(DISTRICTS[zone])
        
        # Season
        season = np.random.choice(SEASONS)
        
        # Soil pH - normal distribution around optimal with some variance
        ph_min, ph_max, ph_opt = conditions['soil_ph']
        soil_ph = np.clip(np.random.normal(ph_opt, 0.5), ph_min - 0.5, ph_max + 0.5)
        
        # Rainfall - influenced by season and zone
        rain_min, rain_max, rain_opt = conditions['rainfall_mm']
        if season == 'Yala':
            rain_opt *= 0.85  # Yala typically has less rain
        if zone == 'Wet':
            rain_opt *= 1.2
        elif zone == 'Dry':
            rain_opt *= 0.8
        rainfall_mm = np.clip(np.random.normal(rain_opt, 200), rain_min - 100, rain_max + 100)
        
        # Temperature - varies by zone
        temp_min, temp_max, temp_opt = conditions['temperature_c']
        if zone == 'Wet':
            temp_opt -= 2
        elif zone == 'Dry':
            temp_opt += 2
        temperature_c = np.clip(np.random.normal(temp_opt, 2), temp_min - 2, temp_max + 2)
        
        # Soil type - weighted towards preferred types
        if np.random.random() < 0.7:
            soil_type = np.random.choice(conditions['preferred_soil'])
        else:
            soil_type = np.random.choice(SOIL_TYPES)
        
        # Drainage - weighted towards preferred
        if np.random.random() < 0.7:
            drainage = np.random.choice(conditions['preferred_drainage'])
        else:
            drainage = np.random.choice(DRAINAGE)
        
        # Slope - weighted towards preferred
        if np.random.random() < 0.7:
            slope = np.random.choice(conditions['preferred_slope'])
        else:
            slope = np.random.choice(SLOPES)
        
        # Irrigation - based on zone and crop requirements
        if conditions['requires_irrigation']:
            irrigation = True if zone in ['Dry', 'Intermediate'] or np.random.random() > 0.3 else False
        else:
            irrigation = True if np.random.random() > 0.6 else False
        
        # Land size
        land_size_ha = np.random.choice(LAND_SIZES)
        
        samples.append({
            'district': district,
            'season': season,
            'soil_ph': round(soil_ph, 1),
            'soil_type': soil_type,
            'drainage': drainage,
            'slope': slope,
            'irrigation': irrigation,
            'rainfall_mm': int(rainfall_mm),
            'temperature_c': int(temperature_c),
            'land_size_ha': land_size_ha,
            'crop': crop
        })
    
    return samples

def generate_dataset():
    """Generate comprehensive dataset for all crops"""
    all_samples = []
    
    # Generate samples for each crop
    for crop, conditions in CROP_CONDITIONS.items():
        print(f"Generating {crop} samples...")
        crop_samples = generate_sample_for_crop(crop, conditions, n_samples=150)
        all_samples.extend(crop_samples)
    
    # Create DataFrame
    df = pd.DataFrame(all_samples)
    
    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    print(f"\nGenerated {len(df)} total samples:")
    print(df['crop'].value_counts())
    print(f"\nDistricts: {df['district'].nunique()}")
    print(f"Soil types: {df['soil_type'].unique()}")
    
    return df

if __name__ == '__main__':
    # Generate dataset
    df = generate_dataset()
    
    # Save to CSV
    output_path = 'data/crop_suitability_samples.csv'
    df.to_csv(output_path, index=False)
    print(f"\n✅ Dataset saved to {output_path}")
    
    # Display sample statistics
    print("\n📊 Dataset Statistics:")
    print(f"Total samples: {len(df)}")
    print("\nCrop distribution:")
    print(df['crop'].value_counts())
    print("\nZone distribution:")
    wet_districts = sum(df['district'].isin(DISTRICTS['Wet']))
    dry_districts = sum(df['district'].isin(DISTRICTS['Dry']))
    inter_districts = sum(df['district'].isin(DISTRICTS['Intermediate']))
    print(f"Wet zone: {wet_districts}")
    print(f"Dry zone: {dry_districts}")
    print(f"Intermediate: {inter_districts}")
    print("\nFeature ranges:")
    print(f"Soil pH: {df['soil_ph'].min():.1f} - {df['soil_ph'].max():.1f}")
    print(f"Rainfall: {df['rainfall_mm'].min()} - {df['rainfall_mm'].max()} mm")
    print(f"Temperature: {df['temperature_c'].min()} - {df['temperature_c'].max()} °C")
