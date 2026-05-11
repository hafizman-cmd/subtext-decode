"use client";
import { useState } from 'react';
import { Camera, Sparkles, ShieldCheck, Zap, Copy, ImagePlus } from 'lucide-react';

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;

      try {
        const response = await fetch('/api/decode', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image }),
        });
        
        // --- THE NEW ERROR CHECK ---
        if (!response.ok) {
          alert("The AI servers are experiencing extremely high demand right now. Please try again in a minute!");
          setIsScanning(false);
          return; // Stop running the rest of the code
        }
        // ---------------------------

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
        ) : result ? (
          /* THE DASHBOARD RESULT */
          <div className="w-full h-full overflow-y-auto space-y-4 pt-4 custom-scrollbar">
            
            {/* Box 1: The Vibe */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-[10px] text-cyan-400 uppercase font-bold mb-1">The Vibe</p>
              <p className="text-sm italic">"{result.vibe}"</p>
            </div>

            {/* Box 2: Hidden Meaning */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-[10px] text-amber-400 uppercase font-bold mb-1">Hidden Meaning</p>
              <p className="text-sm">{result.hidden_meaning}</p>
            </div>

           {/* Box 3: Response Options */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-[10px] text-emerald-400 uppercase font-bold mb-3">Response Options</p>
              
              <div className="space-y-3">
                {/* Option 1: The Shield */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm relative group transition-colors hover:border-slate-600">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1 font-bold">The Shield (Boundaries)</span>
                  <p className="pr-8 text-slate-300">{result.replies?.shield}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.replies?.shield)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-cyan-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>

                {/* Option 2: The Bridge */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm relative group transition-colors hover:border-slate-600">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1 font-bold">The Bridge (Empathy)</span>
                  <p className="pr-8 text-slate-300">{result.replies?.bridge}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.replies?.bridge)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-cyan-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>

                {/* Option 3: The Suit */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm relative group transition-colors hover:border-slate-600">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-1 font-bold">The Suit (Professional)</span>
                  <p className="pr-8 text-slate-300">{result.replies?.suit}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.replies?.suit)}
                    className="absolute top-3 right-3 text-slate-600 hover:text-cyan-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* The Scan Another Button */}
            <button 
              onClick={() => setResult(null)}
              className="w-full py-3 bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors"
            >
              Scan Another
            </button>

          </div>
        ) : (
          /* THE UPLOAD BUTTONS */
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-center gap-8 mb-4">
              
              {/* Button 1: Live Camera */}
              <label className="cursor-pointer group flex flex-col items-center gap-3">
                {/* The 'capture' attribute forces the phone to open the camera */}
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
        
        {/* The "About & Tech" Box (Combined) */}
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col gap-4 transition-colors hover:border-slate-700/80">
          
          {/* Tech Specs Bar */}
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
          
          {/* App Function Info */}
          <div className="px-1">
            <h3 className="text-center font-bold text-slate-200 text-xs tracking-wider mb-2 uppercase">
              Speak the Unspoken
            </h3>
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Navigate the unspoken. SubtextDecode translates hidden tones and meanings in your digital chats, acting as a social translator for your most tricky conversations.
            </p>
          </div>
        </div>

        {/* Quick Guide / How It Works */}
        <div className="bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
          <p className="text-[10px] text-cyan-500 uppercase font-bold mb-4 tracking-widest text-center">Quick Guide</p>
          
          <div className="flex justify-between items-start px-2">
            <div className="flex flex-col items-center text-center gap-2 w-1/3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shadow-lg">1</div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold leading-tight">Snap or<br/>Upload</p>
            </div>
            
            {/* Tiny connector line */}
            <div className="w-8 h-[1px] bg-slate-800 mt-3 hidden sm:block"></div>
            
            <div className="flex flex-col items-center text-center gap-2 w-1/3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shadow-lg">2</div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold leading-tight">AI Decodes<br/>Subtext</p>
            </div>

            {/* Tiny connector line */}
            <div className="w-8 h-[1px] bg-slate-800 mt-3 hidden sm:block"></div>

            <div className="flex flex-col items-center text-center gap-2 w-1/3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shadow-lg">3</div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold leading-tight">Pick Your<br/>Reply</p>
            </div>
          </div>
        </div>

      </div>
          {/* Creator Credit */}
            <div className="mt-8 pb-4 text-center w-full">
            <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
              Engineered by Hafiz Wahid
            </p>
          </div>
    </main>
  );
}