import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const brandData = [
  { axis: 'Credibility', current: 72, peers: 65 },
  { axis: 'Clarity', current: 58, peers: 70 },
  { axis: 'Differentiation', current: 85, peers: 55 },
  { axis: 'Authority', current: 64, peers: 68 },
  { axis: 'Focus', current: 78, peers: 62 },
];

export const BrandRadarChart = () => {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Soft glow effect behind the chart */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={brandData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
            gridType="polygon"
          />
          <PolarAngleAxis 
            dataKey="axis" 
            tick={{ 
              fill: 'hsl(var(--muted-foreground))', 
              fontSize: 11,
              fontWeight: 500
            }}
            tickLine={false}
          />
          
          {/* Peer average - faint outline behind */}
          <Radar
            name="Peers"
            dataKey="peers"
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.3}
            strokeWidth={1}
            fill="hsl(var(--muted))"
            fillOpacity={0.1}
            strokeDasharray="4 4"
          />
          
          {/* Current brand position - prominent with glow */}
          <Radar
            name="Current"
            dataKey="current"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="hsl(var(--primary))"
            fillOpacity={0.15}
            style={{
              filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.4))'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
