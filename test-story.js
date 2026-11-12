/* Story graph tests for Last Orders at Senja.
 * Run: node test-story.js
 * Checks: target validity, reachability, dead ends, placeholder
 * text, choice counts, item collectibility, and — via exhaustive
 * state-space search — a concrete choice path to each ending.
 * Exit code 0 = all checks pass.
 */
"use strict";
const S = require("./story.js");
const N = S.NODES;
let failures = 0;
function fail(msg) { failures++; console.log("FAIL: " + msg); }
function ok(msg) { console.log("ok: " + msg); }

/* ---- 1. target validity ---- */
const ids = new Set(Object.keys(N));
let badTargets = [];
for (const [id, node] of Object.entries(N)) {
  const targets = [];
  if (node.next) targets.push(node.next);
  (node.choices || []).forEach(c => targets.push(c.next));
  (node.branch || []).forEach(b => targets.push(b.next));
  for (const t of targets) if (!ids.has(t)) badTargets.push(id + " -> " + t);
}
if (badTargets.length) fail("dangling targets: " + badTargets.join(", "));
else ok("all " + Object.keys(N).length + " nodes' targets exist");

/* ---- 2. reachability (ignoring requires) ---- */
const seen = new Set([S.START_NODE]);
const queue = [S.START_NODE];
while (queue.length) {
  const id = queue.shift();
  const node = N[id];
  const targets = [];
  if (node.next) targets.push(node.next);
  (node.choices || []).forEach(c => targets.push(c.next));
  (node.branch || []).forEach(b => targets.push(b.next));
  if (node.endingEval) Object.keys(S.ENDINGS).forEach(e => targets.push("end_" + e + "_1"));
  for (const t of targets) if (!seen.has(t)) { seen.add(t); queue.push(t); }
}
const unreachable = [...ids].filter(i => !seen.has(i));
if (unreachable.length) fail("unreachable nodes: " + unreachable.join(", "));
else ok("all nodes reachable from " + S.START_NODE);

/* ---- 3. dead ends ---- */
const deadEnds = [...ids].filter(id => {
  const n = N[id];
  return !n.next && !(n.choices && n.choices.length) && !(n.branch && n.branch.length) && !n.endingEval;
});
const expectedDead = ["end_dawn_2", "end_open_2", "end_letter_2", "end_cup_2", "end_chair_2"];
const unexpected = deadEnds.filter(d => !expectedDead.includes(d));
const missing = expectedDead.filter(d => !deadEnds.includes(d));
if (unexpected.length || missing.length) fail("dead-end mismatch. unexpected: " + unexpected.join(",") + " missing: " + missing.join(","));
else ok("dead ends are exactly the 5 ending epilogues");

/* ---- 4. text quality ---- */
const banned = [/lorem/i, /TODO/, /FIXME/, /placeholder/i, /XXX/];
let textProblems = [];
for (const [id, node] of Object.entries(N)) {
  if (node.endingEval || node.branch) continue; /* routing nodes: never rendered */
  if (!node.text || node.text.trim().length < 40) textProblems.push(id + " (short/empty text)");
  for (const re of banned) if (re.test(node.text || "")) textProblems.push(id + " (banned pattern " + re + ")");
  (node.choices || []).forEach(c => {
    if (!c.label || c.label.trim().length < 3) textProblems.push(id + " (empty choice label)");
  });
}
if (textProblems.length) fail("text problems: " + textProblems.join("; "));
else ok("all node texts are final prose (no lorem/TODO/placeholder)");

/* ---- 5. choice points ---- */
const choiceNodes = [...ids].filter(id => N[id].choices && N[id].choices.length >= 2);
console.log("info: choice points = " + choiceNodes.length + " (requirement: >= 15)");
if (choiceNodes.length < 15) fail("fewer than 15 meaningful choice points");
else ok(">= 15 meaningful choice points");

