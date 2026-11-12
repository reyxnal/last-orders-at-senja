/* Last Orders at Senja — story graph.
 * Data-driven interactive narrative. Pure data + one pure function
 * (pickEnding). No DOM, no side effects: the same file is loaded by
 * the browser engine and by the Node test harness.
 * All characters, places and events are fictional and original.
 */
(function (root) {
"use strict";

var CHAPTERS = [
  { n: 0, title: "Prologue", time: "21:40", guest: "" },
  { n: 1, title: "The Brother", time: "22:00", guest: "Ardi" },
  { n: 2, title: "The Teacher", time: "23:30", guest: "Bu Ratna" },
  { n: 3, title: "The Friend", time: "01:00", guest: "Dimas" },
  { n: 4, title: "The Stranger", time: "03:00", guest: "Sinta" },
  { n: 5, title: "Dawn", time: "05:00", guest: "" }
];

var ITEMS = {
  recipe: { name: "Ibu's recipe card", art: "recipe",
    desc: "A softened index card in faded ink. The last line reads: one more spoon of sugar for the tired ones." },
  photo: { name: "The faded photograph", art: "photo",
    desc: "Senja laughing behind the stall on its very first day, a string of new bulbs glowing above her." },
  ticket: { name: "Two old bus tickets", art: "warung",
    desc: "Never used. Two seats, one trip two teenagers kept promising each other they would take." },
  thermos: { name: "The dented thermos", art: "warung",
    desc: "Old steel, one long dent. It came back after many years, still warm, as if it had never left." },
  cup: { name: "The chipped cup", art: "recipe",
    desc: "Ibu's favourite cup. The chip on its rim is shaped a little like a small moon." }
};

var ENDINGS = {
  dawn:  { title: "Dawn Shift",        art: "dawn",
    blurb: "The stall does not end. It changes hands, hours, and shape — and the light stays on." },
  open:  { title: "Open Again",        art: "hero",
    blurb: "The notice comes down. The kettle goes back on. Some doors close only so they can open." },
  letter:{ title: "The Unsent Letter", art: "recipe",
    blurb: "The stall closes, but the honest words finally travel. A different door opens." },
  cup:   { title: "The Last Cup",      art: "photo",
    blurb: "One last cup at dawn, brewed exactly right. What is loved is carried, not kept." },
  chair: { title: "The Empty Chair",   art: "warung",
    blurb: "A quiet closing, and an unfinished feeling. The chair is empty tonight. It may not always be." }
};

/* Effects use three quiet meters: memory, warmth, truth.
 * Drinks steer them consistently: kopi tubruk -> truth,
 * teh jahe (ginger tea) -> warmth, cokelat panas -> memory.
 * Honest dialogue -> truth, kind dialogue -> warmth,
 * guarded dialogue -> nothing (the night passes unheld). */

var NODES = {
/* ---------------- PROLOGUE ---------------- */
prologue1: {
  ch: 0, speaker: "", art: "hero", portrait: null,
  text: `Rain has been falling since dusk, the patient kind that turns the whole street into a mirror.\n\nThe stall glows at the corner of Jalan Kenanga like it has every night for twenty years: six bulbs, one kettle, a wooden counter worn smooth by a thousand elbows. Tonight the bulbs are lit for the last time.\n\nThe notice on the shutter gave you thirty days. Tonight is the thirtieth. Tomorrow, the builders come, and Warung Senja — named for your mother, who named everything she loved after the evening sky — will be gone.`,
  next: "prologue2"
},
prologue2: {
  ch: 0, speaker: "", art: "warung", portrait: null,
  text: `You wipe the counter the way she taught you: slow circles, edge to edge, as if the wood were listening.\n\nOn the shelf behind you sit the small survivors of twenty years: jars of coffee and ginger, a tin of cocoa, and the things no customer ever saw. The kettle ticks as it warms. Outside, the rain keeps its own time.\n\nOne more night. Five more hours until dawn. Whatever walks in out of the rain tonight, you will be here to meet it.`,
  choices: [
    { label: "Light the lamps one by one, slowly.", next: "prologue_lamps",
      effects: { memory: 1 },
      journal: { title: "The lamps", body: "Six bulbs. She always lit the middle one last, so the stall would seem to wake up smiling." } },
    { label: "Put the kettle on first. The night will want something warm.", next: "prologue_kettle",
      effects: { warmth: 1 },
      journal: { title: "The kettle", body: "A kettle on the boil is a promise: whoever comes, there will be something warm for them." } },
    { label: "Stand in the doorway and look at the street a moment.", next: "prologue_door",
      effects: { truth: 1 },
      journal: { title: "The street", body: "The street does not know tonight is the last night. It only knows the rain, and the light." } }
  ]
},
prologue_lamps: {
  ch: 0, speaker: "", art: "warung", portrait: null,
  text: `One. Two. Three. The bulbs warm up the colour of honey, and for a moment the stall looks the way it did when you were small enough to hide beneath the counter.\n\nYou light the middle one last. Some habits are just love that learned a routine.`,
  next: "c1_intro"
},
prologue_kettle: {
  ch: 0, speaker: "", art: "warung", portrait: null, sfx: "pour",
  text: `Water, flame, the low tick of the kettle finding its voice. Steam rises and fogs the jars, and the stall smells the way it always has: coffee, rain, and something faintly sweet.\n\nWhatever tonight brings, it will not arrive to a cold stall.`,
  next: "c1_intro"
},
prologue_door: {
  ch: 0, speaker: "", art: "hero", portrait: null,
  text: `The street is empty and shining. Somewhere down the block a shutter rattles; somewhere else, a motorbike sighs past and is gone.\n\nYou do not know if you are ready for this night. You know only that you are here, and the light is on, and that has always been enough to begin.`,
  next: "c1_intro"
},

/* ---------------- CHAPTER 1: ARDI ---------------- */
c1_intro: {
  ch: 1, speaker: "", art: "warung", portrait: null,
  text: `22:00. The rain sharpens, then softens, like the night clearing its throat.\n\nA figure stops at the edge of the light. Same walk. Same way of standing with his hands in his pockets, as if the doorway were a question he had not decided how to answer.\n\nThree years. Three years since your younger brother Ardi walked out of this stall mid-sentence and did not come back.`,
  next: "c1_arrive"
},
c1_arrive: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi",
  text: `“I heard,” he says. He does not say what he heard, or from whom. He looks at the counter, the kettle, the shelf — everywhere except your face. “I thought the rain would keep me away. It didn't.”\n\nHe sits on the stool nearest the door, the one he always claimed as a boy. The stool creaks the same way it always did.\n\n“I don't know why I came,” he says, and then, quieter: “Yes, I do.”`,
  choices: [
    { label: "“You came because it's the last night. Say it plainly.”", next: "c1_a_honest", effects: { truth: 2 } },
    { label: "“You're soaked. Sit. The rain can wait outside.”", next: "c1_a_kind", effects: { warmth: 2 } },
    { label: "Say nothing. Let the kettle fill the silence.", next: "c1_a_avoid", effects: {} }
  ]
},
c1_a_honest: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi",
  text: `He flinches, then laughs — one short sound, surprised out of him.\n\n“Still no patience for dancing around it,” he says. “Fine. Yes. I came because it's the last night, and I couldn't stand the thought of this place closing with us still... like this.”\n\nThe word hangs between you, unfinished. Like this. Three years of it.`,
  next: "c1_drink"
},
c1_a_kind: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi",
  text: `Something in his shoulders lets go, all at once, the way a held breath does.\n\n“Thanks,” he says. He takes off his wet jacket and folds it over his knees, careful, like a guest who is afraid of dripping on the floor. “It smells the same. I forgot how much I missed that.”\n\nHe almost smiles. It is a start.`,
  next: "c1_drink"
},
c1_a_avoid: {
  ch: 1, speaker: "", art: "warung", portrait: "ardi",
  text: `The kettle ticks. The rain ticks. Ardi studies his own hands on the counter as if they belonged to someone else.\n\n“Okay,” he says at last, softly. “Quiet, then. We were always good at quiet.”\n\nIt is not unkind. It is just the shape the two of you have learned to fit into, and it fits a little too well.`,
  next: "c1_drink"
},
c1_drink: {
  ch: 1, speaker: "", art: "warung", portrait: "ardi",
  text: `Your hands move before your thoughts do. This is the part you know: when words fail, brew something.\n\nThree jars. Three old answers. What do you make for a brother who came back on the last night?`,
  choices: [
    { label: "Kopi tubruk — strong, black, no hiding in it.", next: "c1_drink_tubruk", effects: { truth: 2 }, sfx: "pour" },
    { label: "Teh jahe — ginger tea, warm all the way down.", next: "c1_drink_teh", effects: { warmth: 2 }, sfx: "pour" },
    { label: "Cokelat panas — the way Ibu made it when you were small.", next: "c1_drink_cokelat", effects: { memory: 2 }, sfx: "pour" }
  ]
},
c1_drink_tubruk: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi", sfx: "clink",
  text: `He takes one sip and closes his eyes. “Strong,” he says. “You always did make it like a challenge.”\n\n“I make it like she did.”\n\n“Yeah.” He turns the cup slowly. “She never let anyone hide behind a sweet drink, either.”`,
  next: "c1_shelf"
},
c1_drink_teh: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi", sfx: "clink",
  text: `He wraps both hands around the cup and breathes in the steam, and some of the rain seems to leave him.\n\n“Ginger,” he says. “She made this the night I failed my exams. Said a warm drink won't fix anything, but it makes fixing things easier.”\n\n“She was right about that, too.”`,
  next: "c1_shelf"
},
c1_drink_cokelat: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi", sfx: "clink",
  text: `He stares at the cup for a long moment before he drinks. When he does, his face does something complicated and unguarded.\n\n“This is...” He stops. Starts again. “She made this when it thundered. She said chocolate was for storms, coffee was for mornings, and tea was for everything in between.”\n\nYou had forgotten the rule. He had not.`,
  next: "c1_shelf"
},
c1_shelf: {
  ch: 1, speaker: "", art: "warung", portrait: "ardi",
  text: `The drink sits between you, half gone. The rain has settled into a steady hush.\n\nBehind you, the shelf holds its small survivors. Ardi is looking at it now — at the jars, the tins, the corner where Ibu kept her things. You could reach for one of them. You could ask him something real. You could say the hardest thing of all.`,
  choices: [
    { label: "Show him Ibu's recipe card, kept behind the jars.", next: "c1_shelf_recipe", effects: { memory: 1 }, gives: "recipe", sfx: "chime" },
    { label: "Ask him about his life — really ask.", next: "c1_shelf_life", effects: { warmth: 1 } },
    { label: "Tell him the stall closes for good at dawn.", next: "c1_shelf_close", effects: { truth: 2 } }
  ]
},
c1_shelf_recipe: {
  ch: 1, speaker: "Ardi", art: "recipe", portrait: null,
  text: `The card is soft as cloth from twenty years of fingers. Ardi holds it like it might tear, reading the faded ink twice.\n\n“Her handwriting,” he says. “I forgot I missed her handwriting.” He traces the last line with one finger. “One more spoon of sugar for the tired ones. She wrote that for you, you know. You were always the tired one.”\n\n“I was eight.”\n\n“You were still the tired one.” For the first time tonight, he grins — the real one, the one from before.`,
  next: "c1_close"
},
c1_shelf_life: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi",
  text: `He talks, haltingly at first, then faster: the job across town, the small flat with the noisy pipes, the girl he almost married and the friend he almost lost. An ordinary life, told like an apology.\n\n“I kept meaning to come,” he says. “And then meaning to became its own kind of not coming.”\n\n“I know,” you say. And you do. You have a shelf full of things you kept meaning to do.`,
  next: "c1_close"
},
c1_shelf_close: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi",
  text: `“At dawn,” you say. “The notice runs out at dawn. I signed the papers a month ago. There was no way to keep it, and I stopped pretending there was.”\n\nHe is quiet for a long time. Then: “Thank you for telling me straight. Everyone else told me gently, and gently just made it worse.”\n\nHe looks around the stall the way you look at a room you are about to leave forever — slowly, as if memorising it on purpose.`,
  next: "c1_close"
},
c1_close: {
  ch: 1, speaker: "", art: "warung", portrait: null,
  branch: [
    { requires: { meter: "warmth", min: 3 }, next: "c1_close_warm" },
    { requires: { meter: "truth", min: 3 }, next: "c1_close_warm" },
    { next: "c1_close_cool" }
  ]
},
c1_close_warm: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi",
  text: `When he stands to leave, he does not go straight to the door. He stops at the counter and puts his hand flat on the wood, the way people touch a wall for luck.\n\n“Come by sometime,” he says. “The flat. The pipes are noisy, but the coffee's terrible, and I could use someone to complain to.”\n\nIt is not forgiveness. It is better than forgiveness: it is a Tuesday, offered plainly. “I'll come,” you say, and mean it.\n\nHe steps out into the rain, and the light from the stall follows him a few steps down the street, as if it did not want to let him go either.`,
  next: "c2_intro"
},
c1_close_cool: {
  ch: 1, speaker: "Ardi", art: "warung", portrait: "ardi",
  text: `When he stands to leave, he hesitates at the door — one breath, two — as if there were something else, something he had rehearsed all the way here and then lost.\n\n“Take care,” he says at last. It is what strangers say. It lands like a door closing softly.\n\nHe steps out into the rain. The stall feels larger without him, and quieter, and the quiet has a shape you recognise: the shape of words that waited too long.`,
  next: "c2_intro"
}
,
/* ---------------- CHAPTER 2: BU RATNA ---------------- */
c2_intro: {
  ch: 2, speaker: "", art: "warung", portrait: null,
  text: `23:30. The rain has not stopped, but it has lowered its voice to a whisper.\n\nThe next visitor arrives the way weather arrives: without hurry, and entirely on her own terms. A small umbrella, folded with great precision. Shoes wiped twice on the mat. A scarf the colour of deep water.\n\nBu Ratna taught at the school at the end of the street for forty years. She taught your mother. Then she taught you. Then she retired, and kept teaching anyway, to anyone who would sit still.`,
  next: "c2_arrive"
},
c2_arrive: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `“I told myself I would not come on the last night,” she says, settling onto her stool — the middle one, always the middle one — with the care of someone who has earned every ache. “And then I told myself not to be ridiculous.”\n\nShe looks around the stall slowly, the way she used to look around a classroom before the first lesson of the year.\n\n“Your mother opened this place the year I started teaching. She said a street without somewhere warm to sit is just a road. I have thought about that sentence for twenty years, and I still think she was right.”`,
  choices: [
    { label: "“Tell me about her — the her from before I was born.”", next: "c2_a_honest", effects: { truth: 2 } },
    { label: "“I'm glad you came. The night needed you in it.”", next: "c2_a_kind", effects: { warmth: 2 } },
    { label: "Nod, and busy yourself with the cups.", next: "c2_a_avoid", effects: {} }
  ]
},
c2_a_honest: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `“Before you were born, your mother was the loudest girl in my class,” Bu Ratna says, and her whole face brightens. “She argued with the textbooks. She once debated a whole lesson about the monsoon into a lesson about soup.”\n\nShe laughs quietly. “She wanted to be a singer, did you know? Then her father fell ill, and she took over his cart, and she never sang on a stage. But she sang in this stall every morning, while she set up. You probably thought that was just how mornings sounded.”\n\nYou did. You had never once wondered where the singing went.`,
  next: "c2_drink"
},
c2_a_kind: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `“Needed me?” She waves a hand, but she is pleased, and does not hide it well. “I am an old woman with an umbrella. But thank you. It is a good thing to be needed on a rainy night.”\n\nShe unwraps her scarf with slow fingers. “Your mother used to say the same thing to me, you know, whenever I apologised for staying too long. She said: a guest is just a story that hasn't finished yet. So. I stayed. For twenty years, I stayed.”`,
  next: "c2_drink"
},
c2_a_avoid: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `Bu Ratna watches you polish a cup that is already clean. She taught children for forty years; she knows the sound of someone avoiding a subject the way a sailor knows wind.\n\n“Well,” she says mildly. “The cups will be very clean tonight, at least.”\n\nIt is not a scolding. It is worse than a scolding: it is patience, offered freely, while you decide whether to use it.`,
  next: "c2_drink"
},
c2_drink: {
  ch: 2, speaker: "", art: "warung", portrait: "ratna",
  text: `“What will you have?” you ask, though you already know the answer. Forty years of regulars teach you that the question matters more than the answer.\n\nBu Ratna folds her hands. “Surprise me,” she says. “It is the last night. A teacher should be willing to learn one new thing.”\n\nThree jars. What do you brew for her?`,
  choices: [
    { label: "Kopi tubruk — the way she takes it when marking papers.", next: "c2_drink_tubruk", effects: { truth: 2 }, sfx: "pour" },
    { label: "Teh jahe — for her joints, and the long walk home.", next: "c2_drink_teh", effects: { warmth: 2 }, sfx: "pour" },
    { label: "Cokelat panas — sweet, like the first day of school.", next: "c2_drink_cokelat", effects: { memory: 2 }, sfx: "pour" }
  ]
},
c2_drink_tubruk: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna", sfx: "clink",
  text: `She takes a sip, nods once, and sets the cup down with the precision of a grade being given.\n\n“Correct,” she says. “Strong enough to argue with. Your mother made it exactly this strong the night she told me she was going to name the stall after herself. I told her it was vain. She said: no, it is a promise. If my name is on it, I can never do it badly.”`,
  next: "c2_shelf"
},
c2_drink_teh: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna", sfx: "clink",
  text: `“Ah,” she says, holding the cup close. “Ginger. You remembered my knees.”\n\n“I remembered you always stayed until the rain stopped.”\n\n“Those are the same memory,” she says, and sips, and sighs the particular sigh of someone who has decided, for one evening, not to be in a hurry about anything at all.`,
  next: "c2_shelf"
},
c2_drink_cokelat: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna", sfx: "clink",
  text: `She laughs — a real laugh, surprised out of her like a student caught passing notes.\n\n“Chocolate! I haven't had chocolate at this counter since... oh. Since your mother's first week, when she was still deciding what the stall was for. She gave it to every child who came in, free, and my whole class smelled of cocoa for a month.”\n\nShe drinks, remembering. “She decided the stall was for that, you know. For the smell of cocoa in a classroom.”`,
  next: "c2_shelf"
},
c2_shelf: {
  ch: 2, speaker: "", art: "warung", portrait: "ratna",
  text: `The rain drums softly on the awning. Bu Ratna reaches into her bag and takes out a small envelope, worn at the corners, and sets it on the counter between you like a question.\n\n“I brought something,” she says. “But first — there is something I have wanted to ask you for a year, and tonight is the last night I can ask it here. What do you want to know? Or what do you want to say, before the morning takes this place?”`,
  choices: [
    { label: "Open the envelope — a photograph, kept for a year.", next: "c2_shelf_photo", effects: { memory: 1 }, gives: "photo", sfx: "chime" },
    { label: "Ask what Ibu was like as her student.", next: "c2_shelf_student", effects: { warmth: 1 } },
    { label: "Admit you never read the letters Ibu left behind.", next: "c2_shelf_letters", effects: { truth: 2 } }
  ]
},
c2_shelf_photo: {
  ch: 2, speaker: "Bu Ratna", art: "photo", portrait: null,
  text: `The photograph is soft with age. In it, a young woman laughs behind a brand-new counter, a string of new bulbs glowing above her, her hands flour-dusted and her whole face lit like a lamp.\n\n“First day,” Bu Ratna says. “I took it with my old camera. She laughed because the bulbs kept blowing out, and she said the stall was winking at her.”\n\nYou have no photograph of your mother laughing. You have one now. You hold it a moment longer than you meant to, and Bu Ratna pretends not to notice, the way good teachers do.`,
  next: "c2_close"
},
c2_shelf_student: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `“Terrible at arithmetic,” Bu Ratna says fondly. “Brilliant at everything that mattered. She could make a whole classroom feel like one family by the end of a lesson, and she did it with nothing but questions and attention.”\n\nShe taps the counter. “She ran this stall the same way she sat in my classroom: as if every person who walked in were the most interesting person she would meet that day. You do that too, you know. You just don't know you're doing it.”`,
  next: "c2_close"
},
c2_shelf_letters: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `The words come out before you can stop them: the box under the counter. Her letters. A year unopened, because opening them would mean the year of keeping the stall was really over.\n\nBu Ratna is quiet for a moment. Then she says, gently: “Your mother wrote letters the way other people pray. Not to be answered. To be honest. When you read them, read them slowly. And remember — a letter you are afraid to open is still a letter that loves you.”\n\nShe pats your hand once, the way she used to pat a student's shoulder before a difficult exam.`,
  next: "c2_close"
},
c2_close: {
  ch: 2, speaker: "", art: "warung", portrait: null,
  branch: [
    { requires: { meter: "warmth", min: 4 }, next: "c2_close_warm" },
    { requires: { meter: "memory", min: 4 }, next: "c2_close_warm" },
    { next: "c2_close_cool" }
  ]
},
c2_close_warm: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `When she leaves, she does it properly: scarf wrapped, umbrella opened with a practised snap, shoes wiped twice.\n\nAt the doorway she turns. “I will miss this light,” she says. “But lights move, you know. Your mother moved hers from a cart to this corner. You will move yours somewhere, too. That is not an ending. That is a lesson.”\n\nShe steps into the rain, and the street takes her the way the rain takes everything: gently, and without asking permission.`,
  next: "c3_intro"
},
c2_close_cool: {
  ch: 2, speaker: "Bu Ratna", art: "warung", portrait: "ratna",
  text: `When she leaves, she pauses at the doorway a moment longer than necessary, as if waiting for something — a word, a question, a reason to stay one cup more.\n\n“Goodnight, then,” she says at last, kindly. “Thank you for the drink. And for the light.”\n\nShe steps into the rain. The middle stool sits empty, and the stall feels like a classroom after the last lesson of the day: full of everything that was said, and everything that was not.`,
  next: "c3_intro"
},

