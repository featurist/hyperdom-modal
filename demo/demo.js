const hyperdom = require('hyperdom')
const h = hyperdom.html
const HyperdomModal = require('../src/hyperdom-modal')

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
