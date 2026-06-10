import React from 'react';
import { privacy } from '../constant/privacy';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-6">
      <div className="mx-auto max-w-3xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-zinc-300">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Privacy Policy & Terms</h1>
          <p className="text-sm text-zinc-400">Last updated: June 2026. Please review how we collect, store, and process your data.</p>
        </header>

        <div className="space-y-6 border border-zinc-800/60 rounded-xl bg-zinc-950/40 p-6 max-h-[500px] overflow-y-auto pr-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 mb-2">1. Overview</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{privacy.privacyPolicy}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-100 mb-2">2. Data Collection</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{privacy.dataCollection}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-100 mb-2">3. Data Usage</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{privacy.dataUsage}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-100 mb-2">4. Data Security</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{privacy.dataSecurity}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-100 mb-2">5. Terms & Conditions</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{privacy.termsAndConditons}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-100 mb-2">6. Changes to Policy</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{privacy.changesToPrivacyPolicy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