/* ---------------- CHAPTER 3: DIMAS ---------------- */
c3_intro: {
  ch: 3, speaker: "", art: "warung", portrait: null,
  text: `01:00. The deep hour. The rain has thinned to a silver drizzle, and the street is empty enough to hear your own footsteps think.\n\nThe next arrival does not stop at the edge of the light. He walks straight in, shaking rain off a yellow jacket, grinning like the night is a joke he is in on.\n\nDimas. Your best friend since the year you both lost your first teeth. Tomorrow morning he boards a boat, and then a plane, and then a life across the sea — a job he has wanted for five years, in a city whose name you still cannot pronounce.`,
  next: "c3_arrive"
},
c3_arrive: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `“Last night of the stall, last night in town, and it's raining,” he says, dropping his bag with a thud. “The universe has no subtlety at all.”\n\nHe takes his usual stool — the far one, by the shelf — and spins once on it, the way he has since you were both twelve.\n\n“I came to say goodbye properly,” he says, and the grin slips, just a little. “Turns out properly is harder than I thought. I've been rehearsing it for a week and it still comes out wrong.”`,
  choices: [
    { label: "“Then say it wrong. Wrong is still honest.”", next: "c3_a_honest", effects: { truth: 2 } },
    { label: "“Stay a while. Goodbyes can wait for one more cup.”", next: "c3_a_kind", effects: { warmth: 2 } },
    { label: "Joke it away: “The universe also gave you that jacket.”", next: "c3_a_avoid", effects: {} }
  ]
},
c3_a_honest: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `He laughs, and the laugh cracks a little at the edge.\n\n“Okay. Wrong, then. I'm terrified. I'm excited and I'm terrified and I keep thinking about the fact that I won't be able to just... walk here. On a bad day. And sit on this stupid stool and have you make me something and not ask what's wrong until I'm ready.”\n\nHe looks down at his hands. “That's the whole speech. It took me a week.”\n\n“It was a good speech,” you say.`,
  next: "c3_drink"
},
c3_a_kind: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `“One more cup,” he agrees, with visible relief. “See? This is why you're the wise one. I rehearse goodbyes for a week, and you just... make room for them.”\n\nHe settles in, elbows on the counter, chin in his hands, and for a moment he looks twelve again — the boy who once hid under this counter during a thunderstorm and refused to come out until your mother promised him cocoa.\n\n“Don't rush tonight,” he says. “Please. Just don't rush it.”`,
  next: "c3_drink"
},
c3_a_avoid: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `“Hey,” he says, clutching the jacket. “This jacket has seen things. This jacket is a survivor.”\n\nYou both laugh, a little too hard, the way people laugh when the real subject is standing right behind them, waiting politely to be noticed.\n\nThe laugh fades. The real subject is still there. Dimas spins slowly on his stool, and does not look at you, and you do not look at him, and the rain does the talking for both of you.`,
  next: "c3_drink"
},
c3_drink: {
  ch: 3, speaker: "", art: "warung", portrait: "dimas",
  text: `“The usual?” you ask.\n\n“The usual,” he says. Then, because it is the last night and the rules are different tonight: “No. Make me the one I need, not the one I always order. You always knew the difference better than I did.”\n\nThree jars. For a friend leaving at dawn — what do you brew?`,
  choices: [
    { label: "Kopi tubruk — strong enough for a long journey.", next: "c3_drink_tubruk", effects: { truth: 2 }, sfx: "pour" },
    { label: "Teh jahe — something warm to carry with him.", next: "c3_drink_teh", effects: { warmth: 2 }, sfx: "pour" },
    { label: "Cokelat panas — the thunderstorm drink, for old times.", next: "c3_drink_cokelat", effects: { memory: 2 }, sfx: "pour" }
  ]
},
c3_drink_tubruk: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas", sfx: "clink",
  text: `He drinks, winces, grins. “That's the one. That's the 'you're going to be fine, stop moping' coffee.”\n\n“It is not called that.”\n\n“It is now. I'm naming it. From across the sea, I will think of it every time I drink something weak and disappointing, which will be constantly.”`,
  next: "c3_shelf"
},
c3_drink_teh: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas", sfx: "clink",
  text: `He holds the cup the way you hold something you want to remember the warmth of.\n\n“Ginger,” he says. “Smart. I'll be thinking about this cup on the boat tomorrow, and the boat will feel shorter. That's how it works, right? Warm things shrink distances.”\n\n“That's exactly how it works,” you say. “It's basic physics. Ibu taught me.”`,
  next: "c3_shelf"
},
c3_drink_cokelat: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas", sfx: "clink",
  text: `He goes very still. Then he laughs, and this time the laugh does not crack at all.\n\n“The thunderstorm drink. I was twelve. I hid under your counter for an hour, and your mother didn't drag me out — she just slid a cup under there and said, 'Storms pass. Chocolate helps.'”\n\nHe drinks slowly, like it is a ceremony. “She was right. Storms pass. I'm just... in the middle of one, I think.”`,
  next: "c3_shelf"
},
c3_shelf: {
  ch: 3, speaker: "", art: "warung", portrait: "dimas",
  text: `His cup is empty. The drizzle has stopped entirely now, and the street outside holds its breath between rains.\n\nDimas looks at the drawer under the counter — the junk drawer, the one that has held twenty years of string, stamps, spare keys, and things nobody threw away. “Do you remember,” he says, “the summer we were going to take the bus to the coast? We saved for months. We had a plan and everything.”\n\nYou remember. The question is what you do with remembering.`,
  choices: [
    { label: "Open the drawer — the two bus tickets are still there.", next: "c3_shelf_tickets", effects: { memory: 1 }, gives: "ticket", sfx: "chime" },
    { label: "Promise to visit him, and mean it this time.", next: "c3_shelf_promise", effects: { warmth: 2 } },
    { label: "Tell him the truth about why you stayed all these years.", next: "c3_shelf_truth", effects: { truth: 2 } }
  ]
},
c3_shelf_tickets: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `Two tickets, faded to the colour of old tea. Two seats. A coastal town whose name you both pronounced wrong for a whole summer.\n\nDimas holds them like they are made of glass. “We never went,” he says. “We spent the money on... what did we spend it on?”\n\n“A broken radio, a kite, and noodles for a month.”\n\n“Best summer of my life,” he says, and means it. “Keep them. Or — no. Keep one. I'll keep one. Then the trip is still... pending. Not cancelled. Pending.”`,
  next: "c3_close"
},
c3_shelf_promise: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `“I will visit,” you say. “Not 'sometime.' I will come, and I will complain about your coffee, and you will show me the city, and we will get lost, and it will be terrible and wonderful.”\n\nHe studies your face for a moment, checking for the polite version of the promise. Finding the real one, he nods once.\n\n“Okay,” he says. “Okay. I'm holding you to that. I'm writing it down. I'm telling the rain, so there's a witness.”`,
  next: "c3_close"
},
c3_shelf_truth: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `“I stayed because leaving felt like leaving her,” you say, and the sentence costs more than you expected. “Not the stall. Her. As if keeping the lights on kept something of her on, too. And now the lights go out, and I have to find out what stays when the stall is gone.”\n\nDimas is quiet for a long moment. Then: “You know what stays? The person who wipes the counter in slow circles. The person who knows which drink a person needs. That was never the stall. That was always you.”\n\nYou look away, because the rain has started again, and because it has not.`,
  next: "c3_close"
},
c3_close: {
  ch: 3, speaker: "", art: "warung", portrait: null,
  branch: [
    { requires: { meter: "warmth", min: 5 }, next: "c3_close_warm" },
    { requires: { meter: "truth", min: 5 }, next: "c3_close_warm" },
    { next: "c3_close_cool" }
  ]
},
c3_close_warm: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `At the door, he turns back — of course he turns back; Dimas has never once left a room cleanly in his life.\n\n“Hey,” he says. “When you figure out what comes next — the stall, the light, all of it — you tell me first. Before the rain. Before anybody.”\n\n“First,” you promise.\n\nHe grins, hoists his bag, and walks into the drizzle whistling, off-key, the way he has since childhood. You listen until the whistling is gone, and then a little longer, because some sounds are worth following to the end.`,
  next: "c4_intro"
},
c3_close_cool: {
  ch: 3, speaker: "Dimas", art: "warung", portrait: "dimas",
  text: `At the door, he hesitates — one of those pauses that could become a real goodbye, if either of you reached for it.\n\n“Well,” he says. “Safe travels to me, I guess. And to you... whatever comes next.”\n\nHe waves, once, and walks into the drizzle. The wave is too cheerful and too small at the same time. You watch until the yellow jacket is gone, and the street is only rain again, and the goodbye stays exactly where it was: unheld, and waiting.`,
  next: "c4_intro"
}
,
/* ---------------- CHAPTER 4: SINTA ---------------- */
c4_intro: {
  ch: 4, speaker: "", art: "warung", portrait: null,
  text: `03:00. The quietest hour. The rain has returned, softer now, falling the way snow must fall in places that have snow: without asking anything of anyone.\n\nThe stall is empty. The kettle is low. You are thinking about closing early — just this once, just an hour early — when you hear footsteps that stop, and then start again, and then stop at the edge of the light.\n\nA woman stands in the rain, holding something against her chest with both hands, as if it were warm and she were afraid of dropping the warmth.`,
  next: "c4_arrive"
},
c4_arrive: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `She does not sit down right away. She stands in the doorway and looks at the stall the way you look at a place from a dream — checking whether the details match.\n\n“The bulbs,” she says softly. “Six bulbs. And the counter is... yes. It's the same.”\n\nShe sets a dented steel thermos on the counter, gently, the way you set down something that has travelled a long way. “My name is Sinta. I think this belongs here. I have been carrying it for a very long time.”`,
  choices: [
    { label: "“How do you know this place? Tell me everything.”", next: "c4_a_honest", effects: { truth: 2 } },
    { label: "“Come in out of the rain first. The story can wait.”", next: "c4_a_kind", effects: { warmth: 2 } },
    { label: "Keep your distance. Strangers at 3 a.m. are rarely simple.", next: "c4_a_avoid", effects: {} }
  ]
},
c4_a_honest: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `She nods, as if she expected the question and respects it.\n\n“Many years ago, on a night like this one, a woman at this stall gave a stranded girl hot tea and lent her a thermos for the walk home,” she says. “The girl was me. I was seventeen, and lost, and the rain had taken my bus, my phone, and most of my courage. Your mother — Senja — told me: bring it back when the rain brings you this way again.”\n\nShe touches the dent in the steel. “It took me years to be brought this way again. I came tonight because I heard the stall was closing. I could not let it close with the thermos still out in the world.”`,
  next: "c4_drink"
},
c4_a_kind: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `She comes in, slowly, and sits on the stool nearest the stove, and holds her hands out to the warmth like someone greeting an old friend.\n\n“Thank you,” she says. “She said that too, you know. Your mother. Come in out of the rain first. The story can wait. I have remembered that sentence for years — the idea that a story could wait, but a person could not.”\n\nShe sets the thermos on the counter. “I brought something back. But first, yes. First, out of the rain.”`,
  next: "c4_drink"
},
c4_a_avoid: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `She does not push. She simply stands, rain dripping from her coat, and waits — with the patience of someone who has already waited years, and can wait one more minute.\n\n“I know,” she says quietly. “Strangers at three in the morning. My mother would have said the same thing. But I only came to return something. And then I will go, and the night will be yours again.”\n\nShe sets the thermos down between you, and steps back, giving you room to decide what it is.`,
  next: "c4_drink"
},
c4_drink: {
  ch: 4, speaker: "", art: "warung", portrait: "sinta",
  text: `The thermos sits on the counter, dented and plain and somehow the most interesting thing in the stall.\n\n“What did she make you, that night?” you ask.\n\nSinta smiles — the smile of someone who has kept a small, exact memory polished for years. “You tell me,” she says. “Brew what you think it was. If you know this stall, you'll know.”\n\nThree jars. What did Ibu brew for a lost girl on a rainy night?`,
  choices: [
    { label: "Kopi tubruk — she believed in facing the night head-on.", next: "c4_drink_tubruk", effects: { truth: 2 }, sfx: "pour" },
    { label: "Teh jahe — warm, gentle, for someone who had been out in the rain.", next: "c4_drink_teh", effects: { warmth: 2 }, sfx: "pour" },
    { label: "Cokelat panas — the drink for storms, and for the frightened.", next: "c4_drink_cokelat", effects: { memory: 2 }, sfx: "pour" }
  ]
},
c4_drink_tubruk: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta", sfx: "clink",
  text: `She drinks, and laughs once, softly. “No — but close. She made me coffee the second time I came. The first time, she said I was too tired for coffee, and coffee would only make me tired faster.”\n\nShe turns the cup in her hands. “You brew it exactly the way she did, though. The same strength. The same... honesty. I can taste that.”`,
  next: "c4_shelf"
},
c4_drink_teh: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta", sfx: "clink",
  text: `She closes her eyes as she drinks, and when she opens them, they are shining.\n\n“Yes,” she whispers. “Ginger tea. With too much ginger, because she said a tired person needs to be woken up kindly. I have tried to make it this way a hundred times. It never tastes like this. It tastes like... my kitchen. Not like a rainy night with somewhere warm to sit.”`,
  next: "c4_shelf"
},
c4_drink_cokelat: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta", sfx: "clink",
  text: `“Oh,” she says, and then she is quiet for a long moment, holding the cup with both hands.\n\n“She made me chocolate,” she says at last. “I had forgotten. I remembered the thermos, and the rain, and her voice — but I had forgotten it was chocolate. Storms pass. Chocolate helps. She said that, didn't she?”\n\n“She said that,” you say. The night seems to lean in a little closer, listening.`,
  next: "c4_shelf"
},
c4_shelf: {
  ch: 4, speaker: "", art: "warung", portrait: "sinta",
  text: `The thermos is still warm. That is the strange part, and you notice it the way you notice something you have been avoiding noticing: through the steel, through the years, it is still warm, as if the tea inside never cooled, as if kindness, once poured, keeps its own temperature.\n\nSinta watches you notice. She does not explain it. Some things in this stall have never needed explaining.\n\n“It's yours now,” she says. “Or the stall's. I only carried it. What do you want to do with a thing that came home?”`,
  choices: [
    { label: "Accept the thermos, and set it on the shelf with the others.", next: "c4_shelf_thermos", effects: { memory: 1 }, gives: "thermos", sfx: "chime" },
    { label: "Ask her who she really is — and why tonight.", next: "c4_shelf_who", effects: { truth: 2 } },
    { label: "Offer her Ibu's recipe card, so the recipe travels onward.", next: "c4_shelf_recipe", effects: { warmth: 2 }, requires: { flag: "recipe" } }
  ]
},
c4_shelf_thermos: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `You set the thermos on the shelf, between the jars, where the light catches the dent in its side.\n\nIt looks as if it had always been there. Perhaps it had. Perhaps some objects are only ever on loan to the world, and spend their whole lives finding their way back to the shelf they belong on.\n\nSinta exhales — a long breath, years long. “Thank you,” she says. “Carrying it was an honour. Setting it down is a relief.”`,
  next: "c4_close"
},
c4_shelf_who: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `“I am nobody special,” she says, and smiles. “I am a person who was once lost, and was once helped, and decided to spend her life being the kind of person who helps. I teach now. Children who are lost in smaller, quieter ways.”\n\nShe looks at the thermos, then at you. “Why tonight? Because endings are when things come home. Lost umbrellas. Old friends. Thermoses. The rain knows the schedule better than we do.”\n\nIt is not an answer that explains the warmth in the steel. It is an answer that makes the warmth feel less strange.`,
  next: "c4_close"
},
c4_shelf_recipe: {
  ch: 4, speaker: "Sinta", art: "recipe", portrait: null,
  text: `You take down the recipe card — the softened card, the faded ink, the line about one more spoon of sugar for the tired ones — and slide it across the counter.\n\n“Take it,” you say. “Or copy it. The recipe was never meant to sit behind jars. She wrote it to be used.”\n\nSinta reads it twice, the way Ardi did, and her hands tremble a little. “I will copy it,” she says. “And I will make it for my students, on rainy days. And I will tell them where it came from. That way it isn't a card. It's a... a relay.”\n\nYou keep the card. She keeps the copy. The recipe, it turns out, does not mind being in two places at once.`,
  next: "c4_close"
},
c4_close: {
  ch: 4, speaker: "", art: "warung", portrait: null,
  branch: [
    { requires: { flag: "thermos" }, next: "c4_close_thermos" },
    { next: "c4_close_other" }
  ]
},
c4_close_thermos: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `At the door, Sinta turns back once, the way everyone does tonight, as if the stall were a sentence nobody wants to finish.\n\n“Your mother lent a stranger a thermos on a rainy night,” she says. “She never asked for it back. She just trusted the rain to bring it home. I used to think that was careless. Now I think it was the bravest thing I ever saw.”\n\nShe steps out into the rain, empty-handed and lighter for it. Behind you, on the shelf, the thermos ticks softly as it cools — or warms — in the lamplight. You decide not to check which. Some mysteries are better kept warm.`,
  next: "c5_intro"
},
c4_close_other: {
  ch: 4, speaker: "Sinta", art: "warung", portrait: "sinta",
  text: `At the door, Sinta turns back once. The thermos is still on the counter between you, where she left it — neither accepted nor refused, simply there, the way some gifts wait for their moment.\n\n“I left it,” she says. “Whether you keep it or not is your choice. It waited years. It can wait one more night.”\n\nShe steps out into the rain. The thermos sits in the lamplight, dented and patient, and the stall is quiet, and the quiet feels less like an ending than a question you have not answered yet.`,
  next: "c5_intro"
},

