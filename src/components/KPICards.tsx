import { Leaf, TrendingUp } from 'lucide-react';
import { VehicleAnalysis, Insights } from '../types/vehicle';
import { useEffect, useState } from 'react';

interface KPICardsProps {
  vehicles: VehicleAnalysis[];
  insights: Insights;
}

export default function KPICards({ vehicles, insights }: KPICardsProps) {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  
  // 숫자 카운트업 애니메이션
  useEffect(() => {
    const target = insights.총절감액;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedTotal(target);
        clearInterval(timer);
      } else {
        setAnimatedTotal(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [insights.총절감액]);

  // 전체 평균 등급 계산 (calculations.ts 기준 적용)
  const 평균위험도점수 = vehicles.reduce((sum, v) => sum + v.위험도점수, 0) / vehicles.length;
  const 종합등급 = 평균위험도점수 >= 30 ? 
    { emoji: '🔴', label: '위험', color: 'bg-red-500', grade: 'danger' } :
    평균위험도점수 >= 10 ?
    { emoji: '🟡', label: '주의', color: 'bg-yellow-500', grade: 'warning' } :
    { emoji: '🟢', label: '양호', color: 'bg-green-500', grade: 'safe' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. 총 절감 가능 유류비 - 가장 크게 강조 */}
      <div className="md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-transform">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💰</span>
          <h3 className="text-xl font-semibold">총 절감 가능 유류비</h3>
        </div>
        <p className="text-5xl font-bold mb-2">
          {animatedTotal.toLocaleString()}
          <span className="text-2xl ml-2">원</span>
        </p>
        <p className="text-blue-100 text-lg">연간 기준</p>
        <p className="text-blue-100 text-sm mt-2">
          월 평균 {Math.round(insights.총절감액 / 12).toLocaleString()}원
        </p>
      </div>

      {/* 2. 종합 안전등급 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">종합 안전등급</h3>
        </div>
        <div className="text-center">
          <p className="text-6xl mb-2">{종합등급.emoji}</p>
          <p className={`text-2xl font-bold ${
            종합등급.grade === 'danger' ? 'text-red-600' :
            종합등급.grade === 'warning' ? 'text-yellow-600' :
            'text-green-600'
          }`}>{종합등급.label}</p>
          <p className="text-sm text-gray-700 mt-2">
            평균 {평균위험도점수.toFixed(1)}점/100km
          </p>
        </div>
      </div>

      {/* 3. CO2 감축량 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-200 flex flex-col justify-center items-center">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">CO2 감축량</h3>
        </div>
        <p className="text-3xl font-bold text-green-600 mb-2 text-center">
          {vehicles.reduce((sum, v) => sum + v.CO2절감량, 0).toLocaleString()}
          <span className="text-lg ml-1">kg</span>
        </p>
        <p className="text-xs text-gray-600 text-center">연간 감축 효과</p>
        <div className="mt-2 text-sm text-green-700 text-center">
          <span className="font-bold">🌲 소나무 {vehicles.reduce((sum, v) => sum + v.나무그루수, 0).toLocaleString()}그루 심재 효과</span>
        </div>
      </div>
    </div>
  );
}
