import { useState } from 'react';
import { VehicleAnalysis } from '../types/vehicle';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

export default function VehicleTable({ vehicles }: { vehicles: VehicleAnalysis[] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'위험도점수' | '절감가능금액'>('위험도점수');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = vehicles.filter(v => 
    v.차량번호.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    return (a[sortBy] - b[sortBy]) * multiplier;
  });

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">차량별 상세 데이터</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="차량번호 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">순위</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">차량번호</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">총운행거리</th>
              <th 
                className="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('위험도점수')}
              >
                <div className="flex items-center justify-end gap-1">
                  위험도
                  {sortBy === '위험도점수' && (
                    sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">안전등급</th>
              <th 
                className="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('절감가능금액')}
              >
                <div className="flex items-center justify-end gap-1">
                  절감 가능액
                  {sortBy === '절감가능금액' && (
                    sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">주요 개선 항목</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.map((vehicle, index) => {
              // 가중치를 반영한 주요 개선 항목 계산
              const 위험행동가중치 = {
                급가속: 1.5, 급출발: 1.3, 급감속: 1.0, 급정지: 1.2,
                과속: 1.4, 장기과속: 2.0, 급좌회전: 0.7, 급우회전: 0.7,
                급유턴: 0.8, 급앞지르기: 0.9, 급진로변경: 0.8,
              };
              
              const 위험행동들 = [
                { name: '급가속', value: vehicle.급가속 * 위험행동가중치.급가속, originalValue: vehicle.급가속 },
                { name: '급출발', value: vehicle.급출발 * 위험행동가중치.급출발, originalValue: vehicle.급출발 },
                { name: '급감속', value: vehicle.급감속 * 위험행동가중치.급감속, originalValue: vehicle.급감속 },
                { name: '급정지', value: vehicle.급정지 * 위험행동가중치.급정지, originalValue: vehicle.급정지 },
                { name: '과속', value: vehicle.과속 * 위험행동가중치.과속, originalValue: vehicle.과속 },
                { name: '장기과속', value: vehicle.장기과속 * 위험행동가중치.장기과속, originalValue: vehicle.장기과속 },
                { name: '급좌회전', value: vehicle.급좌회전 * 위험행동가중치.급좌회전, originalValue: vehicle.급좌회전 },
                { name: '급우회전', value: vehicle.급우회전 * 위험행동가중치.급우회전, originalValue: vehicle.급우회전 },
                { name: '급유턴', value: vehicle.급유턴 * 위험행동가중치.급유턴, originalValue: vehicle.급유턴 },
                { name: '급앞지르기', value: vehicle.급앞지르기 * 위험행동가중치.급앞지르기, originalValue: vehicle.급앞지르기 },
                { name: '급진로변경', value: vehicle.급진로변경 * 위험행동가중치.급진로변경, originalValue: vehicle.급진로변경 },
              ];
              
              const 주요개선 = 위험행동들
                .filter(item => item.value > 0)
                .sort((a, b) => b.value - a.value)[0] || { name: '없음', originalValue: 0 };

              return (
                <tr key={vehicle.인덱스} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{vehicle.차량번호}</td>
                  <td className="px-4 py-3 text-sm text-right">{vehicle.총운행거리.toLocaleString()} km</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{vehicle.위험도점수.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl">{vehicle.안전등급.emoji}</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold text-white`}
                        style={{ backgroundColor: vehicle.안전등급.color }}
                      >
                        {vehicle.안전등급.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                    {vehicle.절감가능금액.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      {주요개선.name} ({주요개선.originalValue.toFixed(1)}회)
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">
          총 {sorted.length}대 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sorted.length)}대 표시
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