/* ---------------- CHAPTER 5: DAWN ---------------- */
c5_intro: {
  ch: 5, speaker: "", art: "dawn", portrait: null,
  text: `05:00. The rain stops the way a song stops: not all at once, but note by note, until you notice the silence and realise it has been arriving for a while.\n\nThe sky over Jalan Kenanga pales from ink to pearl. Somewhere, a bird tries a single note, then another. The bulbs over the stall look suddenly small against the coming light — six small suns, about to be outshone by the real one.\n\nYou are alone now. Four visitors, four cups, four conversations. The night did what nights do: it brought you everyone you needed, and now it is leaving you with yourself.`,
  next: "c5_shelf"
},
c5_shelf: {
  ch: 5, speaker: "", art: "warung", portrait: null,
  text: `The shelf, in the dawn light, looks different. The jars are half empty. The tins are dusty. And on the highest shelf, where you put it a year ago and never touched again, sits the chipped cup — hers, the one with the chip shaped like a small moon.\n\nBelow the counter, the box of letters waits, still unopened. The morning is here. The decision is here. What do you reach for, in the last hour?`,
  choices: [
    { label: "Take down the chipped cup, and hold it in the dawn light.", next: "c5_shelf_cup", effects: { memory: 1 }, gives: "cup", sfx: "chime" },
    { label: "Open the box, and read the first letter at last.", next: "c5_shelf_letter", effects: { truth: 2 } },
    { label: "Sit in the quiet, and let the morning arrive on its own.", next: "c5_shelf_quiet", effects: { warmth: 1 } }
  ]
},
c5_shelf_cup: {
  ch: 5, speaker: "", art: "recipe", portrait: null,
  text: `The cup is lighter than you remembered. The chip on the rim catches the dawn light and holds it, a small moon in a small sky.\n\nShe drank from this cup every morning, standing exactly where you are standing, looking at exactly this street. She never said it was her favourite. She never had to. Some things announce themselves by being reached for, every day, without thinking.\n\nYou set it on the counter, ready. Whatever you brew next, it will be brewed in this cup.`,
  next: "c5_brew"
},
c5_shelf_letter: {
  ch: 5, speaker: "", art: "recipe", portrait: null,
  text: `The first letter is short. Her handwriting, which you have not let yourself look at for a year, is steady and plain.\n\n“To whoever is keeping the light on,” it begins. “If you are reading this, the stall has done its work. A stall is not a place. A stall is a promise: that on a rainy night, there will be somewhere warm to sit. Promises can move. They can change shape. They do not have to stay in one corner to stay true.”\n\nThe letter ends the way all her letters ended: “One more spoon of sugar for the tired ones. Love, Senja.”\n\nYou fold it carefully, and put it in your pocket, and the morning feels a fraction less heavy.`,
  next: "c5_brew"
},
c5_shelf_quiet: {
  ch: 5, speaker: "", art: "dawn", portrait: null,
  text: `You sit on the middle stool — Bu Ratna's stool — and do nothing at all.\n\nThe light comes up slowly, the colour of weak tea, then honey, then gold. The wet street steams. A cat picks its way along the opposite kerb with great dignity. The city wakes the way it always has: one shutter, one voice, one bicycle bell at a time.\n\nFor one whole minute, you do not decide anything. You just sit in the place your mother built, and let it be morning. It is enough. It has to be enough. And strangely, quietly, it is.`,
  next: "c5_brew"
},
c5_brew: {
  ch: 5, speaker: "", art: "warung", portrait: null,
  text: `The kettle, faithful to the end, has one more boil in it.\n\nAll night you have brewed for others: a brother, a teacher, a friend, a stranger. Now, in the last hour, you brew one cup for yourself. The last cup of Warung Senja — or the first cup of whatever comes next.\n\nThree jars. One last choice of the night. What do you brew?`,
  choices: [
    { label: "Kopi tubruk — to face the morning clearly.", next: "c5_brew_tubruk", effects: { truth: 2 }, sfx: "pour" },
    { label: "Teh jahe — to carry warmth into whatever comes next.", next: "c5_brew_teh", effects: { warmth: 2 }, sfx: "pour" },
    { label: "Cokelat panas — to remember, properly, before moving on.", next: "c5_brew_cokelat", effects: { memory: 2 }, sfx: "pour" }
  ]
},
c5_brew_tubruk: {
  ch: 5, speaker: "", art: "warung", portrait: null, sfx: "clink",
  text: `Strong. Black. Honest. You drink it standing at the counter, the way she did, and the morning sharpens around you: the light, the street, the decision waiting at the end of the cup.\n\nYou know what you have to do. You have known all night, really. The coffee only makes it easier to say.`,
  next: "c5_decision"
},
c5_brew_teh: {
  ch: 5, speaker: "", art: "warung", portrait: null, sfx: "clink",
  text: `Warm all the way down. You drink it slowly, and think of every person who sat on these stools tonight, and every person who sat on them across twenty years, and the warmth is not just the ginger. It is the whole night, settling into you like heat into a cup.\n\nWhatever comes next, it will be warm. You will make sure of that.`,
  next: "c5_decision"
},
c5_brew_cokelat: {
  ch: 5, speaker: "", art: "warung", portrait: null, sfx: "clink",
  text: `Sweet, thick, the taste of thunderstorms and childhood and a woman singing while she set up the stall in the morning.\n\nYou drink it in the chipped cup, and for a moment the stall is full again — not with ghosts, nothing so grand. With memory, which is quieter and kinder: the sense that everyone you loved is still, in some small way, sitting with you at the counter.`,
  next: "c5_decision"
},
c5_decision: {
  ch: 5, speaker: "", art: "dawn", portrait: null,
  text: `The cup is empty. The sun is up. The notice on the shutter flutters in the morning breeze, patient as ever.\n\nIt is time. Not to decide everything — nobody decides everything in one morning. Just to decide the next thing. The one small, true thing that this whole night has been leading you toward.\n\nWhat do you do, as the dawn comes up over Jalan Kenanga?`,
  choices: [
    { label: "Leave the lamp on. Let the light decide what it is for.", next: "ending_gate", effects: { warmth: 2 } },
    { label: "Write the letter — the honest one, the one that has waited a year.", next: "ending_gate", effects: { truth: 2 } },
    { label: "Close the shutters gently, and carry the night with you.", next: "ending_gate", effects: { memory: 2 } }
  ]
},
ending_gate: {
  ch: 5, speaker: "", art: "dawn", portrait: null, endingEval: true,
  text: ``
},

