"use strict";

const grid = document.querySelector("#feed-grid");
const search = document.querySelector("#search");
const resultCount = document.querySelector("#result-count");
const empty = document.querySelector("#empty");
const filterButtons = [...document.querySelectorAll("[data-mode]")];
const surprise = document.querySelector("#surprise");
const dialog = document.querySelector("#item-dialog");
const detailPosition = document.querySelector("#detail-position");
const detailImage = document.querySelector("#detail-image");
const detailCredit = document.querySelector("#detail-credit");
const detailTitle = document.querySelector("#detail-title");
const detailSource = document.querySelector("#detail-source");
const detailDescription = document.querySelector("#detail-description");
const detailLink = document.querySelector("#detail-link");
const detailSave = document.querySelector("#detail-save");
const previous = document.querySelector("#detail-previous");
const next = document.querySelector("#detail-next");

const storageKey = "web-field-guide-saved";
const entriesById = new Map(entries.map(entry => [entry.id, entry]));
const saved = readSaved();
let mode = getMode();
let visibleEntries = [];
let activeIndex = -1;
let savedViewChanged = false;

function readSaved() {
  try {
    const ids = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(ids)) return new Set();
    const canonicalIds = ids.map(id => id === "r53" ? "figma" : id);
    return new Set(canonicalIds.filter(id => entriesById.has(id)));
  } catch {
    return new Set();
  }
}

function getMode() {
  if (["#reading", "#sites", "#gallery"].includes(location.hash)) {
    history.replaceState(null, "", location.pathname + location.search);
  }
  return location.hash === "#saved" ? "saved" : "all";
}

function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function setSaveLabel(button, entry) {
  const isSaved = saved.has(entry.id);
  const label = isSaved ? "Remove from saved" : "Save";
  button.setAttribute("aria-pressed", String(isSaved));
  button.setAttribute("aria-label", label + " " + entry.title);
  button.title = label;
  if (button === detailSave) button.textContent = isSaved ? "Saved" : "Save";
}

function toggleSave(entry) {
  if (saved.has(entry.id)) saved.delete(entry.id);
  else saved.add(entry.id);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...saved]));
  } catch {
    // Keep the current session usable when browser storage is unavailable.
  }
  const cardSave = grid.querySelector('[data-save="' + entry.id + '"]');
  if (cardSave) setSaveLabel(cardSave, entry);
  if (dialog.open) {
    setSaveLabel(detailSave, entry);
    savedViewChanged = mode === "saved";
  } else if (mode === "saved") {
    render();
    filterButtons.find(button => button.dataset.mode === "saved").focus();
  }
}

function makeTile(entry, index) {
  const tile = make("article", "tile");
  const open = make("button", "tile-open");
  open.type = "button";
  const visual = make("span", "tile-visual");
  const image = make("img");
  image.src = entry.thumb;
  image.width = entry.width;
  image.height = entry.height;
  image.alt = "";
  image.loading = index < 4 ? "eager" : "lazy";
  image.decoding = "async";
  if (index === 0) image.fetchPriority = "high";
  visual.append(image);
  const info = make("span", "tile-info");
  info.append(make("span", "tile-title", entry.title), make("span", "tile-domain", entry.domain));
  open.append(visual, info);
  open.addEventListener("click", () => openDetail(index));

  const save = make("button", "tile-save");
  save.type = "button";
  save.dataset.save = entry.id;
  save.append(make("span", "bookmark"));
  setSaveLabel(save, entry);
  save.addEventListener("click", () => toggleSave(entry));
  tile.append(open, save);
  return tile;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const words = query.split(/\s+/).filter(Boolean);
  visibleEntries = entries.filter(entry => {
    const matchesMode = mode === "all" || saved.has(entry.id);
    const text = [entry.title, entry.domain, entry.author, entry.essence, entry.description].join(" ").toLowerCase();
    return matchesMode && words.every(word => text.includes(word));
  });

  for (const button of filterButtons) button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
  grid.replaceChildren(...visibleEntries.map(makeTile));
  const count = visibleEntries.length;
  resultCount.textContent = count + (count === 1 ? " preview" : " previews");
  surprise.disabled = count < 2;
  empty.hidden = count > 0;
  empty.textContent = query ? "No previews match that search." : "Save something you’d like to revisit.";
}

function showDetail() {
  const entry = visibleEntries[activeIndex];
  detailPosition.textContent = (activeIndex + 1) + " of " + visibleEntries.length;
  detailTitle.textContent = entry.title;
  detailSource.textContent = [entry.author, entry.domain].filter(Boolean).join(" · ");
  detailImage.src = entry.image;
  detailImage.alt = entry.previewLabel + " for " + entry.title;
  detailCredit.textContent = entry.previewLabel;
  detailDescription.textContent = entry.description || entry.essence;
  detailDescription.hidden = !detailDescription.textContent;
  detailLink.href = entry.url;
  setSaveLabel(detailSave, entry);
  previous.disabled = activeIndex === 0;
  next.disabled = activeIndex === visibleEntries.length - 1;
  dialog.scrollTop = 0;
}

function openDetail(index) {
  activeIndex = index;
  showDetail();
  dialog.showModal();
}

function step(direction) {
  const target = activeIndex + direction;
  if (target >= 0 && target < visibleEntries.length) {
    activeIndex = target;
    showDetail();
  }
}

function showNewResults() {
  render();
  if (document.querySelector("#browse-controls").getBoundingClientRect().top < 1) {
    document.querySelector("#feed").scrollIntoView();
  }
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    const hash = mode === "all" ? "" : "#" + mode;
    history.replaceState(null, "", location.pathname + location.search + hash);
    showNewResults();
  });
}

search.addEventListener("input", showNewResults);
window.addEventListener("hashchange", () => {
  if (location.hash === "#top" || location.hash === "#feed") return;
  mode = getMode();
  render();
});
surprise.addEventListener("click", () => {
  const choices = visibleEntries.map((_, index) => index).filter(index => index !== activeIndex);
  openDetail(choices[Math.floor(Math.random() * choices.length)]);
});
detailSave.addEventListener("click", () => toggleSave(visibleEntries[activeIndex]));
previous.addEventListener("click", () => step(-1));
next.addEventListener("click", () => step(1));
dialog.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    step(event.key === "ArrowLeft" ? -1 : 1);
  }
});
dialog.addEventListener("close", () => {
  if (savedViewChanged) {
    savedViewChanged = false;
    const active = document.activeElement.closest(".tile");
    const savedId = active?.querySelector(".tile-save")?.dataset.save;
    render();
    const restored = savedId && grid.querySelector('[data-save="' + savedId + '"]');
    (restored?.previousElementSibling || filterButtons.find(button => button.dataset.mode === "saved")).focus();
  }
});

render();
