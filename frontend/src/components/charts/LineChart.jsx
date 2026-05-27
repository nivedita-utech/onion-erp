import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const CustomLineChart = ({
  data = [],
  xKey = 'name',
  lines = [],
  height = 300,
  title,
}) => {
  const defaultColors = ['#ee7a0e', '#369367', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="glass-card p-6">
      {title && <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
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
          {lines.map((line, i) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || defaultColors[i % defaultColors.length]}
              strokeWidth={2}
              dot={{ fill: line.color || defaultColors[i % defaultColors.length], r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
