import ttsvg from 'text-to-svg';


const make = async () => {
  // Load font file from URL
  const fontURL = 'https://webapps1.chicago.gov/cdn/Fonts/fontawesome-webfont.ttf'; // Replace with the actual URL of your font file
  const response = await fetch(fontURL);
  const fontBuffer = await response.arrayBuffer();

  // Convert font buffer to base64
  //const fontBase64 = Buffer.from(fontBuffer).toString('base64');
  const buffer = Buffer.from(fontBuffer);
  //const fontDataURI = `data:font/truetype;base64,${fontBase64}`;
  //const fontBuffer = await response.arrayBuffer();

  // Convert font buffer to Blob
 // const fontBlob = new Blob([fontBuffer]);
  // Configure text-to-svg with the fetched font
  const textToSVG = ttsvg.loadSync(buffer);

  const attributes = { fill: 'red', stroke: 'black' };
  const options = { x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes };

  const svg = textToSVG.getSVG('hello', options);

  return svg;
};
const test = async () => {
  const svg = await make();
  console.log(svg);
};
test();
export default make;
