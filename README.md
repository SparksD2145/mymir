Mymir
=====

A personable contacts book assistant which takes its name from the norse mythological figure [Mimir]. Built ontop of [API.ai]'s machine learning services.

## Getting Started
You'll need to build Mymir before running it for the first time. This is a rather straightforward process:

```bash
# Clone the repository
git clone git@github.com:SparksD2145/mymir.git; cd mymir;

# Install Dependencies
npm install;

# Perform build
npm run build;

# Run project
npm start;
```

Mymir needs SSL certificates for production deployment. For local development, the http protocol is fine. To use HTTPS, toggle the `enabled` boolean for `SSLConfig` under `src/config/config.default.ts` and rebuild.

You will need to import the Mymir agent into your API.ai account and set a fulfillment endpoint for this to work correctly.


## Video Demonstration
A video demonstration of the service can be found at: https://youtu.be/2993GLkDqfM






[API.ai]: https://api.ai
[Mimir]: https://en.wikipedia.org/wiki/M%C3%ADmir
