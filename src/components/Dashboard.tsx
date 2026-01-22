import { VehicleAnalysis } from '../types/vehicle';
import KPICards from './KPICards';
import VehicleRiskChart from './charts/VehicleRiskChart';
import BehaviorDistributionChart from './charts/BehaviorDistributionChart';
import EnhancedCharts from './charts/EnhancedCharts';
import InsightCards from './InsightCards';
import DetailedMetrics from './DetailedMetrics';
import VehicleTable from './VehicleTable';
import { generateInsights } from '../utils/calculations';
import tangelJunior from '../assets/images/탠젤주니어.png';

interface DashboardProps {
  vehicles: VehicleAnalysis[];
}

export default function Dashboard({ vehicles }: DashboardProps) {
  const insights = generateInsights(vehicles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-4 md:py-8 px-4 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* 헤더 */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
            <img src={tangelJunior} alt="탠젤주니어" className="h-16 md:h-20 w-auto object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            안전운전 리포트 대시보드
          </h1>
          <p className="text-gray-600 text-sm md:text-lg px-4">
            11대 위험운전행동 분석 및 유류비 절감 리포트
          </p>
        </div>

        {/* KPI 카드 */}
        <KPICards vehicles={vehicles} insights={insights} />

        {/* 상세 메트릭스 */}
        <DetailedMetrics vehicles={vehicles} />

        {/* 기존 차트 섹션 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <VehicleRiskChart vehicles={vehicles} />
          <BehaviorDistributionChart vehicles={vehicles} />
        </div>

        {/* 향상된 차트 섹션 */}
        <EnhancedCharts vehicles={vehicles} />

        {/* 인사이트 카드 */}
        <InsightCards insights={insights} />

        {/* 상세 테이블 */}
        <VehicleTable vehicles={vehicles} />

        {/* 통계 추정치 안내 */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            ℹ️ 본 수치는 DTG 데이터 기반 통계 추정치입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
