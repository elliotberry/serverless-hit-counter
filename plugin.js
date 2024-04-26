import { transform } from 'esbuild';

const cloudflareWorkerFetch = `
  // Cloudflare Workers fetch function implementation
  async function fetch(url, options) {
    // Your custom fetch implementation here
  }
`;

export default function cloudflareWorkerPlugin() {
  return {
    name: 'cloudflare-worker-plugin',
    setup(build) {
      build.onResolve({ filter: /path|fs/ }, (args) => {
        // Resolve 'path' and 'fs' imports to a synthetic module
        return { path: args.path, namespace: 'cloudflare-worker' };
      });

      build.onLoad({ filter: /.*/, namespace: 'cloudflare-worker' }, async (args) => {
        // Replace 'path' and 'fs' imports with Cloudflare Workers fetch function
        return {
          contents: cloudflareWorkerFetch,
          loader: 'js',
        };
      });
    },
  };
}

// Example usage:
async function main() {
  const result = await transform(code, {
    plugins: [cloudflareWorkerPlugin()],
  });
  console.log(result.code);
}

main();
