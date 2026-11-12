/* Last Orders at Senja — original procedural audio.
 * No audio files, no samples, no copyrighted material.
 * Everything is synthesised live with the Web Audio API:
 * a soft pentatonic pluck melody, a low pad, rain made from
 * filtered noise, and small foley sounds (pour, cup, chime).
 * Audio only starts after a user gesture. Safe to load in
 * environments without Web Audio (all calls become no-ops).
 */
(function (root) {
"use strict";

var MOODS = {
  0: { scale: [220.00, 261.63, 293.66, 329.63, 392.00], tempo: 2600, rain: 0.05, pad: 0.018, brightness: 900 },
  1: { scale: [220.00, 261.63, 293.66, 329.63, 392.00], tempo: 2900, rain: 0.055, pad: 0.016, brightness: 850 },
  2: { scale: [196.00, 246.94, 261.63, 329.63, 392.00], tempo: 3200, rain: 0.045, pad: 0.02, brightness: 800 },
  3: { scale: [220.00, 277.18, 329.63, 392.00, 440.00], tempo: 2800, rain: 0.035, pad: 0.016, brightness: 1000 },
  4: { scale: [174.61, 220.00, 261.63, 311.13, 392.00], tempo: 3800, rain: 0.04, pad: 0.022, brightness: 700 },
  5: { scale: [246.94, 293.66, 329.63, 392.00, 493.88], tempo: 2400, rain: 0.015, pad: 0.02, brightness: 1400 }
};

function SenjaAudio() {
  this.ctx = null;
  this.master = null;
  this.musicGain = null;
  this.rainGain = null;
  this.muted = false;
  this.started = false;
  this.chapter = 0;
  this.timer = null;
  this.step = 0;
  this.padNodes = [];
}

SenjaAudio.prototype.ensure = function () {
  if (this.ctx) return true;
  var AC = (typeof window !== "undefined") && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return false;
  try {
    this.ctx = new AC();
  } catch (e) { return false; }
  this.master = this.ctx.createGain();
  this.master.gain.value = this.muted ? 0 : 0.9;
  this.master.connect(this.ctx.destination);
  this.musicGain = this.ctx.createGain();
  this.musicGain.gain.value = 0.5;
  this.musicGain.connect(this.master);
  this.rainGain = this.ctx.createGain();
  this.rainGain.gain.value = 0;
  this.rainGain.connect(this.master);
  this._startRain();
  this._startPad();
  return true;
};

SenjaAudio.prototype.unlock = function () {
  if (!this.ensure()) return;
  if (this.ctx.state === "suspended") { this.ctx.resume(); }
  if (!this.started) {
    this.started = true;
    this._schedule();
  }
};

SenjaAudio.prototype.setMuted = function (muted) {
  this.muted = !!muted;
  if (this.master && this.ctx) {
    this.master.gain.setTargetAtTime(this.muted ? 0 : 0.9, this.ctx.currentTime, 0.1);
  }
};

SenjaAudio.prototype.setChapter = function (ch) {
  this.chapter = MOODS[ch] ? ch : 0;
  var mood = MOODS[this.chapter];
  if (this.rainGain && this.ctx) {
    this.rainGain.gain.setTargetAtTime(mood.rain, this.ctx.currentTime, 1.5);
  }
  this._startPad();
};

SenjaAudio.prototype._noiseBuffer = function (seconds) {
  var len = Math.floor(this.ctx.sampleRate * seconds);
  var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
  var data = buf.getChannelData(0);
  var last = 0;
  for (var i = 0; i < len; i++) {
    var white = Math.random() * 2 - 1;
    last = last * 0.94 + white * 0.06; /* brown-ish, soft like rain on an awning */
    data[i] = last * 3.2;
  }
  return buf;
};

SenjaAudio.prototype._startRain = function () {
  var src = this.ctx.createBufferSource();
  src.buffer = this._noiseBuffer(4);
  src.loop = true;
  var filter = this.ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1400;
  filter.Q.value = 0.4;
  var hiss = this.ctx.createBiquadFilter();
  hiss.type = "highpass";
  hiss.frequency.value = 300;
  src.connect(hiss);
  hiss.connect(filter);
  filter.connect(this.rainGain);
  src.start();
  this.rainGain.gain.value = MOODS[this.chapter].rain;
};

SenjaAudio.prototype._startPad = function () {
  if (!this.ctx) return;
  var self = this;
  this.padNodes.forEach(function (n) {
    try { n.gain.gain.setTargetAtTime(0, self.ctx.currentTime, 0.8); n.osc.stop(self.ctx.currentTime + 2); } catch (e) {}
  });
  this.padNodes = [];
  var mood = MOODS[this.chapter];
  var root = mood.scale[0] / 2;
  [root, root * 1.5].forEach(function (freq, i) {
    var osc = self.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.detune.value = i === 0 ? -4 : 5;
    var g = self.ctx.createGain();
    g.gain.value = 0;
    g.gain.setTargetAtTime(mood.pad, self.ctx.currentTime, 2.0);
    osc.connect(g);
    g.connect(self.musicGain);
    osc.start();
    self.padNodes.push({ osc: osc, gain: g });
  });
};

SenjaAudio.prototype._pluck = function (freq, when, velocity) {
  var osc = this.ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  var osc2 = this.ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 2;
  var g = this.ctx.createGain();
  var g2 = this.ctx.createGain();
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(velocity, when + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 2.4);
  g2.gain.setValueAtTime(0, when);
  g2.gain.linearRampToValueAtTime(velocity * 0.25, when + 0.01);
  g2.gain.exponentialRampToValueAtTime(0.0001, when + 1.2);
  var filter = this.ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = MOODS[this.chapter].brightness;
  osc.connect(g); osc2.connect(g2); g.connect(filter); g2.connect(filter);
  filter.connect(this.musicGain);
  osc.start(when); osc2.start(when);
  osc.stop(when + 2.6); osc2.stop(when + 1.4);
};

/* Gentle random-walk melody over the chapter scale. Occasional
 * rests keep it sparse: this is a stall at night, not a concert. */
SenjaAudio.prototype._schedule = function () {
  var self = this;
  if (this.timer) return;
  var degree = 2;
  var tick = function () {
    if (!self.ctx || self.muted) { return; }
    var mood = MOODS[self.chapter];
    var r = Math.random();
    if (r < 0.22) return; /* rest */
    degree += Math.floor(Math.random() * 5) - 2;
    if (degree < 0) degree = 0;
    if (degree > mood.scale.length - 1) degree = mood.scale.length - 1;
    var freq = mood.scale[degree] * (Math.random() < 0.18 ? 2 : 1);
    var when = self.ctx.currentTime + 0.05;
    self._pluck(freq, when, 0.11 + Math.random() * 0.05);
    if (Math.random() < 0.3) {
      self._pluck(mood.scale[0] * 2, when + 0.35, 0.05);
    }
  };
  tick();
  this.timer = setInterval(function () {
    if (!self.ctx) return;
    tick();
  }, 1400);
  /* Tempo differences come from rest probability + pad/rain mix;
   * the scheduler interval stays constant for stability. */
};

SenjaAudio.prototype.pour = function () {
  if (!this.ensure() || this.muted) return;
  var t = this.ctx.currentTime;
  var src = this.ctx.createBufferSource();
  src.buffer = this._noiseBuffer(1.2);
  var filter = this.ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, t);
  filter.frequency.exponentialRampToValueAtTime(420, t + 0.9);
  filter.Q.value = 1.1;
  var g = this.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.16, t + 0.12);
  g.gain.setTargetAtTime(0, t + 0.7, 0.18);
  src.connect(filter); filter.connect(g); g.connect(this.master);
  src.start(t); src.stop(t + 1.3);
};

