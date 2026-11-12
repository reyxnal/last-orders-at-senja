/* Last Orders at Senja — game engine.
 * Vanilla JS, no dependencies. Renders the story graph from
 * story.js, manages state, save/load, meters, shelf/journal,
 * endings gallery, chapter select, settings and keyboard play.
 */
(function () {
"use strict";

var STORY = (typeof window !== "undefined") ? window.SENJA_STORY : null;
if (!STORY) {
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("title-error");
    if (el) el.style.display = "block";
  });
  return;
}

var SAVE_KEY = "senja-save-v1";
var ENDINGS_KEY = "senja-endings-v1";
var SETTINGS_KEY = "senja-settings-v1";
var DONE_KEY = "senja-completed-v1";

var ART = {
  hero: "assets/hero-thumbnail.jpg",
  warung: "assets/bg-warung-night.jpg",
  dawn: "assets/vignette-dawn.jpg",
  recipe: "assets/vignette-recipe.jpg",
  photo: "assets/vignette-photograph.jpg"
};
var PORTRAITS = {
  ardi: "assets/portrait-ardi.jpg",
  ratna: "assets/portrait-ratna.jpg",
  dimas: "assets/portrait-dimas.jpg",
  sinta: "assets/portrait-sinta.jpg"
};
var CHAPTER_START = { 1: "c1_intro", 2: "c2_intro", 3: "c3_intro", 4: "c4_intro", 5: "c5_intro" };
var SPEEDS = { slow: 45, normal: 18, fast: 6, instant: 0 };

/* ---------- storage (safe under file:// and private modes) ---------- */
var memoryStore = {};
function storeGet(key) {
  try { return window.localStorage.getItem(key); } catch (e) { return memoryStore[key] || null; }
}
function storeSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch (e) { memoryStore[key] = value; }
}
function storeDel(key) {
  try { window.localStorage.removeItem(key); } catch (e) { delete memoryStore[key]; }
}

/* ---------- state ---------- */
var state = null;
var settings = { muted: false, speed: "normal" };
var endingsSeen = [];
var audio = new window.SenjaAudio();
var typingTimer = null;
var typing = false;
var fullText = "";
var shownChars = 0;
var currentNode = null;
var lastMeters = { memory: 0, warmth: 0, truth: 0 };

function freshState() {
  return { node: STORY.START_NODE, meters: { memory: 0, warmth: 0, truth: 0 },
           items: [], flags: {}, journal: [] };
}

function loadSettings() {
  try {
    var raw = storeGet(SETTINGS_KEY);
    if (raw) {
      var s = JSON.parse(raw);
      if (typeof s.muted === "boolean") settings.muted = s.muted;
      if (SPEEDS[s.speed] !== undefined) settings.speed = s.speed;
    }
  } catch (e) {}
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches && !storeGet(SETTINGS_KEY)) {
    settings.speed = "instant";
  }
  audio.setMuted(settings.muted);
}
function saveSettings() { storeSet(SETTINGS_KEY, JSON.stringify(settings)); }

function loadEndings() {
  try { endingsSeen = JSON.parse(storeGet(ENDINGS_KEY) || "[]") || []; }
  catch (e) { endingsSeen = []; }
}
function unlockEnding(id) {
  if (endingsSeen.indexOf(id) === -1) endingsSeen.push(id);
  storeSet(ENDINGS_KEY, JSON.stringify(endingsSeen));
  storeSet(DONE_KEY, "1");
}
function hasCompleted() { return storeGet(DONE_KEY) === "1"; }

function saveGame() {
  if (!state) return;
  storeSet(SAVE_KEY, JSON.stringify(state));
}
function loadSave() {
  try {
    var raw = storeGet(SAVE_KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    if (!s || !STORY.NODES[s.node]) return null;
    return s;
  } catch (e) { return null; }
}
function clearSave() { storeDel(SAVE_KEY); }

/* ---------- requirements ---------- */
function meets(req, st) {
  if (!req) return true;
  if (req.flag) return !!st.flags[req.flag];
  if (req.notFlag) return !st.flags[req.notFlag];
  if (req.meter) return (st.meters[req.meter] || 0) >= (req.min || 0);
  if (req.itemsMin !== undefined) return st.items.length >= req.itemsMin;
  if (req.all) return req.all.every(function (r) { return meets(r, st); });
  if (req.any) return req.any.some(function (r) { return meets(r, st); });
  return true;
}

function applyEffects(effects) {
  if (!effects) return [];
  var changed = [];
  ["memory", "warmth", "truth"].forEach(function (k) {
    if (effects[k]) {
      state.meters[k] += effects[k];
      changed.push(k);
    }
  });
  return changed;
}

/* ---------- DOM helpers ---------- */
function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function showScreen(name) {
  ["title", "game"].forEach(function (n) {
    $("screen-" + n).classList.toggle("active", n === name);
  });
}
function openModal(id) { $(id).classList.add("open"); $(id).setAttribute("aria-hidden", "false"); }
function closeModal(id) { $(id).classList.remove("open"); $(id).setAttribute("aria-hidden", "true"); }
function closeAllModals() {
  document.querySelectorAll(".modal.open").forEach(function (m) { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); });
}
function anyModalOpen() { return !!document.querySelector(".modal.open"); }

