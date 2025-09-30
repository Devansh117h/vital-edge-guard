import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PatientCard from '@/components/PatientCard';
import PatientDetailModal from '@/components/PatientDetailModal';
import ModelMetricsPanel from '@/components/ModelMetricsPanel';
import { Patient, ModelMetrics } from '@/types/health';
import { generateMockPatients, generateMockVitals, classifyPatientStatus, detectAnomalies } from '@/utils/mockData';
import { Activity, AlertTriangle, Users, Stethoscope, Pause, Play } from 'lucide-react';

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  
  // Mock ML metrics
  const [modelMetrics] = useState<ModelMetrics>({
    accuracy: 0.94,
    precision: 0.91,
    recall: 0.93,
    f1Score: 0.92,
    rocAuc: 0.956
  });

  // Initialize patients
  useEffect(() => {
    setPatients(generateMockPatients());
  }, []);

  // Real-time simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => {
          const newVitals = generateMockVitals(patient.currentVitals);
          const newStatus = classifyPatientStatus(newVitals);
          const hasAnomaly = detectAnomalies(newVitals);
          
          return {
            ...patient,
            currentVitals: newVitals,
            status: newStatus,
            anomalyDetected: hasAnomaly,
            vitals: [...patient.vitals.slice(-49), newVitals],
            lastUpdated: new Date()
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const getStatusCounts = () => {
    const counts = { normal: 0, warning: 0, critical: 0, anomaly: 0 };
    patients.forEach(patient => {
      counts[patient.status]++;
      if (patient.anomalyDetected) counts.anomaly++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const criticalAndWarningPatients = patients
    .filter(p => p.status === 'critical' || p.status === 'warning' || p.anomalyDetected)
    .sort((a, b) => {
      if (a.status === 'critical' && b.status !== 'critical') return -1;
      if (b.status === 'critical' && a.status !== 'critical') return 1;
      if (a.anomalyDetected && !b.anomalyDetected) return -1;
      if (b.anomalyDetected && !a.anomalyDetected) return 1;
      return 0;
    });

  const normalPatients = patients.filter(p => p.status === 'normal' && !p.anomalyDetected);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-primary" />
              Health Monitoring System
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time patient vitals with AI-powered classification and anomaly detection
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={isSimulating ? "outline" : "default"}
              onClick={() => setIsSimulating(!isSimulating)}
              className="flex items-center gap-2"
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSimulating ? 'Pause' : 'Resume'} Simulation
            </Button>
            <Badge variant="outline" className="bg-primary-light text-primary">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Live Monitoring
            </Badge>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-status-critical-bg/20 border-status-critical/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-status-critical" />
              <div>
                <p className="text-2xl font-bold text-status-critical">{statusCounts.critical}</p>
                <p className="text-sm text-status-critical">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-status-warning-bg/20 border-status-warning/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-status-warning" />
              <div>
                <p className="text-2xl font-bold text-status-warning">{statusCounts.warning}</p>
                <p className="text-sm text-status-warning">Warning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-status-anomaly-bg/20 border-status-anomaly/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-status-anomaly" />
              <div>
                <p className="text-2xl font-bold text-status-anomaly">{statusCounts.anomaly}</p>
                <p className="text-sm text-status-anomaly">Anomalies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Patient Monitoring Grid */}
        <div className="col-span-3 space-y-6">
          {/* Priority Patients */}
          {criticalAndWarningPatients.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-status-critical" />
                Priority Patients ({criticalAndWarningPatients.length})
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {criticalAndWarningPatients.map(patient => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onClick={() => handlePatientClick(patient)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stable Patients */}
          {normalPatients.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-status-normal" />
                Stable Patients ({normalPatients.length})
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {normalPatients.map(patient => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onClick={() => handlePatientClick(patient)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ML Metrics Panel */}
        <div className="col-span-1">
          <ModelMetricsPanel 
            metrics={modelMetrics} 
            totalPatients={patients.length}
          />
        </div>
      </div>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
      />
    </div>
  );
};

export default Index;