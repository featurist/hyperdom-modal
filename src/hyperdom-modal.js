'use strict'

const hyperdom = require('hyperdom')
const h = hyperdom.html
const dialogPolyfill = require('dialog-polyfill')

module.exports = class Modal {
  constructor({ showModal = false, rootClass = 'modal' }, content) {
    this._showModal = showModal
    this._rootClass = rootClass
    this._content = content
  }

  onrender(element) {
    // Register element with polyfill
    dialogPolyfill.registerDialog(element)

    // Trigger native modal show or close
    if (this._showModal) {
      element.showModal()
    } else {
      element.close()
    }

    // Close when clicking on modal or backdrop
    element.addEventListener('click', event => {
      if (event.target === element) {
        element.close('cancelled')
      }
    })
  }

  render() {
    return h('dialog', { class: this._rootClass }, this._content)
  }
}
