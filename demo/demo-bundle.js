(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hyperdom = require('hyperdom');
var h = hyperdom.html;
var HyperdomModal = require('../src/hyperdom-modal');

var DemoApp = function () {
  function DemoApp() {
    _classCallCheck(this, DemoApp);

    this.modalActive = false;
  }

  _createClass(DemoApp, [{
    key: 'activateModal',
    value: function activateModal() {
      this.modalActive = true;
    }
  }, {
    key: 'deactivateModal',
    value: function deactivateModal() {
      this.modalActive = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      return h('main.container', h('h1.text-center', h('a', { href: 'https://github.com/featurist/hyperdom-modal' }, 'Hyperdom Modal'), ' Demo'), h('.text-center', h('button.button', {
        type: 'button',
        onclick: function onclick() {
          return _this.activateModal();
        }
      }, 'Open Modal')), new HyperdomModal({
        showModal: this.modalActive
      }, h('.text-center', h('h2.modal-heading', 'Modal Heading'), h('p', 'This is a modal with some custom styling.'), h('button.button', {
        type: 'button',
        onclick: function onclick() {
          return _this.deactivateModal();
        }
      }, 'Close Modal'))));
    }
  }]);

  return DemoApp;
}();

hyperdom.append(document.getElementById('root'), new DemoApp());

},{"../src/hyperdom-modal":57,"hyperdom":12}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],4:[function(require,module,exports){
(function() {

  // nb. This is for IE10 and lower _only_.
  var supportCustomEvent = window.CustomEvent;
  if (!supportCustomEvent || typeof supportCustomEvent === 'object') {
    supportCustomEvent = function CustomEvent(event, x) {
      x = x || {};
      var ev = document.createEvent('CustomEvent');
      ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null);
      return ev;
    };
    supportCustomEvent.prototype = window.Event.prototype;
  }

  /**
   * @param {Element} el to check for stacking context
   * @return {boolean} whether this el or its parents creates a stacking context
   */
  function createsStackingContext(el) {
    while (el && el !== document.body) {
      var s = window.getComputedStyle(el);
      var invalid = function(k, ok) {
        return !(s[k] === undefined || s[k] === ok);
      }
      if (s.opacity < 1 ||
          invalid('zIndex', 'auto') ||
          invalid('transform', 'none') ||
          invalid('mixBlendMode', 'normal') ||
          invalid('filter', 'none') ||
          invalid('perspective', 'none') ||
          s['isolation'] === 'isolate' ||
          s.position === 'fixed' ||
          s.webkitOverflowScrolling === 'touch') {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  /**
   * Finds the nearest <dialog> from the passed element.
   *
   * @param {Element} el to search from
   * @return {HTMLDialogElement} dialog found
   */
  function findNearestDialog(el) {
    while (el) {
      if (el.localName === 'dialog') {
        return /** @type {HTMLDialogElement} */ (el);
      }
      el = el.parentElement;
    }
    return null;
  }

  /**
   * Blur the specified element, as long as it's not the HTML body element.
   * This works around an IE9/10 bug - blurring the body causes Windows to
   * blur the whole application.
   *
   * @param {Element} el to blur
   */
  function safeBlur(el) {
    if (el && el.blur && el !== document.body) {
      el.blur();
    }
  }

  /**
   * @param {!NodeList} nodeList to search
   * @param {Node} node to find
   * @return {boolean} whether node is inside nodeList
   */
  function inNodeList(nodeList, node) {
    for (var i = 0; i < nodeList.length; ++i) {
      if (nodeList[i] === node) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {HTMLFormElement} el to check
   * @return {boolean} whether this form has method="dialog"
   */
  function isFormMethodDialog(el) {
    if (!el || !el.hasAttribute('method')) {
      return false;
    }
    return el.getAttribute('method').toLowerCase() === 'dialog';
  }

  /**
   * @param {!HTMLDialogElement} dialog to upgrade
   * @constructor
   */
  function dialogPolyfillInfo(dialog) {
    this.dialog_ = dialog;
    this.replacedStyleTop_ = false;
    this.openAsModal_ = false;

    // Set a11y role. Browsers that support dialog implicitly know this already.
    if (!dialog.hasAttribute('role')) {
      dialog.setAttribute('role', 'dialog');
    }

    dialog.show = this.show.bind(this);
    dialog.showModal = this.showModal.bind(this);
    dialog.close = this.close.bind(this);

    if (!('returnValue' in dialog)) {
      dialog.returnValue = '';
    }

    if ('MutationObserver' in window) {
      var mo = new MutationObserver(this.maybeHideModal.bind(this));
      mo.observe(dialog, {attributes: true, attributeFilter: ['open']});
    } else {
      // IE10 and below support. Note that DOMNodeRemoved etc fire _before_ removal. They also
      // seem to fire even if the element was removed as part of a parent removal. Use the removed
      // events to force downgrade (useful if removed/immediately added).
      var removed = false;
      var cb = function() {
        removed ? this.downgradeModal() : this.maybeHideModal();
        removed = false;
      }.bind(this);
      var timeout;
      var delayModel = function(ev) {
        if (ev.target !== dialog) { return; }  // not for a child element
        var cand = 'DOMNodeRemoved';
        removed |= (ev.type.substr(0, cand.length) === cand);
        window.clearTimeout(timeout);
        timeout = window.setTimeout(cb, 0);
      };
      ['DOMAttrModified', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument'].forEach(function(name) {
        dialog.addEventListener(name, delayModel);
      });
    }
    // Note that the DOM is observed inside DialogManager while any dialog
    // is being displayed as a modal, to catch modal removal from the DOM.

    Object.defineProperty(dialog, 'open', {
      set: this.setOpen.bind(this),
      get: dialog.hasAttribute.bind(dialog, 'open')
    });

    this.backdrop_ = document.createElement('div');
    this.backdrop_.className = 'backdrop';
    this.backdrop_.addEventListener('click', this.backdropClick_.bind(this));
  }

  dialogPolyfillInfo.prototype = {

    get dialog() {
      return this.dialog_;
    },

    /**
     * Maybe remove this dialog from the modal top layer. This is called when
     * a modal dialog may no longer be tenable, e.g., when the dialog is no
     * longer open or is no longer part of the DOM.
     */
    maybeHideModal: function() {
      if (this.dialog_.hasAttribute('open') && document.body.contains(this.dialog_)) { return; }
      this.downgradeModal();
    },

    /**
     * Remove this dialog from the modal top layer, leaving it as a non-modal.
     */
    downgradeModal: function() {
      if (!this.openAsModal_) { return; }
      this.openAsModal_ = false;
      this.dialog_.style.zIndex = '';

      // This won't match the native <dialog> exactly because if the user set top on a centered
      // polyfill dialog, that top gets thrown away when the dialog is closed. Not sure it's
      // possible to polyfill this perfectly.
      if (this.replacedStyleTop_) {
        this.dialog_.style.top = '';
        this.replacedStyleTop_ = false;
      }

      // Clear the backdrop and remove from the manager.
      this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_);
      dialogPolyfill.dm.removeDialog(this);
    },

    /**
     * @param {boolean} value whether to open or close this dialog
     */
    setOpen: function(value) {
      if (value) {
        this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '');
      } else {
        this.dialog_.removeAttribute('open');
        this.maybeHideModal();  // nb. redundant with MutationObserver
      }
    },

    /**
     * Handles clicks on the fake .backdrop element, redirecting them as if
     * they were on the dialog itself.
     *
     * @param {!Event} e to redirect
     */
    backdropClick_: function(e) {
      if (!this.dialog_.hasAttribute('tabindex')) {
        // Clicking on the backdrop should move the implicit cursor, even if dialog cannot be
        // focused. Create a fake thing to focus on. If the backdrop was _before_ the dialog, this
        // would not be needed - clicks would move the implicit cursor there.
        var fake = document.createElement('div');
        this.dialog_.insertBefore(fake, this.dialog_.firstChild);
        fake.tabIndex = -1;
        fake.focus();
        this.dialog_.removeChild(fake);
      } else {
        this.dialog_.focus();
      }

      var redirectedEvent = document.createEvent('MouseEvents');
      redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window,
          e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey,
          e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
      this.dialog_.dispatchEvent(redirectedEvent);
      e.stopPropagation();
    },

    /**
     * Focuses on the first focusable element within the dialog. This will always blur the current
     * focus, even if nothing within the dialog is found.
     */
    focus_: function() {
      // Find element with `autofocus` attribute, or fall back to the first form/tabindex control.
      var target = this.dialog_.querySelector('[autofocus]:not([disabled])');
      if (!target && this.dialog_.tabIndex >= 0) {
        target = this.dialog_;
      }
      if (!target) {
        // Note that this is 'any focusable area'. This list is probably not exhaustive, but the
        // alternative involves stepping through and trying to focus everything.
        var opts = ['button', 'input', 'keygen', 'select', 'textarea'];
        var query = opts.map(function(el) {
          return el + ':not([disabled])';
        });
        // TODO(samthor): tabindex values that are not numeric are not focusable.
        query.push('[tabindex]:not([disabled]):not([tabindex=""])');  // tabindex != "", not disabled
        target = this.dialog_.querySelector(query.join(', '));
      }
      safeBlur(document.activeElement);
      target && target.focus();
    },

    /**
     * Sets the zIndex for the backdrop and dialog.
     *
     * @param {number} dialogZ
     * @param {number} backdropZ
     */
    updateZIndex: function(dialogZ, backdropZ) {
      if (dialogZ < backdropZ) {
        throw new Error('dialogZ should never be < backdropZ');
      }
      this.dialog_.style.zIndex = dialogZ;
      this.backdrop_.style.zIndex = backdropZ;
    },

    /**
     * Shows the dialog. If the dialog is already open, this does nothing.
     */
    show: function() {
      if (!this.dialog_.open) {
        this.setOpen(true);
        this.focus_();
      }
    },

    /**
     * Show this dialog modally.
     */
    showModal: function() {
      if (this.dialog_.hasAttribute('open')) {
        throw new Error('Failed to execute \'showModal\' on dialog: The element is already open, and therefore cannot be opened modally.');
      }
      if (!document.body.contains(this.dialog_)) {
        throw new Error('Failed to execute \'showModal\' on dialog: The element is not in a Document.');
      }
      if (!dialogPolyfill.dm.pushDialog(this)) {
        throw new Error('Failed to execute \'showModal\' on dialog: There are too many open modal dialogs.');
      }

      if (createsStackingContext(this.dialog_.parentElement)) {
        console.warn('A dialog is being shown inside a stacking context. ' +
            'This may cause it to be unusable. For more information, see this link: ' +
            'https://github.com/GoogleChrome/dialog-polyfill/#stacking-context');
      }

      this.setOpen(true);
      this.openAsModal_ = true;

      // Optionally center vertically, relative to the current viewport.
      if (dialogPolyfill.needsCentering(this.dialog_)) {
        dialogPolyfill.reposition(this.dialog_);
        this.replacedStyleTop_ = true;
      } else {
        this.replacedStyleTop_ = false;
      }

      // Insert backdrop.
      this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling);

      // Focus on whatever inside the dialog.
      this.focus_();
    },

    /**
     * Closes this HTMLDialogElement. This is optional vs clearing the open
     * attribute, however this fires a 'close' event.
     *
     * @param {string=} opt_returnValue to use as the returnValue
     */
    close: function(opt_returnValue) {
      if (!this.dialog_.hasAttribute('open')) {
        throw new Error('Failed to execute \'close\' on dialog: The element does not have an \'open\' attribute, and therefore cannot be closed.');
      }
      this.setOpen(false);

      // Leave returnValue untouched in case it was set directly on the element
      if (opt_returnValue !== undefined) {
        this.dialog_.returnValue = opt_returnValue;
      }

      // Triggering "close" event for any attached listeners on the <dialog>.
      var closeEvent = new supportCustomEvent('close', {
        bubbles: false,
        cancelable: false
      });
      this.dialog_.dispatchEvent(closeEvent);
    }

  };

  var dialogPolyfill = {};

  dialogPolyfill.reposition = function(element) {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2;
    element.style.top = Math.max(scrollTop, topValue) + 'px';
  };

  dialogPolyfill.isInlinePositionSetByStylesheet = function(element) {
    for (var i = 0; i < document.styleSheets.length; ++i) {
      var styleSheet = document.styleSheets[i];
      var cssRules = null;
      // Some browsers throw on cssRules.
      try {
        cssRules = styleSheet.cssRules;
      } catch (e) {}
      if (!cssRules) { continue; }
      for (var j = 0; j < cssRules.length; ++j) {
        var rule = cssRules[j];
        var selectedNodes = null;
        // Ignore errors on invalid selector texts.
        try {
          selectedNodes = document.querySelectorAll(rule.selectorText);
        } catch(e) {}
        if (!selectedNodes || !inNodeList(selectedNodes, element)) {
          continue;
        }
        var cssTop = rule.style.getPropertyValue('top');
        var cssBottom = rule.style.getPropertyValue('bottom');
        if ((cssTop && cssTop !== 'auto') || (cssBottom && cssBottom !== 'auto')) {
          return true;
        }
      }
    }
    return false;
  };

  dialogPolyfill.needsCentering = function(dialog) {
    var computedStyle = window.getComputedStyle(dialog);
    if (computedStyle.position !== 'absolute') {
      return false;
    }

    // We must determine whether the top/bottom specified value is non-auto.  In
    // WebKit/Blink, checking computedStyle.top == 'auto' is sufficient, but
    // Firefox returns the used value. So we do this crazy thing instead: check
    // the inline style and then go through CSS rules.
    if ((dialog.style.top !== 'auto' && dialog.style.top !== '') ||
        (dialog.style.bottom !== 'auto' && dialog.style.bottom !== '')) {
      return false;
    }
    return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog);
  };

  /**
   * @param {!Element} element to force upgrade
   */
  dialogPolyfill.forceRegisterDialog = function(element) {
    if (window.HTMLDialogElement || element.showModal) {
      console.warn('This browser already supports <dialog>, the polyfill ' +
          'may not work correctly', element);
    }
    if (element.localName !== 'dialog') {
      throw new Error('Failed to register dialog: The element is not a dialog.');
    }
    new dialogPolyfillInfo(/** @type {!HTMLDialogElement} */ (element));
  };

  /**
   * @param {!Element} element to upgrade, if necessary
   */
  dialogPolyfill.registerDialog = function(element) {
    if (!element.showModal) {
      dialogPolyfill.forceRegisterDialog(element);
    }
  };

  /**
   * @constructor
   */
  dialogPolyfill.DialogManager = function() {
    /** @type {!Array<!dialogPolyfillInfo>} */
    this.pendingDialogStack = [];

    var checkDOM = this.checkDOM_.bind(this);

    // The overlay is used to simulate how a modal dialog blocks the document.
    // The blocking dialog is positioned on top of the overlay, and the rest of
    // the dialogs on the pending dialog stack are positioned below it. In the
    // actual implementation, the modal dialog stacking is controlled by the
    // top layer, where z-index has no effect.
    this.overlay = document.createElement('div');
    this.overlay.className = '_dialog_overlay';
    this.overlay.addEventListener('click', function(e) {
      this.forwardTab_ = undefined;
      e.stopPropagation();
      checkDOM([]);  // sanity-check DOM
    }.bind(this));

    this.handleKey_ = this.handleKey_.bind(this);
    this.handleFocus_ = this.handleFocus_.bind(this);

    this.zIndexLow_ = 100000;
    this.zIndexHigh_ = 100000 + 150;

    this.forwardTab_ = undefined;

    if ('MutationObserver' in window) {
      this.mo_ = new MutationObserver(function(records) {
        var removed = [];
        records.forEach(function(rec) {
          for (var i = 0, c; c = rec.removedNodes[i]; ++i) {
            if (!(c instanceof Element)) {
              continue;
            } else if (c.localName === 'dialog') {
              removed.push(c);
            }
            removed = removed.concat(c.querySelectorAll('dialog'));
          }
        });
        removed.length && checkDOM(removed);
      });
    }
  };

  /**
   * Called on the first modal dialog being shown. Adds the overlay and related
   * handlers.
   */
  dialogPolyfill.DialogManager.prototype.blockDocument = function() {
    document.documentElement.addEventListener('focus', this.handleFocus_, true);
    document.addEventListener('keydown', this.handleKey_);
    this.mo_ && this.mo_.observe(document, {childList: true, subtree: true});
  };

  /**
   * Called on the first modal dialog being removed, i.e., when no more modal
   * dialogs are visible.
   */
  dialogPolyfill.DialogManager.prototype.unblockDocument = function() {
    document.documentElement.removeEventListener('focus', this.handleFocus_, true);
    document.removeEventListener('keydown', this.handleKey_);
    this.mo_ && this.mo_.disconnect();
  };

  /**
   * Updates the stacking of all known dialogs.
   */
  dialogPolyfill.DialogManager.prototype.updateStacking = function() {
    var zIndex = this.zIndexHigh_;

    for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
      dpi.updateZIndex(--zIndex, --zIndex);
      if (i === 0) {
        this.overlay.style.zIndex = --zIndex;
      }
    }

    // Make the overlay a sibling of the dialog itself.
    var last = this.pendingDialogStack[0];
    if (last) {
      var p = last.dialog.parentNode || document.body;
      p.appendChild(this.overlay);
    } else if (this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  };

  /**
   * @param {Element} candidate to check if contained or is the top-most modal dialog
   * @return {boolean} whether candidate is contained in top dialog
   */
  dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function(candidate) {
    while (candidate = findNearestDialog(candidate)) {
      for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
        if (dpi.dialog === candidate) {
          return i === 0;  // only valid if top-most
        }
      }
      candidate = candidate.parentElement;
    }
    return false;
  };

  dialogPolyfill.DialogManager.prototype.handleFocus_ = function(event) {
    if (this.containedByTopDialog_(event.target)) { return; }

    event.preventDefault();
    event.stopPropagation();
    safeBlur(/** @type {Element} */ (event.target));

    if (this.forwardTab_ === undefined) { return; }  // move focus only from a tab key

    var dpi = this.pendingDialogStack[0];
    var dialog = dpi.dialog;
    var position = dialog.compareDocumentPosition(event.target);
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      if (this.forwardTab_) {  // forward
        dpi.focus_();
      } else {  // backwards
        document.documentElement.focus();
      }
    } else {
      // TODO: Focus after the dialog, is ignored.
    }

    return false;
  };

  dialogPolyfill.DialogManager.prototype.handleKey_ = function(event) {
    this.forwardTab_ = undefined;
    if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      var cancelEvent = new supportCustomEvent('cancel', {
        bubbles: false,
        cancelable: true
      });
      var dpi = this.pendingDialogStack[0];
      if (dpi && dpi.dialog.dispatchEvent(cancelEvent)) {
        dpi.dialog.close();
      }
    } else if (event.keyCode === 9) {
      this.forwardTab_ = !event.shiftKey;
    }
  };

  /**
   * Finds and downgrades any known modal dialogs that are no longer displayed. Dialogs that are
   * removed and immediately readded don't stay modal, they become normal.
   *
   * @param {!Array<!HTMLDialogElement>} removed that have definitely been removed
   */
  dialogPolyfill.DialogManager.prototype.checkDOM_ = function(removed) {
    // This operates on a clone because it may cause it to change. Each change also calls
    // updateStacking, which only actually needs to happen once. But who removes many modal dialogs
    // at a time?!
    var clone = this.pendingDialogStack.slice();
    clone.forEach(function(dpi) {
      if (removed.indexOf(dpi.dialog) !== -1) {
        dpi.downgradeModal();
      } else {
        dpi.maybeHideModal();
      }
    });
  };

  /**
   * @param {!dialogPolyfillInfo} dpi
   * @return {boolean} whether the dialog was allowed
   */
  dialogPolyfill.DialogManager.prototype.pushDialog = function(dpi) {
    var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
    if (this.pendingDialogStack.length >= allowed) {
      return false;
    }
    if (this.pendingDialogStack.unshift(dpi) === 1) {
      this.blockDocument();
    }
    this.updateStacking();
    return true;
  };

  /**
   * @param {!dialogPolyfillInfo} dpi
   */
  dialogPolyfill.DialogManager.prototype.removeDialog = function(dpi) {
    var index = this.pendingDialogStack.indexOf(dpi);
    if (index === -1) { return; }

    this.pendingDialogStack.splice(index, 1);
    if (this.pendingDialogStack.length === 0) {
      this.unblockDocument();
    }
    this.updateStacking();
  };

  dialogPolyfill.dm = new dialogPolyfill.DialogManager();
  dialogPolyfill.formSubmitter = null;
  dialogPolyfill.useValue = null;

  /**
   * Installs global handlers, such as click listers and native method overrides. These are needed
   * even if a no dialog is registered, as they deal with <form method="dialog">.
   */
  if (window.HTMLDialogElement === undefined) {

    /**
     * If HTMLFormElement translates method="DIALOG" into 'get', then replace the descriptor with
     * one that returns the correct value.
     */
    var testForm = document.createElement('form');
    testForm.setAttribute('method', 'dialog');
    if (testForm.method !== 'dialog') {
      var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'method');
      if (methodDescriptor) {
        // TODO: older iOS and older PhantomJS fail to return the descriptor here
        var realGet = methodDescriptor.get;
        methodDescriptor.get = function() {
          if (isFormMethodDialog(this)) {
            return 'dialog';
          }
          return realGet.call(this);
        };
        var realSet = methodDescriptor.set;
        methodDescriptor.set = function(v) {
          if (typeof v === 'string' && v.toLowerCase() === 'dialog') {
            return this.setAttribute('method', v);
          }
          return realSet.call(this, v);
        };
        Object.defineProperty(HTMLFormElement.prototype, 'method', methodDescriptor);
      }
    }

    /**
     * Global 'click' handler, to capture the <input type="submit"> or <button> element which has
     * submitted a <form method="dialog">. Needed as Safari and others don't report this inside
     * document.activeElement.
     */
    document.addEventListener('click', function(ev) {
      dialogPolyfill.formSubmitter = null;
      dialogPolyfill.useValue = null;
      if (ev.defaultPrevented) { return; }  // e.g. a submit which prevents default submission

      var target = /** @type {Element} */ (ev.target);
      if (!target || !isFormMethodDialog(target.form)) { return; }

      var valid = (target.type === 'submit' && ['button', 'input'].indexOf(target.localName) > -1);
      if (!valid) {
        if (!(target.localName === 'input' && target.type === 'image')) { return; }
        // this is a <input type="image">, which can submit forms
        dialogPolyfill.useValue = ev.offsetX + ',' + ev.offsetY;
      }

      var dialog = findNearestDialog(target);
      if (!dialog) { return; }

      dialogPolyfill.formSubmitter = target;
    }, false);

    /**
     * Replace the native HTMLFormElement.submit() method, as it won't fire the
     * submit event and give us a chance to respond.
     */
    var nativeFormSubmit = HTMLFormElement.prototype.submit;
    function replacementFormSubmit() {
      if (!isFormMethodDialog(this)) {
        return nativeFormSubmit.call(this);
      }
      var dialog = findNearestDialog(this);
      dialog && dialog.close();
    }
    HTMLFormElement.prototype.submit = replacementFormSubmit;

    /**
     * Global form 'dialog' method handler. Closes a dialog correctly on submit
     * and possibly sets its return value.
     */
    document.addEventListener('submit', function(ev) {
      var form = /** @type {HTMLFormElement} */ (ev.target);
      if (!isFormMethodDialog(form)) { return; }
      ev.preventDefault();

      var dialog = findNearestDialog(form);
      if (!dialog) { return; }

      // Forms can only be submitted via .submit() or a click (?), but anyway: sanity-check that
      // the submitter is correct before using its value as .returnValue.
      var s = dialogPolyfill.formSubmitter;
      if (s && s.form === form) {
        dialog.close(dialogPolyfill.useValue || s.value);
      } else {
        dialog.close();
      }
      dialogPolyfill.formSubmitter = null;
    }, true);
  }

  dialogPolyfill['forceRegisterDialog'] = dialogPolyfill.forceRegisterDialog;
  dialogPolyfill['registerDialog'] = dialogPolyfill.registerDialog;

  if (typeof define === 'function' && 'amd' in define) {
    // AMD support
    define(function() { return dialogPolyfill; });
  } else if (typeof module === 'object' && typeof module['exports'] === 'object') {
    // CommonJS support
    module['exports'] = dialogPolyfill;
  } else {
    // all others
    window['dialogPolyfill'] = dialogPolyfill;
  }
})();

},{}],5:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":2}],6:[function(require,module,exports){
var listener = require('./listener')
var binding = require('./binding')
var RefreshHook = require('./render').RefreshHook

