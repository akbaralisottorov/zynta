
import React, { useState } from 'react';
import { 
  Sparkles, 
  PenTool, 
  Upload, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Send, 
  Image as ImageIcon, 
  Loader2,
  Video,
  Mic,
  LayoutGrid,
  Paperclip,
  Wand2,
  LayoutDashboard,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Check,
  User,
  Copy
} from 'lucide-react';
import { generateContent } from './services/geminiService';
import { ZyntaResponse, PlatformKey, ZyntaContent } from './types';
import OutputCard from './components/OutputCard';
import AnalysisPanel from './components/AnalysisPanel';
import StyleAnalyzerModal from './components/StyleAnalyzerModal';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [userStyle, setUserStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZyntaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PlatformKey>('linkedin');
  const [files, setFiles] = useState<File[]>([]);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleGenerate = async () => {
    if (!prompt && files.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateContent(prompt, userStyle, files);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleStyleAnalysisComplete = (styleString: string) => {
    setUserStyle(styleString);
  };

  const updateContent = (platform: keyof ZyntaContent, subField: string | null, newText: string) => {
    if (!result) return;
    
    setResult(prev => {
      if (!prev) return null;
      const updatedContent = { ...prev.content };
      
      if (subField) {
        // @ts-ignore
        updatedContent[platform] = {
          // @ts-ignore
          ...updatedContent[platform],
          [subField]: newText
        };
      } else {
        // @ts-ignore
        updatedContent[platform] = newText;
      }

      return {
        ...prev,
        content: updatedContent
      };
    });
  };

  const platformIcons: Record<PlatformKey, React.ReactElement<any>> = {
    linkedin: <Linkedin size={18} />,
    twitter: <Twitter size={18} />,
    instagram: <Instagram size={18} />,
    tiktok: <Video size={18} />,
    youtube: <Youtube size={18} />,
    substack: <Mail size={18} />,
    telegram: <Send size={18} />,
  };

  const platformColors: Record<PlatformKey, string> = {
    linkedin: 'bg-blue-600 text-white',
    twitter: 'bg-sky-500 text-white',
    instagram: 'bg-pink-600 text-white',
    tiktok: 'bg-black text-white',
    youtube: 'bg-red-600 text-white',
    substack: 'bg-orange-500 text-white',
    telegram: 'bg-blue-400 text-white',
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <StyleAnalyzerModal 
        isOpen={isStyleModalOpen} 
        onClose={() => setIsStyleModalOpen(false)}
        onAnalysisComplete={handleStyleAnalysisComplete}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
             <Sparkles className="text-blue-600" size={24} />
             <span className="text-xl font-bold text-gray-900 tracking-tight">ZYNTA</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem icon={<PenTool size={20} />} label="Post Yaratish" active />
          <SidebarItem icon={<BarChart2 size={20} />} label="Statistika" />
          <SidebarItem icon={<Settings size={20} />} label="Sozlamalar" />
          <SidebarItem icon={<HelpCircle size={20} />} label="Yordam" />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm border border-blue-200">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Sarah Anderson</p>
              <p className="text-xs text-gray-500 truncate">Pro Plan</p>
            </div>
            <LogOut size={16} className="text-gray-400 hover:text-gray-600" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
             <div className="flex items-center gap-2">
               <Sparkles className="text-blue-600" size={20} />
               <span className="text-lg font-bold text-gray-900">ZYNTA</span>
            </div>
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">SA</div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Post Yaratish</h1>
                <p className="text-sm text-gray-500">Barcha ijtimoiy tarmoqlar uchun optimal kontent yarating.</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                 <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Qoralamalar
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Input Configuration */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <LayoutGrid size={18} className="text-gray-500" />
                      Input & Konfiguratsiya
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Topic Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Post nima haqida?</label>
                      <div className="relative">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Masalan: Yangi qahva brendimizning ochilish marosimi haqida..."
                          className="w-full h-32 bg-white border border-gray-300 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-sm"
                        />
                        <div className="absolute bottom-3 right-3">
                          <Mic className="text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" size={18} />
                        </div>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kontekst (Rasm/Audio)</label>
                      <div className="relative group">
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            multiple
                            accept="image/*,audio/*"
                            className="hidden"
                            id="file-upload"
                        />
                        <label 
                          htmlFor="file-upload"
                          className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-gray-500">
                            <Upload size={16} />
                            <span className="text-sm">{files.length > 0 ? `${files.length} fayl tanlandi` : 'Fayllarni yuklash'}</span>
                          </div>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Optional</span>
                        </label>
                      </div>
                      {files.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {files.map((file, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600 border border-gray-200">
                              <Paperclip size={10} /> {file.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Style & Tone */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Uslub va Ohang</label>
                        <button 
                          onClick={() => setIsStyleModalOpen(true)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Wand2 size={12} /> Tahlil qilish
                        </button>
                      </div>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Sparkles size={16} className="text-gray-400" />
                         </div>
                         <input
                            type="text"
                            value={userStyle}
                            onChange={(e) => setUserStyle(e.target.value)}
                            placeholder="Masalan: Rasmiy, samimiy, emojilar bilan..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                          />
                      </div>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleGenerate}
                        disabled={loading || (!prompt && files.length === 0)}
                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Kontent Yaratilmoqda...
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            Post Yaratish
                          </>
                        )}
                      </button>
                      {error && (
                        <p className="mt-3 text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>
                      )}
                    </div>

                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <h4 className="text-blue-900 text-xs font-bold uppercase tracking-widest mb-3">Target Platformalar</h4>
                  <div className="flex flex-wrap gap-3 opacity-75">
                     {(Object.keys(platformIcons) as PlatformKey[]).map((key) => (
                        <div key={key} className="bg-white p-2 rounded-lg shadow-sm border border-blue-100 text-blue-600">
                            {platformIcons[key]}
                        </div>
                     ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Output */}
              <div className="lg:col-span-7">
                {!result && !loading && (
                  <div className="h-full min-h-[500px] bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <LayoutGrid size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Hali hech narsa yaratilmadi</h3>
                    <p className="text-sm text-gray-500 max-w-xs">Chap tomondagi ma'lumotlarni to'ldiring va brendingiz uchun mos kontent yarating.</p>
                  </div>
                )}

                {loading && (
                  <div className="h-full min-h-[500px] bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={24} className="text-blue-600 animate-pulse"/>
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 animate-pulse">AI ishlamoqda...</h3>
                    <p className="text-sm text-gray-500 mt-2">Kontekst tahlil qilinmoqda • Uslub tanlanmoqda • Formatlanmoqda</p>
                  </div>
                )}

                {result && !loading && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Image Generation Preview */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                          <ImageIcon size={16} className="text-blue-600" />
                          AI Vizual Taklifi (Prompt)
                       </h3>
                       <div className="grid md:grid-cols-5 gap-6">
                          <div className="md:col-span-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center min-h-[140px] border border-gray-200">
                              <ImageIcon className="text-gray-400" size={40} />
                          </div>
                          <div className="md:col-span-3 flex flex-col justify-center">
                              <label className="text-xs font-semibold text-gray-500 mb-2">IMAGE PROMPT (Ingliz tilida)</label>
                              <p className="text-sm text-gray-700 leading-relaxed mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                {result.image_prompt}
                              </p>
                              <button 
                                onClick={() => navigator.clipboard.writeText(result.image_prompt)}
                                className="self-start flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                <Copy size={12} /> Nusxa olish
                              </button>
                          </div>
                       </div>
                    </div>

                    <AnalysisPanel data={result.analysis} />

                    {/* Tabs */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex overflow-x-auto scrollbar-hide">
                       {(Object.keys(platformIcons) as PlatformKey[]).map((key) => (
                          <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                              ${activeTab === key 
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                             {React.cloneElement(platformIcons[key], { 
                                size: 16,
                                className: activeTab === key ? 'text-blue-600' : 'text-gray-400' 
                             })}
                             <span className="capitalize">{key}</span>
                          </button>
                       ))}
                    </div>

                    {/* Content Cards */}
                    <div className="grid gap-6">
                         {activeTab === 'instagram' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <OutputCard 
                                title="Reels Ssenariysi"
                                content={result.content.instagram.reels_caption}
                                icon={<Video size={16}/>}
                                colorClass="text-pink-600 bg-pink-50"
                                onUpdate={(val) => updateContent('instagram', 'reels_caption', val)}
                            />
                            <OutputCard 
                                title="Carousel Matni"
                                content={result.content.instagram.carousel_text}
                                icon={<ImageIcon size={16}/>}
                                colorClass="text-purple-600 bg-purple-50"
                                onUpdate={(val) => updateContent('instagram', 'carousel_text', val)}
                            />
                        </div>
                    )}
                    
                    {activeTab === 'telegram' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <OutputCard 
                                title="Broadcast (Qisqa)"
                                content={result.content.telegram.short}
                                icon={<Send size={16}/>}
                                colorClass="text-blue-500 bg-blue-50"
                                onUpdate={(val) => updateContent('telegram', 'short', val)}
                            />
                            <OutputCard 
                                title="Kanal Posti (To'liq)"
                                content={result.content.telegram.long}
                                icon={<Send size={16}/>}
                                colorClass="text-blue-600 bg-blue-100"
                                onUpdate={(val) => updateContent('telegram', 'long', val)}
                            />
                        </div>
                    )}

                    {/* Simple String Content Platforms */}
                    {['linkedin', 'twitter', 'tiktok', 'youtube', 'substack'].includes(activeTab) && (
                        <OutputCard 
                            title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Post`}
                            content={
                                activeTab === 'linkedin' ? result.content.linkedin :
                                activeTab === 'twitter' ? result.content.twitter :
                                activeTab === 'tiktok' ? result.content.tiktok :
                                activeTab === 'youtube' ? result.content.youtube :
                                result.content.substack
                            }
                            icon={platformIcons[activeTab]}
                            colorClass={
                                activeTab === 'linkedin' ? 'text-blue-700 bg-blue-50' :
                                activeTab === 'twitter' ? 'text-sky-600 bg-sky-50' :
                                activeTab === 'tiktok' ? 'text-gray-900 bg-gray-100' :
                                activeTab === 'youtube' ? 'text-red-600 bg-red-50' :
                                'text-orange-600 bg-orange-50'
                            }
                            onUpdate={(val) => updateContent(activeTab as PlatformKey, null, val)}
                        />
                    )}
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1
    ${active 
      ? 'bg-blue-50 text-blue-700' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <span className={active ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>
    {label}
  </button>
);

export default App;
