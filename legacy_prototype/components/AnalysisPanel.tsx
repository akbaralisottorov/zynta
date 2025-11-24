import React from 'react';
import { ZyntaAnalysis } from '../types';
import { Tag, Activity, FileText } from 'lucide-react';

interface AnalysisPanelProps {
  data: ZyntaAnalysis;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Summary */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-blue-600">
          <FileText size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Content Summary</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
      </div>

      {/* Tone */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-pink-500">
          <Activity size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Tone Detected</span>
        </div>
        <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-gray-900 capitalize">{data.tone}</p>
        </div>
        <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-pink-500 h-full w-3/4 rounded-full opacity-80"></div>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-emerald-600">
          <Tag size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Keywords</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.keywords.map((keyword, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-100"
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;