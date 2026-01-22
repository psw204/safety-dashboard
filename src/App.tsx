import { useState } from 'react';
import CSVUpload from './components/CSVUpload';
import Dashboard from './components/Dashboard';
import { VehicleData } from './types/vehicle';
import { analyzeVehicles } from './utils/calculations';
import { parseCSV } from './utils/csvParser';
import sampleDataCSV from './data/sampleData.csv?raw';
import { Upload, Sparkles } from 'lucide-react';
import logo from './assets/images/symbol.jpg';
import signature from './assets/images/signature.png';
import tangel from './assets/images/탠젤.png';

function App() {
  const [vehicles, setVehicles] = useState<VehicleData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoaded = (data: VehicleData[]) => {
    setVehicles(data);
  };

  const loadSampleData = async () => {
    setIsLoading(true);
    try {
      // CSV 파일을 File 객체로 변환
      const blob = new Blob([sampleDataCSV], { type: 'text/csv;charset=utf-8;' });
      const file = new File([blob], 'sampleData.csv', { type: 'text/csv' });
      
      // CSV 파서로 데이터 변환
      const data = await parseCSV(file);
      setVehicles(data);
    } catch (error) {
      console.error('샘플 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setVehicles(null);
  };

  if (vehicles) {
    const analyzed = analyzeVehicles(vehicles);
    return (
      <div>
        {/* 상단 헤더 */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="TS" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-blue-500">안전운전 리포트</h1>
              <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {vehicles.length}대 분석 중
              </span>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              새 파일 업로드
            </button>
          </div>
        </div>

        <Dashboard vehicles={analyzed} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-fadeIn">
        {/* 랜딩 페이지 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src={signature} alt="TS 한국교통안전공단" className="h-32 w-auto" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            안전운전 리포트 대시보드
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            CSV 파일을 업로드하면 11대 위험운전행동을 분석하고<br/>
            유류비 절감액과 CO2 감축 효과를 자동으로 계산합니다
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-2xl">🟢</span>
              <span className="font-medium">양호</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-600">
              <span className="text-2xl">🟡</span>
              <span className="font-medium">주의</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-2xl">🔴</span>
              <span className="font-medium">위험</span>
            </div>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={loadSampleData}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>로딩 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>샘플 데이터로 체험하기</span>
              </>
            )}
          </button>
        </div>

        {/* CSV 업로드 */}
        <CSVUpload onDataLoaded={handleDataLoaded} />

        {/* 안내 사항 */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-3 text-gray-800">📋 CSV 파일 형식</h3>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <div className="text-gray-700">
              인덱스,차량번호,총운행거리(km),합계,과속,장기과속,급가속,급출발,급감속,급정지,급좌회전,급우회전,급유턴,급앞지르기,급진로변경
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>✓ 위 형식의 CSV 파일을 준비해주세요</li>
            <li>✓ 한글 컬럼명이 정확해야 합니다</li>
            <li>✓ 데이터는 100km당 발생 횟수로 입력</li>
          </ul>
        </div>

        {/* 이용 안내 */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 text-gray-800">💡 이용 안내</h3>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">서비스 소개</h4>
                  <p className="text-sm text-gray-700">
                    DTG 데이터를 기반으로 위험운전 행동을 분석하고<br/>
                    유류비 절감 가능성을 통계적으로 추정합니다.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">계산 기준</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 기본 연비: 6km/L (중대형 화물차)</li>
                    <li>• 경유 가격: 1,600원/L (2026년 1월)</li>
                    <li>• 연구 근거: ORNL(2017), 교통안전공단(2013)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">주의사항</h4>
                  <p className="text-sm text-gray-700">
                    본 수치는 통계 추정치이므로 실제와 차이가 있을 수 있습니다.<br/>
                    차종, 적재량, 도로 조건 등에 따라 결과가 달라질 수 있으니<br/>
                    참고용으로만 활용하시기 바랍니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end pr-16">
                <img src={tangel} alt="탠젤" className="w-64 h-64 object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* 법적 고지 */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600">
            ※ 본 서비스는 공식 교통안전공단 서비스가 아닙니다.<br/>
            연구 기반 통계 추정치이며, 참고용으로 활용하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
