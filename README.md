[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/tutorial-toast.svg)](https://www.npmjs.com/package/@advanced-rest-client/tutorial-toast)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-url-data-model.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/tutorial-toast)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/tutorial-toast)

# tutorial-toast

An on screen minimal tutorial.

```html
<tutorial-toast>
  <p>This is a tutorial for the page. Take a hint.</p>
</tutorial-toast>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/tutorial-toast
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/tutorial-toast/tutorial-toast.js';
    </script>
  </head>
  <body>
    <tutorial-toast></tutorial-toast>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/tutorial-toast/tutorial-toast.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
      <tutorial-toast></tutorial-toast>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/tutorial-toast
cd tutorial-toast
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
