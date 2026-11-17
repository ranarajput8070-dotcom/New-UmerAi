const mediaInput = document.getElementById("media-input");
const mediaList = document.getElementById("media-list");
const mediaCount = document.getElementById("media-count");
const draftCount = document.getElementById("draft-count");
const topic = document.getElementById("topic");
const draftOutput = document.getElementById("draft-output");
const draftButton = document.getElementById("draft-btn");
const copyButton = document.getElementById("copy-btn");
let mediaTotal = 0;
let drafts = 0;
let currentCaption = "";

mediaInput.addEventListener("change", () => {
  const files = Array.from(mediaInput.files || []);
  if (!files.length) return;
  if (mediaTotal === 0) mediaList.innerHTML = "";
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    const item = document.createElement("div");
    item.className = "media-item";
    const preview = document.createElement(file.type.startsWith("video/") ? "video" : "img");
    preview.src = url;
    if (preview.tagName === "VIDEO") preview.muted = true;
    const name = document.createElement("span");
    name.textContent = file.name;
    item.append(preview, name);
    mediaList.append(item);
    mediaTotal++;
  });
  mediaCount.textContent = String(mediaTotal);
});

draftButton.addEventListener("click", () => {
  const subject = topic.value.trim();
  if (!subject) {
    topic.focus();
    topic.placeholder = "Please describe your video first...";
    return;
  }
  const tone = document.getElementById("tone").value;
  const language = document.getElementById("language").value;
  const templates = {
    English: `Discover this: ${subject}.\n\nA little inspiration, a fresh perspective and a moment worth sharing. What do you think?\n\n#NewUmarAI #${safeTag(subject)} #Video`,
    Hindi: `देखिए: ${subject}।\n\nएक नई सोच और एक खास पल। आपको यह वीडियो कैसा लगा? अपनी राय बताइए।\n\n#NewUmarAI #वीडियो #${safeTag(subject)}`,
    Urdu: `دیکھیے: ${subject}۔\n\nایک خوبصورت خیال اور ایک خاص لمحہ۔ آپ کی کیا رائے ہے؟\n\n#NewUmarAI #ویڈیو #${safeTag(subject)}`
  };
  const opening = tone === "Inspirational" ? (language === "English" ? "Let this inspire you: " : language === "Hindi" ? "इससे प्रेरणा लें: " : "اس سے حوصلہ حاصل کریں: ") : "";
  currentCaption = opening + templates[language];
  draftOutput.textContent = currentCaption;
  drafts++;
  draftCount.textContent = String(drafts);
  copyButton.disabled = false;
});

function safeTag(value) {
  return value.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 24) || "Creator";
}

copyButton.addEventListener("click", async () => {
  if (!currentCaption) return;
  try {
    await navigator.clipboard.writeText(currentCaption);
    copyButton.textContent = "Copied!";
    setTimeout(() => { copyButton.textContent = "Copy caption"; }, 1500);
  } catch {
    copyButton.textContent = "Select and copy the draft";
  }
});