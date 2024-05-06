import TextToSVG from './text-to-svg.js';

async function incrementCounter(env) {
  let currentValue = await env.kv.get('count');
  let newValue = 1;
  if (currentValue) {
    newValue = parseInt(currentValue) + 1;
  }
  await env.kv.put('count', newValue.toString());
}

async function getCurrentCount(env) {
  const value = await env.kv.get('count');
  return value ? parseInt(value) : 0;
}

function renderSVG(count) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="50">
      <text x="10" y="30" font-family="Arial" font-size="16">
        Hits: ${count}
      </text>
    </svg>
  `;
}

export default {
  async fetch(request, env, ctx) {
    // Increment hit counter
   // await incrementCounter(env);

    // Get current hit count
    //const count = await getCurrentCount(env);

    const textToSVG = new TextToSVG('https://i5.walmartimages.com/dfw/63fd9f59-fc5c/2944989e-f5a8-4ad3-b44c-cf1f9af7a22c/v2/en-US/_next/static/media/ui-icons.132f6a3d.woff');
    await textToSVG.init();

  
    const svg = textToSVG.getSVG('hello');
let g = textToSVG.getD('hello');
console.log(g);
    // Return SVG response
    return new Response(svg, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  },
};