function toast(msg) {
  var t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove("show"); }, 2600);
}

var METER_WORDS = {
  memory: "A memory surfaces.",
  warmth: "Warmth grows.",
  truth: "The truth lands."
};

/* ---------- rendering ---------- */
function setArt(artKey) {
  var bg = $("scene-bg");
  var src = ART[artKey] || ART.warung;
  if (bg.getAttribute("src") !== src) bg.setAttribute("src", src);
  bg.onerror = function () { bg.style.display = "none"; };
  bg.onload = function () { bg.style.display = "block"; };
}
function setPortrait(key) {
  var wrap = $("portrait-wrap");
  var img = $("portrait-img");
  if (!key || !PORTRAITS[key]) { wrap.classList.add("hidden"); return; }
  img.setAttribute("src", PORTRAITS[key]);
  img.setAttribute("alt", "Portrait of " + key.charAt(0).toUpperCase() + key.slice(1));
  img.onerror = function () { wrap.classList.add("hidden"); };
  img.onload = function () { wrap.classList.remove("hidden"); };
  wrap.classList.remove("hidden");
}

function renderMeters(pulseKeys) {
  ["memory", "warmth", "truth"].forEach(function (k) {
    var row = $("meter-" + k);
    if (!row) return;
    var dots = row.querySelectorAll(".dot");
    var val = Math.min(10, Math.max(0, state.meters[k]));
    dots.forEach(function (d, i) { d.classList.toggle("filled", i < val); });
    row.setAttribute("aria-label", k.charAt(0).toUpperCase() + k.slice(1) + ": " + state.meters[k]);
    if (pulseKeys && pulseKeys.indexOf(k) !== -1) {
      row.classList.remove("pulse");
      void row.offsetWidth;
      row.classList.add("pulse");
    }
  });
}

function renderProgress(ch) {
  var info = STORY.CHAPTERS[ch] || STORY.CHAPTERS[0];
  var label = ch === 0 ? "Prologue" : "Chapter " + ch + " of 5";
  $("chapter-label").textContent = label + " — " + info.title + " · " + info.time + (info.guest ? " · " + info.guest : "");
  var dots = $("chapter-dots").querySelectorAll(".cdot");
  dots.forEach(function (d, i) {
    var n = i + 1;
    d.classList.toggle("done", n < ch || (ch === 5 && n === 5));
    d.classList.toggle("current", n === ch);
    d.setAttribute("aria-label", "Chapter " + n + (n === ch ? " (current)" : n < ch ? " (done)" : ""));
  });
}

function stopTyping() {
  if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }
  typing = false;
}
function finishTyping() {
  stopTyping();
  shownChars = fullText.length;
  renderTypedText();
  showNodeControls();
}
function renderTypedText() {
  var partial = fullText.slice(0, shownChars);
  var html = esc(partial).split(/\n\n+/).map(function (p) {
    return "<p>" + p.replace(/\n/g, "<br>") + "</p>";
  }).join("");
  $("story-text").innerHTML = html || "<p>&nbsp;</p>";
}
function typeText() {
  stopTyping();
  var delay = SPEEDS[settings.speed];
  if (delay === 0 || window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches && settings.speed === "instant") {
    finishTyping();
    return;
  }
  typing = true;
  shownChars = 0;
  var step = function () {
    shownChars += (settings.speed === "fast" ? 2 : 1);
    if (shownChars >= fullText.length) { finishTyping(); return; }
    renderTypedText();
    typingTimer = setTimeout(step, delay);
  };
  step();
}