/* ---------------- ENDING 1: DAWN SHIFT ---------------- */
end_dawn_1: {
  ch: 5, speaker: "", art: "dawn", portrait: null, ending: "dawn", endingTitle: "Dawn Shift",
  text: `You do not take the notice down. You write a new one, underneath it, in your best handwriting: CLOSED AT NIGHT. OPEN AT DAWN.\n\nIt is not the same stall. It cannot be — the lease, the builders, the twenty years, all of it is real, and you are done pretending otherwise. But a promise can move. A promise can change shape.\n\nBy seven, you have called Ardi. By eight, you have walked the street and found a doorway two blocks down — a shuttered bakery with good light and a landlord who likes the smell of coffee. By nine, Bu Ratna has offered her old classroom chairs. By ten, Dimas has sent a postcard from the boat. By eleven, you have brewed the first pot in the new place, in the chipped cup, with the thermos on the shelf and the photograph on the wall and the recipe card where everyone can see it.`,
  next: "end_dawn_2"
},
end_dawn_2: {
  ch: 5, speaker: "", art: "dawn", portrait: null, ending: "dawn", endingTitle: "Dawn Shift",
  text: `EPILOGUE — ONE YEAR LATER\n\nThe new place opens before sunrise, for the nurses coming off shift, the fishermen, the students, the ones who cannot sleep. Ardi works the weekends, badly at first, then well. Sinta brings her students on rainy days. Dimas visits, and complains about the coffee, and drinks three cups.\n\nOn the wall hangs the photograph of a young woman laughing behind a brand-new counter. Beneath it, in a frame, the recipe card. On the shelf, the dented thermos, still warm, as if it had never left.\n\nSome nights it rains, and the light spills out onto the wet street, and a stranger stops at the edge of it, the way strangers do. And you say what your mother said, and what you will always say now: come in out of the rain. The story can wait.`,
  next: null
},