/* ---- 6. endings structure ---- */
let endProblems = [];
for (const e of Object.keys(S.ENDINGS)) {
  if (!N["end_" + e + "_1"] || !N["end_" + e + "_2"]) endProblems.push(e + " missing scene/epilogue");
  if (N["end_" + e + "_1"] && N["end_" + e + "_1"].next !== "end_" + e + "_2") endProblems.push(e + " scene does not lead to epilogue");
  if (N["end_" + e + "_1"] && N["end_" + e + "_1"].text === N["end_" + e + "_2"].text) endProblems.push(e + " scene == epilogue text");
}
const endTexts = Object.keys(S.ENDINGS).map(e => N["end_" + e + "_1"].text + N["end_" + e + "_2"].text);
if (new Set(endTexts).size !== endTexts.length) endProblems.push("two endings share identical text");
if (endProblems.length) fail("ending problems: " + endProblems.join("; "));
else ok("5 endings, each with distinct scene + epilogue text");

/* ---- 7. solver: exhaustive state search for every ending ---- */
function meets(req, st) {
  if (!req) return true;
  if (req.flag) return !!st.flags[req.flag];
  if (req.notFlag) return !st.flags[req.notFlag];
  if (req.meter) return (st.meters[req.meter] || 0) >= (req.min || 0);
  if (req.itemsMin !== undefined) return st.items.length >= req.itemsMin;
  if (req.all) return req.all.every(r => meets(r, st));
  if (req.any) return req.any.some(r => meets(r, st));
  return true;
}
const CAP = 12;
function cap(v) { return Math.min(CAP, Math.max(0, v)); }
function keyOf(nodeId, st) {
  return [nodeId, cap(st.meters.memory), cap(st.meters.warmth), cap(st.meters.truth), [...st.items].sort().join(",")].join("|");
}
function resolveNode(nodeId, st) {
  let node = N[nodeId], guard = 0;
  while (node && (node.branch || node.endingEval) && guard < 10) {
    guard++;
    if (node.endingEval) { nodeId = "end_" + S.pickEnding(st) + "_1"; node = N[nodeId]; break; }
    let picked = null;
    for (const b of node.branch) if (meets(b.requires, st)) { picked = b.next; break; }
    nodeId = picked || node.branch[node.branch.length - 1].next;
    node = N[nodeId];
  }
  return { nodeId, node };
}

const found = {};   // ending -> {path, meters, items}
const visited = new Set();
let statesExplored = 0;
function search(nodeId, st, path) {
  const r = resolveNode(nodeId, st);
  nodeId = r.nodeId;
  const node = r.node;
  if (!node) return;
  const k = keyOf(nodeId, st);
  if (visited.has(k)) return;
  visited.add(k);
  statesExplored++;
  if (node.ending) {
    if (!found[node.ending]) {
      found[node.ending] = { path: [...path], meters: { ...st.meters }, items: [...st.items], endNode: nodeId };
    }
    if (node.next) search(node.next, st, path);
    return;
  }
  if (node.choices && node.choices.length) {
    for (const c of node.choices) {
      if (!meets(c.requires, st)) continue;
      const st2 = { meters: { ...st.meters }, items: [...st.items], flags: { ...st.flags } };
      for (const m of ["memory", "warmth", "truth"]) if (c.effects && c.effects[m]) st2.meters[m] = cap(st2.meters[m] + c.effects[m]);
      if (c.gives && !st2.items.includes(c.gives)) { st2.items.push(c.gives); st2.flags[c.gives] = true; }
      path.push(nodeId + " :: " + c.label);
      search(c.next, st2, path);
      path.pop();
    }
    return;
  }
  if (node.next) search(node.next, st, path);
}
search(S.START_NODE, { meters: { memory: 0, warmth: 0, truth: 0 }, items: [], flags: {} }, []);
console.log("info: states explored = " + statesExplored);

