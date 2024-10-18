# serverless-hit-counter
![](https://hits.s0.rs/example)

**(^this is an actual example)**

![serverless-hit-counter Logo](./logo.jpeg)

## Overview

serverless-hit-counter is a serverless implementation of the classic hit-counter widget, reminiscent of the Geocities era. Uses Cloudflare Workers to expose a path, representing a unique key, that increments a hit counter each time it is accessed. The hit count is rendered as an SVG image in the cloud and returned to the client as an image, which can then be embedded in any website.

## Features

- itty-router is awesome
- CORS

### Endpoints

- **GET /**: Returns an SVG with the text "Hello, World!".
- **GET /:key**: Increments the hit counter for the specified `key` and returns an SVG displaying the current count.

### Example Integration

example SVG image using an `<img>` tag:

```html
<img src="https://hits.s0.rs/your-key" alt="Hit Counter">
```

You'll have to create a KV namespace in Cloudflare Workers called ttf and upload a font to it.

## Acknowledgments

- a heavily-modified text-to-svg is used in this project. Thanks to Hideki Shiro, as this is their work.
- Thanks to [Jan Bobrowski](https://github.com/jan-bobrowski) for the seven-segment display font.
