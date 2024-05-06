import TextToSVG from './text-to-svg.js';

import opentype from './ot/src/opentype.js';
import fs from 'fs/promises';
const main = async () => {
  let buffer = await fs.readFile('./g.ttf');
  // const buffer = await fetch('https://i5.walmartimages.com/dfw/63fd9f59-fc5c/2944989e-f5a8-4ad3-b44c-cf1f9af7a22c/v2/en-US/_next/static/media/ui-icons.132f6a3d.woff').then(res => res.arrayBuffer());

  const textToSVG = new TextToSVG(buffer);
  await textToSVG.init();

  const svg = textToSVG.getSVG('hello');

  await fs.writeFile('./test.svg', svg);
};

main();
