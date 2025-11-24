
import React, { useState } from 'react';
import { X, Sparkles, Upload, Paperclip, Loader2, AlertCircle } from 'lucide-react';
import { analyzeWritingStyle } from '../services/geminiService';

interface StyleAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (styleString: string) => void;
}

const StyleAnalyzerModal: React.FC<StyleAnalyzerModalProps> = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [samples, setSamples] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAnalyze = async () => {
    if (!samples && files.length === 0) {
        setError("Iltimos, matn namunalarini kiriting yoki fayl yuklang.");
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeWritingStyle(samples, files);
      const sig = result.style_signature;
      
      // Format the style signature into a string usable by the main generator
      const formattedStyle = `
Ohang: ${sig.tone}
Struktura: ${sig.sentence_structure}
So'z boyligi: ${sig.vocabulary_patterns}
Temp: ${sig.pacing}
O'tishlar: ${sig.transitions}
Qochish kerak: ${sig.avoidances}
      `.trim();

      onAnalysisComplete(formattedStyle);
      onClose();
    } catch (err: any) {
      setError(err.message || "Uslubni tahlil qilishda xatolik.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
               <Sparkles size={18} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AI Uslub Tahlilchisi</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          <p className="text-gray-600 text-sm mb-6 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            3–10 ta avvalgi postlaringizni yuklang yoki matnini kiriting. Zynta sizning yozish uslubingizni o'rganib, siz kabi yozishni o'rganadi.
          </p>

          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matn namunalarini joylashtiring
                </label>
                <textarea
                    value={samples}
                    onChange={(e) => setSamples(e.target.value)}
                    placeholder="Eng yaxshi yozgan postlaringizdan parchalarni shu yerga qo'ying..."
                    className="w-full h-40 bg-white border border-gray-300 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Upload size={14} /> Yoki hujjat yuklang (PDF, TXT, Rasm)
                </label>
                <div className="relative group">
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        multiple
                        accept=".txt,.md,.pdf,image/*"
                        className="hidden"
                        id="modal-file-upload"
                    />
                    <label 
                        htmlFor="modal-file-upload"
                        className="block w-full text-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-blue-600">Yuklash uchun bosing</span> yoki sudrab tashlang
                        </div>
                        <p className="text-xs text-gray-400 mt-1">TXT, PDF, PNG (max 10MB)</p>
                    </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-md px-2 py-1">
                        <Paperclip size={10} className="text-gray-500" />
                        <span className="text-xs text-gray-700">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors hover:bg-gray-100 rounded-lg"
            >
                Bekor qilish
            </button>
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Tahlil qilish
            </button>
        </div>
      </div>
    </div>
  );
};

export default StyleAnalyzerModal;
