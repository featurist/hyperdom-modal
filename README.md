# Hyperdom Modal [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Accessible modal component built with [Hyperdom](https://github.com/featurist/hyperdom)

* Uses `<dialog>` element by default and loads [a polyfill](https://github.com/GoogleChrome/dialog-polyfill) for older browsers
* No need to worry about `z-index` since modal opens on its own layer
* By default modal expands its dimensions to fit your content - adds styles to limit dimensions
* Modal HTML is returned straight away to your app (rather than returning on show) and hidden with CSS. The `open` attribute is added to the `<dialog>` to reveal it

[**View Demo**](https://featurist.github.io/hyperdom-modal/demo/)

## Installation

```sh
$ yarn add hyperdom-modal
```

## Usage

### JS

```js
const hyperdom = require('hyperdom')
const h = hyperdom.html
const HyperdomModal = require('hyperdom-modal')

class YourApp {
  constructor() {
    this.modalActive = false
  }

  activateModal() {
    this.modalActive = true
  }

  deactivateModal() {
    this.modalActive = false
  }

  render() {
    return h(
      'div',
      h(
        'button',
        {
          type: 'button',
          onclick: () => this.activateModal()
        },
        'Open Modal'
      ),
      new HyperdomModal(
        {
          showModal: this.modalActive
        },
        h(
          'div',
          h('h2', 'Modal Heading'),
          h('p', 'This is modal content.'),
          h(
            'button',
            {
              type: 'button',
              onclick: () => this.deactivateModal()
            },
            'Close'
          )
        )
      )
    )
  }
}

hyperdom.append(document.getElementById('root'), new YourApp())
```

### CSS

Supported browsers provide their own default styles for the modal and backdrop. **You must include the [polyfill stylesheet](https://github.com/GoogleChrome/dialog-polyfill/blob/master/dialog-polyfill.css) in your app for unsupported browsers** to achieve the same default behaviour.

You can add styles to override the defaults and style the content passed in to your modal. [Example stylesheet](demo/css/modal.css).

## Options

|    Name     |   Type    |  Default  | Description                                          |
| :---------: | :-------: | :-------: | :--------------------------------------------------- |
| `showModal` | `Boolean` |  `false`  | Trigger the modal displaying on the page             |
| `rootClass` | `String`  | `'modal'` | Override the default class on the root modal element |

## More About `<dialog>`

* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
* https://keithjgrant.com/posts/2018/meet-the-new-dialog-element/
* https://demo.agektmr.com/dialog/

## License

MIT © [Featurist Ltd](https://www.featurist.co.uk/)

[npm-image]: https://badge.fury.io/js/hyperdom-modal.svg
[npm-url]: https://npmjs.org/package/hyperdom-modal
[daviddm-image]: https://david-dm.org/Featurist/hyperdom-modal.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Featurist/hyperdom-modal

## We're Hiring!

Join our remote team and help us build amazing software. Check out [our career opportunities](https://www.featurist.co.uk/careers/).
