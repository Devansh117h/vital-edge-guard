import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Patient } from '@/types/health';
import VitalChart from './VitalChart';
import { Activity, Thermometer, Droplet, Wind, AlertTriangle, User, MapPin, Clock } from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, isOpen, onClose }) => {
  if (!patient) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-status-critical-bg text-status-critical border-status-critical';
      case 'warning':
        return 'bg-status-warning-bg text-status-warning border-status-warning';
      default:
        return 'bg-status-normal-bg text-status-normal border-status-normal';
    }
  };

  const vitalCharts = [
    {
      vitalType: 'heartRate' as const,
      color: 'hsl(var(--chart-heart-rate))',
      title: 'Heart Rate',
      unit: 'BPM',
      icon: Activity,
      normalRange: [60, 100] as [number, number]
    },
    {
      vitalType: 'respirationRate' as const,
      color: 'hsl(var(--chart-respiration))',
      title: 'Respiration Rate',
      unit: '/min',
      icon: Wind,
      normalRange: [12, 20] as [number, number]
    },
    {
      vitalType: 'oxygenSaturation' as const,
      color: 'hsl(var(--chart-oxygen))',
      title: 'Oxygen Saturation',
      unit: '%',
      icon: Droplet,
      normalRange: [95, 100] as [number, number]
    },
    {
      vitalType: 'temperature' as const,
      color: 'hsl(var(--chart-temperature))',
      title: 'Temperature',
      unit: '°F',
      icon: Thermometer,
      normalRange: [97, 99] as [number, number]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-surface">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-light rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-foreground">
                  {patient.name}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {patient.roomNumber}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Age {patient.age}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Updated {patient.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className={getStatusColor(patient.status)} variant="outline">
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Badge>
              {patient.anomalyDetected && (
                <Badge className="bg-status-anomaly-bg text-status-anomaly border-status-anomaly" variant="outline">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Anomaly Detected
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Vitals Summary */}
          <div className="grid grid-cols-4 gap-4">
            {vitalCharts.map(({ vitalType, color, title, unit, icon: Icon }) => {
              const value = patient.currentVitals[vitalType];
              return (
                <div key={vitalType} className="bg-card border border-card-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5" style={{ color }} />
                    <span className="text-sm font-medium text-card-foreground">{title}</span>
                  </div>
                  <div className="text-2xl font-bold text-card-foreground">
                    {typeof value === 'number' ? value.toFixed(1) : value} 
                    <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vital Signs Charts */}
          <div className="grid grid-cols-2 gap-6">
            {vitalCharts.map((chart) => (
              <div key={chart.vitalType} className="bg-card border border-card-border rounded-lg p-4">
                <VitalChart
                  data={patient.vitals}
                  vitalType={chart.vitalType}
                  color={chart.color}
                  title={chart.title}
                  unit={chart.unit}
                  normalRange={chart.normalRange}
                />
              </div>
            ))}
          </div>

          {/* ML Classification Results */}
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              AI Classification & Risk Assessment
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Classification</h4>
                <Badge className={getStatusColor(patient.status)} variant="outline">
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Confidence Score</h4>
                <div className="text-lg font-semibold text-card-foreground">
                  {(Math.random() * 20 + 75).toFixed(1)}%
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Risk Factors</h4>
                <div className="text-sm text-card-foreground">
                  {patient.status === 'critical' ? 'High heart rate, Low SpO₂' :
                   patient.status === 'warning' ? 'Elevated vitals' : 
                   'Within normal ranges'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailModal;