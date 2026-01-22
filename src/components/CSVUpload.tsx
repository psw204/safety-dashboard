import { useCallback, useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { VehicleData } from '../types/vehicle';

interface CSVUploadProps {
  onDataLoaded: (data: VehicleData[]) => void;
}

export default function CSVUpload({ onDataLoaded }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('CSV 파일만 업로드 가능합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await parseCSV(file);
      onDataLoaded(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-12 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-4 border-blue-500 border-t-transparent" />
          ) : success ? (
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600" />
          ) : error ? (
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600" />
          ) : (
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-500" />
          )}
          
          <div className="px-4">
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              {isLoading ? '파일 처리 중...' : 
               success ? 'CSV 파일 업로드 완료!' :
               'CSV 파일을 드래그하거나 클릭하여 선택하세요'}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
              차량별 11대 위험운전행동 데이터
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