function showNodeControls() {
  var node = currentNode;
  var choicesEl = $("choices");
  var contEl = $("continue-wrap");
  choicesEl.innerHTML = "";
  contEl.innerHTML = "";
  if (!node) return;
  if (node.ending && node.next === null) {
    /* epilogue: end-of-run controls */
    var row = document.createElement("div");
    row.className = "end-actions";
    row.innerHTML = '<button class="btn primary" data-act="gallery">View Ending Gallery</button>' +
      '<button class="btn" data-act="chapters">Chapter Select</button>' +
      '<button class="btn" data-act="title">Back to Title</button>';
    contEl.appendChild(row);
    row.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.act === "gallery") { renderGallery(); openModal("modal-gallery"); }
        else if (b.dataset.act === "chapters") { renderChapterSelect(); openModal("modal-chapters"); }
        else { showTitle(); }
      });
    });
    return;
  }
  if (node.choices && node.choices.length) {
    var visible = node.choices.filter(function (c) { return meets(c.requires, state); });
    visible.forEach(function (choice, i) {
      var b = document.createElement("button");
      b.className = "choice-btn";
      b.innerHTML = '<span class="choice-num">' + (i + 1) + "</span><span>" + esc(choice.label) + "</span>";
      b.addEventListener("click", function () { choose(choice); });
      choicesEl.appendChild(b);
    });
    choicesEl._visible = visible;
  } else if (node.next) {
    var b = document.createElement("button");
    b.className = "btn primary continue-btn";
    b.textContent = "Continue ▸";
    b.addEventListener("click", function () { advance(); });
    contEl.appendChild(b);
  }
}

function renderNode(nodeId) {
  var node = STORY.NODES[nodeId];
  if (!node) { showTitle(); return; }
  /* Resolve branch / ending gates before rendering. */
  var guard = 0;
  while (node && (node.branch || node.endingEval) && guard < 10) {
    guard++;
    if (node.endingEval) {
      var endId = STORY.pickEnding(state);
      nodeId = "end_" + endId + "_1";
      node = STORY.NODES[nodeId];
      break;
    }
    var picked = null;
    for (var i = 0; i < node.branch.length; i++) {
      if (meets(node.branch[i].requires, state)) { picked = node.branch[i].next; break; }
    }
    nodeId = picked || node.branch[node.branch.length - 1].next;
    node = STORY.NODES[nodeId];
  }
  if (!node) { showTitle(); return; }
  state.node = nodeId;
  currentNode = node;
  if (node.effects) applyEffects(node.effects);
  if (node.journal) addJournal(node.journal);
  if (node.ending) {
    unlockEnding(node.ending);
    if (node.next === null) clearSave(); else saveGame();
  } else {
    saveGame();
  }
  audio.setChapter(node.ch || 0);
  setArt(node.art || "warung");
  setPortrait(node.portrait);
  $("speaker").textContent = node.speaker || "";
  $("speaker").style.display = node.speaker ? "inline-block" : "none";
  renderProgress(node.ch || 0);
  renderMeters([]);
  if (node.sfx) audio.playSfx(node.sfx);
  if (node.ending && node.next !== null) {
    $("ending-banner").textContent = "Ending — " + (node.endingTitle || STORY.ENDINGS[node.ending].title);
    $("ending-banner").style.display = "block";
  } else {
    $("ending-banner").style.display = "none";
  }
  fullText = node.text || "";
  $("choices").innerHTML = "";
  $("continue-wrap").innerHTML = "";
  typeText();
  updateShelfBadge();
}

function advance() {
  if (typing) { finishTyping(); return; }
  if (!currentNode || !currentNode.next) return;
  audio.tick();
  renderNode(currentNode.next);
}

function choose(choice) {
  if (typing) { finishTyping(); return; }
  audio.tick();
  var changed = applyEffects(choice.effects);
  if (choice.gives && state.items.indexOf(choice.gives) === -1) {
    state.items.push(choice.gives);
    state.flags[choice.gives] = true;
    audio.chime();
    var item = STORY.ITEMS[choice.gives];
    toast("Kept: " + (item ? item.name : choice.gives));
  }
  if (choice.journal) addJournal(choice.journal);
  renderMeters(changed);
  if (changed.length && !choice.gives) {
    toast(changed.map(function (k) { return METER_WORDS[k]; }).join(" "));
  }
  lastMeters = { memory: state.meters.memory, warmth: state.meters.warmth, truth: state.meters.truth };
  renderNode(choice.next);
}

function addJournal(entry) {
  if (!entry) return;
  var exists = state.journal.some(function (j) { return j.title === entry.title; });
  if (!exists) state.journal.push(entry);
}

