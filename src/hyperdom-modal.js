'use strict'

const hyperdom = require('hyperdom')
const h = hyperdom.html

module.exports = class Modal {
  constructor() {
    const firstArgumentIsOptions =
      typeof arguments[0] === 'object' &&
      typeof arguments[0].tagName === 'undefined'
    const { openBinding, dialogOptions, onCancel } = firstArgumentIsOptions
      ? arguments[0]
      : {}
    this._openBinding = hyperdom.binding(openBinding || [this, '_binding'])
    this._dialogOptions = dialogOptions
    this._onCancel = onCancel || (() => {})
    this._content = [].slice.call(arguments, firstArgumentIsOptions ? 1 : 0)

    this._closeHandler = () => {
      if (this._isProgrammaticClose) {
        delete this._isProgrammaticClose
      } else {
        this._onCancel()
        this._isOpen = false
        this._openBinding.set(false)
        this.refreshImmediately()
      }
    }
  }

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

  onrender(element) {
    const dialogPolyfill = require('dialog-polyfill')
    dialogPolyfill.registerDialog(element)
    element.removeEventListener('close', this._closeHandler)
    element.addEventListener('close', this._closeHandler)
    showModalOrClose(this, element)

    element.removeEventListener('click', event => {
      this.outsideClickHandler(event, element)
    })
    element.addEventListener('click', event => {
      this.outsideClickHandler(event, element)
    })
  }

  render() {
    return h('dialog', this._dialogOptions, this._content)
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
