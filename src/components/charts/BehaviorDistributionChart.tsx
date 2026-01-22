import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { VehicleAnalysis } from '../../types/vehicle';

const COLORS = ['#EF4444', '#F59E0B', '#FBBF24', '#10B981', '#3B82F6', '#8B5CF6'];

export default function BehaviorDistributionChart({ vehicles }: { vehicles: VehicleAnalysis[] }) {
  const behaviors = {
    급가속: vehicles.reduce((sum, v) => sum + v.급가속, 0),
    급감속: vehicles.reduce((sum, v) => sum + v.급감속, 0),
    급정지: vehicles.reduce((sum, v) => sum + v.급정지, 0),
    과속: vehicles.reduce((sum, v) => sum + v.과속, 0),
    급출발: vehicles.reduce((sum, v) => sum + v.급출발, 0),
    기타: vehicles.reduce((sum, v) => 
      sum + v.급좌회전 + v.급우회전 + v.급유턴 + v.급앞지르기 + v.급진로변경, 0
    ),
  };

  const data = Object.entries(behaviors)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold mb-4">위험운전 유형별 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}회`, '발생 횟수']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
        전체 {total.toLocaleString()}회
      </p>
    </div>
  );
}
