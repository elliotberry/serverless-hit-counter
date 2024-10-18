import TextToSVG from './text-to-svg.js';
import {Router, cors, withParams} from 'itty-router';
import fontBuffer from './font.js';

// get preflight and corsify pair
const {preflight, corsify} = cors({
  origin: '*',
  allowMethods: ['GET'],
});

const router = Router({
  before: [preflight], 
  finally: [corsify],
});

async function incrementCounter(env, key) {
  const currentValue = await env.kv.get(`${key}-count`);
  const newValue = currentValue ? parseInt(currentValue) + 1 : 1;

  await env.kv.put(`${key}-count`, newValue.toString());
  return newValue;
}

const makeSVG = async (text, env) => {
  const buffer = fontBuffer;
  const textToSVG = new TextToSVG(buffer);

  const options = {x: 0, y: 0, fontSize: 24, anchor: 'top', attributes: {fill: 'black'}};

  return textToSVG.getSVG(text, options);
};



router.get('/', async (req, env, ctx) => {
  const svg = await makeSVG('Hello, World!', env);
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
});

router.get('/:key', withParams, async (req, env, ctx) => {
  const key = req.params.key;
  const value = await incrementCounter(env, key);

  const svg = await makeSVG(`${value}`, env);

  // Return SVG response
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
});

export default router;
