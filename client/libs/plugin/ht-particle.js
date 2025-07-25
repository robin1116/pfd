var Particle = function () {
    "use strict";

    function f(e, t, r) {
        t = e.createShader(t);
        if (e.shaderSource(t, r), e.compileShader(t), !e.getShaderParameter(t, e.COMPILE_STATUS)) throw new Error(e.getShaderInfoLog(t));
        return t
    }

    function o(e, t, r, a, i) {
        var n = e.createTexture();
        return e.bindTexture(e.TEXTURE_2D, n), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, t), r instanceof Uint8Array ? e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, a, i, 0, e.RGBA, e.UNSIGNED_BYTE, r) : e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, r), e.bindTexture(e.TEXTURE_2D, null), n
    }

    function t(e, t, r) {
        e.activeTexture(e.TEXTURE0 + r), e.bindTexture(e.TEXTURE_2D, t)
    }

    function _(e, t, r) {
        e.bindFramebuffer(e.FRAMEBUFFER, t), r && e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, r, 0)
    }
    var n = "\nprecision mediump float;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_tex_pos;\n\nvoid main() {\n    v_tex_pos = a_pos;\n    gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);\n}",
        u = "\nprecision mediump float;\n\nuniform sampler2D u_particles; uniform sampler2D u_field; uniform vec3 u_field_res;\nuniform vec3 u_speed_min;\nuniform vec3 u_speed_max;\nuniform float u_rand_seed;\nuniform float u_speed_factor;\nuniform float u_drop_rate;\nuniform float u_drop_rate_bump;\nuniform int u_shape;\n\nvarying vec2 v_tex_pos;\n\nconst vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);\nfloat rand(const vec2 co) {\n    float t = dot(rand_constants.xy, co);\n    return fract(sin(t) * (rand_constants.z + t));\n}\n\nvec3 lookup_field(const vec3 uve) {\n    vec3 px = 1.0 / u_field_res;\n    float dy = 1.0 / (u_field_res.y * u_field_res.z);\n\n    float eBelow = (floor(uve.z * (u_field_res.z - 1.0))) * (u_field_res.y) * dy;\n    float eTop = eBelow + dy * (u_field_res.y);\n\n    vec2 uv0 = vec2(uve.x, eBelow + dy * u_field_res.y * uve.y);\n    vec2 uv1 = vec2(uve.x, eTop + dy * u_field_res.y * uve.y);\n\n    float ef = fract(uve.z * (u_field_res.z - 1.0));\n    \n        \n    vec2 vc = (floor(uv0 * vec2(u_field_res.x, u_field_res.y * u_field_res.z))) * vec2(px.x, dy);\n    vec2 f = fract(uv0 * vec2(u_field_res.x, u_field_res.y * u_field_res.z));\n    \n    vec3 tl = texture2D(u_field, vc).rgb;\n    vec3 tr = texture2D(u_field, vc + vec2(px.x, 0)).rgb;\n    vec3 bl = texture2D(u_field, vc + vec2(0, dy)).rgb;\n    vec3 br = texture2D(u_field, vc + vec2(px.x, dy)).rgb;\n    \n    vec3 v0 = mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);\n\n    vc = (floor(uv1 * vec2(u_field_res.x, u_field_res.y * u_field_res.z))) * vec2(px.x, dy);\n    f = fract(uv1 * vec2(u_field_res.x, u_field_res.y * u_field_res.z));\n    vec3 tl2 = texture2D(u_field, vc).rgb;\n    vec3 tr2 = texture2D(u_field, vc + vec2(px.x, 0)).rgb;\n    vec3 bl2 = texture2D(u_field, vc + vec2(0, dy)).rgb;\n    vec3 br2 = texture2D(u_field, vc + vec2(px.x, dy)).rgb;\n\n    vec3 v1 = mix(mix(tl2, tr2, f.x), mix(bl2, br2, f.x), f.y);\n    return mix(v0, v1, ef);\n}\n\nvec3 getSpherePos(vec3 inData) {\n    vec3 t1 = inData - 0.5;\n    if(length(t1) > 0.5) {\n        return (normalize(t1) + 1.0) / 2.0;\n    }\n    return inData;\n}\n\nvec3 getCylinderPos(vec3 inData) {\n    vec3 t1 = inData - 0.5;\n    if(length(t1.xy) > 0.5) {\n        return vec3((normalize(t1.xy)  + 1.0) / 2.0, inData.z);\n    }\n    return inData;\n}\n\nvoid main() {\n    vec4 color = texture2D(u_particles, v_tex_pos);\n\n    vec3 pos = color.rgb;\n\n    vec3 velocity = mix(u_speed_min, u_speed_max, lookup_field(pos));\n    float speed_t = length(velocity) / length(u_speed_max);\n\n        float distortion = 1.0;     vec3 offset = velocity * 0.001 * u_speed_factor;\n\n        pos = fract(pos + offset);\n\n        vec2 seed = (pos.xy + v_tex_pos) * u_rand_seed;\n\n        float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;\n    float drop = step(1.0 - drop_rate, rand(seed));\n\n    vec3 random_pos = vec3(\n        rand(seed + 1.3),\n        rand(seed + 0.8),\n        rand(seed + 0.3));\n    pos = mix(pos, random_pos, drop);\n\n    if(u_shape == 2) {\n        pos = getCylinderPos(pos);\n    }\n    if(u_shape == 1) {\n        pos = getSpherePos(pos);\n    }\n    gl_FragColor = vec4(pos, rand(seed + 1.3));\n}",
        s = function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        },
        e = function (e, t, r) {
            return t && a(e.prototype, t), r && a(e, r), e
        };

    function a(e, t) {
        for (var r = 0; r < t.length; r++) {
            var a = t[r];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
        }
    }
    var l = function (e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        },
        e = (function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(c, ht.Node), e(c, [{
            key: "setSpeedColor",
            value: function (e) {
                this.s("material.u_color_ramp", e)
            }
        }, {
            key: "setColor",
            value: function (e) {
                e ? (e = ht.Default.toColorData(e), this._color = [e[0] / 255, e[1] / 255, e[2] / 255, e[3] / 255], this._fixedColor = 1) : this._fixedColor = 0, this.s({
                    "material.u_color": this._color,
                    "material.u_fixedColor": this._fixedColor
                })
            }
        }, {
            key: "setParticleNum",
            value: function (e) {
                var t = this._gl,
                    e = this._particleStateResolution = Math.ceil(Math.sqrt(e));
                this._numParticles = e * e;
                for (var r = new Uint8Array(4 * this._numParticles), a = 0; a < r.length; a++) r[a] = Math.floor(256 * Math.random());
                this._particleStateTexture0 = o(t, t.NEAREST, r, e, e), this._particleStateTexture1 = o(t, t.NEAREST, r, e, e);
                for (var i = [], n = 0; n < this._numParticles; n++) i.push(n);
                this.s({
                    "geometry.vs": ["float32", 1, i],
                    "material.u_particles": this._particleStateTexture0,
                    shape3d: "custom",
                    "material.u_field": this._fieldTexture,
                    "material.u_particles_res": this._particleStateResolution
                })
            }
        }, {
            key: "getParticleNum",
            value: function () {
                return this._numParticles
            }
        }, {
            key: "setFieldData",
            value: function (e) {
                (this._fieldData = e).image && (this._fieldTexture = o(this._gl, this._gl.LINEAR, e.image)), e.data && (this._fieldTexture = o(this._gl, this._gl.LINEAR, e.data, e.width, e.height * e.tall)), this.s({
                    "material.u_field": this._fieldTexture
                })
            }
        }, {
            key: "_draw",
            value: function () {
                var e;
                this._animationOn && ((e = this._gl).disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), t(e, this._fieldTexture, 0), t(e, this._particleStateTexture0, 1), this._updateParticles())
            }
        }, {
            key: "_updateParticles",
            value: function () {
                var e = this._gl;
                _(e, this._framebuffer, this._particleStateTexture1), e.viewport(0, 0, this._particleStateResolution, this._particleStateResolution);
                var t, r, a, i, n = this._updateProgram;
                e.useProgram(n.program), t = e, r = this._vertexBuffer, a = n.a_pos, i = 2, t.bindBuffer(t.ARRAY_BUFFER, r), t.enableVertexAttribArray(a), t.vertexAttribPointer(a, i, t.FLOAT, !1, 0, 0), e.uniform1i(n.u_field, 0), e.uniform1i(n.u_particles, 1), e.uniform1f(n.u_rand_seed, Math.random()), e.uniform3f(n.u_field_res, this._fieldData.width, this._fieldData.height, this._fieldData.tall), e.uniform3f(n.u_speed_min, this._fieldData.min[0], this._fieldData.min[1], this._fieldData.min[2]), e.uniform3f(n.u_speed_max, this._fieldData.max[0], this._fieldData.max[1], this._fieldData.max[2]), e.uniform1f(n.u_speed_factor, this._speedFactor), e.uniform1f(n.u_drop_rate, this._dropRate), e.uniform1f(n.u_drop_rate_bump, this._dropRateBump), e.uniform1i(n.u_shape, this._shape), e.drawArrays(e.TRIANGLES, 0, 6);
                n = this._particleStateTexture0;
                this._particleStateTexture0 = this._particleStateTexture1, this._particleStateTexture1 = n, _(e, null), this.s({
                    "material.u_particles": this._particleStateTexture0
                })
            }
        }, {
            key: "startSimulation",
            value: function () {
                var e = this;
                if (!this._fieldData) return !1;
                this.stopSimulation();

                function t() {
                    e._draw(), e._animationIdId = requestAnimationFrame(t)
                }
                return this._animationIdId = requestAnimationFrame(t), !0
            }
        }, {
            key: "stopSimulation",
            value: function () {
                cancelAnimationFrame(this._animationIdId)
            }
        }, {
            key: "setParticleSize",
            value: function (e) {
                this._pointSize = e, this._updateUniforms()
            }
        }, {
            key: "setDropRate",
            value: function (e) {
                this._dropRate = e, this._updateUniforms()
            }
        }, {
            key: "getDropRate",
            value: function () {
                return this._dropRate
            }
        }, {
            key: "setSpeedFactor",
            value: function (e) {
                this._speedFactor = .05 + .95 * e, this._updateUniforms()
            }
        }, {
            key: "getSpeedFactor",
            value: function (e) {
                return this._speedFactor
            }
        }, {
            key: "setDropRateBump",
            value: function (e) {
                this._dropRateBump = e, this._updateUniforms()
            }
        }, {
            key: "getDropRateBump",
            value: function (e) {
                return this._dropRateBump
            }
        }, {
            key: "setAlpha",
            value: function (e) {
                this._alpha = e, this._updateUniforms()
            }
        }, {
            key: "getAlpha",
            value: function () {
                return this._alpha
            }
        }, {
            key: "stopAnimation",
            value: function () {
                this._animationOn = !1
            }
        }, {
            key: "startAnimation",
            value: function () {
                this._animationOn = !0
            }
        }, {
            key: "_updateUniforms",
            value: function () {
                this.s({
                    "material.u_point_size": this._pointSize,
                    "material.u_drop_rate_bump": this._dropRateBump,
                    "material.u_drop_rate": this._dropRate,
                    "material.u_speed_factor": this._speedFactor,
                    "material.u_particles_res": this._particleStateResolution,
                    "material.u_point_alpha": this._alpha,
                    "material.u_speed_min": this._fieldData.min,
                    "material.u_speed_max": this._fieldData.max,
                    "material.u_color": this._color,
                    "material.u_fixedColor": this._fixedColor
                })
            }
        }, {
            key: "setShape",
            value: function (e) {
                this._shape = e
            }
        }]), c);

    function c(e, t) {
        s(this, c);
        var r = l(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this));
        r._g3d = e, r._gl = e.getGL();
        var a = r._gl;
        r.s({
            "material.shader": "ht-particle-shader",
            "material.mode": a.POINTS
        });
        var i = 1024,
            e = 1024;
        return r._pointSize = 1, r._alpha = 1, r._animationOn = !0, r._color = [1, 0, 0, 1], r._fixedColor = 0, r._shape = 0, t && (r._pointSize = t.pointSize || 1, i = t.width || 1024, e = t.height || 1024), r._renderTarget = {
            width: i,
            height: e
        }, r._speedFactor = .25, r._dropRate = .003, r._dropRateBump = .01, r._updateProgram = function (e, t, r) {
            var a = e.createProgram(),
                t = f(e, e.VERTEX_SHADER, t),
                r = f(e, e.FRAGMENT_SHADER, r);
            if (e.attachShader(a, t), e.attachShader(a, r), e.linkProgram(a), !e.getProgramParameter(a, e.LINK_STATUS)) throw new Error(e.getProgramInfoLog(a));
            for (var i = {
                    program: a
                }, n = e.getProgramParameter(a, e.ACTIVE_ATTRIBUTES), o = 0; o < n; o++) {
                var _ = e.getActiveAttrib(a, o);
                i[_.name] = e.getAttribLocation(a, _.name)
            }
            for (var u = e.getProgramParameter(a, e.ACTIVE_UNIFORMS), s = 0; s < u; s++) {
                var l = e.getActiveUniform(a, s);
                i[l.name] = e.getUniformLocation(a, l.name)
            }
            return i
        }(a, n, u), r._vertexBuffer = (t = a, i = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e = t.createBuffer(), t.bindBuffer(t.ARRAY_BUFFER, e), t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW), e), r._framebuffer = a.createFramebuffer(), r._fieldData = {
            xMin: 0,
            yMin: 0,
            zMin: 0,
            xMax: 0,
            yMax: 0,
            zMax: 0
        }, r._updateUniforms(), r
    }
    return ht.Default.setShader("ht-particle-shader", "\nprecision highp float;\n\nuniform mat4  uPMatrix;    uniform mat4  uMVMatrix;   uniform mat4  uViewMatrix;   \nattribute float vs;\n\nuniform sampler2D u_particles;\nuniform float u_particles_res;\nuniform float u_point_size;\n\nvarying vec4 v_particle_pos;\n\nconst vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);\nfloat rand(const vec2 co) {\n    float t = dot(rand_constants.xy, co);\n    return fract(sin(t) * (rand_constants.z + t));\n}\n\nvoid main() {\n    vec4 color = texture2D(u_particles, vec2(\n        fract(vs / u_particles_res),\n        floor(vs / u_particles_res) / u_particles_res));\n\n    v_particle_pos = (color - 0.5) * 2.0;\n    gl_PointSize = u_point_size;\n    gl_Position = uPMatrix *  uMVMatrix * vec4(v_particle_pos.xyz, 1.0);\n}", "\nprecision highp float;\n\nuniform sampler2D u_field; \nuniform vec3 u_speed_min;\nuniform vec3 u_speed_max;\nuniform sampler2D u_color_ramp;\nuniform float u_point_alpha;\nuniform int u_fixedColor;\nuniform vec4 u_color;\n\nvarying vec4 v_particle_pos;\n\nvoid main() {\n\n    if(u_fixedColor == 1) {\n        gl_FragColor = u_color;\n        return;\n    }\n    vec3 velocity = mix(u_speed_min, u_speed_max, texture2D(u_field, v_particle_pos.xy).rgb);\n    float speed_t = length(velocity) / length(u_speed_max);\n\n                     vec2 ramp_pos = vec2(\n        0.5,\n        1.0 - speed_t);\n        \n    gl_FragColor = texture2D(u_color_ramp, ramp_pos);\n    gl_FragColor.a = u_point_alpha;\n}"), e
}();