/* ---------------- ENDING 2: OPEN AGAIN ---------------- */
end_open_1: {
  ch: 5, speaker: "", art: "hero", portrait: null, ending: "open", endingTitle: "Open Again",
  text: `You take the notice down.\n\nNot because the problems are solved — they are not, and you know it. Because tonight taught you something you had forgotten: this corner is not yours to close alone. It belongs, a little, to everyone who ever sat here in the rain.\n\nSo you do the unglamorous, stubborn thing. You call the landlord. You call the neighbours. You call Ardi, and Bu Ratna, and the whole street, one by one, and you say: the stall stays, if the street wants it to stay. And the street — in the way streets do, slowly, then all at once — says yes.`,
  next: "end_open_2"
},
end_open_2: {
  ch: 5, speaker: "", art: "hero", portrait: null, ending: "open", endingTitle: "Open Again",
  text: `EPILOGUE — THE FIRST NIGHT BACK\n\nThe bulbs are the same six bulbs. The kettle is the same kettle. The counter still bears the ring-marks of twenty years of cups.\n\nBut the stall is full in a way it has not been full for a year: Ardi on the stool by the door, Bu Ratna in the middle, Dimas's empty stool kept for him with a cup on it, just in case, and Sinta's thermos on the shelf, where it belongs.\n\nYou brew until the jars run low, and then you brew some more, and when the last customer leaves, long past midnight, you wipe the counter in slow circles, edge to edge, the way she taught you. The notice is gone. The light is on. The night, as always, is just beginning.`,
  next: null
},

