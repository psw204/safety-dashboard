import { VehicleData } from '../types/vehicle';

/**
 * 유류비 절감액 계산 (통계 기반 추정)
 * 
 * 📚 연구 근거:
 * 1. 한국교통안전공단 실도로 실험 (2013)
 *    - 급가속 운전 vs 경제운전: 연비 30% 차이
 * 
 * 2. 미국 ORNL (Oak Ridge National Laboratory, 2017)
 *    - 급가속/급감속: 시내 10-40%, 고속 15-30% 연비 악화
 * 
 * 3. 국민대학교 차량제어실험실 (2009)
 *    - 에코드라이빙 vs 일반운전: 16.8% 연비 향상
 * 
 * 4. 국제 에코드라이빙 연구 (PMC Journal, 2023)
 *    - 에코드라이빙으로 4-25% 연비 개선 가능
 * 
 * ⚠️ 주의사항:
 * - 본 계산은 위험운전 행동 횟수를 기반으로 한 통계적 추정치입니다
 * - 실제 연비는 차종, 적재량, 도로 조건, 기상 조건 등에 영향을 받습니다
 * - 개인차가 있을 수 있으므로 참고용으로만 활용하시기 바랍니다
 */

// 기본 상수 (2026년 1월 기준)
const 기본연비 = 6;  // km/L (중대형 화물차 이상적 경제운전 시)
const 경유가격 = 1600;  // 원/L
const CO2배출계수 = 2.65;  // kg CO2/L (경유)
const 나무CO2흡수량 = 6.6;  // kg/년 (소나무)

// 위험행동별 가중치 (연비 영향도 기반)
const 위험행동가중치 = {
  급가속: 1.5,      // 연비에 가장 큰 영향
  급출발: 1.3,
  급감속: 1.0,
  급정지: 1.2,
  과속: 1.4,        // 연비 직접 영향
  장기과속: 2.0,    // 최대 영향
  급좌회전: 0.7,
  급우회전: 0.7,
  급유턴: 0.8,
  급앞지르기: 0.9,
  급진로변경: 0.8,
} as const;

export interface SafetyGrade {
  grade: 'danger' | 'warning' | 'safe';
  label: string;
  emoji: string;
  color: string;
  message: string;
}

export interface VehicleAnalysis extends VehicleData {
  안전등급: SafetyGrade;
  절감가능금액: number;
  CO2절감량: number;
  위험도점수: number;
  나무그루수: number;
  연비개선율: number;
  현재연비: number;
}

/**
 * 위험도 점수 계산 (가중치 반영)
 */
function calculateWeightedRiskScore(vehicle: VehicleData): number {
  if (vehicle.총운행거리 < 1) return 0;
  
  // CSV 데이터는 이미 100km당 발생 횟수이므로, 가중치만 적용
  const 위험행동점수 = 
    vehicle.급가속 * 위험행동가중치.급가속 +
    vehicle.급출발 * 위험행동가중치.급출발 +
    vehicle.급감속 * 위험행동가중치.급감속 +
    vehicle.급정지 * 위험행동가중치.급정지 +
    vehicle.과속 * 위험행동가중치.과속 +
    vehicle.장기과속 * 위험행동가중치.장기과속 +
    vehicle.급좌회전 * 위험행동가중치.급좌회전 +
    vehicle.급우회전 * 위험행동가중치.급우회전 +
    vehicle.급유턴 * 위험행동가중치.급유턴 +
    vehicle.급앞지르기 * 위험행동가중치.급앞지르기 +
    vehicle.급진로변경 * 위험행동가중치.급진로변경;
  
  // 이미 100km당 데이터이므로 그대로 반환
  return 위험행동점수;
}

/**
 * 안전등급 계산
 * - 빨강(위험): 30점/100km 이상
 * - 노랑(주의): 10-30점/100km
 * - 초록(양호): 10점/100km 미만
 */
export function calculateSafetyGrade(vehicle: VehicleData): SafetyGrade {
  const km당위험도점수 = calculateWeightedRiskScore(vehicle);
  
  if (km당위험도점수 >= 30) {
    return {
      grade: 'danger',
      label: '위험',
      emoji: '🔴',
      color: '#EF4444',
      message: '즉시 개선 필요',
    };
  } else if (km당위험도점수 >= 10) {
    return {
      grade: 'warning',
      label: '주의',
      emoji: '🟡',
      color: '#FBBF24',
      message: '개선 권장',
    };
  } else {
    return {
      grade: 'safe',
      label: '양호',
      emoji: '🟢',
      color: '#10B981',
      message: '안전 운전 중',
    };
  }
}

