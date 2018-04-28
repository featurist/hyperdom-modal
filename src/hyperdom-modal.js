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
  }

  render() {
    const open = this._openBinding.get()
    const options = open
      ? optionsWithOpenAttribute(this._options)
      : this._options
    return h('dialog', options, this._content)
  }
}

function optionsWithOpenAttribute(options) {
  const merged = {}
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.apply(options, key)) {
      merged[key] = options[key]
    }
  }
  merged.attributes = merged.attributes || {}
  merged.attributes.open = true
  return merged
}