module.exports = function (tag, attributes, children) {
  var type = inputType(tag, attributes)
  var bind = inputTypeBindings[type] || bindTextInput

  bind(attributes, children, binding(attributes.binding))
}

var inputTypeBindings = {
  text: bindTextInput,

  textarea: bindTextInput,

  checkbox: function (attributes, children, binding) {
    attributes.checked = binding.get()

    attachEventHandler(attributes, 'onclick', function (ev) {
      attributes.checked = ev.target.checked
      return binding.set(ev.target.checked)
    }, binding)
  },

  radio: function (attributes, children, binding) {
    var value = attributes.value
    attributes.checked = binding.get() === attributes.value
    attributes.on_hyperdomsyncchecked = listener(function (event) {
      attributes.checked = event.target.checked
    })

    attachEventHandler(attributes, 'onclick', function (event) {
      var name = event.target.name
      if (name) {
        var inputs = document.getElementsByName(name)
        for (var i = 0, l = inputs.length; i < l; i++) {
          inputs[i].dispatchEvent(customEvent('_hyperdomsyncchecked'))
        }
      }
      return binding.set(value)
    }, binding)
  },

  select: function (attributes, children, binding) {
    var currentValue = binding.get()

    var options = children.filter(function (child) {
      return child.tagName && child.tagName.toLowerCase() === 'option'
    })

    var values = []
    var selectedIndex

    for (var n = 0; n < options.length; n++) {
      var option = options[n]
      var hasValue = option.properties.hasOwnProperty('value')
      var value = option.properties.value
      var text = option.children.map(function (x) { return x.text }).join('')

      values.push(hasValue ? value : text)

      var selected = hasValue ? value === currentValue : text === currentValue

      if (selected) {
        selectedIndex = n
      }

      option.properties.selected = selected
    }

    if (selectedIndex !== undefined) {
      attributes.selectedIndex = selectedIndex
    }

    attachEventHandler(attributes, 'onchange', function (ev) {
      attributes.selectedIndex = ev.target.selectedIndex
      return binding.set(values[ev.target.selectedIndex])
    }, binding)
  },

  file: function (attributes, children, binding) {
    var multiple = attributes.multiple

    attachEventHandler(attributes, 'onchange', function (ev) {
      if (multiple) {
        return binding.set(ev.target.files)
      } else {
        return binding.set(ev.target.files[0])
      }
    }, binding)
  }
}

