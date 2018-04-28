'use strict'

const hyperdom = require('hyperdom')
const h = hyperdom.html

module.exports = class Modal {
  constructor({ openBinding, options }, content) {
    this._openBinding = hyperdom.binding(openBinding)
    this._options = options
    this._content = content
  }

  toggle() {
    this._openBinding.set(!this._openBinding.get())
  }

  onrender(element) {
    const dialogPolyfill = require('dialog-polyfill')
    dialogPolyfill.registerDialog(element)
    showModalOrClose(this, element)
  }

  onupdate(element) {
    showModalOrClose(this, element)
  }

  render() {
    return h('dialog', this._options, this._content)
  }
}

function showModalOrClose(modal, element) {
  const wasOpen = modal._isOpen
  modal._isOpen = modal._openBinding.get()
  if (modal._isOpen && !wasOpen) {
    element.showModal()
  } else if (wasOpen && !modal._isOpen) {
    element.close()
  }
}
