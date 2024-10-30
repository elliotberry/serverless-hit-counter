import TextToSVG from './text-to-svg.js';
import {Router, cors, withParams} from 'itty-router';
import fontBuffer from './font.js';
import withURLParams from './with-url-params.js';
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

const makeSVG = async (text, env, opts) => {
  const {fontSize, fill} = opts;
  const buffer = fontBuffer;
  const textToSVG = new TextToSVG(buffer);

  const options = {x: 0, y: 0, fontSize: fontSize, anchor: 'top', attributes: {fill: fill}};

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

router.get('/:key', withParams, withURLParams, async (req, env) => {
  const key = req.params.key;
  const value = await incrementCounter(env, key);
  let userOpts = {};
  let defaultOpts = {fontSize: 24, fill: 'black'};
  if (req.paramz.size) {
    userOpts.fontSize = req.paramz.size;
  }
  if (req.paramz.fill) {
    userOpts.fill = req.paramz.fill;
  }
  const opts = Object.assign(defaultOpts, req.paramz);
  const svg = await makeSVG(`${value}`, env, opts);

  // Return SVG response
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
});

export default router;