function inputType (selector, attributes) {
  if (/^textarea\b/i.test(selector)) {
    return 'textarea'
  } else if (/^select\b/i.test(selector)) {
    return 'select'
  } else {
    return attributes.type || 'text'
  }
}

function bindTextInput (attributes, children, binding) {
  var textEventNames = ['onkeyup', 'oninput', 'onpaste', 'textInput']

  var bindingValue = binding.get()
  if (!(bindingValue instanceof Error)) {
    attributes.value = bindingValue !== undefined ? bindingValue : ''
  }

  attachEventHandler(attributes, textEventNames, function (ev) {
    if (binding.get() !== ev.target.value) {
      return binding.set(ev.target.value)
    }
  }, binding)
}

function attachEventHandler (attributes, eventNames, handler, binding) {
  if (eventNames instanceof Array) {
    for (var n = 0; n < eventNames.length; n++) {
      insertEventHandler(attributes, eventNames[n], handler)
    }
  } else {
    insertEventHandler(attributes, eventNames, handler)
  }
}

function insertEventHandler (attributes, eventName, handler) {
  var previousHandler = attributes[eventName]
  if (previousHandler) {
    attributes[eventName] = sequenceFunctions(handler, previousHandler)
  } else {
    attributes[eventName] = handler
  }
}

