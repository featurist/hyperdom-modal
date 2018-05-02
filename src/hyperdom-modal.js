'use strict'

const hyperdom = require('hyperdom')
const h = hyperdom.html

module.exports = class Modal {
  outsideClickHandler(event, element) {
    if (event.target === element && this._isOpen) {
      element.close()
    }
  }

  open() {
    this._openBinding.set(true)
  }

  close() {
    this._isProgrammaticClose = true
    this._openBinding.set(false)
  }

  cancel() {
    this._isProgrammaticClose = true
    this._onCancel()
    this._openBinding.set(false)
  }

  render(options) {
    const hasOptions = options && options.constructor === Object
    var content = Array.prototype.slice.call(arguments, hasOptions ? 1 : 0)
    const { openBinding, dialogOptions, onCancel } = hasOptions ? options : {}
    this._openBinding = hyperdom.binding(openBinding || [this, '_binding'])
    this._onCancel = onCancel || (() => {})

    const closeHandler = () => {
      if (this._isProgrammaticClose) {
        delete this._isProgrammaticClose
      } else {
        this._onCancel()
        this._isOpen = false
        this._openBinding.set(false)
      }
    }

    return {
      onadd: element => {
        const dialogPolyfill = require('dialog-polyfill')
        dialogPolyfill.registerDialog(element)
        element.addEventListener('close', closeHandler)
        element.addEventListener('click', event => {
          this.outsideClickHandler(event, element)
        })
      },

      onrender: element => {
        showModalOrClose(this, element)
      },

      render: () => {
        return h('dialog', dialogOptions, content)
      }
    }
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
