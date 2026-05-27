import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#ee7a0e', '#369367', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomPieChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  title,
  innerRadius = 60,
  outerRadius = 100,
}) => {
  return (
    <div className="glass-card p-6">
      {title && <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
