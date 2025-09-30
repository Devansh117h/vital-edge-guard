import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/health';
import { Activity, Thermometer, Droplet, Wind, AlertTriangle, Edit } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  onEdit?: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick, onEdit }) => {
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

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
        patient.status === 'critical' ? 'border-status-critical/30 bg-status-critical-bg/20' :
        patient.status === 'warning' ? 'border-status-warning/30 bg-status-warning-bg/20' :
        'border-card-border bg-card hover:border-primary/30'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {patient.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {patient.roomNumber} • Age {patient.age} • ID: {patient.id}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              <Badge className={getStatusColor(patient.status)}>
                {getStatusText(patient.status)}
              </Badge>
            </div>
            {patient.anomalyDetected && (
              <Badge className="bg-status-anomaly-bg text-status-anomaly border-status-anomaly">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Anomaly
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-chart-heart-rate" />
            <div>
              <p className="text-xs text-muted-foreground">Heart Rate</p>
              <p className="font-medium text-card-foreground">
                {Math.round(patient.currentVitals.heartRate)} BPM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-chart-respiration" />
            <div>
              <p className="text-xs text-muted-foreground">Respiration</p>
              <p className="font-medium text-card-foreground">
                {Math.round(patient.currentVitals.respirationRate)} /min
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-chart-oxygen" />
            <div>
              <p className="text-xs text-muted-foreground">SpO₂</p>
              <p className="font-medium text-card-foreground">
                {Math.round(patient.currentVitals.oxygenSaturation)}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-chart-temperature" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="font-medium text-card-foreground">
                {patient.currentVitals.temperature.toFixed(1)}°F
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Last updated: {patient.lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;