import { config } from 'dotenv';
import { posix, join } from 'path';
import { green, red } from 'chalk';
import { connectSSH } from './utils';

async function run() {
  config();

  const ssh = await connectSSH();

  const deployPath = process.env.DEPLOY_PATH as string;
  const releasesPath = posix.join(deployPath, 'releases');

  const [date, time] = new Date().toISOString().split('T');
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  const releaseFolder = `${year}${month}${day}${hours}${minutes}`;

  const releasePath = posix.join(releasesPath, releaseFolder);

  console.log(`Creating release dir "${releasePath}"`);
  await ssh.exec('mkdir', ['-p', releasePath]);
  console.log(green(`Created release dir!`));

  const rootLocalPath = join(__dirname, '..');
  const distLocalPath = join(rootLocalPath, 'build');
  const distRemotePath = posix.join(releasePath, 'build');

  console.log(`Copying "build" folder...`);
  await ssh.putDirectory(distLocalPath, distRemotePath, { recursive: true });
  console.log(green(`"build" folder copied!`));

  const relativeReleasePath = posix.join('releases', releaseFolder);

  console.log(`Switching current version...`);
  await ssh.exec('ln', ['-nfs', relativeReleasePath, 'current'], {
    cwd: deployPath,
  });
  console.log(green(`Current version is now ${releaseFolder}!`));

  const keepReleases = parseInt(process.env.DEPLOY_KEEP_RELEASES ?? '2');

  console.log(`Cleaning old releases (keeping ${keepReleases})...`);
  await ssh.execCommand(
    `(ls -rd ./*|head -n ${keepReleases}; ls -d ./*)|sort|uniq -u|xargs rm -rf`,
    { cwd: releasesPath },
  );
  console.log(green('Cleaned old releases!'));

  ssh.dispose();
}

(async () => {
  try {
    await run();
    process.exit(0);
  } catch (e) {
    console.log(red(e));
    process.exit(1);
  }
})();
