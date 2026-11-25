import { Link, useLocation } from 'react-router-dom';

const email = <a href="mailto:support@mictestingtool.com">support@mictestingtool.com</a>;

const content = {
  '/terms': {
    eyebrow: 'Legal', title: 'Terms of use',
    lead: 'The rules for using the free browser microphone tester, including its measurement limits.',
    body: <>
      <h2>Using the tester</h2><p>You may use this free tool to check microphones you are authorized to use. Obtain consent before recording anyone else. Do not use the website to publish unlawful content or interfere with other users.</p>
      <h2>Measurement limitations</h2><p>The tool provides a relative input meter, browser audio information, recording, and playback. It does not measure calibrated sound pressure or end-to-end latency, and is not a substitute for professional or safety-critical audio measurement equipment.</p>
      <h2>Availability and your recordings</h2><p>Browser and device compatibility varies. We cannot guarantee uninterrupted availability or that the tester will identify every hardware problem. You are responsible for keeping copies of recordings you choose to download.</p>
      <h2>Accounts and articles</h2><p>Keep your account credentials private. Article publishing is restricted to authorized administrators. Do not upload content you do not have permission to publish.</p>
      <h2>Questions</h2><p>For help with these terms or the service, email {email}.</p>
    </>,
  },
  '/security': {
    eyebrow: 'Security', title: 'Security and recording privacy',
    lead: 'How microphone permissions, local recording and account security work on Mic Testing Tool.',
    body: <>
      <h2>Microphone permissions</h2><p>The tester requests access only when you start a test. Your browser controls this permission, and you can revoke it in site settings. Stop the test to release the microphone.</p>
      <h2>Local audio processing</h2><p>Test audio is recorded and played back in your browser. The microphone tester does not upload recordings. Downloaded files remain on your device; take care when sharing them.</p>
      <h2>Account safety</h2><p>Account sign-in uses Supabase authentication. Use a unique password and sign out on shared devices. Never send passwords or authentication codes in a support message.</p>
      <h2>Report a concern</h2><p>Email {email} with the affected URL and steps to reproduce the issue. Do not include other people’s private data or recordings.</p>
    </>,
  },
  '/about': {
    eyebrow: 'About us', title: 'About Mic Testing Tool',
    lead: 'Free, private browser tools for checking your microphone, camera, speakers and mouse in seconds.',
    body: <>
      <h2>What we do</h2><p>Mic Testing Tool started with one question people ask before every call, class or recording: “Is my microphone working?” The site answers it in the browser, with no download and no sign-up. You can see a live input level, record a short clip, listen back and download it.</p>
      <p>Since then we have added more quick checks for the gear people use every day:</p>
      <ul>
        <li><Link to="/">Online microphone test</Link> with recording and playback</li>
        <li><Link to="/webcam-test">Webcam and mic test</Link></li>
        <li><Link to="/speaker-test">Speaker and headphone test</Link> for left and right channels</li>
        <li><Link to="/surround-sound-test">5.1 and 7.1 surround sound test</Link></li>
        <li><Link to="/bass-test">Bass and subwoofer test</Link></li>
        <li><Link to="/noise-meter">Classroom noise meter</Link></li>
        <li><Link to="/double-click-test">Mouse double click test</Link></li>
      </ul>
      <h2>Privacy comes first</h2><p>Your test audio and video are processed on your own device. The testers do not upload recordings to our servers. Your browser asks for microphone or camera permission only when you start a test, and you can revoke it at any time.</p>
      <h2>Guides that solve real problems</h2><p>When a test shows a problem, our <Link to="/blog">guides</Link> walk through the fix step by step: Windows and Mac settings, iPhone and Android, Chromebook, Xbox, Microsoft Teams and more. The <Link to="/faq">troubleshooting FAQ</Link> covers the most common questions.</p>
      <h2>How the site is funded</h2><p>The tools are free to use. We show ads from Google AdSense to cover hosting and development. Ads never block the testers, and we do not sell your recordings or personal data.</p>
      <h2>Contact us</h2><p>Found a bug, have an idea for a new tool, or need help? Email {email} or use the <Link to="/contact">contact page</Link>. We read every message.</p>
    </>,
  },
  '/disclaimer': {
    eyebrow: 'Legal', title: 'Disclaimer',
    lead: 'What our free tools and guides can and cannot tell you.',
    body: <>
      <h2>General information only</h2><p>The tools and articles on Mic Testing Tool are provided for general information and troubleshooting. We try to keep them accurate and up to date, but we make no guarantees about completeness, accuracy or suitability for any particular purpose.</p>
      <h2>Measurement accuracy</h2><p>Level meters, decibel readings, frequency tones and click timings depend on your browser, operating system, drivers and hardware. Readings are relative, not calibrated. Do not rely on them for hearing safety, workplace noise compliance, medical or other safety-critical decisions. Use certified measuring equipment for those purposes.</p>
      <h2>Volume and hearing safety</h2><p>Speaker, bass and surround tests play sound through your device. Start at a low volume, especially with headphones, and turn it up slowly. Very low bass tones can damage small speakers at high volume.</p>
      <h2>Troubleshooting guides</h2><p>Follow device and settings guides at your own risk. Steps can differ between software versions and manufacturers. Back up important data before changing system settings or drivers. We are not responsible for loss or damage resulting from following the guides.</p>
      <h2>Third-party links and ads</h2><p>The site contains links to other websites and shows ads served by Google AdSense. We do not control and are not responsible for the content, products or privacy practices of third-party sites or advertisers. An ad or link is not an endorsement.</p>
      <h2>Trademarks</h2><p>Product names such as Windows, macOS, iPhone, Android, Chromebook, Xbox and Microsoft Teams are trademarks of their owners. They are used only to describe compatibility. Mic Testing Tool is not affiliated with or endorsed by these companies.</p>
      <h2>Questions</h2><p>If you have a question about this disclaimer, email {email}.</p>
    </>,
  },
  '/cookie-policy': {
    eyebrow: 'Legal', title: 'Cookie policy',
    lead: 'Which cookies and browser storage Mic Testing Tool uses, and how you can control them.',
    body: <>
      <h2>What cookies are</h2><p>Cookies are small text files a website stores in your browser. Similar technologies, such as local storage, keep small pieces of data on your device. This policy covers both.</p>
      <h2>Advertising cookies (Google AdSense)</h2><p>We use Google AdSense to show ads. Google and its partners use cookies to serve ads, limit how often you see the same ad, measure ad performance and, where allowed, show ads based on your visits to this and other websites. These cookies are set by Google, not by us.</p>
      <p>You can turn off personalized ads in <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, or opt out of some third-party vendors at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>. Read <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information from sites that use its services</a>.</p>
      <h2>Consent in the EEA, UK and Switzerland</h2><p>Visitors in these regions are asked for consent, through a Google consent message, before personalized ads are shown. You can accept or decline, and change your choice later.</p>
      <h2>Necessary storage</h2><p>If you create an account or sign in, our authentication provider (Supabase) stores a session token in your browser so you stay signed in. It is removed when you sign out. The microphone, camera, speaker and mouse testers do not need cookies to work.</p>
      <h2>No analytics tracking</h2><p>We do not currently use a separate analytics service on this website.</p>
      <h2>Managing cookies</h2><p>You can block or delete cookies in your browser settings. Blocking advertising cookies does not stop the testers from working; you may still see ads, but they will be less relevant. Blocking all storage will sign you out of your account.</p>
      <h2>Changes and contact</h2><p>We may update this policy when the services we use change. See also our <Link to="/privacy">privacy policy</Link>. Questions? Email {email}.</p>
    </>,
  },
};

export default function Information() {
  const page = content[useLocation().pathname] || content['/terms'];
  return <div className="page">
    <header className="page-hero"><div className="container">
      <span className="eyebrow">{page.eyebrow}</span>
      <h1>{page.title}</h1>
      <p className="lead">{page.lead}</p>
    </div></header>
    <div className="content-page"><article className="prose prose-panel">{page.body}</article>
    <div className="page-links"><Link to="/privacy" className="btn btn-ghost">Read the privacy policy</Link><Link to="/" className="btn btn-primary">Open the microphone tester</Link></div></div>
  </div>;
}
