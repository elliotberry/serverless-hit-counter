import opentype from './ot/src/opentype.js';

class TextToSVG {
  constructor(font, options = {}) {
    this.fontURL = font;
    this.font = undefined;
    this.baseOptions = { fontSize: 42, anchor: {horizontal: 'center', vertical: 'middle'}, kerning: true, x: 0, y: 0, fontSize: 72, attributes: {fill: 'red', stroke: 'black'}};
    this.options = Object.assign({}, this.baseOptions, options);
  }
  parseAnchorOption(anchor) {
    let horizontal = anchor.match(/left|center|right/gi) || [];
    horizontal = horizontal.length === 0 ? 'left' : horizontal[0];

    let vertical = anchor.match(/baseline|top|bottom|middle/gi) || [];
    vertical = vertical.length === 0 ? 'baseline' : vertical[0];

    return {horizontal, vertical};
  }
  async init() {
    // case 1: from an URL
    if (this.fontURL === 'string') {
      const buffer = await fetch(this.fontURL).then(res => res.arrayBuffer());
      const font = opentype.parse(buffer);
      this.font = font;
    } else {
      let font = opentype.parse(this.fontURL);
      this.font = font;
    }
  }

  getWidth(text) {
   
    const {fontSize, kerning} = this.options;
    const fontScale = (1 / this.font.unitsPerEm) * fontSize;

    let width = 0;
    const glyphs = this.font.stringToGlyphs(text);

    glyphs.forEach((glyph, i) => {
      if (glyph.advanceWidth) {
        width += glyph.advanceWidth * fontScale;
      }

      if (kerning && i < glyphs.length - 1) {
        const kerningValue = this.font.getKerningValue(glyph, glyphs[i + 1]);
        width += kerningValue * fontScale;
      }

      if (this.options.letterSpacing) {
        width += this.options.letterSpacing * fontSize;
      } else if (this.options.tracking) {
        width += (this.options.tracking / 1000) * fontSize;
      }
    });

    return width;
  }

  getHeight(fontSize) {
    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    return (this.font.ascender - this.font.descender) * fontScale;
  }

  getMetrics(text) {


    let {fontSize, anchor, x, y} = this.options;

    const width = this.getWidth(text, this.options);
    const height = this.getHeight(fontSize);

    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    const ascender = this.font.ascender * fontScale;
    const descender = this.font.descender * fontScale;

    switch (anchor.horizontal) {
      case 'left':
        x -= 0;
        break;
      case 'center':
        x -= width / 2;
        break;
      case 'right':
        x -= width;
        break;
      default:
        throw new Error(`Unknown anchor option: ${anchor.horizontal}`);
    }

    switch (anchor.vertical) {
      case 'baseline':
        y -= ascender;
        break;
      case 'top':
        y -= 0;
        break;
      case 'middle':
        y -= height / 2;
        break;
      case 'bottom':
        y -= height;
        break;
      default:
        throw new Error(`Unknown anchor option: ${anchor.vertical}`);
    }

    const baseline = y + ascender;

    return {
      x,
      y,
      baseline,
      width,
      height,
      ascender,
      descender,
    };
  }

  getD(text) {
  

    const {fontSize, kerning, letterSpacing, tracking} = this.options;
    const metrics = this.getMetrics(text, this.options);

    const path = this.font.getPath(text, metrics.x, metrics.baseline, fontSize, { kerning, letterSpacing, tracking });

    return path.toPathData();
  }

  getPath(text) {
   
    const attributes = Object.keys(this.options.attributes || {})
      .map(key => `${key}="${this.options.attributes[key]}"`)
      .join(' ');
    const d = this.getD(text, this.options);

    if (attributes) {
      return `<path ${attributes} d="${d}"/>`;
    }

    return `<path d="${d}"/>`;
  }

  getSVG(text) {
 
    const metrics = this.getMetrics(text, this.options);
    console.log(metrics);
    let thePath = this.getPath(text, this.options);
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${metrics.width} ${metrics.height}">${thePath}</svg>`;
  

    return svg;
  }
}

export default TextToSVG;
