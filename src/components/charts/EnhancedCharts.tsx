import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { VehicleAnalysis } from '../../types/vehicle';
import { useState, useEffect } from 'react';

interface EnhancedChartsProps {
  vehicles: VehicleAnalysis[];
}

export default function EnhancedCharts({ vehicles }: EnhancedChartsProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 연비 개선율 분포 데이터
  const 연비개선데이터 = vehicles
    .map(v => ({
      차량번호: v.차량번호.slice(-4), // 뒷 4자리만 표시
      연비개선율: v.연비개선율,
      현재연비: v.현재연비,
      위험도점수: v.위험도점수
    }))
    .sort((a, b) => b.연비개선율 - a.연비개선율)
    .slice(0, 10); // 상위 10개

  // 위험도 점수 vs 연비 개선율 상관관계 데이터
  const 상관관계데이터 = vehicles.map(v => ({
    위험도점수: v.위험도점수,
    연비개선율: v.연비개선율,
    차량번호: v.차량번호.slice(-4)
  }));

  // 연비 개선 그룹 파이차트 데이터
  const 연비그룹데이터 = [
    { 
      name: '고개선 20%+', 
      value: vehicles.filter(v => v.연비개선율 >= 20).length,
      color: '#EF4444'
    },
    { 
      name: '중개선 10-20%', 
      value: vehicles.filter(v => v.연비개선율 >= 10 && v.연비개선율 < 20).length,
      color: '#FBBF24'
    },
    { 
      name: '저개선 <10%', 
      value: vehicles.filter(v => v.연비개선율 < 10).length,
      color: '#10B981'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. 연비 개선율 TOP 10 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 연비 개선율 TOP 10</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={연비개선데이터}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="차량번호" 
              tick={{ fontSize: 12, dy: 20 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [
                `${value}%`, 
                name === '연비개선율' ? '연비 개선율' : name
              ]}
              labelFormatter={(label) => `차량: ${label}`}
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
            <Bar 
              dataKey="연비개선율" 
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. 위험도 vs 연비 개선율 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 위험도 vs 연비 개선율</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={상관관계데이터.slice(0, 15)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="차량번호" 
              tick={{ fontSize: 12, dy: 20 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [
                name === '위험도점수' ? `${value}점` : `${value}%`,
                name === '위험도점수' ? '위험도 점수' : '연비 개선율'
              ]}
              labelFormatter={(label) => `차량: ${label}`}
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
              letterSpacing: '0.05em',
              marginBottom: '4px'
            }}
            />
            <Bar dataKey="위험도점수" fill="#EF4444" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="연비개선율" fill="#10B981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. 연비 개선 그룹 분포 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🚗 연비 개선 그룹 분포</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={연비그룹데이터}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={({ name }) => name === '저개선 <10%' ? '저개선' : name === '중개선 10-20%' ? '중개선' : '고개선'}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={false}
            >
              {연비그룹데이터.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
            formatter={(value) => [`${value}대`, '차량 수']} 
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
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4">
          {연비그룹데이터.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">
                {item.name}: {((item.value / vehicles.length) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 연비 현황 통계 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⛽ 연비 현황 통계</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {(vehicles.reduce((sum, v) => sum + v.현재연비, 0) / vehicles.length).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">평균 현재 연비 (km/L)</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              6.0
            </p>
            <p className="text-sm text-gray-600">이상적 연비 (km/L)</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {(vehicles.reduce((sum, v) => sum + v.연비개선율, 0) / vehicles.length).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">평균 개선율</p>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">
              {vehicles.filter(v => v.연비개선율 >= 20).length}대
            </p>
            <p className="text-sm text-gray-600">고개선 대상</p>
          </div>
        </div>
      </div>
    </div>
  );
}
