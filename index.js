import TextToSVG from './ttsvg3.js';

import { AutoRouter, cors, withParams } from 'itty-router'

// get preflight and corsify pair
const { preflight, corsify } = cors()

const router = AutoRouter({
  before: [preflight],  // add preflight upstream
  finally: [corsify],   // and corsify downstream
})

async function incrementCounter(env, key) {
  let currentValue = await env.kv.get(`${key}-count`);
  let newValue = 1;
  if (currentValue) {
    newValue = parseInt(currentValue) + 1;
  }

  await env.kv.put(`${key}-count`, newValue.toString());
  return newValue;
}

const makeSVG = async (text, env) => {
  let buffer = await env.ttf.get('test.ttf', {type: 'arrayBuffer'});
  const textToSVG = TextToSVG.loadSync(buffer);

  const attributes = {fill: 'red', stroke: 'black'};
  const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};

  const svg = textToSVG.getSVG(text, options);
  return svg;
}


router.get('/', async (req, env, ctx) => {
  let svg = await makeSVG('Hello, World!', env);
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
})

router.get('/:key', withParams, async (req, env, ctx) => {
  let key = req.params.key;
  let value = await incrementCounter(env, key);

  let svg = await makeSVG(`${value}`, env);

  // Return SVG response
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
});

export default router;
