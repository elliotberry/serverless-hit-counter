import TextToSVG from './ttsvg3.js';

//import opentype from './ot/src/opentype.js';
import fs from 'fs/promises';
const main = async () => {
  let buffer = await fs.readFile('./ocra.ttf');
  // const buffer = await fetch('https://i5.walmartimages.com/dfw/63fd9f59-fc5c/2944989e-f5a8-4ad3-b44c-cf1f9af7a22c/v2/en-US/_next/static/media/ui-icons.132f6a3d.woff').then(res => res.arrayBuffer());
  const textToSVG = TextToSVG.loadSync(buffer);
 
  const attributes = {fill: 'red', stroke: 'black'};
  const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};
   
  const svg = textToSVG.getSVG('hello', options);
 await fs.writeFile(`./test.svg`, svg);
  console.log(`Wrote to .svg`);
};

main();
