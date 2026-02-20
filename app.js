const questions = [
  "What's your biggest ick?",
  "A secret you'd never tweet?",
  "Who did you ghost?",
  "Your guilty pleasure?",
  "A lie you tell often?",
  "Something you pretend to understand?",
  "What's your most toxic trait?",
  "Who do you stalk at 2 AM?",
  "What's your worst text fail?",
  "Hot take that would cancel you?"
];

const emojis = ["🍵","🔥","👀","💀","🤡","🤫","😳","🙈","🤦","🍿"];

const SEED_TEAS = [
  { id: 1, text: "I pretend I’m over my ex but I still stalk their stories every night 😭", emoji: "👀", heart: 23, laugh: 5, fire: 12 },
  { id: 2, text: "Intentionally talking to someone as friends knowing they like me… yeah I’m toxic.", emoji: "💀", heart: 18, laugh: 9, fire: 14 },
  { id: 3, text: "I ghost people when I’m overwhelmed and then miss them later.", emoji: "👻", heart: 27, laugh: 4, fire: 11 },
  { id: 4, text: "I mute group chats and then wonder why nobody invites me anymore.", emoji: "🤡", heart: 32, laugh: 20, fire: 9 },
  { id: 5, text: "I read receipts then reply 3 hours later on purpose.", emoji: "😈", heart: 14, laugh: 19, fire: 8 },
  { id: 6, text: "I flirt when I’m bored.", emoji: "😳", heart: 22, laugh: 7, fire: 13 },
  { id: 7, text: "I screenshot convos for my friends like it’s a Netflix series.", emoji: "📸", heart: 17, laugh: 33, fire: 10 },
  { id: 8, text: "I pretend I hate drama but I read every group chat fight.", emoji: "👀", heart: 19, laugh: 11, fire: 8 },
  { id: 9, text: "I say I’m saving money then order food anyway.", emoji: "🍔", heart: 16, laugh: 14, fire: 6 },
  { id: 10, text: "I stalk profiles then accidentally like a 2-year-old photo.", emoji: "💀", heart: 25, laugh: 21, fire: 19 }
];

const spillBtn = document.getElementById("spillBtn");
const spillSection = document.getElementById("spillSection");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const teaContainer = document.getElementById("teaContainer");
const charCount = document.getElementById("charCount");
const trendingRow = document.getElementById("trendingRow");
const teaCountEl = document.getElementById("teaCount");
const reactionCountEl = document.getElementById("reactionCount");

const getTeas = () => JSON.parse(localStorage.getItem("teas")) || [];
const saveTeas = (teas) => localStorage.setItem("teas", JSON.stringify(teas));

function seedTeasIfEmpty() {
  if (getTeas().length === 0) saveTeas(SEED_TEAS);
}

answerInput.oninput = () => {
  charCount.textContent = `${answerInput.value.length} / 220`;
};

spillBtn.onclick = () => {
  spillSection.classList.remove("hidden");
  questionText.textContent = questions[Math.floor(Math.random() * questions.length)];
};

nextQuestionBtn.onclick = () => {
  questionText.textContent = questions[Math.floor(Math.random() * questions.length)];
  answerInput.value = "";
  charCount.textContent = "0 / 220";
};

function renderTeaCard(tea) {
  const div = document.createElement("div");
  div.className = "tea-card bg-white/5 backdrop-blur p-6 rounded-xl shadow-xl";
  div.id = `tea-${tea.id}`;

  const isNew = Date.now() - tea.id < 1000 * 60 * 5;

  div.innerHTML = `
    <div class="flex items-center gap-2 mb-2">
      <span class="text-4xl">${tea.emoji}</span>
      ${isNew ? `<span class="heading text-[10px] px-2 py-[2px] rounded-full bg-pink-600/20 text-pink-400">NEW</span>` : ""}
    </div>
    <p class="body-text mb-4">${tea.text}</p>
    <div class="flex gap-3 text-sm">
      <button class="react" data-type="heart">❤️ ${tea.heart}</button>
      <button class="react" data-type="laugh">😂 ${tea.laugh}</button>
      <button class="react" data-type="fire">🔥 ${tea.fire}</button>
    </div>
  `;
  div.onclick = () => openModal(tea);
  teaContainer.appendChild(div);
}

