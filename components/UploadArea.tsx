
import React, { useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  onUpload: (base64: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-10 flex flex-col items-center text-center px-4">
      <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-8 ring-4 ring-white shadow-md">
        <Camera className="w-10 h-10 text-zinc-400" />
      </div>
      
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">Startup Persona</h1>
      <p className="text-zinc-500 mb-10 leading-relaxed">
        당신의 사진을 업로드해 보세요.<br/>
        깔끔한 오피스 배경과 비즈니스 룩으로 변신시켜 드립니다.
      </p>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <button 
        onClick={triggerUpload}
        className="w-full bg-black text-white font-bold py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
      >
        <ImageIcon className="w-5 h-5" />
        사진 선택하기
      </button>
      
      <p className="mt-4 text-xs text-zinc-400">
        얼굴이 정면으로 나온 선명한 사진이 가장 좋습니다.
      </p>
    </div>
  );
};

export default UploadArea;