SenjaAudio.prototype.clink = function () {
  if (!this.ensure() || this.muted) return;
  var t = this.ctx.currentTime;
  var self = this;
  [2093, 2793].forEach(function (freq, i) {
    var osc = self.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    var g = self.ctx.createGain();
    var start = t + i * 0.07;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(i === 0 ? 0.09 : 0.05, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);
    osc.connect(g); g.connect(self.master);
    osc.start(start); osc.stop(start + 0.8);
  });
};

SenjaAudio.prototype.chime = function () {
  if (!this.ensure() || this.muted) return;
  var t = this.ctx.currentTime;
  var self = this;
  [523.25, 659.25, 783.99].forEach(function (freq, i) {
    var osc = self.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    var g = self.ctx.createGain();
    var start = t + i * 0.12;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(0.08, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);
    osc.connect(g); g.connect(self.master);
    osc.start(start); osc.stop(start + 1.5);
  });
};

SenjaAudio.prototype.tick = function () {
  if (!this.ensure() || this.muted) return;
  var t = this.ctx.currentTime;
  var osc = this.ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 660;
  var g = this.ctx.createGain();
  g.gain.setValueAtTime(0.04, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(g); g.connect(this.master);
  osc.start(t); osc.stop(t + 0.1);
};

SenjaAudio.prototype.playSfx = function (name) {
  if (name === "pour") this.pour();
  else if (name === "clink") this.clink();
  else if (name === "chime") this.chime();
  else if (name === "tick") this.tick();
};

root.SenjaAudio = SenjaAudio;
if (typeof module !== "undefined" && module.exports) module.exports = SenjaAudio;
})(typeof window !== "undefined" ? window : globalThis);