function sequenceFunctions (handler1, handler2) {
  return function (ev) {
    handler1(ev)
    if (handler2 instanceof RefreshHook) {
      return handler2.handler(ev)
    } else {
      return handler2(ev)
    }
  }
}

function customEvent (name) {
  if (typeof Event === 'function') {
    return new window.Event(name)
  } else {
    var event = document.createEvent('Event')
    event.initEvent(name, false, false)
    return event
  }
}

},{"./binding":7,"./listener":15,"./render":22}],7:[function(require,module,exports){
var meta = require('./meta')

module.exports = function (b) {
  var binding = b

  if (b instanceof Array) {
    binding = bindingObject.apply(undefined, b)
  } else if (b instanceof Object && (typeof b.set === 'function' || typeof b.get === 'function')) {
    binding = b
  } else {
    throw Error('hyperdom bindings must be either an array [object, property, setter] or an object { get(), set(value) }, instead binding was: ' + JSON.stringify(b))
  }

  return binding
}

function bindingObject (model, property, setter) {
  var _meta

  return {
    get: function () {
      return model[property]
    },

    set: function (value) {
      model[property] = value
      if (setter) {
        return setter(value)
      }
    },

    meta: function () {
      return _meta || (_meta = meta(model, property))
    }
  }
}

},{"./meta":16}],8:[function(require,module,exports){
var hyperdomMeta = require('./meta')
var render = require('./render')
var Vtext = require('virtual-dom/vnode/vtext.js')
var debuggingProperties = require('./debuggingProperties')

function Component (model, options) {
  this.isViewComponent = options && options.hasOwnProperty('viewComponent') && options.viewComponent
  this.model = model
  this.key = model.renderKey
  this.component = undefined
}

Component.prototype.type = 'Widget'

Component.prototype.init = function () {
  var self = this

  var vdom = this.render()

  var meta = hyperdomMeta(this.model)
  meta.components.add(this)

  var currentRender = render.currentRender()
  this.component = currentRender.mount.createDomComponent()
  var element = this.component.create(vdom)

  if (self.model.detached) {
    return document.createTextNode('')
  } else {
    return element
  }
}

function beforeUpdate (model, element) {
  if (model.onbeforeupdate) {
    model.onbeforeupdate(element)
  }

  if (model.onbeforerender) {
    model.onbeforerender(element)
  }
}

function afterUpdate (model, element, oldElement) {
  if (model.onupdate) {
    model.onupdate(element, oldElement)
  }

  if (model.onrender) {
    model.onrender(element, oldElement)
  }
}

Component.prototype.update = function (previous) {
  var self = this

  if (this.isViewComponent) {
    var keys = Object.keys(this.model)
    for (var n = 0; n < keys.length; n++) {
      var key = keys[n]
      previous.model[key] = self.model[key]
    }
    this.model = previous.model
  }

  this.component = previous.component
  var oldElement = this.component.element

  var element = this.component.update(this.render(oldElement))

  if (self.model.detached) {
    return document.createTextNode('')
  } else {
    return element
  }
}

Component.prototype.renderModel = function (oldElement) {
  var self = this
  var model = this.model
  var currentRender = render.currentRender()
  currentRender.mount.setupModelComponent(model)

  if (!oldElement) {
    if (self.model.onbeforeadd) {
      self.model.onbeforeadd()
    }
    if (self.model.onbeforerender) {
      self.model.onbeforerender()
    }

    if (self.model.onadd || self.model.onrender) {
      currentRender.finished.then(function () {
        if (self.model.onadd) {
          self.model.onadd(self.component.element)
        }
        if (self.model.onrender) {
          self.model.onrender(self.component.element)
        }
      })
    }
  } else {
    beforeUpdate(model, oldElement)

    if (model.onupdate || model.onrender) {
      currentRender.finished.then(function () {
        afterUpdate(model, self.component.element, oldElement)
      })
    }
  }

  var vdom = typeof model.render === 'function' ? model.render() : new Vtext(JSON.stringify(model))

  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array')
  }

  return debuggingProperties(vdom, model)
}

Component.prototype.render = function (oldElement) {
  var model = this.model

  var meta = hyperdomMeta(model)
  meta.lastRenderId = render.currentRender().mount.renderId

  if (typeof model.renderCacheKey === 'function') {
    var key = model.renderCacheKey()
    if (key !== undefined && meta.cacheKey === key && meta.cachedVdom) {
      return meta.cachedVdom
    } else {
      meta.cacheKey = key
      return (meta.cachedVdom = this.renderModel(oldElement))
    }
  } else {
    return this.renderModel(oldElement)
  }
}

Component.prototype.refresh = function () {
  var currentRender = render.currentRender()
  if (currentRender.mount.isComponentInDom(this.model)) {
    var oldElement = this.component.element
    beforeUpdate(this.model, oldElement)
    this.component.update(this.render())
    afterUpdate(this.model, this.component.element, oldElement)
  }
}

Component.prototype.destroy = function (element) {
  var self = this

  var meta = hyperdomMeta(this.model)
  meta.components.delete(this)

  if (self.model.onbeforeremove) {
    self.model.onbeforeremove(element)
  }

  if (self.model.onremove) {
    var currentRender = render.currentRender()
    currentRender.finished.then(function () {
      self.model.onremove(element)
    })
  }

  this.component.destroy()
}

module.exports = Component

},{"./debuggingProperties":9,"./meta":16,"./render":22,"virtual-dom/vnode/vtext.js":53}],9:[function(require,module,exports){
(function (process){
var runRender = require('./render')
var PropertyHook = require('./propertyHook')
var VirtualNode = require('virtual-dom/vnode/vnode')

module.exports = function (vdom, model) {
  if (process.env.NODE_ENV !== 'production' && vdom && vdom.constructor === VirtualNode) {
    if (!vdom.properties) {
      vdom.properties = {}
    }

    vdom.properties._hyperdomMeta = new PropertyHook({
      component: model,
      render: runRender.currentRender()
    })
  }

  return vdom
}

}).call(this,require('_process'))
},{"./propertyHook":19,"./render":22,"_process":31,"virtual-dom/vnode/vnode":51}],10:[function(require,module,exports){
(function (process){
function deprecationWarning () {
  var warningIssued = false

  return function (arg) {
    if (process.env.NODE_ENV !== 'production' && !warningIssued) {
      console.warn(arg) // eslint-disable-line no-console
      warningIssued = true
    }
  }
}

module.exports = {
  refresh: deprecationWarning(),
  currentRender: deprecationWarning(),
  component: deprecationWarning(),
  renderFunction: deprecationWarning(),
  norefresh: deprecationWarning(),
  mapBinding: deprecationWarning(),
  viewComponent: deprecationWarning(),
  htmlRawHtml: deprecationWarning(),
  htmlBinding: deprecationWarning(),
  refreshAfter: deprecationWarning()
}

}).call(this,require('_process'))
},{"_process":31}],11:[function(require,module,exports){
var createElement = require('virtual-dom/create-element')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var toVdom = require('./toVdom')
var isVdom = require('./isVdom')

function DomComponent (options) {
  this.document = options && options.document
}

function prepareVdom (object) {
  var vdom = toVdom(object)
  if (!isVdom(vdom)) {
    throw new Error('expected render to return vdom')
  } else {
    return vdom
  }
}

DomComponent.prototype.create = function (vdom) {
  this.vdom = prepareVdom(vdom)
  return (this.element = createElement(this.vdom, {document: this.document}))
}

DomComponent.prototype.merge = function (vdom, element) {
  this.vdom = prepareVdom(vdom)
  return (this.element = element)
}

DomComponent.prototype.update = function (vdom) {
  var oldVdom = this.vdom
  this.vdom = prepareVdom(vdom)
  var patches = diff(oldVdom, this.vdom)
  return (this.element = patch(this.element, patches))
}

DomComponent.prototype.destroy = function (options) {
  function destroyWidgets (vdom) {
    if (vdom.type === 'Widget') {
      vdom.destroy()
    } else if (vdom.children) {
      vdom.children.forEach(destroyWidgets)
    }
  }

  destroyWidgets(this.vdom)

  if (options && options.removeElement && this.element.parentNode) {
    this.element.parentNode.removeChild(this.element)
  }
}

function domComponent (options) {
  return new DomComponent(options)
}

exports.create = domComponent

},{"./isVdom":13,"./toVdom":26,"virtual-dom/create-element":32,"virtual-dom/diff":33,"virtual-dom/patch":34}],12:[function(require,module,exports){
var rendering = require('./rendering')
var render = require('./render')
var viewComponent = require('./viewComponent')
var deprecations = require('./deprecations')

exports.html = rendering.html
exports.html.refreshify = render.refreshify
exports.rawHtml = rendering.rawHtml
exports.jsx = rendering.jsx
exports.attach = rendering.attach
exports.replace = rendering.replace
exports.append = rendering.append
exports.appendVDom = rendering.appendVDom
exports.binding = require('./binding')
exports.meta = require('./meta')
exports.refreshify = render.refreshify
exports.norefresh = require('./refreshEventResult').norefresh
exports.join = require('./join')
exports.viewComponent = viewComponent
exports.component = function (model) {
  deprecations.viewComponent('hyperdom.component is deprecated, use hyperdom.viewComponent instead')
  return viewComponent(model)
}

exports.currentRender = render.currentRender

},{"./binding":7,"./deprecations":10,"./join":14,"./meta":16,"./refreshEventResult":21,"./render":22,"./rendering":23,"./viewComponent":28}],13:[function(require,module,exports){
var virtualDomVersion = require('virtual-dom/vnode/version')

module.exports = function (x) {
  var type = x.type
  if (type === 'VirtualNode' || type === 'VirtualText') {
    return x.version === virtualDomVersion
  } else {
    return type === 'Widget' || type === 'Thunk'
  }
}

},{"virtual-dom/vnode/version":50}],14:[function(require,module,exports){
module.exports = function join (array, separator) {
  var output = []
  for (var i = 0, l = array.length; i < l; i++) {
    var item = array[i]
    if (i > 0) {
      output.push(separator)
    }
    output.push(item)
  }
  return output
}

},{}],15:[function(require,module,exports){
var refreshify = require('./render').refreshify

function ListenerHook (listener) {
  this.listener = refreshify(listener)
}

ListenerHook.prototype.hook = function (element, propertyName) {
  element.addEventListener(propertyName.substring(2), this.listener, false)
}

ListenerHook.prototype.unhook = function (element, propertyName) {
  element.removeEventListener(propertyName.substring(2), this.listener)
}

module.exports = function (listener) {
  return new ListenerHook(listener)
}

},{"./render":22}],16:[function(require,module,exports){
module.exports = function (model, property) {
  var hyperdomMeta = model._hyperdomMeta

  if (!hyperdomMeta) {
    hyperdomMeta = {}
    Object.defineProperty(model, '_hyperdomMeta', {value: hyperdomMeta})
  }

  if (property) {
    var meta = hyperdomMeta[property]

    if (!meta) {
      meta = hyperdomMeta[property] = {}
    }

    return meta
  } else {
    return hyperdomMeta
  }
}

},{}],17:[function(require,module,exports){
var hyperdomMeta = require('./meta')
var runRender = require('./render')
var domComponent = require('./domComponent')
var Set = require('./set')
var refreshEventResult = require('./refreshEventResult')

var lastId = 0

function Mount (model, options) {
  var win = (options && options.window) || window
  var router = typeof options === 'object' && options.hasOwnProperty('router') ? options.router : undefined
  this.requestRender = (options && options.requestRender) || win.requestAnimationFrame || win.setTimeout

  this.document = (options && options.document) || document
  this.model = model

  this.renderQueued = false
  this.mountRenderRequested = false
  this.componentRendersRequested = undefined
  this.id = ++lastId
  this.renderId = 0
  this.mounted = true
  this.router = router
}

Mount.prototype.refreshify = function (fn, options) {
  if (!fn) {
    return fn
  }

  if (options && (options.norefresh === true || options.refresh === false)) {
    return fn
  }

  var self = this

  return function () {
    var result = fn.apply(this, arguments)
    return refreshEventResult(result, self, options)
  }
}

Mount.prototype.transformFunctionAttribute = function (key, value) {
  return this.refreshify(value)
}

Mount.prototype.queueRender = function () {
  if (!this.renderQueued) {
    var self = this

    var requestRender = this.requestRender
    this.renderQueued = true

    requestRender(function () {
      self.renderQueued = false

      if (self.mounted) {
        if (self.mountRenderRequested) {
          self.refreshImmediately()
        } else if (self.componentRendersRequested) {
          self.refreshComponentsImmediately()
        }
      }
    })
  }
}

Mount.prototype.createDomComponent = function () {
  return domComponent.create({ document: this.document })
}

Mount.prototype.render = function () {
  if (this.router) {
    return this.router.render(this.model)
  } else {
    return this.model
  }
}

Mount.prototype.refresh = function () {
  this.mountRenderRequested = true
  this.queueRender()
}

Mount.prototype.refreshImmediately = function () {
  var self = this

  runRender(self, function () {
    self.renderId++
    var vdom = self.render()
    self.component.update(vdom)
    self.mountRenderRequested = false
  })
}

Mount.prototype.refreshComponentsImmediately = function () {
  var self = this

  runRender(self, function () {
    for (var i = 0, l = self.componentRendersRequested.length; i < l; i++) {
      var w = self.componentRendersRequested[i]
      w.refresh()
    }
    self.componentRendersRequested = undefined
  })
}

Mount.prototype.refreshComponent = function (component) {
  if (!this.componentRendersRequested) {
    this.componentRendersRequested = []
  }

  this.componentRendersRequested.push(component)
  this.queueRender()
}

Mount.prototype.isComponentInDom = function (component) {
  var meta = hyperdomMeta(component)
  return meta.lastRenderId === this.renderId
}

Mount.prototype.setupModelComponent = function (model) {
  var self = this

  var meta = hyperdomMeta(model)

  if (!meta.mount) {
    meta.mount = this
    meta.components = new Set()

    model.refresh = function () {
      self.refresh()
    }

    model.refreshImmediately = function () {
      self.refreshImmediately()
    }

    model.refreshComponent = function () {
      var meta = hyperdomMeta(this)
      meta.components.forEach(function (w) {
        self.refreshComponent(w)
      })
    }

    if (typeof model.onload === 'function') {
      this.refreshify(function () { return model.onload() }, {refresh: 'promise'})()
    }
  }
}

Mount.prototype.detach = function () {
  this.mounted = false
}

Mount.prototype.remove = function () {
  if (this.router) {
    this.router.reset()
  }
  this.component.destroy({removeElement: true})
  this.mounted = false
}

module.exports = Mount

},{"./domComponent":11,"./meta":16,"./refreshEventResult":21,"./render":22,"./set":24}],18:[function(require,module,exports){
(function (process){
var render = require('./render')
var bindModel = require('./bindModel')

module.exports = function (tag, attributes, childElements) {
  var dataset
  var currentRender = render.currentRender()

  if (attributes.binding) {
    bindModel(tag, attributes, childElements)
    delete attributes.binding
  }

  var keys = Object.keys(attributes)
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k]
    var attribute = attributes[key]

    if (typeof (attribute) === 'function' && currentRender) {
      attributes[key] = currentRender.transformFunctionAttribute(key, attribute)
    }

    var rename = renames[key]
    if (rename) {
      attributes[rename] = attribute
      delete attributes[key]
      continue
    }

    if (dataAttributeRegex.test(key)) {
      if (!dataset) {
        dataset = attributes.dataset

        if (!dataset) {
          dataset = attributes.dataset = {}
        }
      }

      var datakey = key
        .replace(dataAttributeRegex, '')
        .replace(/-([a-z])/ig, function (_, x) { return x.toUpperCase() })

      dataset[datakey] = attribute
      delete attributes[key]
      continue
    }
  }

  if (process.env.NODE_ENV !== 'production' && attributes.__source) {
    if (!dataset) {
      dataset = attributes.dataset

      if (!dataset) {
        dataset = attributes.dataset = {}
      }
    }

    dataset.fileName = attributes.__source.fileName
    dataset.lineNumber = attributes.__source.lineNumber
  }

  if (attributes.className) {
    attributes.className = generateClassName(attributes.className)
  }

  return attributes
}

var renames = {
  for: 'htmlFor',
  class: 'className',
  contenteditable: 'contentEditable',
  tabindex: 'tabIndex',
  colspan: 'colSpan'
}

var dataAttributeRegex = /^data-/

function generateClassName (obj) {
  if (typeof (obj) === 'object') {
    if (obj instanceof Array) {
      var names = obj.map(function (item) {
        return generateClassName(item)
      })
      return names.join(' ') || undefined
    } else {
      return generateConditionalClassNames(obj)
    }
  } else {
    return obj
  }
}

function generateConditionalClassNames (obj) {
  return Object.keys(obj).filter(function (key) {
    return obj[key]
  }).join(' ') || undefined
}

}).call(this,require('_process'))
},{"./bindModel":6,"./render":22,"_process":31}],19:[function(require,module,exports){
function PropertyHook (value) {
  this.value = value
}

PropertyHook.prototype.hook = function (element, property) {
  element[property] = this.value
}

PropertyHook.prototype.unhook = function (element, property) {
  delete element[property]
}

module.exports = PropertyHook

},{}],20:[function(require,module,exports){
var render = require('./render')
var refreshEventResult = require('./refreshEventResult')

module.exports = function (promise) {
  refreshEventResult(promise, render.currentRender().mount, {refresh: 'promise'})
}

},{"./refreshEventResult":21,"./render":22}],21:[function(require,module,exports){
var deprecations = require('./deprecations')

module.exports = refreshEventResult

var norefresh = {}

function norefreshFunction () {
  return norefresh
}

module.exports.norefresh = norefreshFunction

function refreshEventResult (result, mount, options) {
  var onlyRefreshAfterPromise = options && options.refresh === 'promise'
  var componentToRefresh = options && options.component

  if (result && typeof (result.then) === 'function') {
    result.then(function (result) {
      var opts = cloneOptions(options)
      opts.refresh = undefined
      refreshEventResult(result, mount, opts)
    })
  }

  if (onlyRefreshAfterPromise) {
    return
  }

  if (isComponent(result)) {
    mount.refreshComponent(result)
  } else if (result instanceof Array) {
    for (var i = 0; i < result.length; i++) {
      refreshEventResult(result[i], mount, options)
    }
  } else if (componentToRefresh) {
    if (componentToRefresh.refreshComponent) {
      componentToRefresh.refreshComponent()
    } else {
      componentToRefresh.refresh()
    }
  } else if (result === norefresh) {
    // don't refresh;
  } else if (result === norefreshFunction) {
    deprecations.norefresh('hyperdom.norefresh is deprecated, please use hyperdom.norefresh()')
    // don't refresh;
  } else {
    mount.refresh()
    return result
  }
}

function isComponent (component) {
  return component &&
    ((typeof component.init === 'function' &&
       typeof component.update === 'function' &&
       typeof component.destroy === 'function') || (typeof component.refreshComponent === 'function'))
}

function cloneOptions (options) {
  if (options) {
    return {
      norefresh: options.norefresh,
      refresh: options.refresh,
      component: options.component
    }
  } else {
    return {}
  }
}

},{"./deprecations":10}],22:[function(require,module,exports){
var simplePromise = require('./simplePromise')

function runRender (mount, fn) {
  var render = new Render(mount)

  try {
    runRender._currentRender = render

    var vdom = fn()
    render.finished.fulfill()
    return vdom
  } finally {
    runRender._currentRender = undefined
  }
}

function Render (mount) {
  this.finished = simplePromise()
  this.mount = mount
  this.attachment = mount
}

Render.prototype.transformFunctionAttribute = function () {
  return this.mount.transformFunctionAttribute.apply(this.mount, arguments)
}

module.exports = runRender
module.exports.currentRender = currentRender
module.exports.refreshify = refreshify
module.exports.RefreshHook = RefreshHook

function currentRender () {
  return runRender._currentRender || defaultRender
}

var defaultRender = {
  mount: {
    setupModelComponent: function () { },
    refreshify: function (fn) { return fn }
  },

  transformFunctionAttribute: function (key, value) {
    return new RefreshHook(value)
  },

  finished: {
    then: function (fn) {
      fn()
    }
  }
}

function refreshify (fn, options) {
  return runRender.currentRender().mount.refreshify(fn, options)
}

function RefreshHook (handler) {
  this.handler = handler
}

RefreshHook.prototype.hook = function (node, property) {
  node[property] = refreshify(this.handler)
}

RefreshHook.prototype.unhook = function (node, property) {
  node[property] = null
}

},{"./simplePromise":25}],23:[function(require,module,exports){
var vhtml = require('./vhtml')
var domComponent = require('./domComponent')
var bindingMeta = require('./meta')
var toVdom = require('./toVdom')
var parseTag = require('virtual-dom/virtual-hyperscript/parse-tag')
var Mount = require('./mount')
var Component = require('./component')
var render = require('./render')
var deprecations = require('./deprecations')
var prepareAttributes = require('./prepareAttributes')
var binding = require('./binding')
var refreshAfter = require('./refreshAfter')
var refreshEventResult = require('./refreshEventResult')

exports.append = function (element, render, model, options) {
  return startAttachment(render, model, options, function (mount, domComponentOptions) {
    var component = domComponent.create(domComponentOptions)
    var vdom = mount.render()
    element.appendChild(component.create(vdom))
    return component
  })
}

exports.replace = function (element, render, model, options) {
  return startAttachment(render, model, options, function (mount, domComponentOptions) {
    var component = domComponent.create(domComponentOptions)
    var vdom = mount.render()
    element.parentNode.replaceChild(component.create(vdom), element)
    return component
  })
}

exports.appendVDom = function (vdom, render, model, options) {
  return startAttachment(render, model, options, function (mount) {
    var component = {
      create: function (newVDom) {
        vdom.children = []
        if (newVDom) {
          vdom.children.push(toVdom(newVDom))
        }
      },
      update: function (newVDom) {
        vdom.children = []
        if (newVDom) {
          vdom.children.push(toVdom(newVDom))
        }
      }
    }
    component.create(mount.render())
    return component
  })
}

function startAttachment (render, model, options, attachToDom) {
  if (typeof render === 'object') {
    return start(render, attachToDom, model)
  } else {
    deprecations.renderFunction('hyperdom.append and hyperdom.replace with render functions are deprecated, please pass a component')
    return start({render: function () { return render(model) }}, attachToDom, options)
  }
}

function start (model, attachToDom, options) {
  var mount = new Mount(model, options)
  render(mount, function () {
    if (options) {
      var domComponentOptions = {document: options.document}
    }
    try {
      mount.component = attachToDom(mount, domComponentOptions)
    } catch (e) {
      mount.component = {
        update: function () {},
        destroy: function () {}
      }
      throw e
    }
  })
  return mount
}

/**
 * this function is quite ugly and you may be very tempted
 * to refactor it into smaller functions, I certainly am.
 * however, it was written like this for performance
 * so think of that before refactoring! :)
 */
exports.html = function (hierarchySelector) {
  var hasHierarchy = hierarchySelector.indexOf(' ') >= 0
  var selector, selectorElements

  if (hasHierarchy) {
    selectorElements = hierarchySelector.match(/\S+/g)
    selector = selectorElements[selectorElements.length - 1]
  } else {
    selector = hierarchySelector
  }

  var childElements
  var vdom
  var tag
  var attributes = arguments[1]

  if (attributes && attributes.constructor === Object && typeof attributes.render !== 'function') {
    childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 2))
    prepareAttributes(selector, attributes, childElements)
    tag = parseTag(selector, attributes)
    vdom = vhtml(tag, attributes, childElements)
  } else {
    attributes = {}
    childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 1))
    tag = parseTag(selector, attributes)
    vdom = vhtml(tag, attributes, childElements)
  }

  if (hasHierarchy) {
    for (var n = selectorElements.length - 2; n >= 0; n--) {
      vdom = vhtml(selectorElements[n], {}, [vdom])
    }
  }

  return vdom
}

