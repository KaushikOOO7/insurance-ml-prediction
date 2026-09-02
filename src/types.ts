export type Sex = 'male' | 'female';
export type Smoker = 'yes' | 'no';
export type Region = 'southwest' | 'southeast' | 'northwest' | 'northeast';

export interface InsuranceInput {
  age: number;
  sex: Sex;
  bmi: number;
  children: number;
  smoker: Smoker;
  region: Region;
  modelName?: string;
}

export interface InsuranceRecord {
  id?: number;
  age: number;
  sex: Sex;
  bmi: number;
  children: number;
  smoker: Smoker;
  region: Region;
  charges: number;
}

export interface ModelMetric {
  model: string;
  mae: number;
  rmse: number;
  r2: number;
  rank: number;
  category: string;
  bestFor: string;
  description: string;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  impactLevel: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface PredictionOutput {
  estimatedCharges: number;
  modelName: string;
  timestamp: string;
  input: InsuranceInput;
  comparisons: { [model: string]: number };
  insights: {
    smokerImpact: boolean;
    bmiWarning: boolean;
    ageFactor: string;
    bmiCategory: string;
    relativeToAverage: number; // percentage difference vs average ($13,270)
  };
}
