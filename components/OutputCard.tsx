import React, { useState } from 'react';
import { Copy, Check, Wand2, Loader2, ArrowRight } from 'lucide-react';
import { refineContent } from '../services/geminiService';

interface OutputCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  colorClass: string;
  onUpdate?: (newContent: string) => void;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, content, icon, colorClass, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [loadingRefine, setLoadingRefine] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = async () => {
    if (!instruction.trim()) return;
    setLoadingRefine(true);
    try {
      const newText = await refineContent(content, instruction);
      if (onUpdate) onUpdate(newText);
      setInstruction('');
      setIsRefining(false);
    } catch (error) {
      console.error("Failed to refine content", error);
    } finally {
      setLoadingRefine(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRefine();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className={`px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
            {onUpdate && (
                <button
                    onClick={() => setIsRefining(!isRefining)}
                    className={`p-2 rounded-lg transition-colors text-gray-400 hover:text-blue-600 hover:bg-blue-50 ${isRefining ? 'bg-blue-50 text-blue-600' : ''}`}
                    title="Refine text"
                >
                    <Wand2 size={16} />
                </button>
            )}
            <button
                onClick={handleCopy}
                className="p-2 rounded-lg transition-colors text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                title="Copy to clipboard"
            >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
        </div>
      </div>
      
      {isRefining && (
        <div className="p-4 bg-blue-50/50 border-b border-blue-100 animate-fade-in">
            <div className="relative flex items-center gap-2">
                <input 
                    type="text" 
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Refine instruction... (e.g. 'Make it funnier')"
                    disabled={loadingRefine}
                    className="w-full bg-white border border-blue-200 rounded-lg pl-4 pr-12 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    autoFocus
                />
                <div className="absolute right-2 flex items-center">
                    <button 
                        onClick={handleRefine}
                        disabled={loadingRefine || !instruction.trim()}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loadingRefine ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="p-5 overflow-y-auto custom-scrollbar flex-grow max-h-[400px]">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default OutputCard;