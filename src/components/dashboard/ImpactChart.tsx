import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ImpactChart = () => {
  const data = [
    { name: 'AI Readiness Audit', complexity: 2, impact: 4, id: 1 },
    { name: 'Benchmarking Data PR', complexity: 1, impact: 3.5, id: 2 },
    { name: 'Partner Ecosystem', complexity: 4, impact: 4, id: 3 },
    { name: 'Client Voice Accreditation', complexity: 5, impact: 3.5, id: 4 },
    { name: 'ABM for Whales', complexity: 3, impact: 5, id: 5 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            Impact: {item.impact}/5 · Complexity: {item.complexity}/5
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-4">Impact vs Complexity</h3>
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="complexity" 
              name="Complexity" 
              domain={[0, 6]}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              label={{ 
                value: 'Complexity →', 
                position: 'bottom', 
                offset: 10,
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 }
              }}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="Impact" 
              domain={[0, 6]}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              label={{ 
                value: '↑ Impact', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} fill="hsl(var(--primary))">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                  r={20}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {data.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
              {item.id}
            </span>
            <span className="hidden sm:inline">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactChart;
