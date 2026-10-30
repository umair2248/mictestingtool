// Builds the site and uploads the contents of dist to Hostinger over SSH.
// Connection settings come from .env.deploy (see .env.deploy.example).
// The live public_html is backed up on the server before every deploy, and
// files that are not part of the build (such as public_html/api) are left alone.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const envFile = join(root, '.env.deploy');

if (!existsSync(envFile)) {
  console.error('Missing .env.deploy. Copy .env.deploy.example and fill in your Hostinger SSH details.');
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

const { DEPLOY_HOST, DEPLOY_USER, DEPLOY_PORT = '65002', DEPLOY_PATH = 'domains/mictestingtool.com/public_html' } = env;
if (!DEPLOY_HOST) {
  console.error('DEPLOY_HOST must be set in .env.deploy.');
  process.exit(1);
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', cwd: root });
// DEPLOY_HOST may be a Host alias from ~/.ssh/config, in which case DEPLOY_USER can stay empty.
const target = DEPLOY_USER ? `${DEPLOY_USER}@${DEPLOY_HOST}` : DEPLOY_HOST;
const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
const archiveName = `deploy-${stamp}.tar.gz`;
// Kept relative to the project root: tar and scp read "C:\..." as a remote host name.
const archive = archiveName;

if (!process.argv.includes('--skip-build')) {
  execFileSync('npm run build', { stdio: 'inherit', cwd: root, shell: true });
}

console.log(`\nPackaging dist -> ${archive}`);
run('tar', ['-czf', archive, '--exclude=./.vite', '-C', 'dist', '.']);

try {
  console.log(`Uploading to ${target}:${DEPLOY_PORT}`);
  run('scp', ['-P', DEPLOY_PORT, archive, `${target}:~/${archiveName}`]);

  const remote = [
    'set -e',
    `cd ~`,
    `mkdir -p deploy-backups`,
    `tar -czf deploy-backups/public_html-${stamp}.tar.gz -C "${DEPLOY_PATH}" .`,
    `tar -xzf ${archiveName} -C "${DEPLOY_PATH}"`,
    `rm -f ${archiveName}`,
    // Keep the five most recent backups.
    `ls -1t deploy-backups/public_html-*.tar.gz | tail -n +6 | xargs -r rm -f`,
    `echo "Deployed to $HOME/${DEPLOY_PATH} (backup: deploy-backups/public_html-${stamp}.tar.gz)"`,
  ].join(' && ');
  run('ssh', ['-p', DEPLOY_PORT, target, remote]);
} finally {
  rmSync(join(root, archive), { force: true });
}

console.log('\nDone. Clear the Hostinger/CDN cache if changes do not show up.');
