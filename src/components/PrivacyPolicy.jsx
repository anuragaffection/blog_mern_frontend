import React from 'react';
import { privacy } from '../constant/privacy';

const PrivacyPolicy = () => {
  return (
    <div className="text-zinc-300">
      <header className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Privacy Policy & Terms</h2>
        <p className="text-sm text-zinc-400">Last updated: June 2026. Please review how we collect, store, and process your data.</p>
      </header>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 border border-zinc-850/40 rounded-xl bg-zinc-950/40 p-4 sm:p-6">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">1. Overview</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{privacy.privacyPolicy}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">2. Data Collection</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{privacy.dataCollection}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">3. Data Usage</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{privacy.dataUsage}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">4. Data Security</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{privacy.dataSecurity}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">5. Terms & Conditions</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{privacy.termsAndConditons}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">6. Changes to Policy</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{privacy.changesToPrivacyPolicy}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