/**
 * 유류비 절감액 계산 (비선형 모델)
 */
export function calculateFuelSavings(vehicle: VehicleData): {
  절감액: number;
  연비개선율: number;
  현재연비: number;
} {
  // 엣지 케이스 처리
  if (vehicle.총운행거리 < 1) {
    return {
      절감액: 0,
      연비개선율: 0,
      현재연비: 기본연비,
    };
  }
  
  // 1단계: 위험행동 점수 (CSV 데이터는 이미 100km당 발생 횟수)
  const 위험행동점수 = 
    vehicle.급가속 * 위험행동가중치.급가속 +
    vehicle.급출발 * 위험행동가중치.급출발 +
    vehicle.급감속 * 위험행동가중치.급감속 +
    vehicle.급정지 * 위험행동가중치.급정지 +
    vehicle.과속 * 위험행동가중치.과속 +
    vehicle.장기과속 * 위험행동가중치.장기과속 +
    vehicle.급좌회전 * 위험행동가중치.급좌회전 +
    vehicle.급우회전 * 위험행동가중치.급우회전 +
    vehicle.급유턴 * 위험행동가중치.급유턴 +
    vehicle.급앞지르기 * 위험행동가중치.급앞지르기 +
    vehicle.급진로변경 * 위험행동가중치.급진로변경;
  
  // 2단계: 위험도 계산 (비선형 적용) - 이미 100km당 데이터이므로 그대로 사용
  const 정규화위험도 = Math.min(위험행동점수 / 50, 1.0);
  const 비선형위험도 = Math.pow(정규화위험도, 1.3);
  
  // 4단계: 연비 악화율
  const 최대악화율 = 0.35;
  const 연비악화율 = 최대악화율 * 비선형위험도;
  
  // 5단계: 연비 계산
  const 이상적연비 = 기본연비;
  const 현재연비 = 이상적연비 * (1 - 연비악화율);
  
  // 6단계: 절감 가능 금액
  const 현재연료소비 = vehicle.총운행거리 / 현재연비;
  const 개선후연료소비 = vehicle.총운행거리 / 이상적연비;
  const 절감가능연료 = 현재연료소비 - 개선후연료소비;
  
  // 7단계: 연비 개선율
  const 연비개선율 = ((이상적연비 - 현재연비) / 현재연비) * 100;
  
  return {
    절감액: Math.round(절감가능연료 * 경유가격),
    연비개선율: Math.round(연비개선율 * 10) / 10,
    현재연비: Math.round(현재연비 * 10) / 10,
  };
}

/**
 * CO2 절감량 계산
 */
export function calculateCO2Reduction(절감가능금액: number): {
  CO2: number;
  나무그루수: number;
} {
  const 절감연료량 = 절감가능금액 / 경유가격;
  const CO2절감량 = 절감연료량 * CO2배출계수;
  const 나무그루수 = Math.floor(CO2절감량 / 나무CO2흡수량);
  
  return {
    CO2: Math.round(CO2절감량),
    나무그루수,
  };
}

/**
 * 위험도 점수 계산
 */
export function calculateRiskScore(vehicle: VehicleData): number {
  const km당위험도점수 = calculateWeightedRiskScore(vehicle);
  return Math.round(km당위험도점수);
}

/**
 * 전체 차량 분석
 */
export function analyzeVehicles(vehicles: VehicleData[]): VehicleAnalysis[] {
  return vehicles.map((vehicle) => {
    const 안전등급 = calculateSafetyGrade(vehicle);
    const { 절감액, 연비개선율, 현재연비 } = calculateFuelSavings(vehicle);
    const { CO2, 나무그루수 } = calculateCO2Reduction(절감액);
    const 위험도점수 = calculateRiskScore(vehicle);
    
    return {
      ...vehicle,
      안전등급,
      절감가능금액: 절감액,
      연비개선율,
      현재연비,
      CO2절감량: CO2,
      나무그루수,
      위험도점수,
    };
  });
}

/**
 * 인사이트 생성
 */
