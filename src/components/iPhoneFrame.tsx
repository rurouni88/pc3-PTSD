import type { ReactNode } from 'react';

interface iPhoneFrameProps {
  children: ReactNode;
}

export function iPhoneFrame({ children }: iPhoneFrameProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center p-4 sm:p-8">
      {/* Ambient glow behind the phone */}
      <div className="absolute w-[320px] h-[680px] sm:w-[380px] sm:h-[800px] rounded-[3rem] bg-accent-blue/5 blur-3xl" />

      {/* iPhone Frame */}
      <div className="relative z-10">
        {/* Side buttons */}
        <div className="absolute -right-[4px] top-[120px] w-[4px] h-[40px] bg-slate-600 rounded-r-sm" />
        <div className="absolute -left-[4px] top-[100px] w-[4px] h-[32px] bg-slate-600 rounded-l-sm" />
        <div className="absolute -left-[4px] top-[150px] w-[4px] h-[32px] bg-slate-600 rounded-l-sm" />

        {/* Phone body */}
        <div className="relative w-[340px] h-[720px] sm:w-[400px] sm:h-[840px] bg-slate-950 rounded-[3rem] p-[12px] shadow-2xl shadow-black/50 border border-slate-700/50">
          {/* Inner bezel */}
          <div className="relative w-full h-full bg-black rounded-[2.5rem] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
              <div className="w-[120px] h-[28px] sm:w-[140px] sm:h-[32px] bg-black rounded-b-3xl flex items-center justify-center gap-2">
                {/* Camera */}
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-800 border border-slate-700" />
                {/* Speaker */}
                <div className="w-8 h-1 sm:w-10 sm:h-1.5 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Screen content — padded to clear notch + home indicator */}
            <div className="relative w-full h-full overflow-hidden pt-8 pb-3">
              {children}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50">
              <div className="w-[100px] h-[4px] bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
