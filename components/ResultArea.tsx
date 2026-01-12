
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface ResultAreaProps {
  original: string;
  result: string | null;
  isProcessing: boolean;
}

const ResultArea: React.FC<ResultAreaProps> = ({ original, result, isProcessing }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Result Section */}
      <div className="relative group">
        <div className={`aspect-[4/5] w-full bg-zinc-100 rounded-[2rem] overflow-hidden shadow-2xl relative ${isProcessing ? 'animate-pulse' : ''}`}>
          {isProcessing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-900/10 backdrop-blur-sm">
              <Loader2 className="w-12 h-12 text-zinc-800 animate-spin" />
              <div className="flex flex-col items-center">
                <p className="text-zinc-800 font-bold">인공지능이 변신 중...</p>
                <p className="text-zinc-600 text-xs mt-1">배경과 의상을 스마트하게 변경하고 있습니다.</p>
              </div>
            </div>
          ) : result ? (
            <img 
              src={result} 
              alt="Generated Persona" 
              className="w-full h-full object-cover transition-all duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
               <p className="text-zinc-400 font-medium italic">Generating magic...</p>
            </div>
          )}
          
          {/* Badge */}
          {result && !isProcessing && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-zinc-800">AI TRANSFORMED</span>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Thumbnail */}
      <div className="flex items-center gap-4 px-2">
        <div className="flex-shrink-0">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Original</p>
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md">
            <img src={original} alt="Original" className="w-full h-full object-cover grayscale-[0.5]" />
          </div>
        </div>
        <div className="flex-1">
          <div className="h-[1px] bg-zinc-100 w-full mb-2"></div>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Nano Banana 모델이 얼굴의 고유한 특징을 보존하며 세련된 IT 스타트업 무드로 재창조했습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultArea;