/* ---------------- ENDING 3: THE UNSENT LETTER ---------------- */
end_letter_1: {
  ch: 5, speaker: "", art: "recipe", portrait: null, ending: "letter", endingTitle: "The Unsent Letter",
  text: `You close the shutters. You mean it this time. The stall has done its work, and keeping it open out of guilt would be the one thing your mother never did: she never kept anything going out of guilt. She kept things going out of love, and love, you are learning, does not always look like staying.\n\nBut before the builders come, you sit at the counter with paper and a pen, and you write the letter.\n\nNot the polite one. The honest one. To Ardi: that you missed him, that you were angry, that you are sorry, that the stall was never the argument. To yourself, too, in a way — the letter your mother never wrote, because she was too busy living the answer: that grief is not a debt, and letting go is not the same as forgetting.`,
  next: "end_letter_2"
},
end_letter_2: {
  ch: 5, speaker: "", art: "recipe", portrait: null, ending: "letter", endingTitle: "The Unsent Letter",
  text: `EPILOGUE — THREE WEEKS LATER\n\nArdi writes back. His letter is longer than yours, and messier, and funnier, and it ends with an invitation: dinner, his flat, the noisy pipes, the terrible coffee. You go. The coffee is terrible. The evening is wonderful.\n\nThe corner where the stall stood is a building site now. You walk past it most mornings, and you do not look away. In your pocket is the letter your mother wrote, folded and soft. In your kitchen is the chipped cup, and the recipe card is on the fridge, where you can see it while you brew.\n\nThe stall is gone. The honesty stayed. And honesty, it turns out, is a warmer thing than you ever expected — warm enough to build a whole new kind of open door.`,
  next: null
},

