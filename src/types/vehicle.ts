export interface VehicleData {
  인덱스: number;
  차량번호: string;
  총운행거리: number;
  합계: number;
  과속: number;
  장기과속: number;
  급가속: number;
  급출발: number;
  급감속: number;
  급정지: number;
  급좌회전: number;
  급우회전: number;
  급유턴: number;
  급앞지르기: number;
  급진로변경: number;
}

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

export interface Insights {
  top3: VehicleAnalysis[];
  가장많은행동: [string, number][];
  top5절감: number;
  총절감액: number;
  총CO2: number;
  위험차량수: number;
  주의차량수: number;
  전체차량수: number;
  평균연비개선율: number;
  평균현재연비: number;
}
