import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="page">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="lead">How Mic Testing Tool handles microphone audio, technical information and messages you send us.</p>
          <p className="meta">Last updated: October 28, 2026</p>
        </div>
      </header>

      <div className="content-page">
        <article className="prose prose-panel">
          <h2>Introduction</h2>
          <p>Welcome to Mic Testing Tool. We respect your privacy and are committed to protecting it. This Privacy Policy explains how information may be collected, used, and protected when you use our website and online microphone testing tools.</p>
          <p>By using mictestingtool.com, you agree to the practices described in this Privacy Policy.</p>

          <h2>Information We Collect</h2>
          <p>Mic Testing Tool is designed to let you test your microphone directly through your web browser. We do not require you to create an account or provide personal information to use the basic microphone testing functionality.</p>
          <h3>Microphone Access</h3>
          <p>When you start a microphone test, your browser may ask for permission to access your device microphone. This permission is controlled by your browser and operating system.</p>
          <p>The microphone is accessed to provide the testing functionality. Test recordings are processed in your browser; we do not collect or store your microphone recordings or audio content on our servers.</p>

          <h2>Automatically Collected Information</h2>
          <p>Like many websites, our website may automatically receive limited technical information when you visit. This information may include your browser type, device type, operating system, approximate location, referring website, pages visited, and general usage information.</p>
          <p>This information may be used to maintain, secure, analyze, and improve our website and services.</p>

          <h2>Contact Form</h2>
          <p>If you use the <Link to="/contact">contact form</Link>, the name, email address, topic and message you enter are delivered to our support inbox through the Formspree form service so we can reply. Do not include passwords or private recordings in a message.</p>

          <h2>Cookies and Similar Technologies</h2>
          <p>Mic Testing Tool may use cookies and similar technologies to improve website functionality, understand website usage, and support analytics or advertising services.</p>
          <p>Cookies are small files stored on your device by your browser. You can manage or disable cookies through your browser settings. Some website features may not work correctly if certain cookies are disabled.</p>

          <h2>Analytics</h2>
          <p>We may use third-party analytics services to understand how visitors interact with our website. These services may collect information such as pages viewed, approximate location, device information, browser information, and general website usage statistics.</p>
          <p>Analytics information is used to improve website performance, usability, and content.</p>

          <h2>Advertising</h2>
          <p>We may display advertisements provided by third-party advertising networks. These advertising providers may use cookies or similar technologies to provide, measure, or personalize advertisements.</p>
          <p>Third-party advertising providers operate under their own privacy policies. We recommend reviewing the applicable privacy policies of those providers for more information about their practices.</p>

          <h2>Third-Party Services</h2>
          <p>Our website may use third-party services for analytics, advertising, security, hosting, performance monitoring, or other website functions. These third parties may process certain technical information according to their own privacy policies and terms.</p>

          <h2>Data Security</h2>
          <p>We take reasonable measures to protect the website and the information processed through it. However, no method of transmission or electronic storage can be guaranteed to be completely secure. Read more on our <Link to="/security">security page</Link>.</p>

          <h2>Children&apos;s Privacy</h2>
          <p>Our website is not intended to knowingly collect personal information from children. We do not intentionally request personal information from children through our microphone testing tools.</p>

          <h2>External Links</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices, content, or security of external websites. We encourage you to review the privacy policies of websites you visit through external links.</p>

          <h2>Your Choices</h2>
          <p>You can control certain browser permissions, cookies, and microphone access through your browser and device settings.</p>
          <p>You may deny microphone permission when your browser requests access. However, denying microphone access will prevent the microphone testing functionality from working.</p>

          <h2>Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes to our website, services, technology, or applicable requirements. Any updated version will be posted on this page with a revised &quot;Last updated&quot; date.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our privacy practices, email <a href="mailto:support@mictestingtool.com">support@mictestingtool.com</a> or use the <Link to="/contact">contact page</Link>.</p>
        </article>
        <div className="page-links"><Link to="/terms" className="btn btn-ghost">Terms of Use</Link><Link to="/" className="btn btn-primary">Open the microphone tester</Link></div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
