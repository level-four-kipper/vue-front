/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
// 原文件参考 https://github.com/zttop/watermark-h5
// 本文件：优化了水印定位及多行文本显示
var t = function () {
    return (
      (t =
        Object.assign ||
        function (t) {
          for (var e, n = 1, i = arguments.length; n < i; n++) for (var o in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o])
          return t
        }),
      t.apply(this, arguments)
    )
  },
  e = {
    parentDomName: 'body',
    show: !0,
    color: 'rgba(0, 0, 0, 0.06)',
    title: '严禁外传',
    width: 200,
    height: 200,
    fontNum: 15,
    rotate: -25,
    zIndex: 999999
  }
var n = new ((function () {
  function n() {
    this.config = e
  }
  return (
    (n.prototype.init = function (e) {
      ;(this.config = t(t({}, this.config), e)), this._init()
    }),
    (n.prototype.clear = function () {
      this.config.show = !1
      var t = null
      ;(t = this.container ? document.querySelector('.__pwm') : document.querySelector('.__wm')) && this.container.removeChild(t), this.moServer && (this.moServer.disconnect(), (this.moServer = null))
    }),
    (n.prototype.show = function () {
      ;(this.config.show = !0), this._init()
    }),
    (n.prototype._init = function () {
      this.config.show && (this._paint(), this.moServer || this._mutation())
    }),
    (n.prototype._paint = function () {
      this.container = this.config.parentDomName ? document.querySelector(this.config.parentDomName) : document.body
      var t = document.createElement('canvas')
      t.setAttribute('width', ''.concat(this.config.width, 'px')), t.setAttribute('height', ''.concat(this.config.height, 'px'))
      var e = t.getContext('2d')
      ;(e.textAlign = 'center'),
        (e.textBaseline = 'middle'),
        (e.font = ''.concat(this.config.fontNum, 'px microsoft yahei')),
        (e.fillStyle = this.config.color),
        e.rotate((Math.PI / 180) * this.config.rotate)
      var lines = this.config.title.split('\n')
      for (var j = 0; j < lines.length; j++) {
        e.fillText(lines[j], parseFloat(''.concat(this.config.width, 'px')) / 2, parseFloat(''.concat(this.config.height, 'px')) / 2 + 1.5 * j * this.config.fontNum)
      }
      var n = t.toDataURL(),
        i = null,
        o = (i = this.container ? document.querySelector('.__pwm') : document.querySelector('.__wm')) || document.createElement('div')
      ;(this.styleStr = 'position:fixed;\n        top:0;\n        left:0;\n        width:100%;\n        height:100%;\n        z-index:'
        .concat(this.config.zIndex, ";\n        pointer-events:none;\n        background-repeat:repeat;\n        background-image:url('")
        .concat(n, "')")),
        o.setAttribute('style', this.styleStr),
        this.container ? o.classList.add('__pwm') : o.classList.add('__wm'),
        i || ((this.container.style.position = 'relative'), this.container.appendChild(o))
    }),
    (n.prototype._mutation = function () {
      var t = this,
        e = window.MutationObserver || window.WebKitMutationObserver
      e &&
        !this.moServer &&
        ((this.moServer = new e(
          (function (t, e, n) {
            var i, o, r, c, s
            void 0 === n && (n = !1)
            var a = function () {
              var h = +new Date() - c
              h < e && h > 0 ? (i = setTimeout(a, e - h)) : ((i = null), n || ((s = t.apply(r, o)), i || (r = o = null)))
            }
            return function () {
              for (var o = [], h = 0; h < arguments.length; h++) o[h] = arguments[h]
              ;(r = this), (c = +new Date())
              var l = n && !i
              return i || (i = setTimeout(a, e)), l && ((s = t.apply(r, o)), (r = o = null)), s
            }
          })(function () {
            t._listen()
          }, 300)
        )),
        this.moServer.observe(this.container, {
          attributes: !0,
          subtree: !0,
          childList: !0
        }))
    }),
    (n.prototype._listen = function () {
      var t = null
      ;(((t = this.container ? document.querySelector('.__pwm') : document.querySelector('.__wm')) && t.getAttribute('style') !== this.styleStr) || !t) && this.config.show && this._init()
    }),
    n
  )
})())()
export { n as default }
