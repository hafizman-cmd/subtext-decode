"use client";
import { useState } from 'react';
import { Camera, Sparkles, ShieldCheck, Zap, Copy, ImagePlus } from 'lucide-react';

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setResult(null);
    setActiveTab(0); // Resets the tab to the first scenario on new scan

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;

      try {
        const response = await fetch('/api/decode', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image }),
        });
        
        // --- THE ERROR CHECK ---
        if (!response.ok) {
          alert("The AI servers are experiencing extremely high demand right now. Please try again in a minute!");
          setIsScanning(false);
          return;
        }

        const data = await response.json();
        setResult(data);
      } catch (error) {
        alert("Something went wrong on checking the image. Please try again.");
      } finally {
        setIsScanning(false);
      }
    };
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-slate-200 flex flex-col items-center p-6 font-sans">
      <div className="text-center mb-10 mt-8">
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          SubtextDecode
        </h1>
        <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest">Speak the Unspoken</p>
      </div>

      <div className="relative w-full max-w-sm aspect-[3/4] bg-[#0f1218] rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6">
        
        {isScanning ? (
          <div className="flex flex-col items-center gap-6">
            <div className="absolute top-0 w-full h-1 bg-cyan-500 shadow-[0_0_20px_#06b6d4] animate-pulse" />
            <Sparkles className="text-cyan-400 w-12 h-12 animate-spin" />
            <p className="text-cyan-400 font-mono text-xs animate-pulse">DECODING SUBTEXT...</p>
          </div>
        ) : result && result.interpretations ? (
          
          /* --- THE NEW RESULTS DASHBOARD --- */
          <div className="w-full h-full overflow-y-auto space-y-4 pt-4 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* THE CONFIDENCE BADGE */}
            <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
              result.confidence_score >= 80 ? "bg-emerald-900/20 border-emerald-800/50" : 
              result.confidence_score >= 60 ? "bg-amber-900/20 border-amber-800/50" : 
              "bg-red-900/20 border-red-800/50"
            }`}>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] uppercase font-bold tracking-widest ${
                  result.confidence_score >= 80 ? "text-emerald-500" : 
                  result.confidence_score >= 60 ? "text-amber-500" : 
                  "text-red-500"
                }`}>
                  {result.confidence_score >= 80 ? "High Confidence" : 
                   result.confidence_score >= 60 ? "Moderate Confidence" : 
                   "Ambiguous"}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {result.confidence_score}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {result.reasoning}
              </p>
            </div>

            {/* THE SCENARIO TABS (Only shows if there are multiple interpretations) */}
            {result.interpretations.length > 1 && (
              <div className="bg-slate-900/50 p-1 rounded-xl flex gap-1 border border-slate-800">
                {result.interpretations.map((interp: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                      activeTab === index 
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm" 
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                  >
                    {interp.title}
                  </button>
                ))}
              </div>
            )}

            {/* Box 1: The Vibe */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <p className="text-[10px] text-cyan-500 uppercase font-bold mb-2 tracking-widest">The Vibe</p>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">"{result.interpretations[activeTab].vibe}"</p>
            </div>

            {/* Box 2: Hidden Meaning */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <p className="text-[10px] text-indigo-400 uppercase font-bold mb-2 tracking-widest">Hidden Meaning</p>
              <p className="text-slate-300 text-sm leading-relaxed">{result.interpretations[activeTab].hidden_meaning}</p>
            </div>

            {/* Box 3: Red Flags (Only shows if the AI found any) */}
            {result.interpretations[activeTab].red_flags && result.interpretations[activeTab].red_flags.length > 0 && (
              <div className="bg-rose-950/30 p-4 rounded-2xl border border-rose-900/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <p className="text-[10px] text-rose-500 uppercase font-bold mb-3 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Red Flags Detected
                </p>
                <ul className="space-y-2">
                  {result.interpretations[activeTab].red_flags.map((flag: string, i: number) => (
                    <li key={i} className="text-rose-200/80 text-xs flex items-start gap-2">
                      <span className="text-rose-500 mt-0.5">›</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Box 4: Response Options */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-4 tracking-widest text-center">Suggested Replies</p>
              
              <div className="space-y-3">
                {/* The Shield */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm relative group transition-colors hover:border-emerald-900/50">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-500 block mb-1 font-bold">The Shield (Boundaries)</span>
                  <p className="pr-8 text-slate-300 text-xs">{result.interpretations[activeTab].replies.shield}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.interpretations[activeTab].replies.shield)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-emerald-400 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>

                {/* The Bridge */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm relative group transition-colors hover:border-amber-900/50">
                  <span className="text-[9px] uppercase tracking-wider text-amber-500 block mb-1 font-bold">The Bridge (Empathy)</span>
                  <p className="pr-8 text-slate-300 text-xs">{result.interpretations[activeTab].replies.bridge}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.interpretations[activeTab].replies.bridge)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>

                {/* The Suit */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm relative group transition-colors hover:border-blue-900/50">
                  <span className="text-[9px] uppercase tracking-wider text-blue-500 block mb-1 font-bold">The Suit (Professional)</span>
                  <p className="pr-8 text-slate-300 text-xs">{result.interpretations[activeTab].replies.suit}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.interpretations[activeTab].replies.suit)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-blue-400 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* The Scan Another Button */}
            <button 
              onClick={() => setResult(null)}
              className="w-full py-3 mt-4 bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors"
            >
              Scan Another
            </button>

          </div>
        ) : (
          
          /* --- THE UPLOAD BUTTONS --- */
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-center gap-8 mb-4">
              
              {/* Button 1: Live Camera */}
              <label className="cursor-pointer group flex flex-col items-center gap-3">
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all shadow-lg">
                  <Camera className="w-7 h-7 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <span className="block text-slate-200 font-bold tracking-wide text-sm">Camera</span>
              </label>

              {/* Button 2: Photo Gallery */}
              <label className="cursor-pointer group flex flex-col items-center gap-3">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all shadow-lg">
                  <ImagePlus className="w-7 h-7 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <span className="block text-slate-200 font-bold tracking-wide text-sm">Gallery</span>
              </label>
              
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">JPG, PNG, or HEIC</span>
          </div>
        )}
        
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="w-full max-w-sm mt-8 space-y-4 pb-8">
        
        {/* The "About & Tech" Box */}
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col gap-4 transition-colors hover:border-slate-700/80">
          <div className="flex justify-center gap-8 pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">AI Powered</span>
            </div>
          </div>
          <div className="px-1">
            <h3 className="text-center font-bold text-slate-200 text-xs tracking-wider mb-2 uppercase">
              Speak the Unspoken
            </h3>
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Navigate the unspoken. SubtextDecode translates hidden tones and meanings in your digital chats, acting as a social translator for your most tricky conversations.
            </p>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
          <p className="text-[10px] text-cyan-500 uppercase font-bold mb-4 tracking-widest text-center">Quick Guide</p>
          <div className="flex justify-between items-start px-2">
            <div className="flex flex-col items-center text-center gap-2 w-1/3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shadow-lg">1</div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold leading-tight">Snap or<br/>Upload</p>
            </div>
            <div className="w-8 h-[1px] bg-slate-800 mt-3 hidden sm:block"></div>
            <div className="flex flex-col items-center text-center gap-2 w-1/3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shadow-lg">2</div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold leading-tight">AI Decodes<br/>Subtext</p>
            </div>
            <div className="w-8 h-[1px] bg-slate-800 mt-3 hidden sm:block"></div>
            <div className="flex flex-col items-center text-center gap-2 w-1/3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shadow-lg">3</div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold leading-tight">Pick Your<br/>Reply</p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Creator Credit */}
      <div className="mt-2 pb-8 text-center w-full">
        <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
          Engineered by Hafiz Wahid
        </p>
      </div>
    </main>
  );
}