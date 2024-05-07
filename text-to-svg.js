import opentype from './ot/src/opentype.js';
import calc from './calc.js';
class TextToSVG {
  constructor(font, options = {}) {
    this.fontURL = font;
    this.font = undefined;
    this.baseOptions = {fontSize: 42, x: 0, y: 0, fontSize: 72, attributes: {fill: 'red', stroke: 'black'}};
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
    let options = this.options;
    const fontSize = options.fontSize || 72;
    const anchor = this.parseAnchorOption(options.anchor || '');

    const width = this.getWidth(text, options);
    const height = this.getHeight(fontSize);

    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    const ascender = this.font.ascender * fontScale;
    const descender = this.font.descender * fontScale;

    let x = options.x || 0;
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

    let y = options.y || 0;
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
    let options = this.options;
    const fontSize = options.fontSize || 72;
    const kerning = 'kerning' in options ? options.kerning : true;
    const letterSpacing = 'letterSpacing' in options ? options.letterSpacing : false;
    const tracking = 'tracking' in options ? options.tracking : false;
    const metrics = this.getMetrics(text, options);
    const path = this.font.getPath(text, metrics.x, metrics.baseline, fontSize, {kerning, letterSpacing, tracking});

    return path.toPathData();
  }
  getPath(text) {
    let options = this.options;
    const attributes = Object.keys(options.attributes || {})
      .map(key => `${key}="${options.attributes[key]}"`)
      .join(' ');
    const d = this.getD(text, options);

    if (attributes) {
      return `<path ${attributes} d="${d}"/>`;
    }

    return `<path d="${d}"/>`;
  }
  getSVG(text) {
    const metrics = this.getMetrics(text);

    let thePath = this.getPath(text);

    let svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 ${metrics.width} ${metrics.height}">${thePath}</svg>`;

    return svg;
  }
}

export default TextToSVG;
