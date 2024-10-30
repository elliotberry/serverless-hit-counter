/**
 * Copyright (c) 2016 Hideki Shiro
 */

import * as opentype from 'opentype.js';

function parseAnchorOption(anchor) {
  const horizontalMatch = anchor.match(/left|center|right/gi);
  const verticalMatch = anchor.match(/baseline|top|bottom|middle/gi);

  return {
    horizontal: horizontalMatch ? horizontalMatch[0] : 'left',
    vertical: verticalMatch ? verticalMatch[0] : 'baseline',
  };
}

class TextToSVG {
  constructor(buffer) {
    this.font = opentype.parse(buffer); 
  }

  getWidth(text, options) {
    const fontSize = options.fontSize || 72;
    const kerning = options.kerning !== undefined ? options.kerning : true;
    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    const letterSpacing = options.letterSpacing || 0;
    const tracking = options.tracking || 0;

    let width = 0;
    const glyphs = this.font.stringToGlyphs(text);

    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i];
      if (glyph.advanceWidth) {
        width += glyph.advanceWidth * fontScale;
      }

      if (kerning && i < glyphs.length - 1) {
        width += this.font.getKerningValue(glyph, glyphs[i + 1]) * fontScale;
      }

      width += letterSpacing * fontSize + (tracking / 1000) * fontSize;
    }

    return width;
  }

  getHeight(fontSize) {
    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    return (this.font.ascender - this.font.descender) * fontScale;
  }

  getMetrics(text, options = {}) {
    const fontSize = options.fontSize || 72;
    const anchor = parseAnchorOption(options.anchor || '');
    const width = this.getWidth(text, options);
    const height = this.getHeight(fontSize);

    const fontScale = (1 / this.font.unitsPerEm) * fontSize;
    const ascender = this.font.ascender * fontScale;
    const descender = this.font.descender * fontScale;

    let x = options.x || 0;
    switch (anchor.horizontal) {
      case 'center':
        x -= width / 2;
        break;
      case 'right':
        x -= width;
        break;
    }

    let y = options.y || 0;
    switch (anchor.vertical) {
      case 'baseline':
        y -= ascender;
        break;
      case 'middle':
        y -= height / 2;
        break;
      case 'bottom':
        y -= height;
        break;
    }

    const baseline = y + ascender;

    return {x, y, baseline, width, height, ascender, descender};
  }

  getD(text, options = {}) {
    const fontSize = options.fontSize || 72;
    const kerning = options.kerning !== undefined ? options.kerning : true;
    const letterSpacing = options.letterSpacing || 0;
    const tracking = options.tracking || 0;
    const metrics = this.getMetrics(text, options);

    const path = this.font.getPath(text, metrics.x, metrics.baseline, fontSize, {kerning, letterSpacing, tracking});
    return path.toPathData();
  }

  getPath(text, options = {}) {
    const attributes = Object.keys(options.attributes || {})
      .map(key => `${key}="${options.attributes[key]}"`)
      .join(' ');
    const d = this.getD(text, options);

    return attributes ? `<path ${attributes} d="${d}"/>` : `<path d="${d}"/>`;
  }

  getSVG(text, options = {}) {
    const metrics = this.getMetrics(text, options);
    let svg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${metrics.width}" height="${metrics.height}">`;
    svg += this.getPath(text, options);
    svg += '</svg>';

    return svg;
  }
}

export default TextToSVG;