for (const e of Object.keys(S.ENDINGS)) {
  if (!found[e]) { fail("ending unreachable in state search: " + e); continue; }
  ok("ending reachable: " + S.ENDINGS[e].title + " (" + found[e].path.length + " choices; meters M" + found[e].meters.memory + "/W" + found[e].meters.warmth + "/T" + found[e].meters.truth + "; items " + found[e].items.length + "/5)");
}
console.log("\n--- ENDING PATHS (choice sequences) ---");
for (const e of Object.keys(S.ENDINGS)) {
  if (!found[e]) continue;
  console.log("\n## " + S.ENDINGS[e].title + " [" + e + "]");
  found[e].path.forEach((p, i) => console.log("  " + (i + 1) + ". " + p));
  console.log("  final meters: " + JSON.stringify(found[e].meters) + "  items: " + found[e].items.join(", "));
}
require("fs").writeFileSync(__dirname + "/ending-paths.json", JSON.stringify(found, null, 2));

/* ---- 8. canonical paths: hand-designed, simulated, asserted ---- */
const CANONICAL = {
  dawn: ["Put the kettle on first. The night will want something warm.",
    "“You came because it's the last night. Say it plainly.”",
    "Kopi tubruk — strong, black, no hiding in it.",
    "Show him Ibu's recipe card, kept behind the jars.",
    "“Tell me about her — the her from before I was born.”",
    "Cokelat panas — sweet, like the first day of school.",
    "Open the envelope — a photograph, kept for a year.",
    "“Stay a while. Goodbyes can wait for one more cup.”",
    "Teh jahe — something warm to carry with him.",
    "Open the drawer — the two bus tickets are still there.",
    "“Come in out of the rain first. The story can wait.”",
    "Teh jahe — warm, gentle, for someone who had been out in the rain.",
    "Accept the thermos, and set it on the shelf with the others.",
    "Take down the chipped cup, and hold it in the dawn light.",
    "Kopi tubruk — to face the morning clearly.",
    "Close the shutters gently, and carry the night with you."],
  open: ["Put the kettle on first. The night will want something warm.",
    "“You're soaked. Sit. The rain can wait outside.”",
    "Teh jahe — ginger tea, warm all the way down.",
    "Ask him about his life — really ask.",
    "“I'm glad you came. The night needed you in it.”",
    "Teh jahe — for her joints, and the long walk home.",
    "Ask what Ibu was like as her student.",
    "“Stay a while. Goodbyes can wait for one more cup.”",
    "Teh jahe — something warm to carry with him.",
    "Promise to visit him, and mean it this time.",
    "“Come in out of the rain first. The story can wait.”",
    "Teh jahe — warm, gentle, for someone who had been out in the rain.",
    "Ask her who she really is — and why tonight.",
    "Take down the chipped cup, and hold it in the dawn light.",
    "Cokelat panas — to remember, properly, before moving on.",
    "Close the shutters gently, and carry the night with you."],
  letter: ["Stand in the doorway and look at the street a moment.",
    "“You came because it's the last night. Say it plainly.”",
    "Kopi tubruk — strong, black, no hiding in it.",
    "Tell him the stall closes for good at dawn.",
    "“Tell me about her — the her from before I was born.”",
    "Kopi tubruk — the way she takes it when marking papers.",
    "Admit you never read the letters Ibu left behind.",
    "“Then say it wrong. Wrong is still honest.”",
    "Kopi tubruk — strong enough for a long journey.",
    "Tell him the truth about why you stayed all these years.",
    "“How do you know this place? Tell me everything.”",
    "Kopi tubruk — she believed in facing the night head-on.",
    "Ask her who she really is — and why tonight.",
    "Open the box, and read the first letter at last.",
    "Kopi tubruk — to face the morning clearly.",
    "Write the letter — the honest one, the one that has waited a year."],
  cup: ["Light the lamps one by one, slowly.",
    "Say nothing. Let the kettle fill the silence.",
    "Cokelat panas — the way Ibu made it when you were small.",
    "Show him Ibu's recipe card, kept behind the jars.",
    "Nod, and busy yourself with the cups.",
    "Cokelat panas — sweet, like the first day of school.",
    "Open the envelope — a photograph, kept for a year.",
    "Joke it away: “The universe also gave you that jacket.”",
    "Cokelat panas — the thunderstorm drink, for old times.",
    "Open the drawer — the two bus tickets are still there.",
    "Keep your distance. Strangers at 3 a.m. are rarely simple.",
    "Cokelat panas — the drink for storms, and for the frightened.",
    "Accept the thermos, and set it on the shelf with the others.",
    "Take down the chipped cup, and hold it in the dawn light.",
    "Cokelat panas — to remember, properly, before moving on.",
    "Close the shutters gently, and carry the night with you."],
  chair: ["Put the kettle on first. The night will want something warm.",
    "Say nothing. Let the kettle fill the silence.",
    "Teh jahe — ginger tea, warm all the way down.",
    "Ask him about his life — really ask.",
    "Nod, and busy yourself with the cups.",
    "Teh jahe — for her joints, and the long walk home.",
    "Ask what Ibu was like as her student.",
    "Joke it away: “The universe also gave you that jacket.”",
    "Teh jahe — something warm to carry with him.",
    "Promise to visit him, and mean it this time.",
    "Keep your distance. Strangers at 3 a.m. are rarely simple.",
    "Teh jahe — warm, gentle, for someone who had been out in the rain.",
    "Ask her who she really is — and why tonight.",
    "Sit in the quiet, and let the morning arrive on its own.",
    "Teh jahe — to carry warmth into whatever comes next.",
    "Leave the lamp on. Let the light decide what it is for."]
};
function simulate(labels) {
  let st = { meters: { memory: 0, warmth: 0, truth: 0 }, items: [], flags: {} };
  let nodeId = S.START_NODE, li = 0, steps = 0, log = [];
  while (steps < 200) {
    steps++;
    const r = resolveNode(nodeId, st);
    nodeId = r.nodeId;
    const node = r.node;
    if (!node) return { error: "missing node " + nodeId };
    if (node.ending) return { ending: node.ending, meters: st.meters, items: st.items, log };
    if (node.choices && node.choices.length) {
      const want = labels[li++];
      const c = node.choices.find(x => x.label === want && meets(x.requires, st));
      if (!c) return { error: "choice not found/visible at " + nodeId + ": " + JSON.stringify(want) };
      for (const m of ["memory", "warmth", "truth"]) if (c.effects && c.effects[m]) st.meters[m] += c.effects[m];
      if (c.gives && !st.items.includes(c.gives)) { st.items.push(c.gives); st.flags[c.gives] = true; }
      log.push(nodeId + " :: " + c.label);
      nodeId = c.next;
    } else if (node.next) {
      nodeId = node.next;
    } else {
      return { error: "dead end at " + nodeId };
    }
  }
  return { error: "step limit" };
}
const canonResults = {};
for (const e of Object.keys(CANONICAL)) {
  const res = simulate(CANONICAL[e]);
  canonResults[e] = res;
  if (res.error) fail("canonical path " + e + ": " + res.error);
  else if (res.ending !== e) fail("canonical path " + e + " led to " + res.ending + " (meters " + JSON.stringify(res.meters) + ")");
  else ok("canonical path verified: " + S.ENDINGS[e].title + " (" + res.log.length + " choices; meters " + JSON.stringify(res.meters) + "; items " + res.items.length + "/5)");
}
require("fs").writeFileSync(__dirname + "/canonical-paths.json", JSON.stringify(canonResults, null, 2));

/* ---- 9. every item collectible in some playthrough ---- */
const collectible = new Set();
for (const e of Object.keys(found)) found[e].items.forEach(i => collectible.add(i));
const missingItems = Object.keys(S.ITEMS).filter(i => !collectible.has(i));
if (missingItems.length) fail("items never collected on any found ending path: " + missingItems.join(","));
else ok("all 5 memory-shelf items collectible");

console.log(failures === 0 ? "\nALL CHECKS PASSED" : "\n" + failures + " CHECK(S) FAILED");
process.exit(failures === 0 ? 0 : 1);
