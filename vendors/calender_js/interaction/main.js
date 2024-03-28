/*!
FullCalendar Interaction Plugin v4.4.2
Docs & License: https://fullcalendar.io/
(c) 2019 Adam Shaw
*/(function (global, factory) { typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fullcalendar/core')) : typeof define === 'function' && define.amd ? define(['exports', '@fullcalendar/core'], factory) : (global = global || self, factory(global.FullCalendarInteraction = {}, global.FullCalendar)); }(this, function (exports, core) {
    'use strict';/*! *****************************************************************************
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
***************************************************************************** */var extendStatics = function (d, b) { extendStatics = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) || function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; }; return extendStatics(d, b); }; function __extends(d, b) {
        extendStatics(d, b); function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) { s = arguments[i]; for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]; }
            return t;
        }; return __assign.apply(this, arguments);
    }; core.config.touchMouseIgnoreWait = 500; var ignoreMouseDepth = 0; var listenerCnt = 0; var isWindowTouchMoveCancelled = false; var PointerDragging = (function () {
        function PointerDragging(containerEl) {
            var _this = this; this.subjectEl = null; this.downEl = null; this.selector = ''; this.handleSelector = ''; this.shouldIgnoreMove = false; this.shouldWatchScroll = true; this.isDragging = false; this.isTouchDragging = false; this.wasTouchScroll = false; this.handleMouseDown = function (ev) {
                if (!_this.shouldIgnoreMouse() && isPrimaryMouseButton(ev) && _this.tryStart(ev)) {
                    var pev = _this.createEventFromMouse(ev, true); _this.emitter.trigger('pointerdown', pev); _this.initScrollWatch(pev); if (!_this.shouldIgnoreMove) { document.addEventListener('mousemove', _this.handleMouseMove); }
                    document.addEventListener('mouseup', _this.handleMouseUp);
                }
            }; this.handleMouseMove = function (ev) { var pev = _this.createEventFromMouse(ev); _this.recordCoords(pev); _this.emitter.trigger('pointermove', pev); }; this.handleMouseUp = function (ev) { document.removeEventListener('mousemove', _this.handleMouseMove); document.removeEventListener('mouseup', _this.handleMouseUp); _this.emitter.trigger('pointerup', _this.createEventFromMouse(ev)); _this.cleanup(); }; this.handleTouchStart = function (ev) {
                if (_this.tryStart(ev)) {
                    _this.isTouchDragging = true; var pev = _this.createEventFromTouch(ev, true); _this.emitter.trigger('pointerdown', pev); _this.initScrollWatch(pev); var target = ev.target; if (!_this.shouldIgnoreMove) { target.addEventListener('touchmove', _this.handleTouchMove); }
                    target.addEventListener('touchend', _this.handleTouchEnd); target.addEventListener('touchcancel', _this.handleTouchEnd); window.addEventListener('scroll', _this.handleTouchScroll, true);
                }
            }; this.handleTouchMove = function (ev) { var pev = _this.createEventFromTouch(ev); _this.recordCoords(pev); _this.emitter.trigger('pointermove', pev); }; this.handleTouchEnd = function (ev) { if (_this.isDragging) { var target = ev.target; target.removeEventListener('touchmove', _this.handleTouchMove); target.removeEventListener('touchend', _this.handleTouchEnd); target.removeEventListener('touchcancel', _this.handleTouchEnd); window.removeEventListener('scroll', _this.handleTouchScroll, true); _this.emitter.trigger('pointerup', _this.createEventFromTouch(ev)); _this.cleanup(); _this.isTouchDragging = false; startIgnoringMouse(); } }; this.handleTouchScroll = function () { _this.wasTouchScroll = true; }; this.handleScroll = function (ev) { if (!_this.shouldIgnoreMove) { var pageX = (window.pageXOffset - _this.prevScrollX) + _this.prevPageX; var pageY = (window.pageYOffset - _this.prevScrollY) + _this.prevPageY; _this.emitter.trigger('pointermove', { origEvent: ev, isTouch: _this.isTouchDragging, subjectEl: _this.subjectEl, pageX: pageX, pageY: pageY, deltaX: pageX - _this.origPageX, deltaY: pageY - _this.origPageY }); } }; this.containerEl = containerEl; this.emitter = new core.EmitterMixin(); containerEl.addEventListener('mousedown', this.handleMouseDown); containerEl.addEventListener('touchstart', this.handleTouchStart, { passive: true }); listenerCreated();
        }
        PointerDragging.prototype.destroy = function () { this.containerEl.removeEventListener('mousedown', this.handleMouseDown); this.containerEl.removeEventListener('touchstart', this.handleTouchStart, { passive: true }); listenerDestroyed(); }; PointerDragging.prototype.tryStart = function (ev) {
            var subjectEl = this.querySubjectEl(ev); var downEl = ev.target; if (subjectEl && (!this.handleSelector || core.elementClosest(downEl, this.handleSelector))) { this.subjectEl = subjectEl; this.downEl = downEl; this.isDragging = true; this.wasTouchScroll = false; return true; }
            return false;
        }; PointerDragging.prototype.cleanup = function () { isWindowTouchMoveCancelled = false; this.isDragging = false; this.subjectEl = null; this.downEl = null; this.destroyScrollWatch(); }; PointerDragging.prototype.querySubjectEl = function (ev) {
            if (this.selector) { return core.elementClosest(ev.target, this.selector); }
            else { return this.containerEl; }
        }; PointerDragging.prototype.shouldIgnoreMouse = function () { return ignoreMouseDepth || this.isTouchDragging; }; PointerDragging.prototype.cancelTouchScroll = function () { if (this.isDragging) { isWindowTouchMoveCancelled = true; } }; PointerDragging.prototype.initScrollWatch = function (ev) { if (this.shouldWatchScroll) { this.recordCoords(ev); window.addEventListener('scroll', this.handleScroll, true); } }; PointerDragging.prototype.recordCoords = function (ev) { if (this.shouldWatchScroll) { this.prevPageX = ev.pageX; this.prevPageY = ev.pageY; this.prevScrollX = window.pageXOffset; this.prevScrollY = window.pageYOffset; } }; PointerDragging.prototype.destroyScrollWatch = function () { if (this.shouldWatchScroll) { window.removeEventListener('scroll', this.handleScroll, true); } }; PointerDragging.prototype.createEventFromMouse = function (ev, isFirst) {
            var deltaX = 0; var deltaY = 0; if (isFirst) { this.origPageX = ev.pageX; this.origPageY = ev.pageY; }
            else { deltaX = ev.pageX - this.origPageX; deltaY = ev.pageY - this.origPageY; }
            return { origEvent: ev, isTouch: false, subjectEl: this.subjectEl, pageX: ev.pageX, pageY: ev.pageY, deltaX: deltaX, deltaY: deltaY };
        }; PointerDragging.prototype.createEventFromTouch = function (ev, isFirst) {
            var touches = ev.touches; var pageX; var pageY; var deltaX = 0; var deltaY = 0; if (touches && touches.length) { pageX = touches[0].pageX; pageY = touches[0].pageY; }
            else { pageX = ev.pageX; pageY = ev.pageY; }
            if (isFirst) { this.origPageX = pageX; this.origPageY = pageY; }
            else { deltaX = pageX - this.origPageX; deltaY = pageY - this.origPageY; }
            return { origEvent: ev, isTouch: true, subjectEl: this.subjectEl, pageX: pageX, pageY: pageY, deltaX: deltaX, deltaY: deltaY };
        }; return PointerDragging;
    }()); function isPrimaryMouseButton(ev) { return ev.button === 0 && !ev.ctrlKey; }
    function startIgnoringMouse() { ignoreMouseDepth++; setTimeout(function () { ignoreMouseDepth--; }, core.config.touchMouseIgnoreWait); }
    function listenerCreated() { if (!(listenerCnt++)) { window.addEventListener('touchmove', onWindowTouchMove, { passive: false }); } }
    function listenerDestroyed() { if (!(--listenerCnt)) { window.removeEventListener('touchmove', onWindowTouchMove, { passive: false }); } }
    function onWindowTouchMove(ev) { if (isWindowTouchMoveCancelled) { ev.preventDefault(); } }
    var ElementMirror = (function () {
        function ElementMirror() { this.isVisible = false; this.sourceEl = null; this.mirrorEl = null; this.sourceElRect = null; this.parentNode = document.body; this.zIndex = 9999; this.revertDuration = 0; }
        ElementMirror.prototype.start = function (sourceEl, pageX, pageY) { this.sourceEl = sourceEl; this.sourceElRect = this.sourceEl.getBoundingClientRect(); this.origScreenX = pageX - window.pageXOffset; this.origScreenY = pageY - window.pageYOffset; this.deltaX = 0; this.deltaY = 0; this.updateElPosition(); }; ElementMirror.prototype.handleMove = function (pageX, pageY) { this.deltaX = (pageX - window.pageXOffset) - this.origScreenX; this.deltaY = (pageY - window.pageYOffset) - this.origScreenY; this.updateElPosition(); }; ElementMirror.prototype.setIsVisible = function (bool) {
            if (bool) {
                if (!this.isVisible) {
                    if (this.mirrorEl) { this.mirrorEl.style.display = ''; }
                    this.isVisible = bool; this.updateElPosition();
                }
            }
            else {
                if (this.isVisible) {
                    if (this.mirrorEl) { this.mirrorEl.style.display = 'none'; }
                    this.isVisible = bool;
                }
            }
        }; ElementMirror.prototype.stop = function (needsRevertAnimation, callback) {
            var _this = this; var done = function () { _this.cleanup(); callback(); }; if (needsRevertAnimation && this.mirrorEl && this.isVisible && this.revertDuration && (this.deltaX || this.deltaY)) { this.doRevertAnimation(done, this.revertDuration); }
            else { setTimeout(done, 0); }
        }; ElementMirror.prototype.doRevertAnimation = function (callback, revertDuration) {
            var mirrorEl = this.mirrorEl; var finalSourceElRect = this.sourceEl.getBoundingClientRect(); mirrorEl.style.transition = 'top ' + revertDuration + 'ms,' +
                'left ' + revertDuration + 'ms'; core.applyStyle(mirrorEl, { left: finalSourceElRect.left, top: finalSourceElRect.top }); core.whenTransitionDone(mirrorEl, function () { mirrorEl.style.transition = ''; callback(); });
        }; ElementMirror.prototype.cleanup = function () {
            if (this.mirrorEl) { core.removeElement(this.mirrorEl); this.mirrorEl = null; }
            this.sourceEl = null;
        }; ElementMirror.prototype.updateElPosition = function () { if (this.sourceEl && this.isVisible) { core.applyStyle(this.getMirrorEl(), { left: this.sourceElRect.left + this.deltaX, top: this.sourceElRect.top + this.deltaY }); } }; ElementMirror.prototype.getMirrorEl = function () {
            var sourceElRect = this.sourceElRect; var mirrorEl = this.mirrorEl; if (!mirrorEl) { mirrorEl = this.mirrorEl = this.sourceEl.cloneNode(true); mirrorEl.classList.add('fc-unselectable'); mirrorEl.classList.add('fc-dragging'); core.applyStyle(mirrorEl, { position: 'fixed', zIndex: this.zIndex, visibility: '', boxSizing: 'border-box', width: sourceElRect.right - sourceElRect.left, height: sourceElRect.bottom - sourceElRect.top, right: 'auto', bottom: 'auto', margin: 0 }); this.parentNode.appendChild(mirrorEl); }
            return mirrorEl;
        }; return ElementMirror;
    }()); var ScrollGeomCache = (function (_super) {
        __extends(ScrollGeomCache, _super); function ScrollGeomCache(scrollController, doesListening) {
            var _this = _super.call(this) || this; _this.handleScroll = function () { _this.scrollTop = _this.scrollController.getScrollTop(); _this.scrollLeft = _this.scrollController.getScrollLeft(); _this.handleScrollChange(); }; _this.scrollController = scrollController; _this.doesListening = doesListening; _this.scrollTop = _this.origScrollTop = scrollController.getScrollTop(); _this.scrollLeft = _this.origScrollLeft = scrollController.getScrollLeft(); _this.scrollWidth = scrollController.getScrollWidth(); _this.scrollHeight = scrollController.getScrollHeight(); _this.clientWidth = scrollController.getClientWidth(); _this.clientHeight = scrollController.getClientHeight(); _this.clientRect = _this.computeClientRect(); if (_this.doesListening) { _this.getEventTarget().addEventListener('scroll', _this.handleScroll); }
            return _this;
        }
        ScrollGeomCache.prototype.destroy = function () { if (this.doesListening) { this.getEventTarget().removeEventListener('scroll', this.handleScroll); } }; ScrollGeomCache.prototype.getScrollTop = function () { return this.scrollTop; }; ScrollGeomCache.prototype.getScrollLeft = function () { return this.scrollLeft; }; ScrollGeomCache.prototype.setScrollTop = function (top) { this.scrollController.setScrollTop(top); if (!this.doesListening) { this.scrollTop = Math.max(Math.min(top, this.getMaxScrollTop()), 0); this.handleScrollChange(); } }; ScrollGeomCache.prototype.setScrollLeft = function (top) { this.scrollController.setScrollLeft(top); if (!this.doesListening) { this.scrollLeft = Math.max(Math.min(top, this.getMaxScrollLeft()), 0); this.handleScrollChange(); } }; ScrollGeomCache.prototype.getClientWidth = function () { return this.clientWidth; }; ScrollGeomCache.prototype.getClientHeight = function () { return this.clientHeight; }; ScrollGeomCache.prototype.getScrollWidth = function () { return this.scrollWidth; }; ScrollGeomCache.prototype.getScrollHeight = function () { return this.scrollHeight; }; ScrollGeomCache.prototype.handleScrollChange = function () { }; return ScrollGeomCache;
    }(core.ScrollController)); var ElementScrollGeomCache = (function (_super) {
        __extends(ElementScrollGeomCache, _super); function ElementScrollGeomCache(el, doesListening) { return _super.call(this, new core.ElementScrollController(el), doesListening) || this; }
        ElementScrollGeomCache.prototype.getEventTarget = function () { return this.scrollController.el; }; ElementScrollGeomCache.prototype.computeClientRect = function () { return core.computeInnerRect(this.scrollController.el); }; return ElementScrollGeomCache;
    }(ScrollGeomCache)); var WindowScrollGeomCache = (function (_super) {
        __extends(WindowScrollGeomCache, _super); function WindowScrollGeomCache(doesListening) { return _super.call(this, new core.WindowScrollController(), doesListening) || this; }
        WindowScrollGeomCache.prototype.getEventTarget = function () { return window; }; WindowScrollGeomCache.prototype.computeClientRect = function () { return { left: this.scrollLeft, right: this.scrollLeft + this.clientWidth, top: this.scrollTop, bottom: this.scrollTop + this.clientHeight }; }; WindowScrollGeomCache.prototype.handleScrollChange = function () { this.clientRect = this.computeClientRect(); }; return WindowScrollGeomCache;
    }(ScrollGeomCache)); var getTime = typeof performance === 'function' ? performance.now : Date.now; var AutoScroller = (function () {
        function AutoScroller() {
            var _this = this; this.isEnabled = true; this.scrollQuery = [window, '.fc-scroller']; this.edgeThreshold = 50; this.maxVelocity = 300; this.pointerScreenX = null; this.pointerScreenY = null; this.isAnimating = false; this.scrollCaches = null; this.everMovedUp = false; this.everMovedDown = false; this.everMovedLeft = false; this.everMovedRight = false; this.animate = function () {
                if (_this.isAnimating) {
                    var edge = _this.computeBestEdge(_this.pointerScreenX + window.pageXOffset, _this.pointerScreenY + window.pageYOffset); if (edge) { var now = getTime(); _this.handleSide(edge, (now - _this.msSinceRequest) / 1000); _this.requestAnimation(now); }
                    else { _this.isAnimating = false; }
                }
            };
        }
        AutoScroller.prototype.start = function (pageX, pageY) { if (this.isEnabled) { this.scrollCaches = this.buildCaches(); this.pointerScreenX = null; this.pointerScreenY = null; this.everMovedUp = false; this.everMovedDown = false; this.everMovedLeft = false; this.everMovedRight = false; this.handleMove(pageX, pageY); } }; AutoScroller.prototype.handleMove = function (pageX, pageY) {
            if (this.isEnabled) {
                var pointerScreenX = pageX - window.pageXOffset; var pointerScreenY = pageY - window.pageYOffset; var yDelta = this.pointerScreenY === null ? 0 : pointerScreenY - this.pointerScreenY; var xDelta = this.pointerScreenX === null ? 0 : pointerScreenX - this.pointerScreenX; if (yDelta < 0) { this.everMovedUp = true; }
                else if (yDelta > 0) { this.everMovedDown = true; }
                if (xDelta < 0) { this.everMovedLeft = true; }
                else if (xDelta > 0) { this.everMovedRight = true; }
                this.pointerScreenX = pointerScreenX; this.pointerScreenY = pointerScreenY; if (!this.isAnimating) { this.isAnimating = true; this.requestAnimation(getTime()); }
            }
        }; AutoScroller.prototype.stop = function () {
            if (this.isEnabled) {
                this.isAnimating = false; for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) { var scrollCache = _a[_i]; scrollCache.destroy(); }
                this.scrollCaches = null;
            }
        }; AutoScroller.prototype.requestAnimation = function (now) { this.msSinceRequest = now; requestAnimationFrame(this.animate); }; AutoScroller.prototype.handleSide = function (edge, seconds) { var scrollCache = edge.scrollCache; var edgeThreshold = this.edgeThreshold; var invDistance = edgeThreshold - edge.distance; var velocity = (invDistance * invDistance) / (edgeThreshold * edgeThreshold) * this.maxVelocity * seconds; var sign = 1; switch (edge.name) { case 'left': sign = -1; case 'right': scrollCache.setScrollLeft(scrollCache.getScrollLeft() + velocity * sign); break; case 'top': sign = -1; case 'bottom': scrollCache.setScrollTop(scrollCache.getScrollTop() + velocity * sign); break; } }; AutoScroller.prototype.computeBestEdge = function (left, top) {
            var edgeThreshold = this.edgeThreshold; var bestSide = null; for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) {
                var scrollCache = _a[_i]; var rect = scrollCache.clientRect; var leftDist = left - rect.left; var rightDist = rect.right - left; var topDist = top - rect.top; var bottomDist = rect.bottom - top; if (leftDist >= 0 && rightDist >= 0 && topDist >= 0 && bottomDist >= 0) {
                    if (topDist <= edgeThreshold && this.everMovedUp && scrollCache.canScrollUp() && (!bestSide || bestSide.distance > topDist)) { bestSide = { scrollCache: scrollCache, name: 'top', distance: topDist }; }
                    if (bottomDist <= edgeThreshold && this.everMovedDown && scrollCache.canScrollDown() && (!bestSide || bestSide.distance > bottomDist)) { bestSide = { scrollCache: scrollCache, name: 'bottom', distance: bottomDist }; }
                    if (leftDist <= edgeThreshold && this.everMovedLeft && scrollCache.canScrollLeft() && (!bestSide || bestSide.distance > leftDist)) { bestSide = { scrollCache: scrollCache, name: 'left', distance: leftDist }; }
                    if (rightDist <= edgeThreshold && this.everMovedRight && scrollCache.canScrollRight() && (!bestSide || bestSide.distance > rightDist)) { bestSide = { scrollCache: scrollCache, name: 'right', distance: rightDist }; }
                }
            }
            return bestSide;
        }; AutoScroller.prototype.buildCaches = function () {
            return this.queryScrollEls().map(function (el) {
                if (el === window) { return new WindowScrollGeomCache(false); }
                else { return new ElementScrollGeomCache(el, false); }
            });
        }; AutoScroller.prototype.queryScrollEls = function () {
            var els = []; for (var _i = 0, _a = this.scrollQuery; _i < _a.length; _i++) {
                var query = _a[_i]; if (typeof query === 'object') { els.push(query); }
                else { els.push.apply(els, Array.prototype.slice.call(document.querySelectorAll(query))); }
            }
            return els;
        }; return AutoScroller;
    }()); var FeaturefulElementDragging = (function (_super) {
        __extends(FeaturefulElementDragging, _super); function FeaturefulElementDragging(containerEl) {
            var _this = _super.call(this, containerEl) || this; _this.delay = null; _this.minDistance = 0; _this.touchScrollAllowed = true; _this.mirrorNeedsRevert = false; _this.isInteracting = false; _this.isDragging = false; _this.isDelayEnded = false; _this.isDistanceSurpassed = false; _this.delayTimeoutId = null; _this.onPointerDown = function (ev) {
                if (!_this.isDragging) {
                    _this.isInteracting = true; _this.isDelayEnded = false; _this.isDistanceSurpassed = false; core.preventSelection(document.body); core.preventContextMenu(document.body); if (!ev.isTouch) { ev.origEvent.preventDefault(); }
                    _this.emitter.trigger('pointerdown', ev); if (!_this.pointer.shouldIgnoreMove) { _this.mirror.setIsVisible(false); _this.mirror.start(ev.subjectEl, ev.pageX, ev.pageY); _this.startDelay(ev); if (!_this.minDistance) { _this.handleDistanceSurpassed(ev); } }
                }
            }; _this.onPointerMove = function (ev) {
                if (_this.isInteracting) {
                    _this.emitter.trigger('pointermove', ev); if (!_this.isDistanceSurpassed) { var minDistance = _this.minDistance; var distanceSq = void 0; var deltaX = ev.deltaX, deltaY = ev.deltaY; distanceSq = deltaX * deltaX + deltaY * deltaY; if (distanceSq >= minDistance * minDistance) { _this.handleDistanceSurpassed(ev); } }
                    if (_this.isDragging) {
                        if (ev.origEvent.type !== 'scroll') { _this.mirror.handleMove(ev.pageX, ev.pageY); _this.autoScroller.handleMove(ev.pageX, ev.pageY); }
                        _this.emitter.trigger('dragmove', ev);
                    }
                }
            }; _this.onPointerUp = function (ev) {
                if (_this.isInteracting) {
                    _this.isInteracting = false; core.allowSelection(document.body); core.allowContextMenu(document.body); _this.emitter.trigger('pointerup', ev); if (_this.isDragging) { _this.autoScroller.stop(); _this.tryStopDrag(ev); }
                    if (_this.delayTimeoutId) { clearTimeout(_this.delayTimeoutId); _this.delayTimeoutId = null; }
                }
            }; var pointer = _this.pointer = new PointerDragging(containerEl); pointer.emitter.on('pointerdown', _this.onPointerDown); pointer.emitter.on('pointermove', _this.onPointerMove); pointer.emitter.on('pointerup', _this.onPointerUp); _this.mirror = new ElementMirror(); _this.autoScroller = new AutoScroller(); return _this;
        }
        FeaturefulElementDragging.prototype.destroy = function () { this.pointer.destroy(); }; FeaturefulElementDragging.prototype.startDelay = function (ev) {
            var _this = this; if (typeof this.delay === 'number') { this.delayTimeoutId = setTimeout(function () { _this.delayTimeoutId = null; _this.handleDelayEnd(ev); }, this.delay); }
            else { this.handleDelayEnd(ev); }
        }; FeaturefulElementDragging.prototype.handleDelayEnd = function (ev) { this.isDelayEnded = true; this.tryStartDrag(ev); }; FeaturefulElementDragging.prototype.handleDistanceSurpassed = function (ev) { this.isDistanceSurpassed = true; this.tryStartDrag(ev); }; FeaturefulElementDragging.prototype.tryStartDrag = function (ev) { if (this.isDelayEnded && this.isDistanceSurpassed) { if (!this.pointer.wasTouchScroll || this.touchScrollAllowed) { this.isDragging = true; this.mirrorNeedsRevert = false; this.autoScroller.start(ev.pageX, ev.pageY); this.emitter.trigger('dragstart', ev); if (this.touchScrollAllowed === false) { this.pointer.cancelTouchScroll(); } } } }; FeaturefulElementDragging.prototype.tryStopDrag = function (ev) { this.mirror.stop(this.mirrorNeedsRevert, this.stopDrag.bind(this, ev)); }; FeaturefulElementDragging.prototype.stopDrag = function (ev) { this.isDragging = false; this.emitter.trigger('dragend', ev); }; FeaturefulElementDragging.prototype.setIgnoreMove = function (bool) { this.pointer.shouldIgnoreMove = bool; }; FeaturefulElementDragging.prototype.setMirrorIsVisible = function (bool) { this.mirror.setIsVisible(bool); }; FeaturefulElementDragging.prototype.setMirrorNeedsRevert = function (bool) { this.mirrorNeedsRevert = bool; }; FeaturefulElementDragging.prototype.setAutoScrollEnabled = function (bool) { this.autoScroller.isEnabled = bool; }; return FeaturefulElementDragging;
    }(core.ElementDragging)); var OffsetTracker = (function () {
        function OffsetTracker(el) { this.origRect = core.computeRect(el); this.scrollCaches = core.getClippingParents(el).map(function (el) { return new ElementScrollGeomCache(el, true); }); }
        OffsetTracker.prototype.destroy = function () { for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) { var scrollCache = _a[_i]; scrollCache.destroy(); } }; OffsetTracker.prototype.computeLeft = function () {
            var left = this.origRect.left; for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) { var scrollCache = _a[_i]; left += scrollCache.origScrollLeft - scrollCache.getScrollLeft(); }
            return left;
        }; OffsetTracker.prototype.computeTop = function () {
            var top = this.origRect.top; for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) { var scrollCache = _a[_i]; top += scrollCache.origScrollTop - scrollCache.getScrollTop(); }
            return top;
        }; OffsetTracker.prototype.isWithinClipping = function (pageX, pageY) {
            var point = { left: pageX, top: pageY }; for (var _i = 0, _a = this.scrollCaches; _i < _a.length; _i++) { var scrollCache = _a[_i]; if (!isIgnoredClipping(scrollCache.getEventTarget()) && !core.pointInsideRect(point, scrollCache.clientRect)) { return false; } }
            return true;
        }; return OffsetTracker;
    }()); function isIgnoredClipping(node) { var tagName = node.tagName; return tagName === 'HTML' || tagName === 'BODY'; }
    var HitDragging = (function () {
        function HitDragging(dragging, droppableStore) {
            var _this = this; this.useSubjectCenter = false; this.requireInitial = true; this.initialHit = null; this.movingHit = null; this.finalHit = null; this.handlePointerDown = function (ev) {
                var dragging = _this.dragging; _this.initialHit = null; _this.movingHit = null; _this.finalHit = null; _this.prepareHits(); _this.processFirstCoord(ev); if (_this.initialHit || !_this.requireInitial) { dragging.setIgnoreMove(false); _this.emitter.trigger('pointerdown', ev); }
                else { dragging.setIgnoreMove(true); }
            }; this.handleDragStart = function (ev) { _this.emitter.trigger('dragstart', ev); _this.handleMove(ev, true); }; this.handleDragMove = function (ev) { _this.emitter.trigger('dragmove', ev); _this.handleMove(ev); }; this.handlePointerUp = function (ev) { _this.releaseHits(); _this.emitter.trigger('pointerup', ev); }; this.handleDragEnd = function (ev) {
                if (_this.movingHit) { _this.emitter.trigger('hitupdate', null, true, ev); }
                _this.finalHit = _this.movingHit; _this.movingHit = null; _this.emitter.trigger('dragend', ev);
            }; this.droppableStore = droppableStore; dragging.emitter.on('pointerdown', this.handlePointerDown); dragging.emitter.on('dragstart', this.handleDragStart); dragging.emitter.on('dragmove', this.handleDragMove); dragging.emitter.on('pointerup', this.handlePointerUp); dragging.emitter.on('dragend', this.handleDragEnd); this.dragging = dragging; this.emitter = new core.EmitterMixin();
        }
        HitDragging.prototype.processFirstCoord = function (ev) {
            var origPoint = { left: ev.pageX, top: ev.pageY }; var adjustedPoint = origPoint; var subjectEl = ev.subjectEl; var subjectRect; if (subjectEl !== document) { subjectRect = core.computeRect(subjectEl); adjustedPoint = core.constrainPoint(adjustedPoint, subjectRect); }
            var initialHit = this.initialHit = this.queryHitForOffset(adjustedPoint.left, adjustedPoint.top); if (initialHit) {
                if (this.useSubjectCenter && subjectRect) { var slicedSubjectRect = core.intersectRects(subjectRect, initialHit.rect); if (slicedSubjectRect) { adjustedPoint = core.getRectCenter(slicedSubjectRect); } }
                this.coordAdjust = core.diffPoints(adjustedPoint, origPoint);
            }
            else { this.coordAdjust = { left: 0, top: 0 }; }
        }; HitDragging.prototype.handleMove = function (ev, forceHandle) { var hit = this.queryHitForOffset(ev.pageX + this.coordAdjust.left, ev.pageY + this.coordAdjust.top); if (forceHandle || !isHitsEqual(this.movingHit, hit)) { this.movingHit = hit; this.emitter.trigger('hitupdate', hit, false, ev); } }; HitDragging.prototype.prepareHits = function () { this.offsetTrackers = core.mapHash(this.droppableStore, function (interactionSettings) { interactionSettings.component.buildPositionCaches(); return new OffsetTracker(interactionSettings.el); }); }; HitDragging.prototype.releaseHits = function () {
            var offsetTrackers = this.offsetTrackers; for (var id in offsetTrackers) { offsetTrackers[id].destroy(); }
            this.offsetTrackers = {};
        }; HitDragging.prototype.queryHitForOffset = function (offsetLeft, offsetTop) {
            var _a = this, droppableStore = _a.droppableStore, offsetTrackers = _a.offsetTrackers; var bestHit = null; for (var id in droppableStore) { var component = droppableStore[id].component; var offsetTracker = offsetTrackers[id]; if (offsetTracker.isWithinClipping(offsetLeft, offsetTop)) { var originLeft = offsetTracker.computeLeft(); var originTop = offsetTracker.computeTop(); var positionLeft = offsetLeft - originLeft; var positionTop = offsetTop - originTop; var origRect = offsetTracker.origRect; var width = origRect.right - origRect.left; var height = origRect.bottom - origRect.top; if (positionLeft >= 0 && positionLeft < width && positionTop >= 0 && positionTop < height) { var hit = component.queryHit(positionLeft, positionTop, width, height); if (hit && (!component.props.dateProfile || core.rangeContainsRange(component.props.dateProfile.activeRange, hit.dateSpan.range)) && (!bestHit || hit.layer > bestHit.layer)) { hit.rect.left += originLeft; hit.rect.right += originLeft; hit.rect.top += originTop; hit.rect.bottom += originTop; bestHit = hit; } } } }
            return bestHit;
        }; return HitDragging;
    }()); function isHitsEqual(hit0, hit1) {
        if (!hit0 && !hit1) { return true; }
        if (Boolean(hit0) !== Boolean(hit1)) { return false; }
        return core.isDateSpansEqual(hit0.dateSpan, hit1.dateSpan);
    }
    var DateClicking = (function (_super) {
        __extends(DateClicking, _super); function DateClicking(settings) { var _this = _super.call(this, settings) || this; _this.handlePointerDown = function (ev) { var dragging = _this.dragging; dragging.setIgnoreMove(!_this.component.isValidDateDownEl(dragging.pointer.downEl)); }; _this.handleDragEnd = function (ev) { var component = _this.component; var _a = component.context, calendar = _a.calendar, view = _a.view; var pointer = _this.dragging.pointer; if (!pointer.wasTouchScroll) { var _b = _this.hitDragging, initialHit = _b.initialHit, finalHit = _b.finalHit; if (initialHit && finalHit && isHitsEqual(initialHit, finalHit)) { calendar.triggerDateClick(initialHit.dateSpan, initialHit.dayEl, view, ev.origEvent); } } }; var component = settings.component; _this.dragging = new FeaturefulElementDragging(component.el); _this.dragging.autoScroller.isEnabled = false; var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsToStore(settings)); hitDragging.emitter.on('pointerdown', _this.handlePointerDown); hitDragging.emitter.on('dragend', _this.handleDragEnd); return _this; }
        DateClicking.prototype.destroy = function () { this.dragging.destroy(); }; return DateClicking;
    }(core.Interaction)); var DateSelecting = (function (_super) {
        __extends(DateSelecting, _super); function DateSelecting(settings) {
            var _this = _super.call(this, settings) || this; _this.dragSelection = null; _this.handlePointerDown = function (ev) { var _a = _this, component = _a.component, dragging = _a.dragging; var options = component.context.options; var canSelect = options.selectable && component.isValidDateDownEl(ev.origEvent.target); dragging.setIgnoreMove(!canSelect); dragging.delay = ev.isTouch ? getComponentTouchDelay(component) : null; }; _this.handleDragStart = function (ev) { _this.component.context.calendar.unselect(ev); }; _this.handleHitUpdate = function (hit, isFinal) {
                var calendar = _this.component.context.calendar; var dragSelection = null; var isInvalid = false; if (hit) { dragSelection = joinHitsIntoSelection(_this.hitDragging.initialHit, hit, calendar.pluginSystem.hooks.dateSelectionTransformers); if (!dragSelection || !_this.component.isDateSelectionValid(dragSelection)) { isInvalid = true; dragSelection = null; } }
                if (dragSelection) { calendar.dispatch({ type: 'SELECT_DATES', selection: dragSelection }); }
                else if (!isFinal) { calendar.dispatch({ type: 'UNSELECT_DATES' }); }
                if (!isInvalid) { core.enableCursor(); }
                else { core.disableCursor(); }
                if (!isFinal) { _this.dragSelection = dragSelection; }
            }; _this.handlePointerUp = function (pev) { if (_this.dragSelection) { _this.component.context.calendar.triggerDateSelect(_this.dragSelection, pev); _this.dragSelection = null; } }; var component = settings.component; var options = component.context.options; var dragging = _this.dragging = new FeaturefulElementDragging(component.el); dragging.touchScrollAllowed = false; dragging.minDistance = options.selectMinDistance || 0; dragging.autoScroller.isEnabled = options.dragScroll; var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsToStore(settings)); hitDragging.emitter.on('pointerdown', _this.handlePointerDown); hitDragging.emitter.on('dragstart', _this.handleDragStart); hitDragging.emitter.on('hitupdate', _this.handleHitUpdate); hitDragging.emitter.on('pointerup', _this.handlePointerUp); return _this;
        }
        DateSelecting.prototype.destroy = function () { this.dragging.destroy(); }; return DateSelecting;
    }(core.Interaction)); function getComponentTouchDelay(component) {
        var options = component.context.options; var delay = options.selectLongPressDelay; if (delay == null) { delay = options.longPressDelay; }
        return delay;
    }
    function joinHitsIntoSelection(hit0, hit1, dateSelectionTransformers) {
        var dateSpan0 = hit0.dateSpan; var dateSpan1 = hit1.dateSpan; var ms = [dateSpan0.range.start, dateSpan0.range.end, dateSpan1.range.start, dateSpan1.range.end]; ms.sort(core.compareNumbers); var props = {}; for (var _i = 0, dateSelectionTransformers_1 = dateSelectionTransformers; _i < dateSelectionTransformers_1.length; _i++) {
            var transformer = dateSelectionTransformers_1[_i]; var res = transformer(hit0, hit1); if (res === false) { return null; }
            else if (res) { __assign(props, res); }
        }
        props.range = { start: ms[0], end: ms[3] }; props.allDay = dateSpan0.allDay; return props;
    }
    var EventDragging = (function (_super) {
        __extends(EventDragging, _super); function EventDragging(settings) {
            var _this = _super.call(this, settings) || this; _this.subjectSeg = null; _this.isDragging = false; _this.eventRange = null; _this.relevantEvents = null; _this.receivingCalendar = null; _this.validMutation = null; _this.mutatedRelevantEvents = null; _this.handlePointerDown = function (ev) { var origTarget = ev.origEvent.target; var _a = _this, component = _a.component, dragging = _a.dragging; var mirror = dragging.mirror; var options = component.context.options; var initialCalendar = component.context.calendar; var subjectSeg = _this.subjectSeg = core.getElSeg(ev.subjectEl); var eventRange = _this.eventRange = subjectSeg.eventRange; var eventInstanceId = eventRange.instance.instanceId; _this.relevantEvents = core.getRelevantEvents(initialCalendar.state.eventStore, eventInstanceId); dragging.minDistance = ev.isTouch ? 0 : options.eventDragMinDistance; dragging.delay = (ev.isTouch && eventInstanceId !== component.props.eventSelection) ? getComponentTouchDelay$1(component) : null; mirror.parentNode = initialCalendar.el; mirror.revertDuration = options.dragRevertDuration; var isValid = component.isValidSegDownEl(origTarget) && !core.elementClosest(origTarget, '.fc-resizer'); dragging.setIgnoreMove(!isValid); _this.isDragging = isValid && ev.subjectEl.classList.contains('fc-draggable'); }; _this.handleDragStart = function (ev) {
                var context = _this.component.context; var initialCalendar = context.calendar; var eventRange = _this.eventRange; var eventInstanceId = eventRange.instance.instanceId; if (ev.isTouch) { if (eventInstanceId !== _this.component.props.eventSelection) { initialCalendar.dispatch({ type: 'SELECT_EVENT', eventInstanceId: eventInstanceId }); } }
                else { initialCalendar.dispatch({ type: 'UNSELECT_EVENT' }); }
                if (_this.isDragging) { initialCalendar.unselect(ev); initialCalendar.publiclyTrigger('eventDragStart', [{ el: _this.subjectSeg.el, event: new core.EventApi(initialCalendar, eventRange.def, eventRange.instance), jsEvent: ev.origEvent, view: context.view }]); }
            }; _this.handleHitUpdate = function (hit, isFinal) {
                if (!_this.isDragging) { return; }
                var relevantEvents = _this.relevantEvents; var initialHit = _this.hitDragging.initialHit; var initialCalendar = _this.component.context.calendar; var receivingCalendar = null; var mutation = null; var mutatedRelevantEvents = null; var isInvalid = false; var interaction = { affectedEvents: relevantEvents, mutatedEvents: core.createEmptyEventStore(), isEvent: true, origSeg: _this.subjectSeg }; if (hit) {
                    var receivingComponent = hit.component; receivingCalendar = receivingComponent.context.calendar; var receivingOptions = receivingComponent.context.options; if (initialCalendar === receivingCalendar || receivingOptions.editable && receivingOptions.droppable) { mutation = computeEventMutation(initialHit, hit, receivingCalendar.pluginSystem.hooks.eventDragMutationMassagers); if (mutation) { mutatedRelevantEvents = core.applyMutationToEventStore(relevantEvents, receivingCalendar.eventUiBases, mutation, receivingCalendar); interaction.mutatedEvents = mutatedRelevantEvents; if (!receivingComponent.isInteractionValid(interaction)) { isInvalid = true; mutation = null; mutatedRelevantEvents = null; interaction.mutatedEvents = core.createEmptyEventStore(); } } }
                    else { receivingCalendar = null; }
                }
                _this.displayDrag(receivingCalendar, interaction); if (!isInvalid) { core.enableCursor(); }
                else { core.disableCursor(); }
                if (!isFinal) {
                    if (initialCalendar === receivingCalendar && isHitsEqual(initialHit, hit)) { mutation = null; }
                    _this.dragging.setMirrorNeedsRevert(!mutation); _this.dragging.setMirrorIsVisible(!hit || !document.querySelector('.fc-mirror')); _this.receivingCalendar = receivingCalendar; _this.validMutation = mutation; _this.mutatedRelevantEvents = mutatedRelevantEvents;
                }
            }; _this.handlePointerUp = function () { if (!_this.isDragging) { _this.cleanup(); } }; _this.handleDragEnd = function (ev) {
                if (_this.isDragging) {
                    var context = _this.component.context; var initialCalendar_1 = context.calendar; var initialView = context.view; var _a = _this, receivingCalendar = _a.receivingCalendar, validMutation = _a.validMutation; var eventDef = _this.eventRange.def; var eventInstance = _this.eventRange.instance; var eventApi = new core.EventApi(initialCalendar_1, eventDef, eventInstance); var relevantEvents_1 = _this.relevantEvents; var mutatedRelevantEvents = _this.mutatedRelevantEvents; var finalHit = _this.hitDragging.finalHit; _this.clearDrag(); initialCalendar_1.publiclyTrigger('eventDragStop', [{ el: _this.subjectSeg.el, event: eventApi, jsEvent: ev.origEvent, view: initialView }]); if (validMutation) {
                        if (receivingCalendar === initialCalendar_1) {
                            initialCalendar_1.dispatch({ type: 'MERGE_EVENTS', eventStore: mutatedRelevantEvents }); var transformed = {}; for (var _i = 0, _b = initialCalendar_1.pluginSystem.hooks.eventDropTransformers; _i < _b.length; _i++) { var transformer = _b[_i]; __assign(transformed, transformer(validMutation, initialCalendar_1)); }
                            var eventDropArg = __assign({}, transformed, { el: ev.subjectEl, delta: validMutation.datesDelta, oldEvent: eventApi, event: new core.EventApi(initialCalendar_1, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null), revert: function () { initialCalendar_1.dispatch({ type: 'MERGE_EVENTS', eventStore: relevantEvents_1 }); }, jsEvent: ev.origEvent, view: initialView }); initialCalendar_1.publiclyTrigger('eventDrop', [eventDropArg]);
                        }
                        else if (receivingCalendar) {
                            initialCalendar_1.publiclyTrigger('eventLeave', [{ draggedEl: ev.subjectEl, event: eventApi, view: initialView }]); initialCalendar_1.dispatch({ type: 'REMOVE_EVENT_INSTANCES', instances: _this.mutatedRelevantEvents.instances }); receivingCalendar.dispatch({ type: 'MERGE_EVENTS', eventStore: _this.mutatedRelevantEvents }); if (ev.isTouch) { receivingCalendar.dispatch({ type: 'SELECT_EVENT', eventInstanceId: eventInstance.instanceId }); }
                            var dropArg = __assign({}, receivingCalendar.buildDatePointApi(finalHit.dateSpan), { draggedEl: ev.subjectEl, jsEvent: ev.origEvent, view: finalHit.component }); receivingCalendar.publiclyTrigger('drop', [dropArg]); receivingCalendar.publiclyTrigger('eventReceive', [{ draggedEl: ev.subjectEl, event: new core.EventApi(receivingCalendar, mutatedRelevantEvents.defs[eventDef.defId], mutatedRelevantEvents.instances[eventInstance.instanceId]), view: finalHit.component }]);
                        }
                    }
                    else { initialCalendar_1.publiclyTrigger('_noEventDrop'); }
                }
                _this.cleanup();
            }; var component = _this.component; var options = component.context.options; var dragging = _this.dragging = new FeaturefulElementDragging(component.el); dragging.pointer.selector = EventDragging.SELECTOR; dragging.touchScrollAllowed = false; dragging.autoScroller.isEnabled = options.dragScroll; var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsStore); hitDragging.useSubjectCenter = settings.useEventCenter; hitDragging.emitter.on('pointerdown', _this.handlePointerDown); hitDragging.emitter.on('dragstart', _this.handleDragStart); hitDragging.emitter.on('hitupdate', _this.handleHitUpdate); hitDragging.emitter.on('pointerup', _this.handlePointerUp); hitDragging.emitter.on('dragend', _this.handleDragEnd); return _this;
        }
        EventDragging.prototype.destroy = function () { this.dragging.destroy(); }; EventDragging.prototype.displayDrag = function (nextCalendar, state) {
            var initialCalendar = this.component.context.calendar; var prevCalendar = this.receivingCalendar; if (prevCalendar && prevCalendar !== nextCalendar) {
                if (prevCalendar === initialCalendar) { prevCalendar.dispatch({ type: 'SET_EVENT_DRAG', state: { affectedEvents: state.affectedEvents, mutatedEvents: core.createEmptyEventStore(), isEvent: true, origSeg: state.origSeg } }); }
                else { prevCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' }); }
            }
            if (nextCalendar) { nextCalendar.dispatch({ type: 'SET_EVENT_DRAG', state: state }); }
        }; EventDragging.prototype.clearDrag = function () {
            var initialCalendar = this.component.context.calendar; var receivingCalendar = this.receivingCalendar; if (receivingCalendar) { receivingCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' }); }
            if (initialCalendar !== receivingCalendar) { initialCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' }); }
        }; EventDragging.prototype.cleanup = function () { this.subjectSeg = null; this.isDragging = false; this.eventRange = null; this.relevantEvents = null; this.receivingCalendar = null; this.validMutation = null; this.mutatedRelevantEvents = null; }; EventDragging.SELECTOR = '.fc-draggable, .fc-resizable'; return EventDragging;
    }(core.Interaction)); function computeEventMutation(hit0, hit1, massagers) {
        var dateSpan0 = hit0.dateSpan; var dateSpan1 = hit1.dateSpan; var date0 = dateSpan0.range.start; var date1 = dateSpan1.range.start; var standardProps = {}; if (dateSpan0.allDay !== dateSpan1.allDay) { standardProps.allDay = dateSpan1.allDay; standardProps.hasEnd = hit1.component.context.options.allDayMaintainDuration; if (dateSpan1.allDay) { date0 = core.startOfDay(date0); } }
        var delta = core.diffDates(date0, date1, hit0.component.context.dateEnv, hit0.component === hit1.component ? hit0.component.largeUnit : null); if (delta.milliseconds) { standardProps.allDay = false; }
        var mutation = { datesDelta: delta, standardProps: standardProps }; for (var _i = 0, massagers_1 = massagers; _i < massagers_1.length; _i++) { var massager = massagers_1[_i]; massager(mutation, hit0, hit1); }
        return mutation;
    }
    function getComponentTouchDelay$1(component) {
        var options = component.context.options; var delay = options.eventLongPressDelay; if (delay == null) { delay = options.longPressDelay; }
        return delay;
    }
    var EventDragging$1 = (function (_super) {
        __extends(EventDragging, _super); function EventDragging(settings) {
            var _this = _super.call(this, settings) || this; _this.draggingSeg = null; _this.eventRange = null; _this.relevantEvents = null; _this.validMutation = null; _this.mutatedRelevantEvents = null; _this.handlePointerDown = function (ev) { var component = _this.component; var seg = _this.querySeg(ev); var eventRange = _this.eventRange = seg.eventRange; _this.dragging.minDistance = component.context.options.eventDragMinDistance; _this.dragging.setIgnoreMove(!_this.component.isValidSegDownEl(ev.origEvent.target) || (ev.isTouch && _this.component.props.eventSelection !== eventRange.instance.instanceId)); }; _this.handleDragStart = function (ev) { var _a = _this.component.context, calendar = _a.calendar, view = _a.view; var eventRange = _this.eventRange; _this.relevantEvents = core.getRelevantEvents(calendar.state.eventStore, _this.eventRange.instance.instanceId); _this.draggingSeg = _this.querySeg(ev); calendar.unselect(); calendar.publiclyTrigger('eventResizeStart', [{ el: _this.draggingSeg.el, event: new core.EventApi(calendar, eventRange.def, eventRange.instance), jsEvent: ev.origEvent, view: view }]); }; _this.handleHitUpdate = function (hit, isFinal, ev) {
                var calendar = _this.component.context.calendar; var relevantEvents = _this.relevantEvents; var initialHit = _this.hitDragging.initialHit; var eventInstance = _this.eventRange.instance; var mutation = null; var mutatedRelevantEvents = null; var isInvalid = false; var interaction = { affectedEvents: relevantEvents, mutatedEvents: core.createEmptyEventStore(), isEvent: true, origSeg: _this.draggingSeg }; if (hit) { mutation = computeMutation(initialHit, hit, ev.subjectEl.classList.contains('fc-start-resizer'), eventInstance.range, calendar.pluginSystem.hooks.eventResizeJoinTransforms); }
                if (mutation) { mutatedRelevantEvents = core.applyMutationToEventStore(relevantEvents, calendar.eventUiBases, mutation, calendar); interaction.mutatedEvents = mutatedRelevantEvents; if (!_this.component.isInteractionValid(interaction)) { isInvalid = true; mutation = null; mutatedRelevantEvents = null; interaction.mutatedEvents = null; } }
                if (mutatedRelevantEvents) { calendar.dispatch({ type: 'SET_EVENT_RESIZE', state: interaction }); }
                else { calendar.dispatch({ type: 'UNSET_EVENT_RESIZE' }); }
                if (!isInvalid) { core.enableCursor(); }
                else { core.disableCursor(); }
                if (!isFinal) {
                    if (mutation && isHitsEqual(initialHit, hit)) { mutation = null; }
                    _this.validMutation = mutation; _this.mutatedRelevantEvents = mutatedRelevantEvents;
                }
            }; _this.handleDragEnd = function (ev) {
                var _a = _this.component.context, calendar = _a.calendar, view = _a.view; var eventDef = _this.eventRange.def; var eventInstance = _this.eventRange.instance; var eventApi = new core.EventApi(calendar, eventDef, eventInstance); var relevantEvents = _this.relevantEvents; var mutatedRelevantEvents = _this.mutatedRelevantEvents; calendar.publiclyTrigger('eventResizeStop', [{ el: _this.draggingSeg.el, event: eventApi, jsEvent: ev.origEvent, view: view }]); if (_this.validMutation) { calendar.dispatch({ type: 'MERGE_EVENTS', eventStore: mutatedRelevantEvents }); calendar.publiclyTrigger('eventResize', [{ el: _this.draggingSeg.el, startDelta: _this.validMutation.startDelta || core.createDuration(0), endDelta: _this.validMutation.endDelta || core.createDuration(0), prevEvent: eventApi, event: new core.EventApi(calendar, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null), revert: function () { calendar.dispatch({ type: 'MERGE_EVENTS', eventStore: relevantEvents }); }, jsEvent: ev.origEvent, view: view }]); }
                else { calendar.publiclyTrigger('_noEventResize'); }
                _this.draggingSeg = null; _this.relevantEvents = null; _this.validMutation = null;
            }; var component = settings.component; var dragging = _this.dragging = new FeaturefulElementDragging(component.el); dragging.pointer.selector = '.fc-resizer'; dragging.touchScrollAllowed = false; dragging.autoScroller.isEnabled = component.context.options.dragScroll; var hitDragging = _this.hitDragging = new HitDragging(_this.dragging, core.interactionSettingsToStore(settings)); hitDragging.emitter.on('pointerdown', _this.handlePointerDown); hitDragging.emitter.on('dragstart', _this.handleDragStart); hitDragging.emitter.on('hitupdate', _this.handleHitUpdate); hitDragging.emitter.on('dragend', _this.handleDragEnd); return _this;
        }
        EventDragging.prototype.destroy = function () { this.dragging.destroy(); }; EventDragging.prototype.querySeg = function (ev) { return core.getElSeg(core.elementClosest(ev.subjectEl, this.component.fgSegSelector)); }; return EventDragging;
    }(core.Interaction)); function computeMutation(hit0, hit1, isFromStart, instanceRange, transforms) {
        var dateEnv = hit0.component.context.dateEnv; var date0 = hit0.dateSpan.range.start; var date1 = hit1.dateSpan.range.start; var delta = core.diffDates(date0, date1, dateEnv, hit0.component.largeUnit); var props = {}; for (var _i = 0, transforms_1 = transforms; _i < transforms_1.length; _i++) {
            var transform = transforms_1[_i]; var res = transform(hit0, hit1); if (res === false) { return null; }
            else if (res) { __assign(props, res); }
        }
        if (isFromStart) { if (dateEnv.add(instanceRange.start, delta) < instanceRange.end) { props.startDelta = delta; return props; } }
        else { if (dateEnv.add(instanceRange.end, delta) > instanceRange.start) { props.endDelta = delta; return props; } }
        return null;
    }
    var UnselectAuto = (function () {
        function UnselectAuto(calendar) {
            var _this = this; this.isRecentPointerDateSelect = false; this.onSelect = function (selectInfo) { if (selectInfo.jsEvent) { _this.isRecentPointerDateSelect = true; } }; this.onDocumentPointerUp = function (pev) {
                var _a = _this, calendar = _a.calendar, documentPointer = _a.documentPointer; var state = calendar.state; if (!documentPointer.wasTouchScroll) {
                    if (state.dateSelection && !_this.isRecentPointerDateSelect) { var unselectAuto = calendar.viewOpt('unselectAuto'); var unselectCancel = calendar.viewOpt('unselectCancel'); if (unselectAuto && (!unselectAuto || !core.elementClosest(documentPointer.downEl, unselectCancel))) { calendar.unselect(pev); } }
                    if (state.eventSelection && !core.elementClosest(documentPointer.downEl, EventDragging.SELECTOR)) { calendar.dispatch({ type: 'UNSELECT_EVENT' }); }
                }
                _this.isRecentPointerDateSelect = false;
            }; this.calendar = calendar; var documentPointer = this.documentPointer = new PointerDragging(document); documentPointer.shouldIgnoreMove = true; documentPointer.shouldWatchScroll = false; documentPointer.emitter.on('pointerup', this.onDocumentPointerUp); calendar.on('select', this.onSelect);
        }
        UnselectAuto.prototype.destroy = function () { this.calendar.off('select', this.onSelect); this.documentPointer.destroy(); }; return UnselectAuto;
    }()); var ExternalElementDragging = (function () {
        function ExternalElementDragging(dragging, suppliedDragMeta) {
            var _this = this; this.receivingCalendar = null; this.droppableEvent = null; this.suppliedDragMeta = null; this.dragMeta = null; this.handleDragStart = function (ev) { _this.dragMeta = _this.buildDragMeta(ev.subjectEl); }; this.handleHitUpdate = function (hit, isFinal, ev) {
                var dragging = _this.hitDragging.dragging; var receivingCalendar = null; var droppableEvent = null; var isInvalid = false; var interaction = { affectedEvents: core.createEmptyEventStore(), mutatedEvents: core.createEmptyEventStore(), isEvent: _this.dragMeta.create, origSeg: null }; if (hit) { receivingCalendar = hit.component.context.calendar; if (_this.canDropElOnCalendar(ev.subjectEl, receivingCalendar)) { droppableEvent = computeEventForDateSpan(hit.dateSpan, _this.dragMeta, receivingCalendar); interaction.mutatedEvents = core.eventTupleToStore(droppableEvent); isInvalid = !core.isInteractionValid(interaction, receivingCalendar); if (isInvalid) { interaction.mutatedEvents = core.createEmptyEventStore(); droppableEvent = null; } } }
                _this.displayDrag(receivingCalendar, interaction); dragging.setMirrorIsVisible(isFinal || !droppableEvent || !document.querySelector('.fc-mirror')); if (!isInvalid) { core.enableCursor(); }
                else { core.disableCursor(); }
                if (!isFinal) { dragging.setMirrorNeedsRevert(!droppableEvent); _this.receivingCalendar = receivingCalendar; _this.droppableEvent = droppableEvent; }
            }; this.handleDragEnd = function (pev) {
                var _a = _this, receivingCalendar = _a.receivingCalendar, droppableEvent = _a.droppableEvent; _this.clearDrag(); if (receivingCalendar && droppableEvent) {
                    var finalHit = _this.hitDragging.finalHit; var finalView = finalHit.component.context.view; var dragMeta = _this.dragMeta; var arg = __assign({}, receivingCalendar.buildDatePointApi(finalHit.dateSpan), { draggedEl: pev.subjectEl, jsEvent: pev.origEvent, view: finalView }); receivingCalendar.publiclyTrigger('drop', [arg]); if (dragMeta.create) {
                        receivingCalendar.dispatch({ type: 'MERGE_EVENTS', eventStore: core.eventTupleToStore(droppableEvent) }); if (pev.isTouch) { receivingCalendar.dispatch({ type: 'SELECT_EVENT', eventInstanceId: droppableEvent.instance.instanceId }); }
                        receivingCalendar.publiclyTrigger('eventReceive', [{ draggedEl: pev.subjectEl, event: new core.EventApi(receivingCalendar, droppableEvent.def, droppableEvent.instance), view: finalView }]);
                    }
                }
                _this.receivingCalendar = null; _this.droppableEvent = null;
            }; var hitDragging = this.hitDragging = new HitDragging(dragging, core.interactionSettingsStore); hitDragging.requireInitial = false; hitDragging.emitter.on('dragstart', this.handleDragStart); hitDragging.emitter.on('hitupdate', this.handleHitUpdate); hitDragging.emitter.on('dragend', this.handleDragEnd); this.suppliedDragMeta = suppliedDragMeta;
        }
        ExternalElementDragging.prototype.buildDragMeta = function (subjectEl) {
            if (typeof this.suppliedDragMeta === 'object') { return core.parseDragMeta(this.suppliedDragMeta); }
            else if (typeof this.suppliedDragMeta === 'function') { return core.parseDragMeta(this.suppliedDragMeta(subjectEl)); }
            else { return getDragMetaFromEl(subjectEl); }
        }; ExternalElementDragging.prototype.displayDrag = function (nextCalendar, state) {
            var prevCalendar = this.receivingCalendar; if (prevCalendar && prevCalendar !== nextCalendar) { prevCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' }); }
            if (nextCalendar) { nextCalendar.dispatch({ type: 'SET_EVENT_DRAG', state: state }); }
        }; ExternalElementDragging.prototype.clearDrag = function () { if (this.receivingCalendar) { this.receivingCalendar.dispatch({ type: 'UNSET_EVENT_DRAG' }); } }; ExternalElementDragging.prototype.canDropElOnCalendar = function (el, receivingCalendar) {
            var dropAccept = receivingCalendar.opt('dropAccept'); if (typeof dropAccept === 'function') { return dropAccept(el); }
            else if (typeof dropAccept === 'string' && dropAccept) { return Boolean(core.elementMatches(el, dropAccept)); }
            return true;
        }; return ExternalElementDragging;
    }()); function computeEventForDateSpan(dateSpan, dragMeta, calendar) {
        var defProps = __assign({}, dragMeta.leftoverProps); for (var _i = 0, _a = calendar.pluginSystem.hooks.externalDefTransforms; _i < _a.length; _i++) { var transform = _a[_i]; __assign(defProps, transform(dateSpan, dragMeta)); }
        var def = core.parseEventDef(defProps, dragMeta.sourceId, dateSpan.allDay, calendar.opt('forceEventDuration') || Boolean(dragMeta.duration), calendar); var start = dateSpan.range.start; if (dateSpan.allDay && dragMeta.startTime) { start = calendar.dateEnv.add(start, dragMeta.startTime); }
        var end = dragMeta.duration ? calendar.dateEnv.add(start, dragMeta.duration) : calendar.getDefaultEventEnd(dateSpan.allDay, start); var instance = core.createEventInstance(def.defId, { start: start, end: end }); return { def: def, instance: instance };
    }
    function getDragMetaFromEl(el) { var str = getEmbeddedElData(el, 'event'); var obj = str ? JSON.parse(str) : { create: false }; return core.parseDragMeta(obj); }
    core.config.dataAttrPrefix = ''; function getEmbeddedElData(el, name) { var prefix = core.config.dataAttrPrefix; var prefixedName = (prefix ? prefix + '-' : '') + name; return el.getAttribute('data-' + prefixedName) || ''; }
    var ExternalDraggable = (function () {
        function ExternalDraggable(el, settings) {
            var _this = this; if (settings === void 0) { settings = {}; }
            this.handlePointerDown = function (ev) { var dragging = _this.dragging; var _a = _this.settings, minDistance = _a.minDistance, longPressDelay = _a.longPressDelay; dragging.minDistance = minDistance != null ? minDistance : (ev.isTouch ? 0 : core.globalDefaults.eventDragMinDistance); dragging.delay = ev.isTouch ? (longPressDelay != null ? longPressDelay : core.globalDefaults.longPressDelay) : 0; }; this.handleDragStart = function (ev) { if (ev.isTouch && _this.dragging.delay && ev.subjectEl.classList.contains('fc-event')) { _this.dragging.mirror.getMirrorEl().classList.add('fc-selected'); } }; this.settings = settings; var dragging = this.dragging = new FeaturefulElementDragging(el); dragging.touchScrollAllowed = false; if (settings.itemSelector != null) { dragging.pointer.selector = settings.itemSelector; }
            if (settings.appendTo != null) { dragging.mirror.parentNode = settings.appendTo; }
            dragging.emitter.on('pointerdown', this.handlePointerDown); dragging.emitter.on('dragstart', this.handleDragStart); new ExternalElementDragging(dragging, settings.eventData);
        }
        ExternalDraggable.prototype.destroy = function () { this.dragging.destroy(); }; return ExternalDraggable;
    }()); var InferredElementDragging = (function (_super) {
        __extends(InferredElementDragging, _super); function InferredElementDragging(containerEl) { var _this = _super.call(this, containerEl) || this; _this.shouldIgnoreMove = false; _this.mirrorSelector = ''; _this.currentMirrorEl = null; _this.handlePointerDown = function (ev) { _this.emitter.trigger('pointerdown', ev); if (!_this.shouldIgnoreMove) { _this.emitter.trigger('dragstart', ev); } }; _this.handlePointerMove = function (ev) { if (!_this.shouldIgnoreMove) { _this.emitter.trigger('dragmove', ev); } }; _this.handlePointerUp = function (ev) { _this.emitter.trigger('pointerup', ev); if (!_this.shouldIgnoreMove) { _this.emitter.trigger('dragend', ev); } }; var pointer = _this.pointer = new PointerDragging(containerEl); pointer.emitter.on('pointerdown', _this.handlePointerDown); pointer.emitter.on('pointermove', _this.handlePointerMove); pointer.emitter.on('pointerup', _this.handlePointerUp); return _this; }
        InferredElementDragging.prototype.destroy = function () { this.pointer.destroy(); }; InferredElementDragging.prototype.setIgnoreMove = function (bool) { this.shouldIgnoreMove = bool; }; InferredElementDragging.prototype.setMirrorIsVisible = function (bool) {
            if (bool) { if (this.currentMirrorEl) { this.currentMirrorEl.style.visibility = ''; this.currentMirrorEl = null; } }
            else { var mirrorEl = this.mirrorSelector ? document.querySelector(this.mirrorSelector) : null; if (mirrorEl) { this.currentMirrorEl = mirrorEl; mirrorEl.style.visibility = 'hidden'; } }
        }; return InferredElementDragging;
    }(core.ElementDragging)); var ThirdPartyDraggable = (function () {
        function ThirdPartyDraggable(containerOrSettings, settings) {
            var containerEl = document; if (containerOrSettings === document || containerOrSettings instanceof Element) { containerEl = containerOrSettings; settings = settings || {}; }
            else { settings = (containerOrSettings || {}); }
            var dragging = this.dragging = new InferredElementDragging(containerEl); if (typeof settings.itemSelector === 'string') { dragging.pointer.selector = settings.itemSelector; }
            else if (containerEl === document) { dragging.pointer.selector = '[data-event]'; }
            if (typeof settings.mirrorSelector === 'string') { dragging.mirrorSelector = settings.mirrorSelector; }
            new ExternalElementDragging(dragging, settings.eventData);
        }
        ThirdPartyDraggable.prototype.destroy = function () { this.dragging.destroy(); }; return ThirdPartyDraggable;
    }()); var main = core.createPlugin({ componentInteractions: [DateClicking, DateSelecting, EventDragging, EventDragging$1], calendarInteractions: [UnselectAuto], elementDraggingImpl: FeaturefulElementDragging }); exports.Draggable = ExternalDraggable; exports.FeaturefulElementDragging = FeaturefulElementDragging; exports.PointerDragging = PointerDragging; exports.ThirdPartyDraggable = ThirdPartyDraggable; exports.default = main; Object.defineProperty(exports, '__esModule', { value: true });
}));