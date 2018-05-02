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

Instantiate a modal in your constructor then call `.render()` method where you want it on the page.
The `<dialog>` will always be rendered to the page regardless of whether it's open or not.

Pass modal content to this method or options first and then the content. Example:

### JS

```js
const hyperdom = require('hyperdom')
const h = hyperdom.html
const HyperdomModal = require('hyperdom-modal')

class DemoApp {
  constructor() {
    this._favourite = 'undecided'
    this._choosing = false
    this._title = 'World'

    this._modal1 = new HyperdomModal()
    this._modal2 = new HyperdomModal()
  }

  render() {
    return h(
      'main.container',
      h(
        'h1.text-center',
        h(
          'a',
          { href: 'https://github.com/featurist/hyperdom-modal' },
          'Hyperdom Modal'
        ),
        ' Demo'
      ),
      h(
        '.text-center',
        h(
          'button',
          {
            onclick: () => this._modal1.open()
          },
          'Greet me'
        )
      ),
      h(
        '.text-center',
        h('p', 'Your favourite animal is: ', this._favourite),
        h(
          'button',
          {
            onclick: () => {
              this._previousFavourite = this._favourite
              this._modal2.open()
            }
          },
          'Choose an animal'
        )
      ),
      h(
        '.text-center',
        h(
          'button',
          {
            onclick: () => {
              this._title = 'Brand New World'
              this._modal1.open()
            }
          },
          'Update title and open modal'
        )
      ),
      this._modal1.render(
        h(
          '.modal-content',
          h('h2.modal-heading', `Hello ${this._title}!`),
          h(
            'button',
            {
              onclick: () => this._modal1.close()
            },
            'Goodbye!'
          )
        )
      ),
      this._modal2.render(
        {
          openBinding: [this, '_choosing'],
          onCancel: () => {
            this._favourite = this._previousFavourite
          },
          dialogOptions: { class: 'modal' }
        },
        h(
          '.modal-content',
          h('h2.modal-heading', 'Choose your favourite!'),
          h('p', 'What is your favourite animal?'),
          h(
            'p',
            h(
              'select',
              { binding: [this, '_favourite'] },
              h('option', 'undecided'),
              h('option', 'cat'),
              h('option', 'dog')
            )
          ),
          h(
            'button',
            {
              onclick: () => this._modal2.close()
            },
            'Confirm'
          ),
          h(
            'button',
            {
              onclick: () => this._modal2.cancel()
            },
            'Cancel'
          )
        )
      )
    )
  }
}

hyperdom.append(document.getElementById('root'), new DemoApp())
```

### CSS

Supported browsers provide their own default styles for the modal and backdrop. **You must include the polyfill stylesheet in your app for unsupported browsers** to achieve the same default behaviour. You can include it from this package at `node_modules/hyperdom-modal/dist/dialog-polyfill.css`

You can add styles to override the defaults and style the content passed in to your modal. [Example stylesheet](demo/css/modal.css).

## Options

|      Name       |    Type    | Default | Description                                                                         |
| :-------------: | :--------: | :-----: | :---------------------------------------------------------------------------------- |
|  `openBinding`  | `binding`  | `none`  | A hyperdom binding that determines whether the modal window is open                 |
| `dialogOptions` |  `object`  | `none`  | Any options such as attributes or event handlers passed to the `<dialog>` element   |
|   `onCancel`    | `function` | `none`  | A function that is called when the modal dialog is closed e.g. using the escape key |

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
