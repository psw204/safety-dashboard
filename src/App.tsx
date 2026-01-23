import { useState } from 'react';
import FileUpload from './components/CSVUpload';
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
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <img src={logo} alt="TS" className="h-6 sm:h-8 w-auto" />
                <h1 className="text-lg sm:text-2xl font-bold text-blue-500 truncate">안전운전 리포트</h1>
                <span className="text-xs sm:text-sm bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                  {vehicles.length}대 분석 중
                </span>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                CSV/XLSX 파일 업로드
              </button>
            </div>
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
        <div className="text-center mb-6 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <img src={signature} alt="TS 한국교통안전공단" className="h-20 md:h-32 w-auto" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            안전운전 리포트 대시보드
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4 whitespace-normal">
            CSV 또는 XLSX 파일을 업로드하면 11대 위험운전행동을 분석하고<br className="hidden sm:block"/>
            {" "}유류비 절감액과 CO2 감축 효과를 자동으로 계산합니다
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-4 pt-4 flex-wrap">
            <div className="flex items-center gap-1 md:gap-2 text-green-600">
              <span className="text-lg md:text-2xl">🟢</span>
              <span className="text-sm md:font-medium">양호</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-yellow-600">
              <span className="text-lg md:text-2xl">🟡</span>
              <span className="text-sm md:font-medium">주의</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-red-600">
              <span className="text-lg md:text-2xl">🔴</span>
              <span className="text-sm md:font-medium">위험</span>
            </div>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
          <button
            onClick={loadSampleData}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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

        {/* 파일 업로드 */}
        <FileUpload onDataLoaded={handleDataLoaded} />

        {/* 파일 형식 안내 */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg mx-4 sm:mx-0">
          <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800">📋 파일 형식</h3>
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm overflow-x-auto">
            <div className="text-gray-700 break-all">
              인덱스,차량번호,총운행거리(km),합계,과속,장기과속,급가속,급출발,급감속,급정지,급좌회전,급우회전,급유턴,급앞지르기,급진로변경
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-xs md:text-sm text-gray-700">
            <li>✓ CSV 또는 XLSX 파일을 지원합니다</li>
            <li>✓ 한글 컬럼명이 정확해야 합니다</li>
            <li>✓ 데이터는 100km당 발생 횟수로 입력</li>
          </ul>
        </div>

        {/* 이용 안내 */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg mx-4 sm:mx-0">
          <h3 className="font-bold text-base md:text-lg mb-4 text-gray-800">💡 이용 안내</h3>
          
          <div className="bg-blue-50 rounded-lg p-3 md:p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">서비스 소개</h4>
                  <p className="text-xs md:text-sm text-gray-700">
                    DTG 데이터를 기반으로 위험운전 행동을 분석하고<br className="hidden sm:block"/>
                    {" "}유류비 절감 가능성을 통계적으로 추정합니다.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">계산 기준</h4>
                  <ul className="text-xs md:text-sm text-gray-700 space-y-1">
                    <li>• 기본 연비: 6km/L (중대형 화물차)</li>
                    <li>• 경유 가격: 1,600원/L (2026년 1월)</li>
                    <li>• 연구 근거: ORNL(2017), 교통안전공단(2013)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">주의사항</h4>
                  <p className="text-xs md:text-sm text-gray-700">
                    본 수치는 통계 추정치이므로 실제와 차이가 있을 수 있습니다.<br className="hidden sm:block"/>
                    {" "}차종, 적재량, 도로 조건 등에 따라 결과가 달라질 수 있으니<br className="hidden sm:block"/>
                    {" "}참고용으로만 활용하시기 바랍니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end pr-0 sm:pr-16">
                <img src={tangel} alt="탠젤" className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain" />
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
