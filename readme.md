[//]: <> (Hello! You may be wondering, why is this heading a `h1` instead of a `#` MD heading? Because i use Markdown All in One for VS Code, which complained about the fact that I didn't signal a heading in the table of contents.)
<h1>React + TypeScript SSR Application Boilerplate</h1>

> All 100s in [Lighthouse](https://developers.google.com/web/tools/lighthouse/) (with fireworks since [5.1.0](https://github.com/GoogleChrome/lighthouse/releases/tag/v5.1.0/) 😁)!

[![language: TypeScript](https://img.shields.io/static/v1.svg?label=language&message=TypeScript&labelColor=152740&color=294e80&style=flat-square&logo=typescript&logoColor=0074c1)](https://github.com/styled-components/styled-components)
[![frontend: React](https://img.shields.io/static/v1.svg?label=frontend&message=React&labelColor=20232a&color=282c34&style=flat-square&logo=react)](https://github.com/styled-components/styled-components)
[![backend: restify](https://img.shields.io/static/v1.svg?label=backend&message=restify&labelColor=000000&color=91F200&style=flat-square)](https://github.com/styled-components/styled-components)
[![style: styled-components](https://img.shields.io/static/v1.svg?label=style&message=%F0%9F%92%85%20styled-components&labelColor=db748e&color=daa357&style=flat-square)](https://github.com/styled-components/styled-components)

This is a boilerplate project, set up for writing a server-side rendered PWA with React + TypeScript, styled with [styled-components](https://www.styled-components.com/). It uses [React Router DOM](https://reacttraining.com/react-router/web/) for routing and [React Helmet](https://github.com/nfl/react-helmet#readme) as a document head manager.

*Note: at this point, server-side caching is not supported. But, after all, do you really need to cache a PWA's content on the server? In the end, your clients are only ever going to request a server-side rendered page on their first visit, or when you decide to update your service worker cache (on the client). Nonetheless, I'll try to make server-side caching possible (you can see some comments in `src/server/servers/app/index.tsx` in which I lay down a basic concept for caching).*

- [Getting started](#Getting-started)
- [Building your app](#Building-your-app)
  - [Development](#Development)
  - [Production](#Production)
- [Running your app](#Running-your-app)
  - [Server-side rendering](#Server-side-rendering)
  - [Client-side rendering](#Client-side-rendering)
- [The build's output, in detail](#The-builds-output-in-detail)

## Getting started
To use this boilerplate, just clone (or simply download) the repository to your computer, and install the required dependencies with `npm i` (or `npm install`). Then change what you need to change in `package.json` (package name, author, etc. – but not the license!).

## Building your app
> Feel free to tweak the webpack configuration to your needs!

### Development
For quick development, you can `npm start` (or `npm run hot:start`). This will fire up an instance `webpack-dev-server`, which will allow to see the changes you make to your code as soon as you make them. Note that this approach will neither have server-side rendering, nor the service worker.

If, instead, you want to try server-side rendering or check out the service worker, but still maintain the ability to debug with source maps in the browser, you can `npm run development:dist`. This will build client, server and service worker, giving you a production-like experience with all debugging tools at your disposal. *The server uses a self-signed certificate for `localhost`, which is located in `ssl/development`. You may want to install it beforehand, or replace it with your own.*

### Production
Creating a production build is as easy as running `npm run production:dist`. This will generate an output very similar to the one that is output by `development:dist`, but with production optimizations and without debugging tools such as source maps. *In production mode, the server uses the certificate located in `ssl/production`. Be aware that, because it is specific to your own domain name, __the certificate is not provided by default__.*

## Running your app
### Server-side rendering
Whether you created a development or a production build, you can `npm run ssr:start` to launch a Restify server that will render the app before sending it to the client.

### Client-side rendering
This boilerplate's main purpose is server-side rendering, but you can disable it if you don't want to create your own server and just host static files. To do so, just delete `index.html` and `ssr.bundle.js` and rename `index.csr.html` to `index.html`.
> Just a reminder: don't forget to reroute all traffic to `index.html` if you choose client-side rendering!

## The build's output, in detail
Note that you probably don't care about this, but, in case you really did, here is a more detailed explanation of what is output when building the app:
- `dist/public`, which contains files that look like they can all be served statically, but some shouldn't: the files `index.html` `ssr.bundle.js` are actually used for server-side rendering, so serving these files statically will result in an error, as the bundle calls `ReactDOM.hydrate`, which requires the app's root to already contain rendered HTML. To render your app solely on the client side, see [Client side rendering](#Client-side-rendering).
- `dist/server`: this directory actually contains the JavaScript files that run the server. They create a server with [Restify](http://restify.com/), and, for each request, dynamically render the app with `ReactDOM/server`'s `renderToNodeStream` function, which allows for a very low TTFB (time to first byte).
- `dist/client`, that just contains the unbundled files for the client. These are imported by the server to render the app.
