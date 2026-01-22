import * as XLSX from 'xlsx';
import { VehicleData } from '../types/vehicle';

export function parseXLSX(file: File): Promise<VehicleData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 첫 번째 시트를 가져옴
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // 시트 데이터를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: null 
        });
        
        if (jsonData.length < 2) {
          reject(new Error('XLSX 파일에 데이터가 없거나 형식이 올바르지 않습니다.'));
          return;
        }
        
        // 첫 번째 행은 헤더로 사용
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const vehicles: VehicleData[] = rows.map((row) => {
          const vehicle: any = {};
          
          headers.forEach((header, index) => {
            const value = row[index];
            
            // 헤더 이름에 따라 매핑
            if (header?.includes('인덱스') || header?.includes('index')) {
              vehicle.인덱스 = value;
            } else if (header?.includes('차량번호')) {
              vehicle.차량번호 = value;
            } else if (header?.includes('총운행거리')) {
              vehicle.총운행거리 = Number(value) || 0;
            } else if (header?.includes('합계')) {
              vehicle.합계 = Number(value) || 0;
            } else if (header?.includes('과속') && !header?.includes('장기')) {
              vehicle.과속 = Number(value) || 0;
            } else if (header?.includes('장기과속')) {
              vehicle.장기과속 = Number(value) || 0;
            } else if (header?.includes('급가속')) {
              vehicle.급가속 = Number(value) || 0;
            } else if (header?.includes('급출발')) {
              vehicle.급출발 = Number(value) || 0;
            } else if (header?.includes('급감속')) {
              vehicle.급감속 = Number(value) || 0;
            } else if (header?.includes('급정지')) {
              vehicle.급정지 = Number(value) || 0;
            } else if (header?.includes('급좌회전')) {
              vehicle.급좌회전 = Number(value) || 0;
            } else if (header?.includes('급우회전')) {
              vehicle.급우회전 = Number(value) || 0;
            } else if (header?.includes('급유턴')) {
              vehicle.급유턴 = Number(value) || 0;
            } else if (header?.includes('급앞지르기')) {
              vehicle.급앞지르기 = Number(value) || 0;
            } else if (header?.includes('급진로변경')) {
              vehicle.급진로변경 = Number(value) || 0;
            }
          });
          
          return vehicle as VehicleData;
        }).filter(vehicle => vehicle.차량번호); // 차량번호가 있는 데이터만 필터링
        
        // 유효성 검증
        const isValid = vehicles.every(v => 
          v.차량번호 && 
          typeof v.총운행거리 === 'number' && 
          typeof v.합계 === 'number'
        );
        
        if (!isValid || vehicles.length === 0) {
          reject(new Error('XLSX 파일 형식이 올바르지 않습니다.'));
        } else {
          resolve(vehicles);
        }
      } catch (error) {
        reject(new Error('XLSX 파일 처리 중 오류가 발생했습니다.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
