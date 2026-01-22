import { TrendingUp, TrendingDown, Zap, Gauge, AlertTriangle } from 'lucide-react';
import { VehicleAnalysis } from '../types/vehicle';

interface DetailedMetricsProps {
  vehicles: VehicleAnalysis[];
}

export default function DetailedMetrics({ vehicles }: DetailedMetricsProps) {
  // 안전등급 분포 먼저 계산
  const 고위험그룹 = vehicles.filter(v => v.안전등급.grade === 'danger').length;
  const 중위험그룹 = vehicles.filter(v => v.안전등급.grade === 'warning').length;
  const 저위험그룹 = vehicles.filter(v => v.안전등급.grade === 'safe').length;
  
  // 평균 연비 관련 통계 (insights에서 계산된 값 사용)
  const 평균연비개선율 = vehicles.reduce((sum, v) => sum + v.연비개선율, 0) / vehicles.length;
  const 평균현재연비 = vehicles.reduce((sum, v) => sum + v.현재연비, 0) / vehicles.length;
  
  // 연비 개선 잠재력 그룹화
  const 고개선그룹 = vehicles.filter(v => v.연비개선율 >= 20).length;
  const 중개선그룹 = vehicles.filter(v => v.연비개선율 >= 10 && v.연비개선율 < 20).length;
  const 저개선그룹 = vehicles.filter(v => v.연비개선율 < 10).length;

  return (
    <div className="space-y-6">
      {/* 위쪽 2개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. 긴급 개선 필요 */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">긴급 개선 필요</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 mb-1">
            {고위험그룹}대
          </p>
          <p className="text-sm text-gray-700">
            전체 {vehicles.length}대 중 {고위험그룹 + 중위험그룹}대 개선 필요
          </p>
          <div className="mt-2 bg-red-100 rounded-full h-2">
            <div 
              className="bg-red-500 rounded-full h-2 transition-all"
              style={{ width: `${((고위험그룹 + 중위험그룹) / vehicles.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 2. 위험도 점수 분포 */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">위험도 점수 분포</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">고위험 (30점+)</span>
              <span className="text-sm font-bold text-red-600">{고위험그룹}대</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">중위험 (10-30점)</span>
              <span className="text-sm font-bold text-yellow-600">{중위험그룹}대</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">저위험 (&lt;10점)</span>
              <span className="text-sm font-bold text-green-600">{저위험그룹}대</span>
            </div>
          </div>
        </div>
      </div>

      {/* 아래쪽 3개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3. 연비 개선 그룹 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">연비 개선 그룹</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">고개선 (20%+)</span>
              <span className="text-sm font-bold text-red-600">{고개선그룹}대</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">중개선 (10-20%)</span>
              <span className="text-sm font-bold text-yellow-600">{중개선그룹}대</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">저개선 (&lt;10%)</span>
              <span className="text-sm font-bold text-green-600">{저개선그룹}대</span>
            </div>
          </div>
        </div>

        {/* 4. 평균 연비 개선율 */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">평균 연비 개선율</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-1">
            {평균연비개선율.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-700">
            개선 시 기대효과
          </p>
          <div className="mt-2 bg-purple-100 rounded-full h-2">
            <div 
              className="bg-purple-500 rounded-full h-2 transition-all"
              style={{ width: `${Math.min(평균연비개선율, 35)}%` }}
            />
          </div>
        </div>

        {/* 5. 평균 현재 연비 */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">평균 현재 연비</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-1">
            {평균현재연비.toFixed(1)}
            <span className="text-lg ml-1">km/L</span>
          </p>
          <p className="text-sm text-gray-700">
            이상적: 6.0 km/L
          </p>
          <div className="mt-2 bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-500 rounded-full h-2 transition-all"
              style={{ width: `${(평균현재연비 / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
