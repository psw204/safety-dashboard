import { TrendingDown, Target, BookOpen, Award } from 'lucide-react';
import { Insights } from '../types/vehicle';

export default function InsightCards({ insights }: { insights: Insights }) {
  const 가장많은행동명 = insights.가장많은행동[0][0];
  const 가장많은행동횟수 = insights.가장많은행동[0][1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {/* 1. 가장 위험한 차량 TOP 3 */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 shadow-lg border border-red-200 flex flex-col justify-center items-center min-h-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-red-600" />
          <h3 className="font-bold text-lg text-gray-800">개선 우선순위 TOP 3</h3>
        </div>
        {insights.top3.map((v, i: number) => (
          <div key={i} className="mb-3 pb-3 border-b border-red-200 last:border-0 text-center">
            <p className="font-semibold text-red-600">
              {i + 1}. {v.차량번호}
            </p>
            <p className="text-sm text-gray-700">
              위험도: {v.위험도점수.toFixed(1)}점/100km
            </p>
            <p className="text-sm font-semibold text-blue-600">
              절감 가능: {v.절감가능금액.toLocaleString()}원/연
            </p>
          </div>
        ))}
      </div>

      {/* 2. 가장 많이 발생한 위험행동 */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 shadow-lg border border-yellow-200 flex flex-col justify-center items-center min-h-[280px]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingDown className="w-6 h-6 text-yellow-600" />
          <h3 className="font-bold text-lg text-gray-800">주요 개선 항목</h3>
        </div>
        <p className="text-3xl font-bold text-yellow-600 mb-2">
          {가장많은행동명}
        </p>
        <p className="text-gray-700 mb-3">
          전체의 <span className="font-bold text-xl">
            {(() => {
              const top3Total = insights.top3.reduce((s, v) => s + v.위험도점수, 0);
              return top3Total > 0 ? ((가장많은행동횟수 / top3Total) * 100).toFixed(0) : '0';
            })()}%
          </span> 차지
        </p>
        <div className="bg-white rounded-lg p-3 mt-3">
          <p className="text-sm text-gray-700">
            💡 부드러운 운전으로<br/>
            <span className="font-bold text-blue-600">
              월 {Math.round(insights.총절감액 / 12 * 0.4).toLocaleString()}원
            </span> 절감 가능
          </p>
        </div>
      </div>

      {/* 3. 즉시 개선 효과 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-200 flex flex-col justify-center items-center min-h-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-lg text-gray-800">상위 5개 차량 개선 시</h3>
        </div>
        <div className="space-y-3 w-full">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-sm text-gray-700">월 절감액</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(insights.top5절감 / 12).toLocaleString()}원
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-sm text-gray-700">연 절감액</p>
            <p className="text-2xl font-bold text-blue-600">
              {insights.top5절감.toLocaleString()}원
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-sm text-gray-700">CO2 감축</p>
            <p className="text-xl font-bold text-green-600">
              {Math.round(insights.top5절감 / 1630 * 2.65).toLocaleString()} kg
            </p>
          </div>
        </div>
      </div>

      {/* 4. 실천 가능한 팁 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-green-200 flex flex-col justify-center items-center min-h-[280px]">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-green-600" />
          <h3 className="font-bold text-lg text-gray-800">운전 습관 개선 팁</h3>
        </div>
        <ul className="space-y-3 text-center">
          <li className="flex items-center justify-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span className="text-sm text-gray-700">
              급가속 대신 <strong>5초에 걸쳐</strong> 천천히 가속
            </span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span className="text-sm text-gray-700">
              신호 예측으로 급정지 줄이기
            </span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span className="text-sm text-gray-700">
              적정 속도 <strong>60-80km/h</strong> 유지
            </span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span className="text-sm text-gray-700">
              엔진 RPM <strong>2000 이하</strong> 유지
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
