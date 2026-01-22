import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { VehicleAnalysis } from '../../types/vehicle';

export default function VehicleRiskChart({ vehicles }: { vehicles: VehicleAnalysis[] }) {
  const data = vehicles
    .sort((a, b) => b.위험도점수 - a.위험도점수)
    .slice(0, 10)
    .map(v => ({
      name: v.차량번호.slice(-4), // 뒷 4자리만 표시
      위험도: v.위험도점수,
      color: v.안전등급.color,
    }));

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold mb-4">차량별 위험도 순위 TOP 10</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis label={{ value: '위험도 점수/100km', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value) => [`${Number(value).toFixed(1)}점`, '위험도']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <ReferenceLine y={30} stroke="#EF4444" strokeDasharray="3 3" label="위험" />
          <ReferenceLine y={10} stroke="#FBBF24" strokeDasharray="3 3" label="주의" />
          <Bar dataKey="위험도" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