/* ---------------- ENDING 4: THE LAST CUP ---------------- */
end_cup_1: {
  ch: 5, speaker: "", art: "photo", portrait: null, ending: "cup", endingTitle: "The Last Cup",
  text: `You brew one last cup, exactly the way she taught you. Not for a customer. Not for the night. For the stall itself — a thank-you, poured into the chipped cup, set on the counter in the dawn light.\n\nThen you do the quiet work of carrying. The recipe card goes into a folder. The photograph goes into a frame. The tickets, the thermos, the cup — each wrapped, each labelled, each kept. Not as a museum. As a promise: that none of it will be lost, even though the corner will change.\n\nYou close the shutters gently, the way you would close the eyes of someone sleeping. The stall does not protest. It has given you everything it had.`,
  next: "end_cup_2"
},
end_cup_2: {
  ch: 5, speaker: "", art: "photo", portrait: null, ending: "cup", endingTitle: "The Last Cup",
  text: `EPILOGUE — YEARS LATER\n\nYour kitchen is small, and the light in the morning is good. On the shelf: the thermos, the photograph, the tickets in their frame. In the cupboard: the chipped cup, used every day, because things that are loved should be used, not stored.\n\nA neighbour's child comes by on rainy afternoons, and you teach her the recipe — one more spoon of sugar for the tired ones — and you tell her about a stall on Jalan Kenanga where the bulbs were the colour of honey and the rain never kept anyone away for long.\n\nShe asks if you miss it. You think for a moment, honestly. “I carried it with me,” you say. “So no. Not the way you'd think. It's here. It's this cup. It's this afternoon. It's you, learning the recipe.” And the rain falls, and the kettle sings, and the last cup turns out, after all, not to have been the last.`,
  next: null
},

