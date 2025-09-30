import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ModelMetrics } from '@/types/health';
import { BarChart, TrendingUp, Target, Activity } from 'lucide-react';

interface ModelMetricsPanelProps {
  metrics: ModelMetrics;
  totalPatients: number;
}

const ModelMetricsPanel: React.FC<ModelMetricsPanelProps> = ({ metrics, totalPatients }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-status-normal';
    if (score >= 0.8) return 'text-status-warning';
    return 'text-status-critical';
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.9) return 'bg-status-normal-bg';
    if (score >= 0.8) return 'bg-status-warning-bg';
    return 'bg-status-critical-bg';
  };

  const metricItems = [
    {
      label: 'Accuracy',
      value: metrics.accuracy,
      icon: Target,
      description: 'Overall prediction accuracy'
    },
    {
      label: 'Precision',
      value: metrics.precision,
      icon: TrendingUp,
      description: 'True positive rate'
    },
    {
      label: 'Recall',
      value: metrics.recall,
      icon: Activity,
      description: 'Sensitivity to positive cases'
    },
    {
      label: 'F1-Score',
      value: metrics.f1Score,
      icon: BarChart,
      description: 'Harmonic mean of precision and recall'
    }
  ];

  return (
    <Card className="bg-card border-card-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <BarChart className="w-5 h-5 text-primary" />
          ML Model Performance
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Active Patients: {totalPatients}</span>
          <Badge variant="outline" className="bg-primary-light text-primary">
            Real-time Classification
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {metricItems.map((metric) => {
              const Icon = metric.icon;
              const percentage = Math.round(metric.value * 100);
              
              return (
                <div key={metric.label} className="bg-surface rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">{metric.label}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>
                      {percentage}%
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="mt-2 h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </div>
              );
            })}
          </div>

          {/* ROC AUC Score */}
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-card-foreground">ROC AUC Score</span>
              </div>
              <Badge className={`${getScoreBg(metrics.rocAuc)} ${getScoreColor(metrics.rocAuc)}`}>
                {metrics.rocAuc >= 0.9 ? 'Excellent' : metrics.rocAuc >= 0.8 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(metrics.rocAuc)} mb-2`}>
              {metrics.rocAuc.toFixed(3)}
            </div>
            <Progress value={metrics.rocAuc * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Area under the ROC curve - measures model's discriminative ability
            </p>
          </div>

          {/* Model Status */}
          <div className="flex items-center justify-between p-3 bg-primary-light rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Model Status</span>
            </div>
            <Badge className="bg-status-normal-bg text-status-normal">
              Active & Learning
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelMetricsPanel;