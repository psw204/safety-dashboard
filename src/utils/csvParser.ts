import Papa from 'papaparse';
import { VehicleData } from '../types/vehicle';

export function parseCSV(file: File): Promise<VehicleData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const vehicles = results.data.map((row: any) => ({
            인덱스: row['인덱스'] || row['index'],
            차량번호: row['차량번호'],
            총운행거리: row['총운행거리(km)'] || row['총운행거리'],
            합계: row['합계'],
            과속: row['과속'],
            장기과속: row['장기과속'],
            급가속: row['급가속'],
            급출발: row['급출발'],
            급감속: row['급감속'],
            급정지: row['급정지'],
            급좌회전: row['급좌회전'],
            급우회전: row['급우회전'],
            급유턴: row['급유턴'],
            급앞지르기: row['급앞지르기'],
            급진로변경: row['급진로변경'],
          }));
          
          // 유효성 검증
          const isValid = vehicles.every(v => 
            v.차량번호 && 
            typeof v.총운행거리 === 'number' && 
            typeof v.합계 === 'number'
          );
          
          if (!isValid) {
            reject(new Error('CSV 파일 형식이 올바르지 않습니다.'));
          } else {
            resolve(vehicles);
          }
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
