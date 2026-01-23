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
            contentStyle={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '600',
              padding: '16px 20px',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15), 0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.1)',
              color: '#1a1a1a',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              letterSpacing: '-0.02em'
            }}
            wrapperStyle={{ zIndex: 1000 }}
            labelStyle={{ 
              color: '#6b7280', 
              fontWeight: '500',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          />
          <ReferenceLine y={30} stroke="#EF4444" strokeDasharray="3 3" label="위험" />
          <ReferenceLine y={10} stroke="#FBBF24" strokeDasharray="3 3" label="주의" />
          <Bar dataKey="위험도" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