exports.jsx = function (tag, attributes) {
  var childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 2))
  if (typeof tag === 'string') {
    if (attributes) {
      prepareAttributes(tag, attributes, childElements)
    }
    return vhtml(tag, attributes || {}, childElements)
  } else {
    return new Component(new tag(attributes || {}, childElements), {viewComponent: true}) // eslint-disable-line new-cap
  }
}

Object.defineProperty(exports.html, 'currentRender', {get: function () {
  deprecations.currentRender('hyperdom.html.currentRender is deprecated, please use hyperdom.currentRender() instead')
  return render._currentRender
}})

Object.defineProperty(exports.html, 'refresh', {get: function () {
  deprecations.refresh('hyperdom.html.refresh is deprecated, please use component.refresh() instead')
  if (render._currentRender) {
    var currentRender = render._currentRender
    return function (result) {
      refreshEventResult(result, currentRender.mount)
    }
  } else {
    throw new Error('Please assign hyperdom.html.refresh during a render cycle if you want to use it in event handlers. See https://github.com/featurist/hyperdom#refresh-outside-render-cycle')
  }
}})

Object.defineProperty(exports.html, 'norefresh', {get: function () {
  deprecations.norefresh('hyperdom.html.norefresh is deprecated, please use hyperdom.norefresh() instead')
  return refreshEventResult.norefresh
}})

