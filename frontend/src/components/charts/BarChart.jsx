import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const CustomBarChart = ({
  data = [],
  xKey = 'name',
  bars = [],
  height = 300,
  title,
}) => {
  const defaultColors = ['#ee7a0e', '#369367', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="glass-card p-6">
      {title && <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey={xKey} tick={{ fill: '#888', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
          <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#16213e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#e7e7e7',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ color: '#888', fontSize: '12px' }} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color || defaultColors[i % defaultColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
