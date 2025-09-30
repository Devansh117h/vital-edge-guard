import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VitalSigns } from '@/types/health';

interface VitalChartProps {
  data: VitalSigns[];
  vitalType: 'heartRate' | 'respirationRate' | 'oxygenSaturation' | 'temperature';
  color: string;
  title: string;
  unit: string;
  normalRange?: [number, number];
}

const VitalChart: React.FC<VitalChartProps> = ({ 
  data, 
  vitalType, 
  color, 
  title, 
  unit, 
  normalRange 
}) => {
  const chartData = data.slice(-20).map((vital, index) => ({
    time: vital.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: Math.round(vital[vitalType] * 10) / 10,
    fullTime: vital.timestamp.toLocaleTimeString()
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-card-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{data.payload.fullTime}</p>
          <p className="text-sm font-semibold" style={{ color }}>
            {data.value} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-card-foreground">{title}</h4>
        <span className="text-xs text-muted-foreground">
          {chartData[chartData.length - 1]?.value} {unit}
        </span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            domain={normalRange ? [normalRange[0] - 10, normalRange[1] + 10] : ['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip content={<CustomTooltip />} />
          {normalRange && (
            <>
              <Line
                y1={normalRange[0]}
                y2={normalRange[0]}
                stroke="hsl(var(--status-normal))"
                strokeDasharray="2 2"
                strokeWidth={1}
              />
              <Line
                y1={normalRange[1]}
                y2={normalRange[1]}
                stroke="hsl(var(--status-normal))"
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            </>
          )}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalChart;