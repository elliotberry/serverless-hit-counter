import { build } from 'esbuild';
import cloudflareWorkerPlugin from './plugin.js';

async function bundle() {
  await build({
    entryPoints: ['makesvg.js'],
    outfile: 'dist/bundle.js',
    plugins: [cloudflareWorkerPlugin()],
  });
}

bundle().catch((err) => {
  console.error(err);
  process.exit(1);
});
