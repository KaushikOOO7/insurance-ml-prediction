import { InsuranceRecord } from '../types';

export const DATASET_STATS = {
  totalRecords: 1338,
  meanCharge: 13270.42,
  medianCharge: 9382.03,
  minCharge: 1121.87,
  maxCharge: 63770.43,
  smokerCount: 274,
  nonSmokerCount: 1064,
  smokerAvgCharge: 32050.23,
  nonSmokerAvgCharge: 8434.27,
  maleAvgCharge: 13956.75,
  femaleAvgCharge: 12569.58,
  avgAge: 39.2,
  avgBmi: 30.66,
  avgChildren: 1.09,
};

// Distribution histograms and aggregates
export const AGE_DISTRIBUTION = [
  { range: '18-24', count: 278, avgCharge: 7086 },
  { range: '25-34', count: 274, avgCharge: 10180 },
  { range: '35-44', count: 260, avgCharge: 13134 },
  { range: '45-54', count: 286, avgCharge: 15854 },
  { range: '55-64', count: 240, avgCharge: 18513 },
];

export const BMI_DISTRIBUTION = [
  { range: '<18.5 (Underweight)', count: 20, avgCharge: 8852 },
  { range: '18.5–24.9 (Normal)', count: 225, avgCharge: 10379 },
  { range: '25.0–29.9 (Overweight)', count: 386, avgCharge: 10988 },
  { range: '30.0–34.9 (Obese I)', count: 391, avgCharge: 14413 },
  { range: '35.0–39.9 (Obese II)', count: 225, avgCharge: 16958 },
  { range: '40.0+ (Severe Obese)', count: 91, avgCharge: 19839 },
];

export const SMOKER_BY_BMI = [
  { bmiGroup: 'Normal (<25)', smokerAvg: 19942, nonSmokerAvg: 7922 },
  { bmiGroup: 'Overweight (25-30)', smokerAvg: 22495, nonSmokerAvg: 8257 },
  { bmiGroup: 'Obese I (30-35)', smokerAvg: 41558, nonSmokerAvg: 8543 },
  { bmiGroup: 'Obese II+ (35+)', smokerAvg: 44217, nonSmokerAvg: 8974 },
];

export const REGIONAL_STATS = [
  { region: 'Southeast', records: 364, avgCharge: 14735.41, smokerPct: 25.0, avgBmi: 33.36 },
  { region: 'Northeast', records: 324, avgCharge: 13406.38, smokerPct: 20.7, avgBmi: 29.17 },
  { region: 'Northwest', records: 325, avgCharge: 12417.58, smokerPct: 17.8, avgBmi: 29.20 },
  { region: 'Southwest', records: 325, avgCharge: 12346.94, smokerPct: 17.8, avgBmi: 30.60 },
];

export const CORRELATION_MATRIX = [
  { feature: 'Age', age: 1.00, bmi: 0.11, children: 0.04, smoker: 0.03, charges: 0.30 },
  { feature: 'BMI', age: 0.11, bmi: 1.00, children: 0.01, smoker: 0.00, charges: 0.20 },
  { feature: 'Children', age: 0.04, bmi: 0.01, children: 1.00, smoker: 0.01, charges: 0.07 },
  { feature: 'Smoker', age: 0.03, bmi: 0.00, children: 0.01, smoker: 1.00, charges: 0.79 },
  { feature: 'Charges', age: 0.30, bmi: 0.20, children: 0.07, smoker: 0.79, charges: 1.00 },
];

