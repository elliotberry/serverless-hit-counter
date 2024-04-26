

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
		await incrementCounter(env);

		// Get current hit count
		const count = await getCurrentCount(env);
	  
		const textToSVG = TextToSVG.loadSync();

const attributes = {fill: 'red', stroke: 'black'};
const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};

const svg = textToSVG.getSVG('hello', options);
	  
		// Return SVG response
		return new Response(svg, {
		  headers: {
			'Content-Type': 'image/svg+xml',
		  },
		});
		
	},
};
