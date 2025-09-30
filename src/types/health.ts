export interface VitalSigns {
  heartRate: number;
  respirationRate: number;
  oxygenSaturation: number;
  temperature: number;
  timestamp: Date;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  roomNumber: string;
  status: PatientStatus;
  vitals: VitalSigns[];
  currentVitals: VitalSigns;
  anomalyDetected: boolean;
  lastUpdated: Date;
}

export type PatientStatus = 'normal' | 'warning' | 'critical';

export interface MLClassification {
  status: PatientStatus;
  confidence: number;
  riskFactors: string[];
}

export interface AnomalyDetection {
  isAnomaly: boolean;
  anomalyScore: number;
  affectedVitals: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}