function updateShelfBadge() {
  $("shelf-count").textContent = state ? state.items.length + " / " + Object.keys(STORY.ITEMS).length : "0 / 5";
}

/* ---------- flows ---------- */
function startNewGame() {
  state = freshState();
  lastMeters = { memory: 0, warmth: 0, truth: 0 };
  showScreen("game");
  renderNode(state.node);
}
function continueGame() {
  var s = loadSave();
  if (!s) { startNewGame(); return; }
  state = s;
  lastMeters = { memory: state.meters.memory, warmth: state.meters.warmth, truth: state.meters.truth };
  showScreen("game");
  renderNode(state.node);
}
function showTitle() {
  stopTyping();
  closeAllModals();
  showScreen("title");
  refreshTitleButtons();
}
function refreshTitleButtons() {
  var hasSave = !!loadSave();
  $("btn-continue").style.display = hasSave ? "inline-block" : "none";
  var done = hasCompleted();
  $("btn-chapters").textContent = done ? "Chapter Select" : "Chapter Select (finish the night to unlock)";
  $("btn-chapters").disabled = !done;
  $("endings-progress").textContent = "Endings found: " + endingsSeen.length + " / 5";
}

function chapterStartState(ch) {
  var st = freshState();
  st.meters = { memory: 2, warmth: 2, truth: 2 };
  var grant = [];
  if (ch >= 2) grant.push("recipe");
  if (ch >= 3) grant.push("photo");
  if (ch >= 4) grant.push("ticket");
  if (ch >= 5) grant.push("thermos");
  grant.forEach(function (id) { st.items.push(id); st.flags[id] = true; });
  st.journal.push({ title: "Chapter select", body: "You return to this hour with a balanced heart and the keepsakes of earlier hours. The truest ending is earned on a full night, from the prologue to the dawn." });
  st.node = CHAPTER_START[ch];
  return st;
}
function startChapter(ch) {
  state = chapterStartState(ch);
  lastMeters = { memory: 2, warmth: 2, truth: 2 };
  closeAllModals();
  showScreen("game");
  renderNode(state.node);
}

/* ---------- panels ---------- */
function renderShelf() {
  var shelfEl = $("shelf-items");
  shelfEl.innerHTML = "";
  Object.keys(STORY.ITEMS).forEach(function (id) {
    var item = STORY.ITEMS[id];
    var owned = state && state.items.indexOf(id) !== -1;
    var card = document.createElement("div");
    card.className = "shelf-card" + (owned ? "" : " locked");
    card.innerHTML = (owned
      ? '<img src="' + ART[item.art] + '" alt="">'
      : '<div class="shelf-empty">?</div>') +
      '<div><h4>' + (owned ? esc(item.name) : "An empty space on the shelf…") + "</h4>" +
      "<p>" + (owned ? esc(item.desc) : "Something from the night belongs here. Keep playing to find it.") + "</p></div>";
    shelfEl.appendChild(card);
  });
  var jEl = $("journal-entries");
  jEl.innerHTML = "";
  if (!state || !state.journal.length) {
    jEl.innerHTML = "<p class='muted'>No journal entries yet. The night is young.</p>";
  } else {
    state.journal.forEach(function (j) {
      var d = document.createElement("div");
      d.className = "journal-entry";
      d.innerHTML = "<h4>" + esc(j.title) + "</h4><p>" + esc(j.body) + "</p>";
      jEl.appendChild(d);
    });
  }
}
function renderGallery() {
  var el = $("gallery-items");
  el.innerHTML = "";
  Object.keys(STORY.ENDINGS).forEach(function (id) {
    var e = STORY.ENDINGS[id];
    var seen = endingsSeen.indexOf(id) !== -1;
    var card = document.createElement("div");
    card.className = "gallery-card" + (seen ? "" : " locked");
    card.innerHTML = (seen
      ? '<img src="' + ART[e.art] + '" alt="">'
      : '<div class="gallery-empty">?</div>') +
      "<div><h4>" + (seen ? esc(e.title) : "???") + "</h4>" +
      "<p>" + (seen ? esc(e.blurb) : "Finish the night to reveal this ending. Different choices lead to different dawns.") + "</p></div>";
    el.appendChild(card);
  });
}
function renderChapterSelect() {
  var el = $("chapter-list");
  el.innerHTML = "";
  STORY.CHAPTERS.slice(1).forEach(function (c) {
    var b = document.createElement("button");
    b.className = "choice-btn";
    b.innerHTML = '<span class="choice-num">' + c.n + "</span><span><strong>Chapter " + c.n + ": " + esc(c.title) + "</strong><br><small>" + esc(c.time) + (c.guest ? " · " + esc(c.guest) : "") + "</small></span>";
    b.addEventListener("click", function () { startChapter(c.n); });
    el.appendChild(b);
  });
}
function renderSettingsUI() {
  $("setting-mute").textContent = settings.muted ? "Sound: Off" : "Sound: On";
  document.querySelectorAll("[data-speed]").forEach(function (b) {
    b.classList.toggle("selected", b.dataset.speed === settings.speed);
    b.setAttribute("aria-pressed", b.dataset.speed === settings.speed ? "true" : "false");
  });
  $("hud-mute").textContent = settings.muted ? "Sound: Off" : "Sound: On";
}

