! function () {
    "use strict";
    var i = function (t, i) {
            if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function")
        },
        t = function (t, i, e) {
            return i && s(t.prototype, i), e && s(t, e), t
        };

    function s(t, i) {
        for (var e = 0; e < i.length; e++) {
            var s = i[e];
            s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
        }
    }
    var b = ["jointNo", "jointDistance", "jointHinge", "jointPrisme", "jointSlide", "jointBall", "jointWheel"],
        a = Math.PI / 180,
        d = 57.29577951308232,
        e = (t(o, [{
            key: "setForceNodeMapping",
            value: function (t) {
                this._forceNodeMap = t
            }
        }, {
            key: "setConfigNodeMapping",
            value: function (t) {
                this._configNodeMap = t, this._updateConfigIndex()
            }
        }, {
            key: "setVelocityNodeMapping",
            value: function (t) {
                this._velocityNodeMap = t
            }
        }, {
            key: "setSdfNodeMapping",
            value: function (t) {
                this._sdfNodeMap = t
            }
        }, {
            key: "updateForceNodeMapping",
            value: function (t, i) {
                this._forceNodeMap[t] = i
            }
        }, {
            key: "updateConfigNodeMapping",
            value: function (t, i) {
                this._forceNodeMap[t] = i, this._updateConfigIndex()
            }
        }, {
            key: "updateSdfNodeMapping",
            value: function (t, i) {
                this._sdfNodeMap[t] = i
            }
        }, {
            key: "updateVelocityNodeMapping",
            value: function (t, i) {
                this._velocityNodeMap[t] = i
            }
        }, {
            key: "setParent",
            value: function (t) {
                this._parent = t
            }
        }, {
            key: "getWorld",
            value: function () {
                return this._world
            }
        }, {
            key: "getDebugInfo",
            value: function () {
                return this._world.getInfo()
            }
        }, {
            key: "createFromNode",
            value: function (t, i) {
                var e = t.getParent(),
                    s = t.getPhysics();
                e && e.a("phyCombineBody") && 0 == s.jointType || (s = void 0, s = (i || t).getPhysicsCombineShapes(), t.a("phyCombineBody") ? 0 == s.length ? console.log("No combined shapes found!") : i ? this._createShapes(i, s, t) : this._createShapes(t, s) : t instanceof ht.Polyline ? this._createRope(t) : t instanceof ht.Shape ? 0 < t.getThickness() ? this._createShapeWall(t) : this._createShapeFloor(t) : this._createSingleShape(t))
            }
        }, {
            key: "_createShapeWall",
            value: function (t) {
                var i = t.getPhysics(),
                    e = t._getPhysicsWallPoints();
                if (e) {
                    t.isClosePath() && e.push(e[0]);
                    var s, o = t._getPhysicsWallPos(e),
                        n = e.length,
                        a = t.getThickness(),
                        h = (t.getElevation(), t.getTall());
                    i.type = "box";
                    var r = [],
                        c = new ht.Math.Vector3;
                    c.fromArray([0, 1, 0]);
                    for (var y = new ht.Math.Quaternion, p = new ht.Math.Euler, l = 0; l < n - 1; l++) {
                        e[l].x, e[l + 1].x, e[l].y, e[l + 1].y;
                        var d, u = e[l + 1].x - e[l].x,
                            g = e[l + 1].y - e[l].y;
                        (s = Math.sqrt(u * u + g * g)) < 5 || (y.setFromAxisAngle(c, -Math.atan2(g, u)), d = t.getQuaternion().multiply(y), p.setFromQuaternion(d, "XYZ"), i.rot = [180 * p.x / Math.PI, 180 * p.y / Math.PI, 180 * p.z / Math.PI], i.pos = o[l], i.size = [s, h, a], (d = this._world.add(i))._htNode = t, r.push(d))
                    }
                    t.setPhysicsBody(r)
                }
            }
        }, {
            key: "createFromNodes",
            value: function (t, s) {
                var i, o = this,
                    n = [],
                    a = [];
                t.forEach(function (t) {
                    if (s && t.a("phyDeleteRun") && (t instanceof ht.Edge ? n : a).push(t), t.isPhysicsRigidBody && t.isPhysicsRigidBody()) {
                        var i = null;
                        if (t.a("phyCopyInfo")) {
                            var e = t.a("phyCopyFrom");
                            if (!(i = t.getDataModel().getDataByTag(e))) return
                        }
                        o.createFromNode(t, i)
                    }
                }), t.forEach(function (t) {
                    t.isPhysicsJoint && t.isPhysicsJoint() && o.createJoint(t)
                }), s && (i = void 0, 0 < n.length ? i = n[0].getDataModel() : 0 < a.length && (i = a[0].getDataModel()), i && (n.forEach(function (t) {
                    i.remove(t)
                }), a.forEach(function (t) {
                    i.remove(t)
                })))
            }
        }, {
            key: "removeFromNodes",
            value: function (t) {
                var s = this;
                t.forEach(function (t) {
                    if (t.getPhysicsBody) {
                        var i = t.getPhysicsBody();
                        if (i) {
                            if (t.setPhysicsBody(void 0), t instanceof ht.Polyline) {
                                var e = t.getPhysicsJoints();
                                if (!e) return;
                                return t.setPhysicsJoints(void 0), e.forEach(function (t) {
                                    t.htNode = void 0, s._world.removeJoint(t)
                                }), void i.forEach(function (t) {
                                    t.htNode = void 0, s._world.removeRigidBody(t)
                                })
                            }
                            return t instanceof ht.Shape ? t.getThickness() < 0 ? (i.htNode = void 0, void s._world.removeRigidBody(i)) : void i.forEach(function (t) {
                                t.htNode = void 0, s._world.removeRigidBody(t)
                            }) : t instanceof ht.Node ? (i.htNode = void 0, void s._world.removeRigidBody(i)) : t instanceof ht.Edge ? (i.htNode = void 0, void s._world.removeJoint(i)) : void 0
                        }
                    }
                })
            }
        }, {
            key: "createJoint",
            value: function (t) {
                var i, e, s, o = t.getPhysics(),
                    n = t.getPhysicsHtNodes();
                n.length < 2 || (s = {
                    type: b[o.jointType],
                    body1: n[0].getPhysicsBody(),
                    body2: n[1].getPhysicsBody(),
                    min: o.jointMin,
                    max: o.jointMax,
                    spring: [o.jointSpringFrequency, o.jointSpringDamping],
                    limit: [o.jointLimitLow, o.jointLimitUp],
                    motor: [o.jointMotorSpeed, o.jointMaxMotorForce],
                    axe1: o.jointAxis1,
                    pos1: o.jointPos1,
                    axe2: o.jointAxis2,
                    pos2: o.jointPos2,
                    collision: o.collision
                }, n[0] instanceof ht.Polyline && (i = 0, o.ropeEnd && (i = s.body1.length - 1), s.body1 = s.body1[i], delete s.spring, delete s.motor, s.min = .1, s.max = .1, s.type = s.type || 1), n[1] instanceof ht.Polyline && (e = 0, o.ropeEnd && (e = s.body2.length - 1), s.body2 = s.body2[e], delete s.spring, delete s.motor, s.min = .1, s.max = .1), e = this._world.add(s), t.setPhysicsBody(e), e._htNode = t, 6 == o.jointType && o.jointMotorSpeed2 && o.jointMaxMotorForce2 && e.rotationalLimitMotor2.setMotor(o.jointMotorSpeed2, o.jointMaxMotorForce2), s = void 0, 4 == (t = o.jointType) && (s = e.translationalLimitMotor), 1 != t && 3 != t && 2 != t || (s = e.limitMotor), s && (2 == t ? s.setLimit(o.jointMin * a, o.jointMax * a) : s.setLimit(o.jointMin * e.invScale, o.jointMax * e.invScale)))
            }
        }, {
            key: "_createShapes",
            value: function (t, i, e) {
                var s = ht.Default.getPhysicsBarycenter(i);
                e ? e.setAnchor3d(t.getAnchor3d(), !0) : t.setAnchorTo(s, !0);
                var o, n, a = void 0,
                    a = (e || t).getPhysics(),
                    h = void 0,
                    s = [180 * (h = (e || t).getEuler().reorder("XYZ")).x / Math.PI, 180 * h.y / Math.PI, 180 * h.z / Math.PI],
                    r = [],
                    c = [],
                    y = [],
                    p = [];
                a.rot = s, a.pos = t.p3();
                var l = t.getQuaternion();
                l.inverse();
                for (var d = new ht.Math.Vector3, u = void 0, g = i.length, f = 0; f < g; f++)
                    if (i[f].isPhysicsEnabled && i[f].isPhysicsEnabled()) {
                        o = i[f].getFinalScale3d();
                        var v = i[f].a("phyType");
                        switch (r.push(v), v) {
                            case "box":
                                u = o;
                                break;
                            case "cylinder":
                                u = [o[0] / 2, o[1], o[0] / 2];
                                break;
                            case "sphere":
                                u = [o[0] / 2]
                        }
                        p.push.apply(p, function (t) {
                            if (Array.isArray(t)) {
                                for (var i = 0, e = Array(t.length); i < t.length; i++) e[i] = t[i];
                                return e
                            }
                            return Array.from(t)
                        }(u)), n = [180 * (h = i[f].getLocalEuler().reorder("XYZ")).x / Math.PI, 180 * h.y / Math.PI, 180 * h.z / Math.PI], c.push(n[0], n[1], n[2]);
                        v = i[f].p3();
                        v[0] = v[0] - a.pos[0], v[1] = v[1] - a.pos[1], v[2] = v[2] - a.pos[2], d.fromArray(v), d.applyQuaternion(l), y.push(d.x, d.y, d.z)
                    } e && (a.pos = e.p3()), a.type = r, a.size = p, a.posShape = y, a.rotShape = c;
                s = this._world.add(a);
                return e ? (e.setPhysicsBody(s), s._htNode = e) : (t.setPhysicsBody(s), s._htNode = t), s
            }
        }, {
            key: "_createSingleShape",
            value: function (t) {
                var i = t.getPhysics(),
                    e = t.getFinalScale3d(),
                    s = t.getEuler().reorder("XYZ"),
                    o = i.type,
                    s = [180 * s.x / Math.PI, 180 * s.y / Math.PI, 180 * s.z / Math.PI];
                switch (i.rot = s, i.pos = t.p3(), o) {
                    case "box":
                        i.size = e;
                        break;
                    case "cylinder":
                        i.size = [e[0] / 2, e[1], e[0] / 2];
                        break;
                    case "sphere":
                        i.size = [e[0] / 2]
                }
                i = this._world.add(i);
                return t.setPhysicsBody(i), i._htNode = t, i
            }
        }, {
            key: "_createShapeFloor",
            value: function (t) {
                var i = t.getPhysics(),
                    e = t.getFinalScale3d(),
                    s = t.getEuler().reorder("XYZ"),
                    s = (i.type, [180 * s.x / Math.PI, 180 * s.y / Math.PI, 180 * s.z / Math.PI]);
                i.rot = s, i.pos = t.p3(), i.size = e;
                i = this._world.add(i);
                return t.setPhysicsBody(i), i._htNode = t, i
            }
        }, {
            key: "_createRope",
            value: function (t) {
                var i = [],
                    e = [],
                    s = t.getPhysics(),
                    o = void 0,
                    o = !1 !== t.a("phyRopeSizeCopy") ? t.getThickness() / 2 : t.a("phyRopeSize") / 2 || 10,
                    n = t.getPoints(),
                    a = n.length,
                    h = s.simPointsNum || a;
                h < 2 && (h = 2);
                for (var r = n.get(0), c = n.get(a - 1), y = (c.x - r.x) / h, p = (c.e - r.e) / h, l = (c.y - r.y) / h, d = [1], u = [], g = 0; g < h; g++) {
                    var f = n.get(g),
                        v = void 0,
                        v = h <= a ? [f.x, f.e, f.y] : [r.x + y * g, r.e + p * g, r.y + l * g];
                    u.push({
                        x: v[0],
                        e: v[1],
                        y: v[2]
                    });
                    f = s;
                    f.type = "sphere", f.pos = v, f.size = [o];
                    f = this._world.add(f);
                    f._htNode = t, f.isRope = !0, i.push(f)
                }
                t.setPoints(u);
                var c = t.a("phyRopeLength") || 1,
                    P = c / (2 * h - 2),
                    _ = void 0;
                1 == s.jointType && (_ = c / (h - 1) - 2 * (P = t.a("phyRopeOffset") || 0)) < 0 && (_ = 0, P = c / (2 * h - 2));
                for (var m = 0; m < h - 1; m++) {
                    d.push(2);
                    var M = {
                        type: b[s.jointType] || 1,
                        body1: i[m],
                        body2: i[m + 1],
                        spring: [s.jointSpringFrequency, s.jointSpringDamping],
                        collision: s.collision,
                        axe1: [0, 1, 0],
                        pos1: [0, P, 0],
                        axe2: [0, 1, 0],
                        pos2: [0, -P, 0]
                    };
                    1 == s.jointType && (M.min = _, M.max = _);
                    M = this._world.add(M);
                    e.push(M)
                }
                t.setSegments(d), t.setPhysicsBody(i), t.setPhysicsJoints(e)
            }
        }, {
            key: "_clearListReference",
            value: function (t) {
                for (; t;) t._htNode && (t._htNode.setPhysicsBody(null), delete t._htNode), t = t.next
            }
        }, {
            key: "clear",
            value: function () {
                this.stop(), this._clearListReference(this._world.rigidBodies), this._clearListReference(this._world.joints), this._world.clear()
            }
        }, {
            key: "isRunning",
            value: function () {
                return this._isRunning
            }
        }, {
            key: "enableDebugMode",
            value: function (t) {
                this._debugMode = t
            }
        }, {
            key: "getDebugMode",
            value: function () {
                return this._debugMode
            }
        }, {
            key: "enable3DInvisible",
            value: function (t) {
                this._notUpdate3d = t
            }
        }, {
            key: "get3DInvisible",
            value: function () {
                return this._notUpdate3d
            }
        }, {
            key: "start",
            value: function (t) {
                this._timer || (this._updateId = 0, this._isRunning = !0, this._loop(t))
            }
        }, {
            key: "stop",
            value: function () {
                cancelAnimationFrame(this._timer), this._timer = null, this._isRunning = !1
            }
        }, {
            key: "_loop",
            value: function (t) {
                var i = this;
                this._updateOimoPhysics(), t && t(), this._timer = requestAnimationFrame(function () {
                    i._loop(t)
                })
            }
        }, {
            key: "setWordStepLast",
            value: function (t) {
                this._stepLast = t
            }
        }, {
            key: "_updateOimoPhysics",
            value: function () {
                if (this._stepLast || this._world.step(), this._notUpdate3d) this._stepLast && this._world.step();
                else {
                    this._updateId++;
                    for (var t = this._world.rigidBodies, i = !1; t;) {
                        var e = t._htNode;
                        if (!t.isStatic && e) {
                            var s = e.getPhysics();
                            if (this._debugMode && e.a("phyIsSleeping", e.isPhysicsSleeping()), t.isKinematic) {
                                this._oimoQuaternion.fromArray(e.getQuaternion().toArray()), t.resetQuaternion(this._oimoQuaternion);
                                var o = e.p3();
                                t.setPosition({
                                    x: o[0],
                                    y: o[1],
                                    z: o[2]
                                }), t.isKinematic = !0, t = t.next
                            } else if (t.sleeping) t = t.next;
                            else {
                                if (t.isRope) {
                                    if (e._phyUpdateId != this._updateId) {
                                        e._phyUpdateId = this._updateId;
                                        for (var n = e.getPhysicsBody(), a = [], h = n.length, r = [], c = 0; c < h; c++) n[c].getPosition().toArray(r), a.push({
                                            x: r[0],
                                            e: r[1],
                                            y: r[2]
                                        });
                                        e.setPoints(a)
                                    }
                                } else {
                                    var y = [];
                                    t.getPosition().toArray(y), e.p3(y);
                                    var p = [];
                                    t.getQuaternion().toArray(p), this._htQuaternion.fromArray(p), e.setQuaternion(this._htQuaternion), this._checkSdf(y, e, t), this._checkVelocityControl(e, t), this._checkVelocityLimit(e, t), this._debugMode && (e.a("phyLVelocity", t.linearVelocity.length()), e.a("phyAVelocity", t.angularVelocity.length()), e.a("phyShowTrail") && e.updatePhysicsTrail(y, e.a("phyTrailPointsNum"), e.a("phyTrailMinDistance")))
                                }
                                this._debugMode && this._updateDebugInfo(e, t);
                                var l = s.forceType,
                                    o = s,
                                    p = s.applyForce;
                                7 == l && (d = s.configSrc, this._configNodeMap[d] && (s = this._configNodeMap[d].getPhysics(), p = p || s.applyForce, l = s.forceType));
                                var d, y = o.applyForceMode;
                                0 < l && p && (i = !0, y || e.a("phyApplyForce", !1), s.forcePos || (s.forcePos = [0, 0, 0]), 6 == l ? (.001 < t.angularVelocity.length() && t.angularVelocity.multiplyScalar(s.forceStrength), .001 < t.linearVelocity.length() && t.linearVelocity.multiplyScalar(s.forceStrength)) : 8 == l ? (t.linearVelocity.fromArray(s.forceInitLV), t.angularVelocity.fromArray(s.forceInitAV)) : (d = t.invScale, o = void 0, p = e.p3(), 4 <= l && 9 !== l ? o = 5 == l ? (y = s.forceNode, (y = this._forceNodeMap[y]) ? y.p3() : [0, 0, 0]) : s.forcePos : 2 == l ? ((o = s.forcePos)[0] = o[0] + p[0], o[1] = o[1] + p[1], o[2] = o[2] + p[2]) : 1 == l ? o = s.forcePos : 3 == l || 9 == l ? (o = s.forcePos, this._v0.fromArray(o), this._oimoQuaternion.fromArray(e.getQuaternion().toArray()), this._v0.applyQuaternion(this._oimoQuaternion), o[0] = this._v0.x + p[0], o[1] = this._v0.y + p[1], o[2] = this._v0.z + p[2]) : 6 == l && (o = p), 9 == l ? (this._v1.fromArray(s.forceValue), this._v1.applyQuaternion(this._oimoQuaternion)) : 4 <= l ? (this._v1.fromArray([o[0] - p[0], o[1] - p[1], o[2] - p[2]]), this._v1.normalize(), this._v1.multiplyScalar(s.forceStrength)) : this._v1.fromArray(s.forceValue), this._v0.fromArray(o), this._v0.multiplyScalar(d), t.applyImpulse(this._v0, this._v1))), t = t.next
                            }
                        } else t = t.next
                    }
                    if (i && 0 < this._configNodeIndex.length)
                        for (var u = this._configNodeIndex.length, g = void 0, f = 0; f < u; f++)(g = this._configNodeMap[this._configNodeIndex[f]]).a("phyApplyForceMode") || g.a("phyApplyForce", !1);
                    this._postPhysicsHandler && this._postPhysicsHandler(), this._stepLast && this._world.step()
                }
            }
        }, {
            key: "_checkSdf",
            value: function (t, i, e) {
                var s;
                i.a("phyHasSdf") && (s = i.a("phySdfId"), !(i = this._sdfNodeMap[s]) || (s = i.getSdfPosition(t)) && (i = e.linearVelocity, this._v0.fromArray(s.targetPos[0] - s.borderPos[0], s.targetPos[1] - s.borderPos[1], s.targetPos[2] - s.borderPos[2]), s.isOut && this._v0.multiplyScalar(-1), this._v0.normalize(), 0 < (t = this._v0.dot(i)) || (this._v0.multiplyScalar(-2 * t), this._v0.add(i), e.position.set(s.targetPos[0] * e.invScale, s.targetPos[1] * e.invScale, s.targetPos[2] * e.invScale), e.isKinematic = !1)))
            }
        }, {
            key: "_updateConfigIndex",
            value: function () {
                this._configNodeIndex = Object.keys(this._configNodeMap)
            }
        }, {
            key: "setPostPhysicsHandler",
            value: function (t) {
                this._postPhysicsHandler = t
            }
        }, {
            key: "setGravity",
            value: function (t) {
                t && this._world.setGravity(t)
            }
        }, {
            key: "setTimeStep",
            value: function (t) {
                t && (this._world.timeStep = 1 / t, this._world.timeRate = 1e3 * this._world.timeStep)
            }
        }, {
            key: "setIterations",
            value: function (t) {
                t < 4 && (t = 4), 20 < t && (t = 20), this._world.numIterations = t
            }
        }, {
            key: "setWorldScale",
            value: function (t) {
                t && (this._world.scale = t, this._world.invScale = 1 / t)
            }
        }, {
            key: "enableDebugInfo",
            value: function () {
                this._world.isStat = !0, this._world.performance || (this._world.performance = new OIMO.InfoDisplay(this._world))
            }
        }, {
            key: "disableDebugInfo",
            value: function () {
                this._world.isStat = !1
            }
        }, {
            key: "isContacting",
            value: function (t, i) {
                if (!t || !i) return !1;
                if (!t.contactLink) return !1;
                for (var e, s = t.contactLink; s;) {
                    if ((e = s.contact).body1.name == i.name || e.body2.name == i.name) return e.touching;
                    s = s.next
                }
                return !1
            }
        }, {
            key: "getPhysicsContacts",
            value: function (t) {
                var i = [];
                if (!t) return i;
                if (!t.contactLink) return i;
                for (var e, s = t.name, o = t.contactLink; o;)(e = o.contact).body1.name !== s ? i.push(e.body1._htNode) : e.body2.name !== s && i.push(e.body2._htNode), o = o.next;
                return i
            }
        }, {
            key: "_updateDebugInfo",
            value: function (t) {
                var i = t.getEdges();
                if (i)
                    for (var e, s, o, n, a, h, r, c, y = i.length, p = void 0, l = 0; l < y; l++) {
                        (p = i.get(l))._phyUpdateId != this._updateId && (e = p.getPhysicsBody(), p._phyUpdateId = this._updateId, s = p.getAttrObject(), o = p.getSource(), n = p.getTarget(), r = h = c = a = void 0, o instanceof ht.Polyline ? (r = o, h = [p.s("edge.source.anchor.x"), p.s("edge.source.anchor.elevation"), p.s("edge.source.anchor.y")]) : n instanceof ht.Polyline ? (r = n, h = [p.s("edge.target.anchor.x"), p.s("edge.target.anchor.elevation"), p.s("edge.target.anchor.y")]) : p.a("phyDistance", this._parent.getLineLength(p)), r && (a = r.getOffsetPoint(h), h = r.getPoints(), r = void 0, c = [(r = 0 == p.a("phyRopeEnd") ? h.get(0) : h.get(h.length - 1)).x, r.e, r.y], s.phyDistance = ht.Default.getDistance(a, c).toFixed(2)), e instanceof OIMO.HingeJoint ? s.phyLimitAngle = (e.limitMotor.angle * d).toFixed(1) : e instanceof OIMO.SliderJoint ? s.phyLimitAngle = (e.rotationalLimitMotor.angle * d).toFixed(1) : e instanceof OIMO.WheelJoint && (s.phyLimitAngle = (e.rotationalLimitMotor1.angle * d).toFixed(1), s.phyLimitAngle2 = (e.rotationalLimitMotor2.angle * d).toFixed(1)))
                    }
            }
        }, {
            key: "_checkVelocityControl",
            value: function (t, i) {
                if (t.a("phySetV")) {
                    var e = void 0,
                        s = void 0,
                        o = void 0,
                        n = void 0;
                    if (2 == t.a("phySetV")) {
                        var a = t.a("phyVSetSrc"),
                            a = this._velocityNodeMap[a];
                        if (!a) return;
                        if (1 !== a.a("phySetV")) return;
                        e = a.a("phyLVA"), s = a.a("phyLVB"), o = a.a("phyAVA"), n = a.a("phyAVB")
                    } else e = t.a("phyLVA"), s = t.a("phyLVB"), o = t.a("phyAVA"), n = t.a("phyAVB");
                    t = i.linearVelocity;
                    t.x = t.x * e[0] + s[0], t.y = t.y * e[1] + s[1], t.z = t.z * e[2] + s[2], (t = i.angularVelocity).x = t.x * o[0] + n[0], t.y = t.y * o[1] + n[1], t.z = t.z * o[2] + n[2]
                }
            }
        }, {
            key: "_checkVelocityLimit",
            value: function (t, i) {
                if (t.a("phyLimitV")) {
                    var e = void 0,
                        s = void 0;
                    if (2 == t.a("phyLimitV")) {
                        var o = t.a("phyVLimitSrc"),
                            o = this._velocityNodeMap[o];
                        if (!o) return;
                        if (1 !== o.a("phyLimitV")) return;
                        e = o.a("phyMaxLV"), s = o.a("phyMaxAV")
                    } else e = t.a("phyMaxLV"), s = t.a("phyMaxAV");
                    t = i.linearVelocity;
                    t.length() > e && (t.normalize(), t.multiplyScalar(e)), (t = i.angularVelocity).length() > s && (t.normalize(), t.multiplyScalar(s))
                }
            }
        }]), o);

    function o(t) {
        i(this, o), (t = t || {
            info: !1,
            worldscale: 100,
            timestep: 1 / 60,
            iterations: 16,
            gravity: [0, -9.8, 0],
            broadphase: 2
        }).gravity || (t.gravity = [0, -9.8, 0]), t.timestep || (t.timestep = 1 / 60), this._world = new OIMO.World(t), this._htQuaternion = new ht.Math.Quaternion, this._oimoQuaternion = new OIMO.Quat, this._v0 = new OIMO.Vec3, this._v1 = new OIMO.Vec3, this._v2 = new OIMO.Vec3, this._forceNodeMap = {}, this._configNodeMap = {}, this._sdfNodeMap = {}, this._velocityNodeMap = {}
    }
    var c = {
            jointType: 1,
            jointMin: 0,
            jointMax: 10,
            jointSpringFrequency: 1,
            jointSpringDamping: .2,
            jointLimitLow: 1,
            jointLimitUp: 0,
            jointMotorSpeed: 0,
            jointMaxMotorForce: 0,
            collision: !1,
            jointAxis1: [0, 1, 0],
            jointAxis2: [0, 1, 0],
            jointPos1: [0, 0, 0],
            jointPos2: [0, 0, 0],
            jointLimit: 2
        },
        f = "PHY_ARROW_VS",
        v = "top",
        u = "physicsAxisInd",
        g = "physicsAxisIndA",
        p = "physicsLimitInd",
        t = ht.Default.createSmoothConeModel(!0, 32);
    ht.Default.setShape3dModel(f, t);
    var y = Math.PI / 180,
        t = ht.Edge.prototype,
        n = t.getSerializableAttrs;
    t.getSerializableAttrs = function () {
        var t = n.apply(this, arguments);
        return delete t.phyShowAxis1, delete t.phyShowAxis2, delete t.phyShowLimit1, delete t.phyShowLimit2, t
    }, t.isPhysicsEnabled = function () {
        return this.a("phyEnabled")
    }, t.enablePhysics = function () {
        this.a("phyEnabled", !0)
    }, t.disablePhysics = function () {
        this.a("phyEnabled", !1)
    }, t.setPhysicsBody = function (t) {
        t ? this._physicsBody = t : delete this._physicsBody
    }, t.getPhysicsBody = function () {
        return this._physicsBody
    }, t.getPhysics = function () {
        var t, i, e = {},
            s = this.getAttrObject(),
            o = s.phyJointType;
        for (t in s) {
            0 === t.indexOf("phy") && (e[i = t[3].toLowerCase() + t.slice(4)] = 6 != o || "jointLimitLow" != i && "jointLimitUp" != i ? ht.Default.clone(s[t]) : s[t] * y)
        }
        return e
    };
    var l = t.onPropertyChanged;
    t.onPropertyChanged = function (t) {
        l.apply(this, arguments);
        var i = t.property;
        if (0 === i.indexOf("a:phy"))
            if ("a:phyEnabled" != i) {
                this.a("phyEnabled") && ("scale" != i && "scaleTall" != i && "width" != i && "height" != i && "tall" != i || (this.updatePhysicsJoint(), this.a("phyShowAxis1") && this.updatePhysicsJointAxis(1), this.a("phyShowAxis2") && this.updatePhysicsJointAxis(2), this.a("phyShowLimit1") && this.updatePhysicsJointLimit(1), this.a("phyShowLimit2") && this.updatePhysicsJointLimit(2)));
                var e = this.a("phyJointType"),
                    s = i[5].toLowerCase() + i.slice(6),
                    o = this.getPhysicsBody();
                if (o) {
                    var n = void 0,
                        a = void 0;
                    if (6 == e ? (n = o.rotationalLimitMotor1, a = o.rotationalLimitMotor2) : n = 4 == e ? o.translationalLimitMotor : o.limitMotor, !n) return;
                    i = this.getPhysics();
                    switch (s) {
                        case "collision":
                            o.allowCollision = this.a("phyCollision");
                            break;
                        case "jointMin":
                        case "jointMax":
                            1 != e && 3 != e && 4 != e || n.setLimit(i.jointMin * o.invScale, i.jointMax * o.invScale), 2 == e && n.setLimit(i.jointMin * y, i.jointMax * y), this.updatePhysicsJointLimit(1), this.updatePhysicsJointLimit(2);
                            break;
                        case "jointSpringFrequency":
                        case "jointSpringDamping":
                            n.setSpring(i.jointSpringFrequency, i.jointSpringDamping);
                            break;
                        case "jointMotorSpeed":
                        case "jointMaxMotorForce":
                            n.setMotor(i.jointMotorSpeed, i.jointMaxMotorForce), o.awake();
                            break;
                        case "jointMotorSpeed2":
                        case "jointMaxMotorForce2":
                            a.setMotor(i.jointMotorSpeed2, i.jointMaxMotorForce2), o.awake();
                            break;
                        case "jointLimitLow":
                        case "jointLimitUp":
                            n.setLimit(i.jointLimitLow * y, i.jointLimitUp * y)
                    }
                }
            } else {
                if (null != t.oldValue) return;
                for (var h in c) {
                    var r = "phy" + h[0].toUpperCase() + h.slice(1);
                    null == this.a(r) && this.a(r, ht.Default.clone(c[h]))
                }
            }
    }, t.getPhysicsHtNodes = function () {
        var t = [],
            i = this.getSource();
        return i.isPhysicsRigidBody() && t.push(i), (i = this.getTarget()).isPhysicsRigidBody() && t.push(i), t
    }, t.hasPhysicsRope = function () {
        for (var t = [this.getSource(), this.getTarget()], i = 0; i < 2; i++) {
            if (t[i] instanceof ht.Polyline) return !0
        }
        return !1
    }, t.isPhysicsEnds = function () {
        for (var t = [this.getSource(), this.getTarget()], i = 0, e = 0; e < 2; e++) {
            var s = t[e];
            if (!s.isPhysicsEnabled) return !1;
            if (!s.isPhysicsEnabled()) return !1;
            if (3 === s.a("phyMode")) return !1;
            s instanceof ht.Polyline && i++
        }
        return !(2 <= i)
    }, t._getPhysicsAxisPoint = function () {
        var t = this.getPhysics(),
            i = this.getPhysicsHtNodes();
        if (i.length < 2) return [];
        var e = t.jointPos1 || [0, 0, 0],
            s = t.jointPos2 || [0, 0, 0],
            o = i[0].p3(),
            n = i[1].p3(),
            t = new ht.Math.Vector3;
        return t.fromArray(e), t.applyQuaternion(i[0].getQuaternion()), e = t.toArray(), t.fromArray(s), t.applyQuaternion(i[1].getQuaternion()), s = t.toArray(), [
            [e[0] + o[0], e[1] + o[1], e[2] + o[2]],
            [s[0] + n[0], s[1] + n[1], s[2] + n[2]]
        ]
    }, t.updatePhysicsJoint = function () {
        var t, i, e, s = this._getPhysicsAxisPoint();
        s.length < 2 || (e = (i = (t = this).getPhysicsHtNodes())[0].getPointOffset(s[0]), s = i[1].getPointOffset(s[1]), t.s("edge.source.anchor.x", e[0]), t.s("edge.source.anchor.elevation", e[1]), t.s("edge.source.anchor.y", e[2]), t.s("edge.target.anchor.x", s[0]), t.s("edge.target.anchor.elevation", s[1]), t.s("edge.target.anchor.y", s[2]))
    }, t.isPhysicsJoint = function () {
        return this.isPhysicsEnabled()
    }, t.updatePhysicsJointAxis = function (t) {
        var i = void 0,
            e = void 0,
            s = void 0,
            o = void 0,
            n = void 0,
            a = void 0,
            h = this.getDataModel();
        if (h) {
            for (var r = this.getPhysics(), c = (a = 1 == t ? (i = r.showAxis1, s = r.jointAxis1, e = r.jointPos1, o = this._physicsAxis1, n = this._physicsAxisA1, this.getSource()) : (i = r.showAxis2, s = r.jointAxis2, e = r.jointPos2, o = this._physicsAxis2, n = this._physicsAxisA2, this.getTarget())).getChildren().toArray(), y = c.length, p = 0; p < y; p++) {
                if (c[p].a(u)) {
                    if (o === c[p]) continue;
                    o ? h.remove(c[p]) : o = c[p]
                }
                c[p].a(g) && n !== c[p] && (n ? h.remove(c[p]) : n = c[p])
            }
            if (!i) return o && h.remove(o), n && h.remove(n), void(1 == t ? (delete this._physicsAxis1, delete this._physicsAxisA1) : (delete this._physicsAxis2, delete this._physicsAxisA2));
            o || ((o = new ht.Polyline).setRenderLayer(v), h.add(o), o.setParent(a), o.setHost(a), o.setDisplayName("物理引擎辅助 - 轴")), n || ((l = new ht.Node).s("shape3d", f), l.s3([3, 5, 3]), l.setAnchorElevation(1), l.s({
                "shape3d.bottom.color": "yellow",
                "3d.selectable": !1,
                "shadow.cast": !1,
                "shadow.receive": !1
            }), l.setRenderLayer(v), h.add(l), l.setHost(a), l.setParent(a), (n = l).setDisplayName("物理引擎辅助 - 轴"));
            var i = a.p3(),
                l = new ht.Math.Vector3;
            l.fromArray(s), l.applyQuaternion(a.getQuaternion());
            s = l.clone();
            s.setLength(50), l.fromArray(e), l.applyQuaternion(a.getQuaternion());
            e = [], a = [l.x + s.x + i[0], l.y + s.y + i[1], l.z + s.z + i[2]];
            e.push({
                x: l.x + i[0],
                y: l.z + i[2],
                e: l.y + i[1]
            }, {
                x: a[0],
                y: a[2],
                e: a[1]
            }), o.setRotation3d([0, 0, 0]);
            l = new ht.Math.Matrix4, i = new ht.Math.Vector3([s.z, 0, -s.x]);
            l.lookAtDirection(i, s);
            s = new ht.Math.Euler;
            s.setFromRotationMatrix(l, ht.Math.Euler.ReverseOrder(n.getRotationMode)), n.setEuler(s), n.p3(a), o.setPoints(e), o.a(u, !0), n.a(g, !0), 1 == t ? (this._physicsAxis1 = o, this._physicsAxisA1 = n, o.s("shape.border.color", "green")) : (this._physicsAxis2 = o, this._physicsAxisA2 = n, o.s("shape.border.color", "yellow"))
        }
    }, t.updatePhysicsJointLimit = function (t) {
        var i = void 0,
            e = void 0,
            s = void 0,
            o = this.getDataModel();
        if (o) {
            for (var n = this.getPhysics(), a = (s = 1 == t ? (i = n.showLimit1, e = this._physicsLimit1, this.getTarget()) : (i = n.showLimit2, e = this._physicsLimit2, this.getSource())).getChildren().toArray(), h = a.length, r = 0; r < h; r++)
                if (a[r].a(p)) {
                    if (e === a[r]) break;
                    e ? o.remove(a[r]) : e = a[r];
                    break
                } if (!i) return e && o.remove(e), void(1 == t ? delete this._physicsLimit1 : delete this._physicsLimit2);
            var c, y = this._getPhysicsAxisPoint();
            y.length < 2 || (e || ((e = new ht.Node).setRenderLayer(v), o.add(e), e.setParent(s), e.setHost(s), e.s({
                shape3d: "cylinder",
                "light.mask": 1,
                "effect.flow.mask": 1,
                "3d.clipbox.mask": 0,
                "shadow.cast": !1,
                "shadow.receive": !1,
                "3d.reflectable": !1,
                "shape3d.side.to": 0,
                "shape3d.side.from": 0,
                "shape3d.side": 360,
                "shape3d.transparent": !0,
                "shape3d.opacity": .5,
                "shape3d.visible": !0,
                "shape3d.bottom.visible": !1,
                "shape3d.from.visible": !1,
                "shape3d.to.visible": !1,
                "shape3d.reverse.flip": !0
            }), e.setDisplayName("物理引擎辅助 - 范围")), n = c = void 0, n = 1 == t ? (c = 180 - this.a("phyJointMax"), 180 - this.a("phyJointMin")) : (c = this.a("phyJointMin"), this.a("phyJointMax")), c < 0 && (c += 360), n < 0 && (n += 360), e.a(p, !0), e.s3([200, 1, 200]), i = void 0, i = 1 == t ? ((this._physicsLimit1 = e).s("shape3d.color", "green"), e.p3(y[1]), e.s({
                "shape3d.side.to": n,
                "shape3d.side.from": c
            }), this.a("phyJointAxis2")) : ((this._physicsLimit2 = e).s("shape3d.color", "yellow"), e.p3(y[0]), e.s({
                "shape3d.side.to": n,
                "shape3d.side.from": c
            }), this.a("phyJointAxis1")), (c = new ht.Math.Vector3(i)).normalize(), c.applyQuaternion(s.getQuaternion()), i = new ht.Math.Vector3([0, 1, 0]), (s = new ht.Math.Quaternion).setFromToVectors(i, c), e.setQuaternion(s))
        }
    }, t.syncPhysicsAxisDir = function (t) {
        t ? this.a("phyJointAxis2", this.a("phyJointAxis1")) : this.a("phyJointAxis1", this.a("phyJointAxis2"))
    }, t.syncPhysicsAxisPos = function (t) {
        var i = this.getSource(),
            e = this.getTarget(),
            s = this.a("phyJointPos1"),
            o = this.a("phyJointPos2"),
            n = new ht.Math.Vector3,
            a = new ht.Math.Vector3,
            h = e,
            r = i,
            c = o,
            o = "phyJointPos1";
        t && (h = i, r = e, c = s, o = "phyJointPos2"), n.fromArray(c), n.applyQuaternion(h.getQuaternion()), a.fromArray(h.p3()), n.add(a), a.fromArray(r.p3()), n.sub(a), n.applyQuaternion(r.getQuaternion().inverse()), this.a(o, n.toArray())
    }, t.setPhysicsTop = function (t) {
        var i = "main";
        t && (i = "top");
        for (var e = [this.getSource(), this.getTarget()], s = 0; s < 2; s++) {
            var o = e[s].getChildren();
            if (!o) return;
            for (var n = o.length, a = 0; a < n; a++) {
                var h = o.get(a);
                (h.a(u) || h.a(g)) && h.setRenderLayer(i)
            }
        }
    }, t.setPhysicsTransparent = function (t) {
        var i = 1;
        t && (i = .6);
        for (var e = [this.getSource(), this.getTarget()], s = 0; s < 2; s++) {
            var o = e[s].getChildren();
            if (!o) return;
            for (var n = o.length, a = 0; a < n; a++) {
                var h = o.get(a);
                (h.a(u) || h.a(u)) && h.s({
                    "shape3d.transparent": t,
                    "shape3d.opacity": i,
                    "shape3d.reverse.flip": !0
                })
            }
        }
    }, t.syncPhysicsRotation = function (t) {
        var i = this.getSource(),
            e = this.getTarget(),
            s = this.a("phyJointPos1"),
            o = this.a("phyJointPos2"),
            n = this.a("phyJointAxis1"),
            a = this.a("phyJointAxis2"),
            h = new ht.Math.Vector3,
            r = new ht.Math.Vector3,
            c = e,
            y = i,
            p = o,
            l = a,
            o = n;
        t && (c = i, y = e, p = s, l = n, o = a);
        a = y.getAnchor3d();
        h.fromArray(p), h.applyQuaternion(c.getQuaternion()), r.fromArray(c.p3()), h.add(r);
        p = y.getPointOffset(h.toArray());
        y.setAnchor3d(p, !0), h.fromArray(l), h.applyQuaternion(c.getQuaternion()), r.fromArray(o), r.applyQuaternion(y.getQuaternion());
        o = new ht.Math.Quaternion;
        o.setFromToVectors(r, h);
        h = y.getQuaternion();
        o.multiply(h), y.setQuaternion(o), y.setAnchor3d(a, !0)
    }, t.syncPhysicsRotation2 = function (t) {
        var i = this.getSource(),
            e = this.getTarget(),
            s = "phyJointAxis1",
            o = e,
            n = i,
            a = this.a("phyJointAxis1"),
            h = this.a("phyJointAxis2"),
            r = new ht.Math.Vector3,
            c = new ht.Math.Vector3,
            y = h,
            p = a;
        t && (o = i, n = e, y = a, p = h, s = "phyJointAxis2"), r.fromArray(y), r.applyQuaternion(o.getQuaternion()), r.normalize(), c.fromArray(p), c.applyQuaternion(n.getQuaternion()), c.normalize();
        p = new ht.Math.Quaternion;
        p.setFromToVectors(c, r), c.applyQuaternion(p), c.applyQuaternion(n.getQuaternion().inverse()), this.a(s, c.toArray())
    }, t.saveDataForPhysics = function () {}, t.restoreDataForPhysics = function () {}, t.setPhysicsJointAngle = function (t) {
        this._setPhysicsJointMinMax(t, t)
    }, t._setPhysicsJointMinMax = function (t, i) {
        var e, s, o, n = this.getPhysicsBody();
        n && (e = void 0, 4 == (s = this.a("phyJointType")) ? e = n.translationalLimitMotor : 2 != s && 1 != s && 3 != s || (e = n.limitMotor), e && ((o = this.getAttrObject()).phyJointMin = t, o.phyJointMax = i, 1 != s && 3 != s && 4 != s || e.setLimit(t * n.invScale, i * n.invScale), 2 == s && e.setLimit(t * y, i * y), n.awake()))
    }, t.setPhysicsJointDistance = function (t) {
        this._setPhysicsJointMinMax(t, t)
    }, t.setPhysicsJointNoLimit = function () {
        this._setPhysicsJointMinMax(1, 0)
    }, t.physicsAwake = function () {
        var t = this.getPhysicsBody();
        if (!t) return null;
        t.awake()
    };
    var r = {
            type: "sphere",
            density: 1,
            friction: .2,
            restitution: .2,
            belongsTo: 1,
            collidesWith: 255,
            neverSleep: !1,
            forceType: 0,
            mode: 1
        },
        P = "physicsForce",
        _ = "physicsForceA",
        h = "physicsTrail",
        t = ht.Node.prototype,
        m = t.onPropertyChanged,
        M = t.getSerializableAttrs;
    t.getPhysics = function () {
        var t, i, e, s = {},
            o = this.getAttrObject();
        for (t in o) {
            0 === t.indexOf("phy") && ("mode" == (i = t[3].toLowerCase() + t.slice(4)) && (0 == (e = o[t]) ? s.move = !1 : 1 == e ? (s.move = !0, s.kinematic = !1) : (s.move = !0, s.kinematic = !0)), s[i] = ht.Default.clone(o[t]))
        }
        return s
    }, t.getSerializableAttrs = function () {
        var t = M.apply(this, arguments);
        return delete t.phyIsSleeping, delete t.phyShowTrail, delete t.phyTrailPointsNum, delete t.phyTrailMinDistance, delete t.phyLVelocity, delete t.phyAVelocity, t
    }, t.onPropertyChanged = function (t) {
        var e = this;
        m.apply(this, arguments);
        var i = t.property;
        if (0 === i.indexOf("a:phy"))
            if ("a:phyEnabled" != i) {
                if (this.a("phyEnabled")) {
                    var s = t.newValue,
                        o = this.getPhysicsBody();
                    if (o)
                        if (this instanceof ht.Polyline || this instanceof ht.Shape && 0 <= this.getThickness()) switch (i) {
                            case "a:phyNeverSleep":
                                this.a("phyNeverSleep") && 1 == this.a("phyMode") ? o.forEach(function (t) {
                                    t.allowSleep = !1, t.sleeping = !1, t.awake()
                                }) : o.forEach(function (t) {
                                    t.allowSleep = !0
                                });
                                break;
                            case "a:phyDensity":
                                o.forEach(function (t) {
                                    e._updatePhysicsShapeData(t, "density", e.a("phyDensity"));
                                    var i = OIMO.BODY_DYNAMIC;
                                    0 == e.a("phyMode") && (i = OIMO.BODY_STATIC), t.setupMass(i, !0)
                                });
                                break;
                            case "a:phyBelongTo":
                                o.forEach(function (t) {
                                    e._updatePhysicsShapeData(t, "belongsTo", e.a("phyBelongTo"))
                                });
                                break;
                            case "a:phyCollidesWith":
                                o.forEach(function (t) {
                                    e._updatePhysicsShapeData(o, "collidesWith", e.a("phyCollidesWith"))
                                })
                        } else switch (i) {
                            case "a:phyNeverSleep":
                                this.a("phyNeverSleep") && 1 == this.a("phyMode") ? (o.allowSleep = !1, o.sleeping = !1, o.awake()) : o.allowSleep = !0;
                                break;
                            case "a:phyDensity":
                                this._updatePhysicsShapeData(o, "density", this.a("phyDensity"));
                                var n = OIMO.BODY_DYNAMIC;
                                0 == this.a("phyMode") && (n = OIMO.BODY_STATIC), o.setupMass(n, !0);
                                break;
                            case "a:phyForceDir":
                            case "a:phyForceStrength":
                            case "a:phyForceType":
                            case "a:phyApplyForce":
                                0 < this.a("phyForceType") && (o.sleeping = !1, o.awake());
                                break;
                            case "a:phyRestitution":
                                this.updatePhysicsRestitution(s);
                                break;
                            case "a:phyFriction":
                                this.updatePhysicsFriction(s);
                                break;
                            case "a:phyBelongTo":
                                this._updatePhysicsShapeData(o, "belongsTo", this.a("phyBelongTo"));
                                break;
                            case "a:phyCollidesWith":
                                this._updatePhysicsShapeData(o, "collidesWith", this.a("phyCollidesWith"))
                        }("a:phyForceDir" == i || "a:phyForceStrength" == i) && (this.a("phyForceType") < 4 || 9 == this.a("phyForceType")) && this.a("phyForceDir") && ((n = new ht.Math.Vector3(this.a("phyForceDir"))).normalize(), n.setLength(this.a("phyForceStrength")), this._attrObject.phyForceValue = n.toArray()), "a:phyMode" == i && o && (this instanceof ht.Polyline || this instanceof ht.Shape && 0 <= this.getThickness() || (0 == s && (o.isKinematic = !1, o.move = !1, o.setupMass(OIMO.BODY_STATIC)), 1 == s && (o.isKinematic = !1, o.move = !0, o.setupMass(OIMO.BODY_DYNAMIC)), 2 == s && (o.isKinematic = !0, o.move = !0, o.setupMass(OIMO.BODY_DYNAMIC))))
                }
            } else {
                if (1 != t.newValue) return void this.a("phyShowForce", !1);
                switch (this.s("shape3d")) {
                    case "box":
                    case "sphere":
                    case "cylinder":
                        this.a("phyType", this.s("shape3d")), this.setAnchor3d([.5, .5, .5], !0);
                        break;
                    case "plane":
                        this.a("phyType", "box"), this.setAnchor3d([.5, 0, .5], !0), this.a("phyMode", 0)
                }
                if (this.s("shape3d") || (this.a("phyType", "box"), this.setAnchor3d([.5, .5, .5], !0)), null != t.oldValue) return;
                for (var a in r) {
                    var h = "phy" + a[0].toUpperCase() + a.slice(1);
                    null == this.a(h) && this.a(h, ht.Default.clone(r[a]))
                }
                this instanceof ht.Polyline && (null == this.a("phySimPointsNum") && this.a("phySimPointsNum", 2), null == this.a("phyJointType") && this.a("phyJointType", 1))
            }
    }, t.isShowPhysicsWall = function () {
        return !1
    }, t.isShowPhysicsFloor = function () {
        return !1
    }, t.isPhysicsEnabled = function () {
        return this.a("phyEnabled")
    }, t.isPhysicsRigidBody = function () {
        if (!this.isPhysicsEnabled()) return !1;
        var t = this.getParent();
        return !(t && t.isPhysicsEnabled && t.isPhysicsEnabled() && t.a("phyCombineBody")) && (3 != this.a("phyMode") && this.isPhysicsEnabled())
    }, t.getPhysicsCombineShapes = function () {
        var t = [];
        if (!this.a("phyCombineBody")) return t;
        for (var i = this.getChildren().toArray(), e = i.length, s = 0; s < e; s++) i[s].isPhysicsEnabled && i[s].isPhysicsEnabled() && i[s] instanceof ht.Node && t.push(i[s]);
        return t
    }, t.setPhysicsBody = function (t) {
        t ? this._physicsBody = t : delete this._physicsBody
    }, t.getPhysicsBody = function () {
        return this._physicsBody
    }, t.syncPositionToPhysics = function (t) {
        var i;
        this._physicsBody && (i = this.p3(), this._physicsBody.isKinematic = !0, this._physicsBody.setPosition({
            x: i[0],
            y: i[1],
            z: i[2]
        }), this._physicsBody.isKinematic = t)
    }, t.syncRotationToPhysics = function (t) {
        var i;
        this._physicsBody && (i = new OIMO.Quat, this._physicsBody.isKinematic = !0, i.fromArray(this.getQuaternion().toArray()), this._physicsBody.setQuaternion(this._oimoQuaternion), this._physicsBody.isKinematic = t)
    }, t.syncToPhysics = function (t) {
        var i;
        this._physicsBody && (i = new OIMO.Quat, this._physicsBody.isKinematic = !0, i.fromArray(this.getQuaternion().toArray()), this._physicsBody.resetQuaternion(i), i = this.p3(), this._physicsBody.setPosition({
            x: i[0],
            y: i[1],
            z: i[2]
        }), this._physicsBody.isKinematic = t)
    }, t.resetPhysicsPosition = function (t) {
        this._physicsBody && (this._physicsBody.position && this._physicsBody.position.copy(t).multiplyScalar(this._physicsBody.invScale), this._physicsBody.resetPosition && this._physicsBody.resetPosition(t[0], t[1], t[2]))
    }, t.resetPhysicsRotation = function (t) {
        this._physicsBody && this._physicsBody.resetRotation && this._physicsBody.resetRotation(t[0], t[1], t[2])
    }, t.resetPhysicsQuaternion = function (t) {
        this._physicsBody && this._physicsBody.resetQuaternion && this._physicsBody.resetQuaternion(t)
    }, t.updatePhysicsFriction = function (t) {
        this._physicsBody && this._updatePhysicsShapeData(this._physicsBody, "friction", t)
    }, t.updatePhysicsRestitution = function (t) {
        this._physicsBody && this._updatePhysicsShapeData(this._physicsBody, "restitution", t)
    }, t.getPointOffset = function (t) {
        var i = this.getFinalScale3d(),
            e = this.getAnchor3d(),
            s = this.p3(),
            o = void 0,
            n = i[0],
            a = i[1],
            h = i[2],
            r = t[0] - s[0],
            c = t[1] - s[1],
            o = t[2] - s[2],
            s = this.getQuaternion();
        s.inverse();
        o = new ht.Math.Vector3(r, c, o);
        return o.applyQuaternion(s), [o.x / n + e.x, o.y / a + e.y, o.z / h + e.z]
    }, t.getOffsetPoint = function (t) {
        var i = this.getFinalScale3d(),
            e = void 0,
            s = this.getAnchor3d(),
            o = this.p3(),
            n = i[0],
            a = i[1],
            h = i[2],
            r = n * (t[0] - s.x),
            e = a * (t[1] - s.y),
            c = h * (t[2] - s.z),
            e = new ht.Math.Vector3(r, e, c),
            c = this.getEuler();
        return e.applyEuler(c), [o[0] + e.x, o[1] + e.y, o[2] + e.z]
    }, t.setAnchorTo = function (t) {
        var i = this,
            e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
            s = this.getAttaches();
        (s = s && s.toArray()) && s.forEach(function (t) {
            t.setHost(null)
        }), this.setAnchor3d(this.getPointOffset(t), e), s && s.forEach(function (t) {
            t.setHost(i)
        })
    }, t.isPhysicsCombinedShape = function () {
        var t = this.getParent();
        return !!t && (!!t.isPhysicsEnabled && (!!t.isPhysicsEnabled() && t.a("phyCombineBody")))
    }, t.saveDataForPhysics = function () {
        this._phyOldP3 = this.p3(), this._phyOldRot = this.getRotation3d()
    }, t.restoreDataForPhysics = function () {
        this._phyOldP3 && (this.resetPhysicsPosition(this._phyOldP3), this.p3(this._phyOldP3)), this._phyOldRot && (this.resetPhysicsRotation([180 * this._phyOldRot[0] / Math.PI, 180 * this._phyOldRot[1] / Math.PI, 180 * this._phyOldRot[2] / Math.PI]), this.setRotation3d(this._phyOldRot))
    }, t.updatePhysicsForceArrow = function () {
        if (this.a("phyForcePos")) {
            var t = this.a("phyForceType");
            if (8 != t) {
                var i = this.a("phyForcePos").slice(0),
                    e = this.a("phyForceDir").slice(0),
                    s = this.a("phyShowForce"),
                    o = void 0,
                    n = void 0,
                    a = this.getDataModel();
                if (a) {
                    o = this._physicsForceNode, n = this._physicsForceNodeA;
                    for (var h = this.getChildren().toArray(), r = h.length, c = 0; c < r; c++) {
                        if (h[c].a(P)) {
                            if (o === h[c]) continue;
                            o ? a.remove(h[c]) : o = h[c]
                        }
                        h[c].a(_) && n !== h[c] && (n ? a.remove(h[c]) : n = h[c])
                    }
                    if (!s) return o && a.remove(o), n && a.remove(n), delete this._physicsForceNode, void delete this._physicsForceNodeA;
                    o || ((o = new ht.Polyline).setRenderLayer(v), o.s("shape.border.color", "rgb(240,225,19)"), a.add(o), o.setParent(this), o.setDisplayName("物理引擎辅助 - 力")), n || ((y = new ht.Node).s("shape3d", f), y.s3([12, 20, 12]), y.setAnchorElevation(1), y.s({
                        "shape3d.bottom.color": "red",
                        "shape3d.color": "yellow",
                        "3d.selectable": !1,
                        "shadow.cast": !1,
                        "shadow.receive": !1
                    }), y.setRenderLayer(v), a.add(y), y.setParent(this), (n = y).setDisplayName("物理引擎辅助 - 力"));
                    var y, p, l = void 0,
                        d = new ht.Math.Vector3,
                        u = this.p3();
                    switch (t) {
                        case 1:
                            l = i;
                            break;
                        case 9:
                        case 3:
                            d.fromArray(i), d.applyQuaternion(this.getQuaternion()), l = [d.x + u[0], d.y + u[1], d.z + u[2]];
                            break;
                        case 2:
                            l = [i[0] + u[0], i[1] + u[1], i[2] + u[2]];
                            break;
                        case 4:
                        case 5:
                            l = u;
                            break;
                        default:
                            return
                    }
                    t < 4 ? d.fromArray(e) : (p = g = void 0, p = 5 == t ? (s = void 0, (y = this.a("phyForceNode")) && (s = a.getDataByTag(y)) ? s.p3() : [0, 0, 0]) : 9 == t ? (d.fromArray(e), d.applyQuaternion(this.getQuaternion()), d.toArray()) : i, g = 9 == t ? p : [p[0] - u[0], p[1] - u[1], p[2] - u[2]], d.fromArray(g), d.normalize(), d.multiplyScalar(Math.sign(this.a("phyForceStrength"))), e = d.toArray()), d.setLength(150);
                    var u = [],
                        g = [d.x + l[0], d.y + l[1], d.z + l[2]];
                    u.push({
                        x: l[0],
                        y: l[2],
                        e: l[1]
                    }, {
                        x: g[0],
                        y: g[2],
                        e: g[1]
                    }), o.setPoints(u);
                    u = new ht.Math.Matrix4;
                    d.fromArray(e);
                    e = new ht.Math.Vector3([e[2], 0, -e[0]]);
                    u.lookAtDirection(e, d);
                    d = new ht.Math.Euler;
                    d.setFromRotationMatrix(u, ht.Math.Euler.ReverseOrder(n.getRotationMode)), n.setEuler(d), n.p3(g), this._physicsForceNode = o, this._physicsForceNodeA = n, o.a(P, !0), n.a(_, !0)
                }
            }
        }
    }, t.isPhysicsContacting = function (t) {
        var i = t.getPhysicsBody(),
            t = this._physicsBody;
        return !(!t || !i) && t.parent.checkContact(t.name, i.name)
    }, t.getPhysicsContacts = function () {
        var t = this._physicsBody,
            i = [];
        if (!t) return i;
        if (!t.contactLink) return i;
        for (var e, s = t.name, o = t.contactLink; o;)(e = o.contact).body1.name !== s ? i.push(e.body1._htNode) : e.body2.name !== s && i.push(e.body2._htNode), o = o.next;
        return i
    }, t.updatePhysicsBaryCenter = function () {
        var t = this.getPhysicsCombineShapes();
        0 != t.length && (t = ht.Default.getPhysicsBarycenter(t), this.setAnchorTo(t, !0))
    }, t.isPhysicsSleeping = function () {
        return !!this._physicsBody && this._physicsBody.sleeping
    }, t._updatePhysicsShapeData = function (t, i, e) {
        for (var s = t.shapes; s;) s[i] = e, s = s.next
    }, ht.Default.getPhysicsBarycenter = function (t) {
        var o = 0,
            n = void 0,
            a = void 0,
            h = void 0,
            n = 0,
            a = 0,
            h = 0;
        return t.forEach(function (t) {
            var i = t.p3(),
                e = t.getFinalScale3d(),
                s = void 0;
            switch (t.s("shape3d") || "box") {
                case "box":
                    s = e[0] * e[1] * e[2];
                    break;
                case "cylinder":
                    s = e[0] * e[0] * Math.PI / 4 * e[1];
                    break;
                case "sphere":
                    s = e[0] * e[0] * e[0] * Math.PI / 6
            }
            o += s, n += s * i[0], a += s * i[1], h += s * i[2]
        }), [n / o, a / o, h / o]
    }, t.getPhysicsLinearVelocity = function () {
        var t = this.getPhysicsBody();
        return t ? t.linearVelocity : null
    }, t.getPhysicsAngularVelocity = function () {
        var t = this.getPhysicsBody();
        return t ? t.angularVelocity : null
    }, t.setPhysicsLinearVelocity = function (t) {
        var i = this.getPhysicsBody();
        if (!i) return null;
        i.linearVelocity.fromArray(t)
    }, t.setPhysicsAngularVelocity = function (t) {
        var i = this.getPhysicsBody();
        if (!i) return null;
        i.angularVelocity.fromArray(t)
    }, t.setPhysicsVelocity = function (t, i) {
        t && this.setPhysicsLinearVelocity(t), i && this.setPhysicsAngularVelocity(i)
    }, t.getPhysicsIsSleeping = function () {
        var t = this.getPhysicsBody();
        return t ? t.sleeping : null
    }, t.showPhysicsTrail = function (t) {
        var i, e = this,
            s = this.getDataModel();
        t ? this._physicsTail ? this._physicsTail.getDataModel() || (s.add(this._physicsTail), this._physicsTail.setParent(this)) : (this._lastPhysicsPoint = [0, 0, 0], this._physicsTail || (i = this.getChildren()) && i.forEach(function (t) {
            e._physicsTail ? s.remove(t) : t.a(h) && (e._physicsTail = t)
        }), this._physicsTail || (i = new ht.Polyline, this._physicsTail = i, s.add(i), i.setParent(this), i.a(h, !0), i.s("shape.border.color", "red"))) : this._physicsTail && (this._physicsTail.setPoints([]), this._physicsTail.getDataModel() && s.remove(this._physicsTail))
    }, t.updatePhysicsTrail = function (t) {
        var i = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 60,
            e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : .2,
            s = this._physicsTail.getPoints();
        s.length >= i && s.shift(), ht.Default.getDistance(this._lastPhysicsPoint, t) < e || (this._lastPhysicsPoint = t, s.push({
            x: t[0],
            e: t[1],
            y: t[2]
        }), this._physicsTail.iv())
    }, t.physicsAwake = function () {
        var t = this.getPhysicsBody();
        if (!t) return null;
        t.awake()
    }, t.applyPhysicsForce = function (t) {
        var i;
        t ? t.stop ? this.a("phyApplyForce", !1) : (t.dir ? this.a("phyForceDir", t.dir) : this.a("phyForceDir") || this.a("phyForceDir", [1, 0, 0]), t.pos ? this.a("phyForcePos", t.pos) : this.a("phyForcePos") || this.a("phyForcePos", [0, 0, 0]), i = 2, t.type && (i = t.type), this.a("phyForceType", i), t.strength && this.a("phyForceStrength", t.strength), t.once ? this.a("phyApplyForceMode", !1) : this.a("phyApplyForceMode", !0), this.a("phyApplyForce", !0)) : this.a("phyApplyForce", !0)
    }, t.setPhysicsVelocityLimit = function (t) {
        t ? (t.maxLinear && (node.a("phyLimitV", 1), node.a("phyMaxLV", t.maxLinear), node.a("phyMaxAV", 1e4)), t.maxLinear && (node.a("phyLimitV", 1), node.a("phyMaxAV", t.maxAngular), null == node.a("phyMaxLV") && node.a("phyMaxLV", 1e4))) : this.a("phyLimitV", 0)
    }, t.disablePhysicsVelocityLimit = function () {
        this.a("phyLimitV", 0)
    };
    var A = {};
    t.setPhysicsVelocityControl = function (t) {
        t && !1 !== t.enable ? (this.a("phySetV", 1), t.linearA || (t.linearA = [1, 1, 1]), t.linearB || (t.linearB = [0, 0, 0]), t.angularA || (t.angularA = [1, 1, 1]), t.angularB || (t.angularB = [0, 0, 0]), this.a("phyLVA", t.linearA), this.a("phyLVB", t.linearB), this.a("phyAVA", t.angularA), this.a("phyAVB", t.angularB)) : this.a("phySetV", 0)
    }, ht.Default.setPhysicsConstraint = function () {}, ht.Default.getPhysicsConstraint = function () {
        return A
    };
    var t = ht.Shape.prototype,
        S = t.onPropertyChanged,
        x = "physicsWall";
    t.onPropertyChanged = function (t) {
        S.apply(this, arguments);
        var i = t.property;
        if (0 === i.indexOf("a:phy") && "a:phyEnabled" == i) {
            if (null != t.oldValue) return;
            if (1 != t.newValue) return;
            this.a("phyMode", 0)
        }
    }, t.isShowPhysicsWall = function () {
        return this._isShowPhySplittedWall
    }, t.isShowPhysicsFloor = function () {
        return this._isShowPhySplittedWall
    }, t._getPhysicsWallPoints = function () {
        var t = this.getPoints();
        if (!t) return null;
        var i = t.toArray(),
            e = this.getSegments();
        if (e) {
            for (var s = [], o = e.length, n = (i.length, 0), a = 0; n < o; n++) {
                e.get(n) <= 2 ? (s.push(i[a]), a++) : 3 != e.get(n) ? 4 != e.get(n) || (a += 2, s.push(i[a]), a++) : (a++, s.push(i[a]), a++)
            }
            i = s
        }
        this.getQuaternion();
        var h = this.p3(),
            t = this.getScale3d(),
            r = [],
            c = i.length,
            y = new ht.Math.Vector3,
            p = new ht.Math.Vector3;
        p.fromArray(t);
        for (var l = 0; l < c; l++) y.fromArray([i[l].x - h[0], i[l].e - h[1], i[l].y - h[2]]), y.multiply(p), r.push({
            x: y.x + h[0],
            e: y.y + h[1],
            y: y.z + h[2]
        });
        return r
    }, t._getPhysicsWallPos = function (t) {
        for (var i = this.getQuaternion(), e = [], s = t.length, o = new ht.Math.Vector3, n = new ht.Math.Vector3, a = this.p3(), h = 0; h < s - 1; h++) o.fromArray([t[h].x - a[0], 0, t[h].y - a[2]]), n.fromArray([t[h + 1].x - a[0], 0, t[h + 1].y - a[2]]), o.add(n), o.multiplyScalar(.5), o.applyQuaternion(i), e.push([o.x + a[0], o.y + a[1], o.z + a[2]]);
        return e
    }, t.showPhysicsWall = function (t) {
        var i = this.getDataModel();
        if (i && (this._isShowPhySplittedWall = t, this.getChildren().toArray().forEach(function (t) {
                t.a(x) && i.remove(t)
            }), t)) {
            var e = this._getPhysicsWallPoints();
            if (e) {
                this.isClosePath() && e.push(e[0]);
                var s = this._getPhysicsWallPos(e),
                    o = e.length,
                    n = this.getThickness(),
                    a = (this.getElevation(), this.getTall()),
                    h = new ht.Math.Vector3;
                h.fromArray([0, 1, 0]);
                for (var r = new ht.Math.Euler, c = new ht.Math.Quaternion, y = 0; y < o - 1; y++) {
                    var p = new ht.Node,
                        l = (e[y].x, e[y + 1].x, e[y].y, e[y + 1].y, e[y + 1].x - e[y].x),
                        d = e[y + 1].y - e[y].y,
                        u = Math.sqrt(l * l + d * d);
                    p.s3([u, a, n]), p.p3(s[y]), c.setFromAxisAngle(h, -Math.atan2(d, l)), r.setFromQuaternion(this.getQuaternion().multiply(c)), p.setEuler(r), i.add(p), p.setParent(this), p.a(x, !0)
                }
            }
        }
    }, t.showPhysicsFloor = function (t) {
        var i, e = this.getDataModel();
        e && (this._isShowPhySplittedWall = t, this.getChildren().toArray().forEach(function (t) {
            t.a(x) && e.remove(t)
        }), t && (i = this.getFinalScale3d(), (t = new ht.Node).s3(i), t.p3(this.p3()), t.setRotation3d(this.getRotation3d()), e.add(t), t.setParent(this), t.a(x, !0)))
    }, t.updatePhysicsFriction = function (i) {
        var e = this;
        this._physicsBody && this._physicsBody.forEach(function (t) {
            e._updatePhysicsShapeData(t, "friction", i)
        })
    }, t.updatePhysicsRestitution = function (i) {
        var e = this;
        this._physicsBody && this._physicsBody.forEach(function (t) {
            e._updatePhysicsShapeData(t, "restitution", i)
        })
    };
    var t = ht.Polyline.prototype,
        w = t.onPropertyChanged;
    t.onPropertyChanged = function (t) {
        w.apply(this, arguments);
        var i = t.property;
        if (0 === i.indexOf("a:phy")) {
            if ("a:phyEnabled" == i) {
                if (null != t.oldValue) return;
                if (1 != t.newValue) return;
                this.a("phyMode", 0)
            }
            var e = this.getPhysicsJoints();
            if (e) {
                var s = e.length,
                    o = this.getPhysics();
                switch (i) {
                    case "a:phyJointMin":
                    case "a:phyJointMax":
                        for (var n = 0; n < s; n++) {
                            var a = e[n],
                                h = a.limitMotor;
                            if (!h) return;
                            h.setLimit(o.jointMin * a.invScale, o.jointMax * a.invScale)
                        }
                        break;
                    case "a:phyJointSpringFrequency":
                    case "a:phyJointSpringDamping":
                        for (var r = 0; r < s; r++) {
                            var c = e[r].limitMotor;
                            if (!c) return;
                            c.setSpring(o.jointSpringFrequency, o.jointSpringDamping)
                        }
                }
            }
        }
    }, t.updatePhysicsFriction = function (i) {
        var e = this;
        this._physicsBody && this._physicsBody.forEach(function (t) {
            e._updatePhysicsShapeData(t, "friction", i)
        })
    }, t.updatePhysicsRestitution = function (i) {
        var e = this;
        this._physicsBody && this._physicsBody.forEach(function (t) {
            e._updatePhysicsShapeData(t, "restitution", i)
        })
    }, t.setPhysicsJoints = function (t) {
        this._physicsJoints = t
    }, t.getPhysicsJoints = function () {
        return this._physicsJoints
    };
    t = ht.graph3d.Graph3dView.prototype;
    t.createPhysicsWorld = function () {
        var t, i;
        this._physicsEngine || (t = {
            gravity: [0, -9.8, 0],
            steps: 60,
            iterations: 8,
            broadphase: 2,
            random: !1,
            info: !1,
            worldscale: 100
        }, (i = this.dm()) && (t.gravity = i.a("physicsEngineGravity") || t.gravity, t.timestep = 1 / (i.a("physicsEngineSteps") || t.steps), t.iterations = i.a("physicsEngineIterations") || t.iterations, t.random = i.a("physicsEngineRandom") || t.random, t.broadphase = i.a("physicsEngineBroadPhase") || t.broadphase, t.info = i.a("physicsEngineInfo") || t.info, t.worldscale = i.a("physicsEngineWorldScale") || t.worldscale, this._physicsEngine = new e(t), this._physicsEngine.setParent(this)))
    }, t.updatePhysicsForceNode = function (t) {
        var i;
        this._physicsEngine && (!t || (i = this.dm().getDataByTag(t)) && this._physicsEngine.updateForceNodeMapping(t, i))
    }, t.updatePhysicsConfigNode = function (t) {
        var i;
        this._physicsEngine && (!t || (i = this.dm().getDataByTag(t)) && this._physicsEngine.updateConfigNodeMapping(t, i))
    }, t.updatePhysicsVelocityNode = function (t) {
        var i;
        this._physicsEngine && (!t || (i = this.dm().getDataByTag(t)) && this._physicsEngine.updateVelocityNodeMapping(t, i))
    }, t.updatePhysicsSdfNode = function (t) {
        var i;
        this._physicsEngine && (!t || (i = this.dm().getDataByTag(t)) && this._physicsEngine.updateSdfNodeMapping(t, i))
    }, t._getPhysicsForceNode = function () {
        var e = {},
            s = this.dm();
        return s.getDatas().forEach(function (t) {
            var i;
            t.isPhysicsEnabled && t.isPhysicsEnabled() && 5 === t.a("phyForceType") && ("" == (i = t.a("phyForceNode")) || (t = s.getDataByTag(i)) && (e[i] = t))
        }), e
    }, t._getPhysicsConfigNode = function () {
        var e = {};
        return this.dm().getDatas().forEach(function (t) {
            var i;
            t.isPhysicsEnabled && t.isPhysicsEnabled() && (3 != t.a("phyMode") || (i = t.getTag()) && (e[i] = t))
        }), e
    }, t._getPhysicsVelocityNode = function () {
        var e = {};
        return this.dm().getDatas().forEach(function (t) {
            var i;
            t.isPhysicsEnabled && t.isPhysicsEnabled() && 3 == t.a("phyMode") && (1 != t.a("phySetV") || (i = t.getTag()) && (e[i] = t), 1 != t.a("phyLimitV") || (i = t.getTag()) && (e[i] = t))
        }), e
    }, t._getPhysicsSdfNode = function () {
        var e = this,
            s = {},
            o = this.dm();
        return o.getDatas().forEach(function (t) {
            var i;
            t.isPhysicsEnabled && t.isPhysicsEnabled() && t.a("phyHasSdf") && (!(i = t.a("phySdfId")) || (t = o.getDataByTag(i)) && !s[i] && (t.createSdf(e), s[i] = t))
        }), s
    }, t.getPhysicsEngine = function () {
        return this._physicsEngine
    }, t.clearPhysicsEngine = function () {
        this._physicsEngine && (this.stopPhysicsWorld(), this._physicsEngine.clear())
    }, t.initPhysicsEngine = function (t) {
        var i = this.dm();
        i.a("physicsEngineEnabled") && (this._physicsEngine || this.createPhysicsWorld(), this.clearPhysicsEngine(), this._physicsEngine.setForceNodeMapping(this._getPhysicsForceNode()), this._physicsEngine.setConfigNodeMapping(this._getPhysicsConfigNode()), this._physicsEngine.setVelocityNodeMapping(this._getPhysicsVelocityNode()), this._physicsEngine.setSdfNodeMapping(this._getPhysicsSdfNode()), this._physicsEngine.setGravity(i.a("physicsEngineGravity")), this._physicsEngine.setWorldScale(i.a("physicsEngineWorldScale")), this._physicsEngine.createFromNodes(i.getDatas(), t))
    }, t.enablePhysicsDebug = function (t) {
        this._enablePhysicsDebug = t, this._physicsEngine && this._physicsEngine.enableDebugMode(t)
    }, t.getPhysicsDebug = function () {
        return this._enablePhysicsDebug
    }, t.enablePhysicsInvisible = function (t) {
        this._enablePhysicsInvisible = t, this._physicsEngine && this._physicsEngine.enable3DInvisible(t)
    }, t.getPhysicsInvisible = function () {
        return this._enablePhysicsInvisible
    }, t.startPhysicsWorld = function (t) {
        var i = this;
        return this.dm().a("physicsEngineEnabled", !0), this.initPhysicsEngine(t), !!this._physicsEngine && (this._physicsEngine.enableDebugMode(this._enablePhysicsDebug), this._physicsEngine.enable3DInvisible(this._enablePhysicsInvisible), this._showPhyInfo || this._isShowPhysicsTip ? this._physicsEngine.enableDebugInfo() : this._physicsEngine.disableDebugInfo(), this._physicsEngine.start(function () {
            i._showPhyInfo && i._setPhysicsInfo(i._physicsEngine.getDebugInfo())
        }, this.dm().a("physicsEngineDebug")), !0)
    }, t.isPhysicsRunning = function () {
        return !!this._physicsEngine && this._physicsEngine.isRunning()
    }, t.getPhysicsVersion = function () {
        return "0.1.3"
    };
    var E = t.getDebugTip,
        D = t.showDebugTip,
        B = t.hideDebugTip;
    t.getDebugTip = function () {
        var t = E.call(this);
        return this._physicsEngine ? t + "<hr/>" + this._physicsEngine.getDebugInfo() : t
    }, t.showDebugTip = function () {
        D.call(this), this._isShowPhysicsTip = !0, this._physicsEngine && this._physicsEngine.enableDebugInfo()
    }, t.hideDebugTip = function () {
        B.call(this), this._isShowPhysicsTip = !1, this._physicsEngine && this._physicsEngine.disableDebugInfo()
    }, t.removePhysicsHtJoints = function () {
        for (var t = this.dm(), i = t.getDatas().toArray(), e = i.length, s = void 0, o = 0; o < e; o++)(s = i[o]) instanceof ht.Edge && s.isPhysicsEnabled() && t.remove(s)
    }, t.removePhysicsHtShapes = function () {
        for (var t = this.dm(), i = t.getDatas().toArray(), e = i.length, s = void 0, o = 0; o < e; o++)(s = i[o]).isPhysicsCombinedShape && s.isPhysicsCombinedShape() && t.remove(s)
    }, t.stopPhysicsWorld = function () {
        this._physicsEngine && this._physicsEngine.stop()
    }, t.pausePhysicsWorld = function () {
        this._physicsEngine && this._physicsEngine.stop()
    }, t.resumePhysicsWorld = function () {
        this._physicsEngine && this.dm().a("physicsEngineEnabled") && this._physicsEngine.start()
    }, t.isPhysicsDebugInfo = function () {
        return this._showPhyInfo
    }, t.showPhysicsInfo = function () {
        var t;
        this._phyInfo || ((t = document.createElement("div")).style.position = "absolute", t.style.color = "black", t.style.fontSize = "smaller", t.style.paddingLeft = "9px", t.style.backgroundColor = "#f2fce382", this.getView().appendChild(t), this._phyInfoDiv = t), this._phyInfoDiv.hidden = !1, this._showPhyInfo = !0, this._physicsEngine && this._physicsEngine.enableDebugInfo()
    }, t._setPhysicsInfo = function (t) {
        this._phyInfoDiv.innerHTML = t
    }, t.hidePhysicsInfo = function () {
        this._phyInfoDiv && (this._showPhyInfo = !1, this._phyInfoDiv.hidden = !0, this._physicsEngine && this._physicsEngine.disableDebugInfo())
    }, t.isPhysicsContacting = function (t, i) {
        t = t.getPhysicsBody(), i = i.getPhysicsBody();
        return this.getPhysicsEngine().isContacting(t, i)
    }, t.setPostPhysicsHandler = function (t) {
        var i = this.getPhysicsEngine();
        i && i.setPostPhysicsHandler(t)
    }, t.addPhysicsObject = function (t) {
        if (!this._physicsEngine) return !1;
        this._physicsEngine.isRunning() && this._physicsEngine.createFromNodes([t])
    }, t.removePhysicsObject = function (t) {
        if (!this._physicsEngine) return !1;
        this._physicsEngine.removeFromNodes([t])
    }, t.setPhysicsGravity = function (t) {
        if (!this._physicsEngine) return !1;
        this._physicsEngine.setGravity(t)
    }, t.setPhysicsTimeStep = function (t) {
        if (!this._physicsEngine) return !1;
        this._physicsEngine.setTimeStep(t)
    }, t.setPhysicsIterations = function (t) {
        if (!this._physicsEngine) return !1;
        this._physicsEngine.setIterations(t)
    }
}();