# 1.1.0 / 2018-04-31

* Add support for passing function instead of configuration object for dynamic content

# 1.0.0 / 2018-04-30

* Switch to using `openBinding` hyperdom binding instead of `showModal` boolean
* Allow passing any options to `<dialog>` instead of just class name
* Rename `onExit` to `onCancel`

# 0.2.4 / 2018-04-25

* Fix `window is undefined` error when loading outside of browser DOM

# 0.2.3 / 2018-02-20

* Check for `open` attribute before showing/hiding modal

# 0.2.2 / 2018-02-18

* Fix modal not closing in some cases

# 0.2.1 / 2018-02-18

* Improve handling of modal re-render when already open

# 0.2.0 / 2018-02-18

* Add `onExit` option

# 0.1.0 / 2018-02-18

* Initial public release
* Refactor how modal padding is applied in demo to avoided unintended closes
* Add modal slide in example to demo styles
* Include polyfill stylesheet in `/dist` to ease integration

# 0.0.1 / 2018-02-15

* Initial test release
