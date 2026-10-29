import { Link, useLocation } from 'react-router-dom';
export default function Information() {
  const security = useLocation().pathname === '/security';
  return <div className="page">
    <header className="page-hero"><div className="container">
      <span className="eyebrow">{security ? 'Security' : 'Legal'}</span>
      <h1>{security ? 'Security and recording privacy' : 'Terms of use'}</h1>
      <p className="lead">{security ? 'How microphone permissions, local recording and account security work on Mic Testing Tool.' : 'The rules for using the free browser microphone tester, including its measurement limits.'}</p>
    </div></header>
    <div className="content-page"><article className="prose prose-panel">
      {security ? <>
        <h2>Microphone permissions</h2><p>The tester requests access only when you start a test. Your browser controls this permission, and you can revoke it in site settings. Stop the test to release the microphone.</p>
        <h2>Local audio processing</h2><p>Test audio is recorded and played back in your browser. The microphone tester does not upload recordings. Downloaded files remain on your device; take care when sharing them.</p>
        <h2>Account safety</h2><p>Account sign-in uses Supabase authentication. Use a unique password and sign out on shared devices. Never send passwords or authentication codes in a support message.</p>
        <h2>Report a concern</h2><p>Email <a href="mailto:support@mictestingtool.com">support@mictestingtool.com</a> with the affected URL and steps to reproduce the issue. Do not include other people’s private data or recordings.</p>
      </> : <>
        <h2>Using the tester</h2><p>You may use this free tool to check microphones you are authorized to use. Obtain consent before recording anyone else. Do not use the website to publish unlawful content or interfere with other users.</p>
        <h2>Measurement limitations</h2><p>The tool provides a relative input meter, browser audio information, recording, and playback. It does not measure calibrated sound pressure or end-to-end latency, and is not a substitute for professional or safety-critical audio measurement equipment.</p>
        <h2>Availability and your recordings</h2><p>Browser and device compatibility varies. We cannot guarantee uninterrupted availability or that the tester will identify every hardware problem. You are responsible for keeping copies of recordings you choose to download.</p>
        <h2>Accounts and articles</h2><p>Keep your account credentials private. Article publishing is restricted to authorized administrators. Do not upload content you do not have permission to publish.</p>
        <h2>Questions</h2><p>For help with these terms or the service, email <a href="mailto:support@mictestingtool.com">support@mictestingtool.com</a>.</p>
      </>}
    </article>
    <div className="page-links"><Link to="/privacy" className="btn btn-ghost">Read the privacy policy</Link><Link to="/" className="btn btn-primary">Open the microphone tester</Link></div></div>
  </div>;
}
