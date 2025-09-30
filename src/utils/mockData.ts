import { Patient, VitalSigns, PatientStatus } from '@/types/health';

// Generate realistic vital signs with some variation
export const generateMockVitals = (baseVitals?: Partial<VitalSigns>): VitalSigns => {
  const defaults = {
    heartRate: 75,
    respirationRate: 16,
    oxygenSaturation: 98,
    temperature: 98.6
  };

  const vitals = { ...defaults, ...baseVitals };
  
  return {
    heartRate: vitals.heartRate + (Math.random() - 0.5) * 10,
    respirationRate: vitals.respirationRate + (Math.random() - 0.5) * 4,
    oxygenSaturation: Math.min(100, vitals.oxygenSaturation + (Math.random() - 0.5) * 3),
    temperature: vitals.temperature + (Math.random() - 0.5) * 2,
    timestamp: new Date()
  };
};

// Classification logic based on vitals
export const classifyPatientStatus = (vitals: VitalSigns): PatientStatus => {
  const { heartRate, respirationRate, oxygenSaturation, temperature } = vitals;
  
  // Critical conditions
  if (heartRate > 120 || heartRate < 50 || 
      respirationRate > 24 || respirationRate < 12 ||
      oxygenSaturation < 90 || 
      temperature > 103 || temperature < 95) {
    return 'critical';
  }
  
  // Warning conditions
  if (heartRate > 100 || heartRate < 60 ||
      respirationRate > 20 || respirationRate < 14 ||
      oxygenSaturation < 95 ||
      temperature > 100.4 || temperature < 97) {
    return 'warning';
  }
  
  return 'normal';
};

// Anomaly detection simulation
export const detectAnomalies = (vitals: VitalSigns): boolean => {
  // Simple anomaly detection based on unusual combinations
  const { heartRate, respirationRate, oxygenSaturation, temperature } = vitals;
  
  // Unusual patterns that might indicate equipment malfunction or rare conditions
  if ((heartRate > 90 && respirationRate < 10) ||
      (oxygenSaturation > 99 && heartRate > 110) ||
      (temperature < 96 && heartRate > 100)) {
    return Math.random() > 0.7; // 30% chance to flag as anomaly
  }
  
  return false;
};

// Generate initial mock patients
export const generateMockPatients = (): Patient[] => {
  const patients: Patient[] = [
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      roomNumber: 'ICU-101',
      status: 'normal',
      vitals: [],
      currentVitals: generateMockVitals(),
      anomalyDetected: false,
      lastUpdated: new Date()
    },
    {
      id: 'P002',
      name: 'Maria Garcia',
      age: 67,
      roomNumber: 'ICU-102',
      status: 'warning',
      vitals: [],
      currentVitals: generateMockVitals({ heartRate: 105, temperature: 101.2 }),
      anomalyDetected: false,
      lastUpdated: new Date()
    },
    {
      id: 'P003',
      name: 'Robert Johnson',
      age: 72,
      roomNumber: 'ICU-103',
      status: 'critical',
      vitals: [],
      currentVitals: generateMockVitals({ heartRate: 125, oxygenSaturation: 88 }),
      anomalyDetected: true,
      lastUpdated: new Date()
    },
    {
      id: 'P004',
      name: 'Sarah Wilson',
      age: 34,
      roomNumber: 'ICU-104',
      status: 'normal',
      vitals: [],
      currentVitals: generateMockVitals(),
      anomalyDetected: false,
      lastUpdated: new Date()
    },
    {
      id: 'P005',
      name: 'Michael Brown',
      age: 58,
      roomNumber: 'ICU-105',
      status: 'warning',
      vitals: [],
      currentVitals: generateMockVitals({ respirationRate: 22, heartRate: 95 }),
      anomalyDetected: false,
      lastUpdated: new Date()
    },
    {
      id: 'P006',
      name: 'Lisa Davis',
      age: 41,
      roomNumber: 'ICU-106',
      status: 'normal',
      vitals: [],
      currentVitals: generateMockVitals(),
      anomalyDetected: false,
      lastUpdated: new Date()
    }
  ];

  // Classify each patient and generate historical data
  patients.forEach(patient => {
    patient.status = classifyPatientStatus(patient.currentVitals);
    patient.anomalyDetected = detectAnomalies(patient.currentVitals);
    
    // Generate some historical data
    for (let i = 0; i < 50; i++) {
      const historicalVitals = generateMockVitals(patient.currentVitals);
      historicalVitals.timestamp = new Date(Date.now() - (50 - i) * 60000); // 1 minute intervals
      patient.vitals.push(historicalVitals);
    }
  });

  return patients;
};