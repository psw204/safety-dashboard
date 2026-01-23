import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { VehicleAnalysis } from '../../types/vehicle';
import { useState, useEffect } from 'react';

const COLORS = ['#EF4444', '#F59E0B', '#FBBF24', '#10B981', '#3B82F6', '#8B5CF6'];

export default function BehaviorDistributionChart({ vehicles }: { vehicles: VehicleAnalysis[] }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            isAnimationActive={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${Number(value).toLocaleString()}회`, '발생 횟수']}
            trigger={isMobile ? "click" : undefined}
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
        전체 {total.toLocaleString()}회
      </p>
    </div>
  );
}
