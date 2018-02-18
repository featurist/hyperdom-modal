const hyperdom = require('hyperdom')
const h = hyperdom.html
const HyperdomModal = require('../src/hyperdom-modal')

class DemoApp {
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
          'button.button',
          {
            type: 'button',
            onclick: () => this.activateModal()
          },
          'Open Modal'
        )
      ),
      new HyperdomModal(
        {
          showModal: this.modalActive,
          onExit: this.deactivateModal
        },
        h(
          '.modal-content',
          h('h2.modal-heading', 'Modal Heading'),
          h('p', 'This is a modal with some custom styling.'),
          h(
            'button.button',
            {
              type: 'button',
              onclick: () => this.deactivateModal()
            },
            'Close Modal'
          )
        )
      )
    )
  }
}

hyperdom.append(document.getElementById('root'), new DemoApp())