/* ---------- events ---------- */
function bindEvents() {
  $("btn-start").addEventListener("click", function () {
    audio.unlock();
    if (loadSave() && !window.confirm("Start a new night? Your saved progress will be replaced.")) return;
    startNewGame();
  });
  $("btn-continue").addEventListener("click", function () { audio.unlock(); continueGame(); });
  $("btn-chapters").addEventListener("click", function () { renderChapterSelect(); openModal("modal-chapters"); });
  $("btn-gallery-title").addEventListener("click", function () { renderGallery(); openModal("modal-gallery"); });
  $("btn-settings-title").addEventListener("click", function () { renderSettingsUI(); openModal("modal-settings"); });
  $("btn-credits-title").addEventListener("click", function () { openModal("modal-credits"); });

  $("hud-mute").addEventListener("click", function () {
    settings.muted = !settings.muted;
    audio.setMuted(settings.muted);
    saveSettings(); renderSettingsUI();
  });
  $("hud-shelf").addEventListener("click", function () { renderShelf(); openModal("modal-shelf"); });
  $("hud-settings").addEventListener("click", function () { renderSettingsUI(); openModal("modal-settings"); });
  $("hud-title").addEventListener("click", function () { showTitle(); });

  document.querySelectorAll("[data-close]").forEach(function (b) {
    b.addEventListener("click", function () { closeModal(b.dataset.close); });
  });
  document.querySelectorAll(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) { if (e.target === m) closeModal(m.id); });
  });
  $("setting-mute").addEventListener("click", function () {
    settings.muted = !settings.muted;
    audio.setMuted(settings.muted);
    saveSettings(); renderSettingsUI();
  });
  document.querySelectorAll("[data-speed]").forEach(function (b) {
    b.addEventListener("click", function () {
      settings.speed = b.dataset.speed;
      saveSettings(); renderSettingsUI();
    });
  });
  $("setting-restart").addEventListener("click", function () {
    if (!window.confirm("Restart the night from the beginning? Saved progress will be replaced.")) return;
    closeAllModals();
    startNewGame();
  });
  $("setting-title").addEventListener("click", function () { showTitle(); });

  /* Audio unlocks on the first gesture, anywhere. */
  var unlockOnce = function () { audio.unlock(); };
  document.addEventListener("pointerdown", unlockOnce, { once: false });
  document.addEventListener("keydown", unlockOnce, { once: false });

  /* Clicking the story text completes typing, then advances. */
  $("story-box").addEventListener("click", function (e) {
    if (e.target.closest("button")) return;
    if (typing) { finishTyping(); return; }
    if (currentNode && !currentNode.choices && currentNode.next) advance();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeAllModals(); return; }
    if (anyModalOpen()) return;
    if ($("screen-title").classList.contains("active")) {
      if (e.key === "Enter") { audio.unlock(); if (loadSave()) continueGame(); else startNewGame(); }
      return;
    }
    if (!$("screen-game").classList.contains("active")) return;
    if (e.key === "m" || e.key === "M") {
      settings.muted = !settings.muted;
      audio.setMuted(settings.muted); saveSettings(); renderSettingsUI();
      return;
    }
    if (e.key === "j" || e.key === "J") { renderShelf(); openModal("modal-shelf"); return; }
    if (typing) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finishTyping(); }
      return;
    }
    var num = parseInt(e.key, 10);
    var visible = $("choices")._visible;
    if (num >= 1 && visible && num <= visible.length) { choose(visible[num - 1]); return; }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (currentNode && !currentNode.choices && currentNode.next) advance();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadSettings();
  loadEndings();
  renderSettingsUI();
  refreshTitleButtons();
  bindEvents();
});
})();
