
import React, { useState, useCallback, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Download, RefreshCcw, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/Button';
import { transformToProfessionalPortrait } from './services/geminiService';
import { GenerationState, ProfessionalStyle } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    originalImage: null,
    generatedImage: null,
    error: null,
  });
  const [selectedStyle, setSelectedStyle] = useState<ProfessionalStyle>(ProfessionalStyle.BUSINESS_FORMAL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          originalImage: reader.result as string,
          generatedImage: null,
          error: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransform = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const result = await transformToProfessionalPortrait(state.originalImage, selectedStyle);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedImage: result,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: "이미지 변환 중 오류가 발생했습니다. 다시 시도해주세요.",
      }));
    }
  };

  const handleDownload = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = `professional-portrait-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setState({
      isGenerating: false,
      originalImage: null,
      generatedImage: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      {/* Header Section */}
      <header className="max-w-4xl w-full text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center justify-center p-2 mb-4 bg-indigo-100 rounded-2xl text-indigo-600">
          <Sparkles className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm uppercase tracking-wider">AI Portrait Studio</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          당신의 사진을 <span className="text-indigo-600">이력서용</span> 프로필로
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          일상적인 사진도 단 몇 초 만에 사진관에서 촬영한 것 같은 고품질 비즈니스 프로필 사진으로 변환해 드립니다.
        </p>
      </header>

      <main className="max-w-5xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls & Options (Left/Top) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <ChevronRight className="w-5 h-5 text-indigo-500 mr-1" />
                스타일 선택
              </h2>
              <div className="space-y-3">
                {Object.values(ProfessionalStyle).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                      selectedStyle === style 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="font-medium">{style}</span>
                    {selectedStyle === style && <Check className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                {!state.originalImage ? (
                  <Button 
                    className="w-full h-14 text-lg" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-5 h-5" />
                    사진 업로드하기
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      className="w-full h-14 text-lg"
                      onClick={handleTransform}
                      isLoading={state.isGenerating}
                      disabled={!!state.generatedImage}
                    >
                      <Sparkles className="w-5 h-5" />
                      {state.generatedImage ? '변환 완료' : '프로필 사진 생성'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={reset}
                    >
                      <RefreshCcw className="w-4 h-4" />
                      다시 시작하기
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                성공적인 변환 팁
              </h3>
              <ul className="text-indigo-100 text-sm space-y-2 opacity-90">
                <li>• 얼굴이 정면을 향한 선명한 사진을 권장합니다.</li>
                <li>• 조명이 충분하고 배경이 복잡하지 않은 사진이 좋습니다.</li>
                <li>• 한 명의 인물만 포함된 사진을 사용해주세요.</li>
              </ul>
            </div>
          </div>

          {/* Preview Area (Right/Bottom) */}
          <div className="lg:col-span-8">
            <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px] flex flex-col">
              <div className="flex-1 flex flex-col md:flex-row gap-4 p-4">
                
                {/* Original Preview */}
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">Original</span>
                  <div className="aspect-[3/4] rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center relative group">
                    {state.originalImage ? (
                      <img 
                        src={state.originalImage} 
                        alt="Original" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium">사진을 업로드하면<br/>여기에 표시됩니다</p>
                      </div>
                    )}
                    {!state.originalImage && (
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                    )}
                  </div>
                </div>

                {/* Generated Preview */}
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">Professional AI result</span>
                  <div className="aspect-[3/4] rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center relative border-4 border-white shadow-inner">
                    {state.generatedImage ? (
                      <img 
                        src={state.generatedImage} 
                        alt="Generated" 
                        className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" 
                      />
                    ) : state.isGenerating ? (
                      <div className="flex flex-col items-center text-center p-6">
                        <div className="relative mb-6">
                          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
                        </div>
                        <p className="text-indigo-300 font-medium animate-pulse">AI가 사진을 분석하고<br/>의상을 정장으로 변경하는 중입니다...</p>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-slate-600">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mx-auto mb-3 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-medium">변환 시작 버튼을 눌러<br/>결과를 확인하세요</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar (Footer of Preview Area) */}
              <div className="bg-slate-50 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   {state.error ? (
                     <p className="text-red-500 text-sm font-medium flex items-center">
                       <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping" />
                       {state.error}
                     </p>
                   ) : (
                     <p className="text-slate-500 text-sm">
                       {state.generatedImage 
                         ? "마음에 드시나요? 결과물을 다운로드하여 이력서에 활용해보세요!" 
                         : "이미지 처리는 약 10-20초 정도 소요될 수 있습니다."}
                     </p>
                   )}
                </div>
                {state.generatedImage && (
                  <Button variant="secondary" onClick={handleDownload}>
                    <Download className="w-5 h-5" />
                    사진 다운로드
                  </Button>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 text-slate-400 text-sm text-center">
        <p>© 2024 AI Professional Portrait Studio. Powered by Gemini 2.5 Flash.</p>
        <p className="mt-1">개인정보보호를 위해 변환 완료 후 사진은 서버에 저장되지 않습니다.</p>
      </footer>
    </div>
  );
};

export default App;