export function generateInsights(vehicles: VehicleAnalysis[]) {
  if (vehicles.length === 0) {
    return {
      top3: [],
      가장많은행동: [],
      top5절감: 0,
      총절감액: 0,
      총CO2: 0,
      위험차량수: 0,
      주의차량수: 0,
      전체차량수: 0,
      평균연비개선율: 0,
      평균현재연비: 기본연비,
    };
  }
  
  const top3 = [...vehicles]
    .sort((a, b) => b.위험도점수 - a.위험도점수)
    .slice(0, 3);
  
  const 위험행동합계 = {
    급가속: vehicles.reduce((sum, v) => sum + v.급가속, 0),
    급감속: vehicles.reduce((sum, v) => sum + v.급감속, 0),
    과속: vehicles.reduce((sum, v) => sum + v.과속, 0),
    급정지: vehicles.reduce((sum, v) => sum + v.급정지, 0),
    급출발: vehicles.reduce((sum, v) => sum + v.급출발, 0),
    장기과속: vehicles.reduce((sum, v) => sum + v.장기과속, 0),
  };
  
  const 가장많은행동 = Object.entries(위험행동합계)
    .sort(([, a], [, b]) => b - a);
  
  const top5절감 = [...vehicles]
    .sort((a, b) => b.절감가능금액 - a.절감가능금액)
    .slice(0, Math.min(5, vehicles.length))
    .reduce((sum, v) => sum + v.절감가능금액, 0);
  
  const 총절감액 = vehicles.reduce((sum, v) => sum + v.절감가능금액, 0);
  const 총CO2 = vehicles.reduce((sum, v) => sum + v.CO2절감량, 0);
  const 위험차량수 = vehicles.filter(v => v.안전등급.grade === 'danger').length;
  const 주의차량수 = vehicles.filter(v => v.안전등급.grade === 'warning').length;
  const 평균연비개선율 = vehicles.reduce((sum, v) => sum + v.연비개선율, 0) / vehicles.length;
  const 평균현재연비 = vehicles.reduce((sum, v) => sum + v.현재연비, 0) / vehicles.length;
  
  return {
    top3,
    가장많은행동,
    top5절감,
    총절감액,
    총CO2,
    위험차량수,
    주의차량수,
    전체차량수: vehicles.length,
    평균연비개선율: Math.round(평균연비개선율 * 10) / 10,
    평균현재연비: Math.round(평균현재연비 * 10) / 10,
  };
}

/**
 * 개별 차량 상세 분석
 */
export function getVehicleDetail(vehicle: VehicleAnalysis) {
  const 위험행동들 = [
    { 이름: '급가속', 횟수: vehicle.급가속, 가중치: 위험행동가중치.급가속 },
    { 이름: '급출발', 횟수: vehicle.급출발, 가중치: 위험행동가중치.급출발 },
    { 이름: '급감속', 횟수: vehicle.급감속, 가중치: 위험행동가중치.급감속 },
    { 이름: '급정지', 횟수: vehicle.급정지, 가중치: 위험행동가중치.급정지 },
    { 이름: '과속', 횟수: vehicle.과속, 가중치: 위험행동가중치.과속 },
    { 이름: '장기과속', 횟수: vehicle.장기과속, 가중치: 위험행동가중치.장기과속 },
    { 이름: '급좌회전', 횟수: vehicle.급좌회전, 가중치: 위험행동가중치.급좌회전 },
    { 이름: '급우회전', 횟수: vehicle.급우회전, 가중치: 위험행동가중치.급우회전 },
    { 이름: '급유턴', 횟수: vehicle.급유턴, 가중치: 위험행동가중치.급유턴 },
    { 이름: '급앞지르기', 횟수: vehicle.급앞지르기, 가중치: 위험행동가중치.급앞지르기 },
    { 이름: '급진로변경', 횟수: vehicle.급진로변경, 가중치: 위험행동가중치.급진로변경 },
  ];
  
  const top3위험행동 = 위험행동들
    .filter(행동 => 행동.횟수 > 0)
    .sort((a, b) => (b.횟수 * b.가중치) - (a.횟수 * a.가중치))
    .slice(0, 3);
  
  return {
    차량번호: vehicle.차량번호,
    안전등급: vehicle.안전등급,
    위험도점수: vehicle.위험도점수,
    절감가능금액: vehicle.절감가능금액,
    연비개선율: vehicle.연비개선율,
    현재연비: vehicle.현재연비,
    이상적연비: 기본연비,
    CO2절감량: vehicle.CO2절감량,
    나무그루수: vehicle.나무그루수,
    총운행거리: vehicle.총운행거리,
    top3위험행동,
  };
}
