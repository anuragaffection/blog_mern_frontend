import React from 'react';
import { privacy } from '../constant/privacy';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-900 text-white p-6">

      <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
      <p className="mb-4">{privacy.privacyPolicy}</p>

      <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
      <p className="mb-4">{privacy.dataCollection}</p>

      <h3 className="text-xl font-semibold mb-2">Data Usage</h3>
      <p className="mb-4">{privacy.dataUsage}</p>

      <h3 className="text-xl font-semibold mb-2">Data Security</h3>
      <p className="mb-4">{privacy.dataSecurity}</p>

      <h3 className="text-xl font-semibold mb-2">Terms & Conditions</h3>
      <p className="mb-4">{privacy.termsAndConditons}</p>

      <h3 className="text-xl font-semibold mb-2">Changes to Privacy Policy</h3>
      <p className="mb-4">{privacy.changesToPrivacyPolicy}</p>

    </div>
  );
};

export default PrivacyPolicy;