Object.defineProperty(exports.html, 'binding', {get: function () {
  deprecations.htmlBinding('hyperdom.html.binding() is deprecated, please use hyperdom.binding() instead')
  return binding
}})

Object.defineProperty(exports.html, 'refreshAfter', {get: function () {
  deprecations.refreshAfter("hyperdom.html.refreshAfter() is deprecated, please use require('hyperdom/refreshAfter')() instead")
  return refreshAfter
}})

exports.html.meta = bindingMeta

function rawHtml () {
  var selector
  var html
  var options

  if (arguments.length === 2) {
    selector = arguments[0]
    html = arguments[1]
    options = {innerHTML: html}
    return exports.html(selector, options)
  } else {
    selector = arguments[0]
    options = arguments[1]
    html = arguments[2]
    options.innerHTML = html
    return exports.html(selector, options)
  }
}

exports.html.rawHtml = function () {
  deprecations.htmlRawHtml('hyperdom.html.rawHtml() is deprecated, please use hyperdom.rawHtml() instead')
  return rawHtml.apply(undefined, arguments)
}

exports.rawHtml = rawHtml

},{"./binding":7,"./component":8,"./deprecations":10,"./domComponent":11,"./meta":16,"./mount":17,"./prepareAttributes":18,"./refreshAfter":20,"./refreshEventResult":21,"./render":22,"./toVdom":26,"./vhtml":27,"virtual-dom/virtual-hyperscript/parse-tag":43}],24:[function(require,module,exports){
if (typeof Set === 'function') {
  module.exports = Set
} else {
  module.exports = function () {
    this.items = []
  }

  module.exports.prototype.add = function (widget) {
    if (this.items.indexOf(widget) === -1) {
      this.items.push(widget)
    }
  }

  module.exports.prototype.delete = function (widget) {
    var i = this.items.indexOf(widget)
    if (i !== -1) {
      this.items.splice(i, 1)
    }
  }

  module.exports.prototype.forEach = function (fn) {
    for (var n = 0; n < this.items.length; n++) {
      fn(this.items[n])
    }
  }
}

},{}],25:[function(require,module,exports){
function SimplePromise () {
  this.listeners = []
}

SimplePromise.prototype.fulfill = function (value) {
  if (!this.isFulfilled) {
    this.isFulfilled = true
    this.value = value
    this.listeners.forEach(function (listener) {
      listener()
    })
  }
}

SimplePromise.prototype.then = function (success) {
  if (this.isFulfilled) {
    success(this.value)
  } else {
    this.listeners.push(success)
  }
}

module.exports = function () {
  return new SimplePromise()
}

},{}],26:[function(require,module,exports){
var Vtext = require('virtual-dom/vnode/vtext.js')
var isVdom = require('./isVdom')
var Component = require('./component')

function toVdom (object) {
  if (object === undefined || object === null) {
    return new Vtext('')
  } else if (typeof (object) !== 'object') {
    return new Vtext(String(object))
  } else if (object instanceof Date) {
    return new Vtext(String(object))
  } else if (object instanceof Error) {
    return new Vtext(object.toString())
  } else if (isVdom(object)) {
    return object
  } else if (typeof object.render === 'function') {
    return new Component(object)
  } else {
    return new Vtext(JSON.stringify(object))
  }
}

module.exports = toVdom

function addChild (children, child) {
  if (child instanceof Array) {
    for (var n = 0; n < child.length; n++) {
      addChild(children, child[n])
    }
  } else {
    children.push(toVdom(child))
  }
}

module.exports.recursive = function (child) {
  var children = []
  addChild(children, child)
  return children
}

},{"./component":8,"./isVdom":13,"virtual-dom/vnode/vtext.js":53}],27:[function(require,module,exports){
'use strict'

var VNode = require('virtual-dom/vnode/vnode.js')
var isHook = require('virtual-dom/vnode/is-vhook')
var xml = require('./xml')

var softSetHook = require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js')

module.exports = h

function h (tagName, props, children) {
  var tag = tagName

  // support keys
  if (props.hasOwnProperty('key')) {
    var key = props.key
    props.key = undefined
  }

  // support namespace
  if (props.hasOwnProperty('namespace')) {
    var namespace = props.namespace
    props.namespace = undefined
  }

  // fix cursor bug
  if (tag.toLowerCase() === 'input' &&
    !namespace &&
    props.hasOwnProperty('value') &&
    props.value !== undefined &&
    !isHook(props.value)
  ) {
    props.value = softSetHook(props.value)
  }

  var vnode = new VNode(tag, props, children, key, namespace)

  if (props.xmlns) {
    xml.transform(vnode)
  }

  return vnode
}

},{"./xml":29,"virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js":42,"virtual-dom/vnode/is-vhook":46,"virtual-dom/vnode/vnode.js":51}],28:[function(require,module,exports){
var Component = require('./component')

module.exports = function (model) {
  return new Component(model, {viewComponent: true})
}

},{"./component":8}],29:[function(require,module,exports){
var AttributeHook = require('virtual-dom/virtual-hyperscript/hooks/attribute-hook')

var namespaceRegex = /^([a-z0-9_-]+)(--|:)([a-z0-9_-]+)$/i
var xmlnsRegex = /^xmlns(--|:)([a-z0-9_-]+)$/i
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

function transformTanName (vnode, namespaces) {
  var tagNamespace = namespaceRegex.exec(vnode.tagName)
  if (tagNamespace) {
    var namespaceKey = tagNamespace[1]
    var namespace = namespaces[namespaceKey]
    if (namespace) {
      vnode.tagName = tagNamespace[1] + ':' + tagNamespace[3]
      vnode.namespace = namespace
    }
  } else if (!vnode.namespace) {
    vnode.namespace = namespaces['']
  }
}

function transformProperties (vnode, namespaces) {
  var properties = vnode.properties

  if (properties) {
    var attributes = properties.attributes || (properties.attributes = {})

    var keys = Object.keys(properties)
    for (var k = 0, l = keys.length; k < l; k++) {
      var key = keys[k]
      if (key !== 'style' && key !== 'attributes') {
        var match = namespaceRegex.exec(key)
        if (match) {
          properties[match[1] + ':' + match[3]] = new AttributeHook(namespaces[match[1]], properties[key])
          delete properties[key]
        } else {
          if (vnode.namespace === SVG_NAMESPACE && key === 'className') {
            attributes['class'] = properties.className
            delete properties.className
          } else {
            var property = properties[key]
            var type = typeof property
            if (type === 'string' || type === 'number' || type === 'boolean') {
              attributes[key] = property
            }
          }
        }
      }
    }
  }
}

function declaredNamespaces (vnode) {
  var namespaces = {
    '': vnode.properties.xmlns,
    xmlns: 'http://www.w3.org/2000/xmlns/'
  }

  var keys = Object.keys(vnode.properties)

  for (var k = 0, l = keys.length; k < l; k++) {
    var key = keys[k]
    var value = vnode.properties[key]

    if (key === 'xmlns') {
      namespaces[''] = value
    } else {
      var match = xmlnsRegex.exec(key)

      if (match) {
        namespaces[match[2]] = value
      }
    }
  }

  return namespaces
}

function transform (vnode) {
  var namespaces = declaredNamespaces(vnode)

  function transformChildren (vnode, namespaces) {
    transformTanName(vnode, namespaces)
    transformProperties(vnode, namespaces)

    if (vnode.children) {
      for (var c = 0, l = vnode.children.length; c < l; c++) {
        var child = vnode.children[c]
        if (!(child.properties && child.properties.xmlns)) {
          transformChildren(child, namespaces)
        }
      }
    }
  }

  transformChildren(vnode, namespaces)

  return vnode
}

module.exports.transform = transform

},{"virtual-dom/virtual-hyperscript/hooks/attribute-hook":41}],30:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],31:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],32:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":36}],33:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":55}],34:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":39}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":46,"is-object":30}],36:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":44,"../vnode/is-vnode.js":47,"../vnode/is-vtext.js":48,"../vnode/is-widget.js":49,"./apply-properties":35,"global/document":5}],37:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],38:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":49,"../vnode/vpatch.js":52,"./apply-properties":35,"./update-widget":40}],39:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":36,"./dom-index":37,"./patch-op":38,"global/document":5,"x-is-array":56}],40:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":49}],41:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],42:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],43:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":3}],44:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":45,"./is-vnode":47,"./is-vtext":48,"./is-widget":49}],45:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],46:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],47:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":50}],48:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":50}],49:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],50:[function(require,module,exports){
module.exports = "2"

},{}],51:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":45,"./is-vhook":46,"./is-vnode":47,"./is-widget":49,"./version":50}],52:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":50}],53:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":50}],54:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":46,"is-object":30}],55:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":44,"../vnode/is-thunk":45,"../vnode/is-vnode":47,"../vnode/is-vtext":48,"../vnode/is-widget":49,"../vnode/vpatch":52,"./diff-props":54,"x-is-array":56}],56:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],57:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hyperdom = require('hyperdom');
var h = hyperdom.html;
var dialogPolyfill = require('dialog-polyfill');

module.exports = function () {
  function Modal(_ref, content) {
    var _ref$showModal = _ref.showModal,
        showModal = _ref$showModal === undefined ? false : _ref$showModal,
        _ref$rootClass = _ref.rootClass,
        rootClass = _ref$rootClass === undefined ? 'modal' : _ref$rootClass;

    _classCallCheck(this, Modal);

    this._showModal = showModal;
    this._rootClass = rootClass;
    this._content = content;
  }

  _createClass(Modal, [{
    key: 'onrender',
    value: function onrender(element) {
      // Register element with polyfill
      dialogPolyfill.registerDialog(element);

      // Trigger native modal show or close
      if (this._showModal) {
        element.showModal();
      } else {
        element.close();
      }

      // Close when clicking on modal or backdrop
      element.addEventListener('click', function (event) {
        if (event.target === element) {
          element.close('cancelled');
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return h('dialog', { class: this._rootClass }, this._content);
    }
  }]);

  return Modal;
}();

},{"dialog-polyfill":4,"hyperdom":12}]},{},[1]);
