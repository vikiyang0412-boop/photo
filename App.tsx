
import React, { useState, useCallback } from 'react';
import { Camera, Upload, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { editImage } from './services/geminiService';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import ResultArea from './components/ResultArea';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (base64Image: string) => {
    setOriginalImage(base64Image);
    setEditedImage(null);
    setError(null);
    processImage(base64Image);
  };

  const processImage = async (image: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await editImage(image);
      if (result) {
        setEditedImage(result);
      } else {
        setError("이미지를 생성하지 못했습니다. 다시 시도해 주세요.");
      }
    } catch (err) {
      console.error(err);
      setError("처리 중 오류가 발생했습니다. 얼굴이 잘 보이는 사진을 사용해 주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20">
      <Header />
      
      <main className="w-full max-w-md px-4 mt-6 flex-1 flex flex-col">
        {!originalImage ? (
          <UploadArea onUpload={handleFileUpload} />
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultArea 
              original={originalImage} 
              result={editedImage} 
              isProcessing={isProcessing} 
            />
            
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex gap-3 sticky bottom-4">
              <button 
                onClick={reset}
                className="flex-1 bg-white border border-gray-200 text-gray-800 font-semibold py-4 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                새 사진 찍기
              </button>
              
              {editedImage && (
                <a 
                  href={editedImage} 
                  download="persona_startup_profile.png"
                  className="flex-1 bg-black text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  저장하기
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-8 text-zinc-400 text-xs font-medium flex items-center gap-1">
        Powered by <span className="text-zinc-600 font-bold">Nano Banana</span>
      </footer>
    </div>
  );
};

export default App;
