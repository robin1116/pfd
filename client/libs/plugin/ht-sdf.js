! function () {
    "use strict";

    function _(t, n, a, e) {
        var o, r, i = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 128,
            u = [],
            s = [],
            l = 1e6,
            h = new ht.Math.Vector2(l, l),
            f = new ht.Math.Vector2;

        function m(t, e, o) {
            return e < 0 || o < 0 || n - 1 < e || a - 1 < o ? h : t[o * n + e]
        }

        function d(t, e, o, a) {
            t[o * n + e] = a
        }

        function c(t, e, o, a, n, r) {
            return f.copy(m(t, o + n, a + r)), f.x += n, f.y += r, f.lengthSq() < e.lengthSq() && e.copy(f), e
        }

        function g(t) {
            var e;
            for (p = 0; p < a; p++) {
                for (o = 0; o < n; o++) e = c(t, e = m(t, o, p), o, p, -1, 0), e = c(t, e, o, p, 0, -1), e = c(t, e, o, p, -1, -1), e = c(t, e, o, p, 1, -1), d(t, o, p, e);
                for (o = n - 1; 0 <= o; o--) e = c(t, e = m(t, o, p), o, p, 1, 0), d(t, o, p, e)
            }
            for (p = a - 1; 0 <= p; p--) {
                for (o = n - 1; 0 <= o; o--) e = c(t, e = m(t, o, p), o, p, 1, 0), e = c(t, e, o, p, 0, 1), e = c(t, e, o, p, -1, 1), e = c(t, e, o, p, 1, 1), d(t, o, p, e);
                for (o = 0; o < n; o++) e = c(t, e = m(t, o, p), o, p, -1, 0), d(t, o, p, e)
            }
        }
        for (p = 0; p < a; p++)
            for (o = 0; o < n; o++) t[r = p * n + o] > i ? (d(u, o, p, new ht.Math.Vector2(0, 0)), d(s, o, p, new ht.Math.Vector2(l, l))) : (d(u, o, p, new ht.Math.Vector2(l, l)), d(s, o, p, new ht.Math.Vector2(0, 0)));
        g(u), g(s);
        for (var _ = [], v = [], p = (new ht.Math.Vector2, 0); p < a; p++)
            for (o = 0; o < n; o++) {
                var w = m(u, o, p).length() - m(s, o, p).length();
                _[r = p * n + o] = w, e && (w = m(0 <= w ? u : s, o, p), v[2 * r] = w.x, v[2 * r + 1] = w.y)
            }
        return [_, v]
    }
    ht.Default.setShader("sdfShader", "\nuniform mat4 uProjectMatrix;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nattribute vec3 vs;\nattribute vec2 uv;\nvarying vec2 vUv;\n\nvoid main (void) {\n  vUv = uv;\n  gl_Position = uProjectMatrix * uModelViewMatrix * vec4(vs, 1.0);\n}\n", "\nuniform float u_transFrom;\nuniform float u_shadowFrom;\nuniform float u_hollowFrom;\nuniform float u_hollowTo;\nuniform float u_outlineFrom;\n\nuniform float u_inDelta;\nuniform float u_shadowDelta;\nuniform float u_outlineDelta;\n\nuniform float  u_transformRatio;\n\nuniform vec3 u_outlineColor;\nuniform vec3 u_color;\nuniform vec3 u_shadowColor;\nuniform vec3 u_bgColor;\n\n\nuniform sampler2D u_imageFrom;\nuniform sampler2D u_imageTo;\n\nuniform float u_shadowOffsetX;\nuniform float u_shadowOffsetY;\n\nuniform float u_opacity;\nuniform float u_alphaTest;\n\nvarying vec2 vUv;\n\nvoid main(void) {\n  vec4 shadowFrom = texture2D(u_imageFrom, clamp(vUv + vec2(-u_shadowOffsetX, -u_shadowOffsetY), 0.0, 1.0));\n  vec4 shadowTo   = texture2D(u_imageTo,   clamp(vUv + vec2(-u_shadowOffsetX, -u_shadowOffsetY), 0.0, 1.0));\n  \n  vec4 d1 =  texture2D(u_imageFrom, vUv);\n  vec4 d2 =  texture2D(u_imageTo, vUv);\n  vec4 inColor;\n  vec4 shadow;\n  vec4 outline;\n\n  float distance1 = d1.r + d1.g / 255.0 + d1.b / 65535.0;\n  float distance2 = d2.r + d2.g / 255.0 + d2.b / 65535.0;\n  float distance = abs(mix(distance1, distance2, u_transformRatio) - u_hollowFrom) + u_hollowTo;\n\n  distance1 = shadowFrom.r + shadowFrom.g / 255.0 + shadowFrom.b / 65535.0;\n  distance2 = shadowTo.r + shadowTo.g / 255.0 + shadowTo.b / 65535.0;\n  float distanceShadow = abs(mix(distance1, distance2, u_transformRatio) - u_hollowFrom) + u_hollowTo;\n\n  outline.a = 1.0 - smoothstep(u_outlineFrom - u_outlineDelta, u_outlineFrom + u_outlineDelta, distance);\n  shadow.a  = 1.0 - smoothstep(u_shadowFrom -  u_shadowDelta,  u_shadowFrom +  u_shadowDelta,  distanceShadow);\n  inColor.a = 1.0 - smoothstep(u_transFrom -   u_inDelta,      u_transFrom +   u_inDelta,      distance);\n  \n  inColor.rgb = u_color;\n  shadow.rgb  = u_shadowColor;\n  outline.rgb = u_outlineColor;\n\n  vec4 ret;\n  ret = mix(outline, inColor, inColor.a);\n  ret = mix(shadow, ret, ret.a);\n\n  if(ret.a <= 0.0) {\n    ret.rgb = u_bgColor;\n  }\n\n  if(u_alphaTest > ret.a ) {\n    discard;\n  }\n\n  ret.a = ret.a * u_opacity;\n  gl_FragColor = ret;\n}\n");
    var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        },
        e = function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        },
        t = function (t, e, o) {
            return e && a(t.prototype, e), o && a(t, o), t
        };

    function a(t, e) {
        for (var o = 0; o < e.length; o++) {
            var a = e[o];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(t, a.key, a)
        }
    }

    function n(t, e, o) {
        null === t && (t = Function.prototype);
        var a = Object.getOwnPropertyDescriptor(t, e);
        return void 0 !== a ? "value" in a ? a.value : void 0 !== (a = a.get) ? a.call(o) : void 0 : null === (t = Object.getPrototypeOf(t)) ? void 0 : n(t, e, o)
    }
    var r = function (t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        },
        i = (function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(u, ht.Node), t(u, [{
            key: "onPropertyChanged",
            value: function (t) {
                n(u.prototype.__proto__ || Object.getPrototypeOf(u.prototype), "onPropertyChanged", this).call(this, t);
                var e = t.property,
                    t = t.newValue;
                "a:reverseColor" != e && "a:imageWidth" != e && "a:imageHeight" != e ? "s:alphaTest" != e ? "s:shape3d.opacity" != e ? "s:shape3d.transparent" != e || this.updateMaterial("transparent", t) : this.updateMaterial("u_opacity", 2 * t) : this.updateMaterial("u_alphaTest", t) : this.createSdf()
            }
        }, {
            key: "setImageFromUrl",
            value: function (t) {
                this._imageFromUrl = t, this.s("shape3d.from.image", t), this.setFrom(this._imageFromUrl)
            }
        }, {
            key: "setImageToUrl",
            value: function (t) {
                this._imageToUrl = t, this.s("shape3d.to.image", t), this.setTo(this._imageToUrl)
            }
        }, {
            key: "getImageFromUrl",
            value: function () {
                return this._imageFromUrl
            }
        }, {
            key: "getImageToUrl",
            value: function () {
                return this._imageToUrl
            }
        }, {
            key: "setFrom",
            value: function (t) {
                var e = this;
                "" !== t && ("object" !== (void 0 === (this._imageFromUrl = t) ? "undefined" : o(t)) ? "string" == typeof t && (0 <= t.indexOf(".json") ? ht.Default.xhrLoad(t, function (t) {
                    t = ht.Default.parse(t);
                    e.setJsonImageFrom(t, e.a("imageWidth"), e.a("imageHeight"))
                }) : this.setRawImageFrom(t)) : this.setJsonImageFrom(t, this.a("imageWidth"), this.a("imageHeight")))
            }
        }, {
            key: "setTo",
            value: function (t) {
                var e = this;
                "" !== t && ("object" !== (void 0 === (this._imageToUrl = t) ? "undefined" : o(t)) ? "string" == typeof t && (0 <= t.indexOf(".json") ? ht.Default.xhrLoad(t, function (t) {
                    t = ht.Default.parse(t);
                    e.setJsonImageTo(t, e.a("imageWidth"), e.a("imageHeight"))
                }) : this.setRawImageTo(t)) : this.setJsonImageTo(t, this.a("imageWidth"), this.a("imageHeight")))
            }
        }, {
            key: "createSdf",
            value: function () {
                this.setFrom(this._imageFromUrl), this.setTo(this._imageToUrl)
            }
        }, {
            key: "getFrom",
            value: function () {
                return this._imageFromUrl
            }
        }, {
            key: "getTo",
            value: function () {
                return this._imageToUrl
            }
        }, {
            key: "getClass",
            value: function () {
                return u
            }
        }, {
            key: "getSuperClass",
            value: function () {
                return ht.Node
            }
        }, {
            key: "getClassName",
            value: function () {
                return "ht.plugin.SdfBoard"
            }
        }, {
            key: "getSerializableProperties",
            value: function () {
                var t = n(u.prototype.__proto__ || Object.getPrototypeOf(u.prototype), "getSerializableProperties", this).call(this);
                return t.imageFromUrl = 1, t.imageToUrl = 1, t
            }
        }, {
            key: "updateMaterial",
            value: function (t, e) {
                this.setMaterial("shape3d.material", t, e)
            }
        }, {
            key: "setImageFrom",
            value: function (t) {
                var e = "sdfFrom_" + this.getId();
                ht.Default.setImage(e, t), this.updateMaterial("u_imageFrom", e)
            }
        }, {
            key: "setImageTo",
            value: function (t) {
                var e = "sdfTo_" + this.getId();
                ht.Default.setImage(e, t), this.updateMaterial("u_imageTo", e)
            }
        }, {
            key: "setRawImageFrom",
            value: function (t) {
                var o = this;
                this.getImageSdf(t, function (t, e) {
                    o._fromImageInfo = e, o.setImageFrom(t)
                })
            }
        }, {
            key: "setRawImageTo",
            value: function (t) {
                var o = this;
                this.getImageSdf(t, function (t, e) {
                    o._toImageInfo = e, o.setImageTo(t)
                })
            }
        }, {
            key: "setJsonImageFrom",
            value: function (t, e, o) {
                var a = this;
                this.getJsonSdf(t, e, o, function (t, e) {
                    a._fromImageInfo = e, a.setImageFrom(t)
                })
            }
        }, {
            key: "setJsonImageTo",
            value: function (t, e, o) {
                var a = this;
                this.getJsonSdf(t, e, o, function (t, e) {
                    a._toImageInfo = e, a.setImageTo(t)
                })
            }
        }, {
            key: "getMaterialValue",
            value: function (t) {
                return this.getMaterial("shape3d.material", t)
            }
        }, {
            key: "getImageSdf",
            value: function (t, c) {
                var n, r, i, u, s, l, g = this;
                t = t, r = n = null, u = i = 0, s = function (t) {
                    var e = t.width,
                        o = t.height,
                        a = [];
                    if (g.a("reverseColor"))
                        for (var n = 0; n < t.width * t.height; n++) t.data[4 * n + 3] <= 50 ? a.push(0) : a.push(255 - t.data[4 * n]);
                    else
                        for (var r = 0; r < t.width * t.height; r++) a.push(t.data[4 * r]);
                    var i = _(a, t.width, t.height),
                        u = [],
                        s = -1 / 0,
                        l = 1 / 0;
                    i[0].forEach(function (t, e) {
                        s < t && (s = t), t < l && (l = t)
                    }), i[0].forEach(function (t) {
                        var e = (t - l) / (s - l) * 255;
                        e < 0 && (e = 0), 255 < e && (e = 255);
                        var o = 255 * (e - Math.floor(e)),
                            t = 255 * (o - Math.floor(o));
                        u.push(Math.floor(e), Math.floor(o), Math.floor(t), 255)
                    });
                    var h, f, m, d = -l / (s - l),
                        m = (h = {
                            data: u,
                            width: t.width,
                            height: t.height
                        }, f = h, m = document.createElement("canvas"), i = m.getContext("2d"), f instanceof ImageData || (f = i.createImageData(h.width, h.height)).data.set(h.data, 0), m.width = f.width, m.height = f.height, i.putImageData(f, 0, 0), m.toDataURL("image/png"));
                    c && c(m, {
                        width: e,
                        height: o,
                        zero: d
                    })
                }, (l = new Image).src = t, l.onload = function () {
                    var t = document.createElement("canvas"),
                        e = t.getContext("2d"),
                        o = n || l.width,
                        a = r || l.height;
                    t.width = o, t.height = a, e.drawImage(l, 0, 0, l.width, l.height);
                    a = e.getImageData(i || 0, u || 0, o, a);
                    s && s(a)
                }
            }
        }, {
            key: "getJsonSdf",
            value: function (t, e, o, a) {
                e = e || t.width, o = o || t.height, o = ht.Default.toCanvas(t, e, o, "fill", this).toDataURL();
                this.getImageSdf(o, a)
            }
        }, {
            key: "setTransformRatio",
            value: function (t) {
                this.updateMaterial("u_transformRatio", t)
            }
        }]), u);

    function u() {
        e(this, u);
        var t = r(this, (u.__proto__ || Object.getPrototypeOf(u)).call(this));
        return t.s("shape3d", "plane"), t._material = {
            type: "sdfShader",
            u_transFrom: 0,
            u_shadowFrom: 0,
            u_hollowFrom: 0,
            u_hollowTo: 0,
            u_outlineFrom: 0,
            u_inDelta: .01,
            u_shadowDelta: .01,
            u_outlineDelta: .01,
            u_transformRatio: 0,
            u_outlineColor: "red",
            u_color: "blue",
            u_shadowColor: "gray",
            u_bgColor: "black",
            u_shadowOffsetX: 0,
            u_shadowOffsetY: 0,
            u_opacity: 1,
            u_alphaTest: 0
        }, t.s("shape3d.material", t._material), t.a("imageWidth", 64), t.a("imageHeight", 64), t._imageFromUrl = "", t._imageToUrl = "", t.setDisplayName("SDF Board"), t
    }
    var s, l = {
            Thickness: "u_transFrom",
            Blur: "u_inDelta",
            Color: "u_color",
            OutlineThickness: "u_outlineFrom",
            OutlineBlur: "u_outlineDelta",
            OutlineColor: "u_outlineColor",
            ShadowThickness: "u_shadowFrom",
            ShadowBlur: "u_shadowDelta",
            ShadowOffsetX: "u_shadowOffsetX",
            ShadowOffsetY: "u_shadowOffsetY",
            ShadowColor: "u_shadowColor",
            TransformRatio: "u_transformRatio"
        },
        h = "shape3d.material";
    for (s in l) ! function (t) {
        var e, o;
        i.prototype["set" + t] = (e = l[t], function (t) {
            this.setMaterial(h, e, t)
        }), i.prototype["get" + t] = (o = l[t], function () {
            return this.getMaterial(h, o)
        })
    }(s);
    t = ht.plugin;
    (t = t || (ht.plugin = {})).SdfBoard = i, t.sdfGenerator = _
}();