/* ---------------- ENDING 5: THE EMPTY CHAIR ---------------- */
end_chair_1: {
  ch: 5, speaker: "", art: "warung", portrait: null, ending: "chair", endingTitle: "The Empty Chair",
  text: `You close the shutters, and you are not sure you did the right thing. You are not sure you did the wrong thing, either. The night passes through you the way rain passes through a streetlight: lit up, briefly, and then gone.\n\nThe stools stand empty. The middle one, the far one, the one by the door. You wipe the counter in slow circles, edge to edge, and the wood does not answer, and the kettle ticks itself cool, and the dawn comes up over Jalan Kenanga whether you are ready for it or not.\n\nYou leave the lamp on for one more hour. You tell yourself it is for the builders. It is not for the builders. It is for the feeling you cannot name yet — the feeling that something tonight was left unfinished, and that unfinished things have a way of knocking again.`,
  next: "end_chair_2"
},
end_chair_2: {
  ch: 5, speaker: "", art: "warung", portrait: null, ending: "chair", endingTitle: "The Empty Chair",
  text: `EPILOGUE — SOME WEEKS LATER\n\nYou walk past the corner most mornings. The shutters are down. The bulbs are dark. The street has already learned to walk past without looking.\n\nBut some mornings you stop. You stand where the light used to spill onto the pavement, and you think about a brother, a teacher, a friend, a stranger with a thermos — and about all the things you did not say, and all the things you still could.\n\nThe chair is empty tonight. It may not always be. Nights come back around, the way rain does. And the next time one does — the next time the light is on and someone stops at the edge of it — perhaps you will be ready to say the thing, and brew the drink, and stay for one more cup. The story is not over. It is only waiting.`,
  next: null
}
};

/* Ending selection: evaluated once, at ending_gate, from the full
 * night's state. Priority order is deliberate: the balanced,
 * fully-remembered night earns Dawn Shift; the other endings
 * reward a clear leaning; the guarded, scattered night ends
 * with the Empty Chair. */
function pickEnding(state) {
  var m = state.meters;
  var items = state.items ? state.items.length : 0;
  if (m.memory >= 5 && m.warmth >= 5 && m.truth >= 5 && items >= 5) return "dawn";
  if (m.warmth >= 6 && m.memory >= 4) return "open";
  if (m.truth >= 6 && m.warmth <= 5) return "letter";
  if (m.memory >= 6) return "cup";
  return "chair";
}

var START_NODE = "prologue1";

root.SENJA_STORY = {
  CHAPTERS: CHAPTERS, ITEMS: ITEMS, ENDINGS: ENDINGS,
  NODES: NODES, pickEnding: pickEnding, START_NODE: START_NODE
};
if (typeof module !== "undefined" && module.exports) {
  module.exports = root.SENJA_STORY;
}
})(typeof window !== "undefined" ? window : globalThis);
