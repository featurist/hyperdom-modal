'use strict'

const hyperdom = require('hyperdom')
const h = hyperdom.html
const dialogPolyfill = require('dialog-polyfill')

module.exports = class Modal {
  constructor({ showModal = false, onExit, rootClass = 'modal' }, content) {
    this._showModal = showModal
    this._onExit = onExit
    this._rootClass = rootClass
    this._content = content
  }

  onrender(element) {
    dialogPolyfill.registerDialog(element)

    if (this._showModal && !element.hasAttribute('open')) {
      element.showModal()
    }

    element.addEventListener('cancel', () => {
      this._onExit()
    })

    element.addEventListener('click', event => {
      if (event.target === element) {
        element.close()
        this._onExit()
      }
    })
  }

  render() {
    return h('dialog', { class: this._rootClass }, this._content)
  }
}
