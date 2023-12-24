import React from 'react';
import { privacy } from '../constant/privacy';

const PrivacyPolicy = () => {
  const container = `bg-gray-900 text-gray-200 p-4 `;
  const subHeading = `text-2xl font-semibold mb-4 text-yellow-400`;
  const paragraphStyle = `mb-4`;

  return (
    <div className={container}>
      <h2 className={subHeading}>Privacy Policy</h2>
      <p className={paragraphStyle}>{privacy.privacyPolicy}</p>

      <h3 className={subHeading}>Data Collection</h3>
      <p className={paragraphStyle}>{privacy.dataCollection}</p>

      <h3 className={subHeading}>Data Usage</h3>
      <p className={paragraphStyle}>{privacy.dataUsage}</p>

      <h3 className={subHeading}>Data Security</h3>
      <p className={paragraphStyle}>{privacy.dataSecurity}</p>

      <h3 className={subHeading}>Terms & Conditions</h3>
      <p className={paragraphStyle}>{privacy.termsAndConditons}</p>

      <h3 className={subHeading}>Changes to Privacy Policy</h3>
      <p className={paragraphStyle}>{privacy.changesToPrivacyPolicy}</p>
    </div>
  );
};

export default PrivacyPolicy;
