const hyperdom = require('hyperdom')
const h = hyperdom.html
const HyperdomModal = require('../src/hyperdom-modal')

class DemoApp {
  constructor() {
    this._favourite = 'undecided'
    this._choosing = false
    this._modal = new HyperdomModal(
      {
        openBinding: [this, '_choosing'],
        options: { class: 'modal' }
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
            onclick: () => this._modal.toggle()
          },
          'Confirm'
        ),
        h(
          'button',
          {
            onclick: () => {
              this._favourite = this._previousFavourite
              this._modal.toggle()
            }
          },
          'Cancel'
        )
      )
    )
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
        h('p', 'Your favourite animal is: ', this._favourite),
        h(
          'button',
          {
            onclick: () => {
              this._previousFavourite = this._favourite
              this._modal.toggle()
            }
          },
          'Choose an animal'
        )
      ),
      this._modal
    )
  }
}

hyperdom.append(document.getElementById('root'), new DemoApp())