function loadTrending() {
  const teas = getTeas()
    .slice()
    .sort((a, b) => (b.fire + b.heart + b.laugh) - (a.fire + a.heart + a.laugh))
    .slice(0, 6);

  trendingRow.innerHTML = "";

  teas.forEach(tea => {
    const card = document.createElement("div");
    card.className = "trending-card min-w-[220px] p-4 rounded-xl bg-white/10 backdrop-blur shadow-lg cursor-pointer";
    card.innerHTML = `
      <div class="text-2xl mb-1">${tea.emoji}</div>
      <p class="body-text text-sm">${tea.text}</p>
      <div class="mt-2 text-xs">🔥 ${tea.fire} ❤️ ${tea.heart} 😂 ${tea.laugh}</div>
    `;
    card.onclick = () => {
      document.getElementById(`tea-${tea.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    trendingRow.appendChild(card);
    card.onclick = () => openModal(tea);
  });
}

function updateStats() {
  const teas = getTeas();
  teaCountEl.textContent = `${teas.length} teas spilled`;
  reactionCountEl.textContent = `${teas.reduce((s, t) => s + t.heart + t.laugh + t.fire, 0)} reactions`;
}

function loadTeas() {
  teaContainer.innerHTML = "";
  getTeas().forEach(renderTeaCard);
  loadTrending();
  updateStats();
}

submitBtn.onclick = () => {
  const text = answerInput.value.trim();
  if (!text) return alert("Spill something 😭");

  const tea = {
    id: Date.now(),
    text,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    heart: 0,
    laugh: 0,
    fire: 0
  };

  const teas = getTeas();
  teas.unshift(tea);
  saveTeas(teas);
  loadTeas();
  spillSection.classList.add("hidden");
  answerInput.value = "";
  confetti({ particleCount: 120, spread: 80 });
};

teaContainer.onclick = (e) => {
  if (!e.target.classList.contains("react")) return;

  const id = Number(e.target.closest("[id^='tea-']").id.replace("tea-", ""));
  const type = e.target.dataset.type;

  const teas = getTeas();
  const tea = teas.find(t => t.id === id);
  tea[type]++;
  saveTeas(teas);
  loadTeas();
};

seedTeasIfEmpty();
loadTeas();

const teaModal = document.getElementById("teaModal");
const closeModal = document.getElementById("closeModal");
const modalEmoji = document.getElementById("modalEmoji");
const modalText = document.getElementById("modalText");
const modalHeart = document.getElementById("modalHeart");
const modalLaugh = document.getElementById("modalLaugh");
const modalFire = document.getElementById("modalFire");

let activeTeaId = null;

function openModal(tea) {
  activeTeaId = tea.id;
  modalEmoji.textContent = tea.emoji;
  modalText.textContent = tea.text;
  modalHeart.textContent = `❤️ ${tea.heart}`;
  modalLaugh.textContent = `😂 ${tea.laugh}`;
  modalFire.textContent = `🔥 ${tea.fire}`;
  teaModal.classList.remove("hidden");
  teaModal.classList.add("flex");
}

closeModal.onclick = () => {
  teaModal.classList.add("hidden");
  teaModal.classList.remove("flex");
};

teaModal.onclick = (e) => {
  if (e.target === teaModal) closeModal.click();
};

function reactInModal(type) {
  const teas = getTeas();
  const tea = teas.find(t => t.id === activeTeaId);
  if (!tea) return;
  tea[type]++;
  saveTeas(teas);
  loadTeas();
  openModal(tea);
}

modalHeart.onclick = () => reactInModal("heart");
modalLaugh.onclick = () => reactInModal("laugh");
modalFire.onclick = () => reactInModal("fire");