// Sample records from the 1,338 records dataset for the interactive data table & explorer
export const SAMPLE_RECORDS: InsuranceRecord[] = [
  { id: 1, age: 19, sex: 'female', bmi: 27.9, children: 0, smoker: 'yes', region: 'southwest', charges: 16884.92 },
  { id: 2, age: 18, sex: 'male', bmi: 33.77, children: 1, smoker: 'no', region: 'southeast', charges: 1725.55 },
  { id: 3, age: 28, sex: 'male', bmi: 33.0, children: 3, smoker: 'no', region: 'southeast', charges: 4449.46 },
  { id: 4, age: 33, sex: 'male', bmi: 22.7, children: 0, smoker: 'no', region: 'northwest', charges: 21984.47 },
  { id: 5, age: 32, sex: 'male', bmi: 28.88, children: 0, smoker: 'no', region: 'northwest', charges: 3866.86 },
  { id: 6, age: 31, sex: 'female', bmi: 25.74, children: 0, smoker: 'no', region: 'southeast', charges: 3756.62 },
  { id: 7, age: 46, sex: 'female', bmi: 33.44, children: 1, smoker: 'no', region: 'southeast', charges: 8240.59 },
  { id: 8, age: 37, sex: 'female', bmi: 27.74, children: 3, smoker: 'no', region: 'northwest', charges: 7281.51 },
  { id: 9, age: 37, sex: 'male', bmi: 29.83, children: 2, smoker: 'no', region: 'northeast', charges: 6406.41 },
  { id: 10, age: 60, sex: 'female', bmi: 25.84, children: 0, smoker: 'no', region: 'northwest', charges: 28923.14 },
  { id: 11, age: 25, sex: 'male', bmi: 26.22, children: 0, smoker: 'no', region: 'northeast', charges: 2721.32 },
  { id: 12, age: 62, sex: 'female', bmi: 26.29, children: 0, smoker: 'yes', region: 'southeast', charges: 27808.73 },
  { id: 13, age: 23, sex: 'male', bmi: 34.4, children: 0, smoker: 'no', region: 'southwest', charges: 1826.84 },
  { id: 14, age: 56, sex: 'female', bmi: 39.82, children: 0, smoker: 'no', region: 'southeast', charges: 11090.72 },
  { id: 15, age: 27, sex: 'male', bmi: 42.13, children: 0, smoker: 'yes', region: 'southeast', charges: 39611.76 },
  { id: 16, age: 19, sex: 'male', bmi: 24.6, children: 1, smoker: 'no', region: 'southwest', charges: 1837.24 },
  { id: 17, age: 52, sex: 'female', bmi: 30.78, children: 1, smoker: 'no', region: 'northeast', charges: 10797.34 },
  { id: 18, age: 23, sex: 'male', bmi: 23.85, children: 0, smoker: 'no', region: 'northeast', charges: 2395.17 },
  { id: 19, age: 56, sex: 'male', bmi: 40.3, children: 0, smoker: 'no', region: 'southwest', charges: 10602.39 },
  { id: 20, age: 30, sex: 'male', bmi: 35.3, children: 0, smoker: 'yes', region: 'southwest', charges: 36837.47 },
  { id: 21, age: 60, sex: 'female', bmi: 36.01, children: 0, smoker: 'no', region: 'northeast', charges: 13228.85 },
  { id: 22, age: 30, sex: 'female', bmi: 32.4, children: 1, smoker: 'no', region: 'southwest', charges: 4149.74 },
  { id: 23, age: 18, sex: 'male', bmi: 34.1, children: 0, smoker: 'no', region: 'southeast', charges: 1137.01 },
  { id: 24, age: 34, sex: 'female', bmi: 31.92, children: 1, smoker: 'yes', region: 'northeast', charges: 37701.88 },
  { id: 25, age: 37, sex: 'male', bmi: 28.03, children: 2, smoker: 'no', region: 'northwest', charges: 6203.90 },
  { id: 26, age: 59, sex: 'female', bmi: 27.72, children: 3, smoker: 'no', region: 'southeast', charges: 14001.13 },
  { id: 27, age: 63, sex: 'female', bmi: 23.09, children: 0, smoker: 'no', region: 'northeast', charges: 14449.85 },
  { id: 28, age: 55, sex: 'female', bmi: 32.78, children: 0, smoker: 'no', region: 'northwest', charges: 12268.63 },
  { id: 29, age: 23, sex: 'male', bmi: 17.38, children: 1, smoker: 'no', region: 'northwest', charges: 2775.20 },
  { id: 30, age: 31, sex: 'male', bmi: 36.3, children: 2, smoker: 'yes', region: 'southwest', charges: 38711.00 },
  { id: 31, age: 22, sex: 'male', bmi: 35.6, children: 0, smoker: 'yes', region: 'southwest', charges: 35585.58 },
  { id: 32, age: 18, sex: 'female', bmi: 26.31, children: 0, smoker: 'no', region: 'northeast', charges: 2198.19 },
  { id: 33, age: 19, sex: 'female', bmi: 28.6, children: 5, smoker: 'no', region: 'southwest', charges: 4687.80 },
  { id: 34, age: 63, sex: 'male', bmi: 28.3, children: 0, smoker: 'no', region: 'northwest', charges: 13770.10 },
  { id: 35, age: 28, sex: 'male', bmi: 36.4, children: 1, smoker: 'yes', region: 'southwest', charges: 51194.56 },
  { id: 36, age: 19, sex: 'male', bmi: 20.43, children: 0, smoker: 'no', region: 'northwest', charges: 1625.43 },
  { id: 37, age: 62, sex: 'female', bmi: 32.97, children: 3, smoker: 'no', region: 'northwest', charges: 15644.88 },
  { id: 38, age: 26, sex: 'male', bmi: 20.8, children: 0, smoker: 'no', region: 'southwest', charges: 2302.39 },
  { id: 39, age: 35, sex: 'male', bmi: 36.67, children: 1, smoker: 'yes', region: 'northeast', charges: 39774.28 },
  { id: 40, age: 60, sex: 'male', bmi: 39.9, children: 0, smoker: 'yes', region: 'southwest', charges: 48173.36 },
];
