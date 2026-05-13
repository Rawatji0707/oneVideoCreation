/**
 * Mobile Mythology God Shorts — UI only. Uses catalog.js + prompt-engine.js (no public/ imports).
 */
(function () {
  const eng = () => window.MythologyMobilePromptEngine;
  const cat = () => window.MythologyMobileCatalog;

  const MOOD_LABELS = {
    bhakti: "Bhakti",
    courage: "Courage",
    peace: "Peace",
    awe: "Awe",
    wrath: "Wrath",
    compassion: "Compassion",
    mystery: "Mystery",
    triumph: "Triumph",
    melancholy: "Melancholy",
    festive: "Festive",
    serenity: "Serenity",
    power: "Power",
  };

  const rowsHost = document.getElementById("character-rows");
  const btnAddChar = document.getElementById("btn-add-character");
  const fieldP1Notes = document.getElementById("field-p1-notes");
  const p1OptionalNotes = document.getElementById("p1-optional-notes");
  const bgSelect = document.getElementById("bg-select");
  const bgVersionSelect = document.getElementById("bg-version-select");
  const bgLock = document.getElementById("bg-lock");
  const bgOptionalNotes = document.getElementById("bg-optional-notes");
  const camHidden = document.getElementById("cam-keys");
  const camChips = document.getElementById("cam-chips");
  const camAdd = document.getElementById("cam-add");
  const moodHidden = document.getElementById("mood-keys");
  const moodChips = document.getElementById("mood-chips");
  const moodAdd = document.getElementById("mood-add");
  const videoMain = document.getElementById("video-main");
  const videoSub = document.getElementById("video-sub");
  const toastEl = document.getElementById("toast");

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("visible");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toastEl.classList.remove("visible"), 2200);
  }

  async function copyText(text) {
    const t = String(text || "").trim();
    if (!t) {
      showToast("Nothing to copy");
      return false;
    }
    try {
      await navigator.clipboard.writeText(t);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = t;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  }

  function findGod(godId) {
    const g = cat()?.gods?.gods;
    if (!g || !godId) return null;
    return g.find((x) => x && x.id === godId) || null;
  }

  function findVersion(god, versionId) {
    if (!god || !versionId || !Array.isArray(god.versions)) return null;
    return god.versions.find((v) => v && v.id === versionId) || null;
  }

  function fillGodSelect(sel) {
    const gods = cat()?.gods?.gods || [];
    sel.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Choose…";
    sel.appendChild(ph);
    for (const g of gods) {
      const o = document.createElement("option");
      o.value = g.id;
      o.textContent = g.label || g.id;
      sel.appendChild(o);
    }
  }

  function fillVersionSelect(godId, sel, preferredVersionId) {
    const god = findGod(godId);
    sel.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Choose…";
    sel.appendChild(ph);
    if (!god || !Array.isArray(god.versions)) {
      sel.disabled = true;
      return;
    }
    sel.disabled = false;
    for (const v of god.versions) {
      const o = document.createElement("option");
      o.value = v.id;
      o.textContent = v.label || v.id;
      sel.appendChild(o);
    }
    const want = String(preferredVersionId || "").trim();
    if (want && [...sel.options].some((op) => op.value === want)) sel.value = want;
    else if (god.versions[0] && [...sel.options].some((op) => op.value === god.versions[0].id)) {
      sel.value = god.versions[0].id;
    }
  }

  function syncLockFromRow(card) {
    const godId = card.querySelector(".god-sel")?.value?.trim();
    const verId = card.querySelector(".ver-sel")?.value?.trim();
    const ta = card.querySelector(".lock-ta");
    if (!ta) return;
    const god = findGod(godId);
    const ver = findVersion(god, verId);
    if (ver) {
      ta.value = String(ver.videoLock || ver.characterBrief || "").trim();
    }
  }

  function updateP1NotesVisibility() {
    const n = document.querySelectorAll("#character-rows .character-card").length;
    if (fieldP1Notes) fieldP1Notes.hidden = n !== 1;
  }

  function wireCharacterCard(card) {
    const gSel = card.querySelector(".god-sel");
    const vSel = card.querySelector(".ver-sel");
    if (!gSel || !vSel) return;
    fillGodSelect(gSel);
    gSel.addEventListener("change", () => {
      fillVersionSelect(gSel.value, vSel, "");
      syncLockFromRow(card);
    });
    vSel.addEventListener("change", () => {
      syncLockFromRow(card);
    });
  }

  function refreshRemoveButtons() {
    const cards = [...document.querySelectorAll("#character-rows .character-card")];
    cards.forEach((c, i) => {
      const btn = c.querySelector(".btn-remove");
      if (!btn) return;
      btn.hidden = cards.length <= 1;
      const lab = c.querySelector(".fig-label");
      if (lab) lab.textContent = `Figure ${i + 1}`;
    });
    updateP1NotesVisibility();
  }

  function addCharacterRow(preferred) {
    const card = document.createElement("div");
    card.className = "character-card";
    card.innerHTML = `
      <div class="character-card-head">
        <span class="fig-label">Figure</span>
        <button type="button" class="btn-remove">Remove</button>
      </div>
      <div class="row-grid two">
        <div class="field">
          <label class="god-label">Deity</label>
          <select class="god-sel" aria-label="Deity"></select>
        </div>
        <div class="field">
          <label class="ver-label">Version</label>
          <select class="ver-sel" aria-label="Version"></select>
        </div>
      </div>
      <div class="field">
        <label class="lock-label">Lock</label>
        <textarea class="lock-ta" rows="4" autocomplete="off"></textarea>
      </div>
    `;
    rowsHost.appendChild(card);
    wireCharacterCard(card);
    const gSel = card.querySelector(".god-sel");
    const vSel = card.querySelector(".ver-sel");
    const gid = String(preferred?.godId || "").trim();
    if (gid && [...gSel.options].some((o) => o.value === gid)) gSel.value = gid;
    fillVersionSelect(gSel.value, vSel, preferred?.versionId || "");
    if (preferred?.lockText != null) {
      card.querySelector(".lock-ta").value = String(preferred.lockText);
    } else {
      syncLockFromRow(card);
    }
    card.querySelector(".btn-remove").addEventListener("click", () => {
      if (document.querySelectorAll("#character-rows .character-card").length <= 1) return;
      card.remove();
      refreshRemoveButtons();
    });
    refreshRemoveButtons();
  }

  function initBackgroundUI() {
    if (bgSelect.dataset.mobileWired === "1") return;
    bgSelect.dataset.mobileWired = "1";
    const bgs = cat()?.backgrounds?.backgrounds || [];
    bgSelect.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Choose…";
    bgSelect.appendChild(ph);
    for (const b of bgs) {
      const o = document.createElement("option");
      o.value = b.id;
      o.textContent = b.label || b.id;
      bgSelect.appendChild(o);
    }
    if (bgs[0]) bgSelect.value = bgs[0].id;
    bgSelect.addEventListener("change", () => {
      onBgChange(false);
    });
    bgVersionSelect.addEventListener("change", () => {
      syncBgLock();
    });
    onBgChange(true);
  }

  function onBgChange(_isInitial) {
    const bid = bgSelect.value?.trim();
    const bg = cat()?.backgrounds?.backgrounds?.find((b) => b && b.id === bid);
    bgVersionSelect.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Choose…";
    bgVersionSelect.appendChild(ph);
    if (!bg || !Array.isArray(bg.versions) || !bg.versions.length) {
      bgVersionSelect.disabled = true;
      return;
    }
    bgVersionSelect.disabled = false;
    for (const v of bg.versions) {
      const o = document.createElement("option");
      o.value = v.id;
      o.textContent = v.label || v.id;
      bgVersionSelect.appendChild(o);
    }
    bgVersionSelect.value = bg.versions[0]?.id || "";
    syncBgLock();
  }

  function syncBgLock() {
    const bid = bgSelect.value?.trim();
    const vid = bgVersionSelect.value?.trim();
    const bg = cat()?.backgrounds?.backgrounds?.find((b) => b && b.id === bid);
    const ver = bg && Array.isArray(bg.versions) ? bg.versions.find((v) => v && v.id === vid) : null;
    if (ver) {
      bgLock.value = String(ver.videoLock || ver.characterBrief || "").trim();
    }
  }

  function readJsonKeys(hidden, fallback) {
    try {
      const raw = hidden.value?.trim();
      const j = JSON.parse(raw || (fallback != null ? JSON.stringify(fallback) : "[]"));
      return Array.isArray(j) ? j.map((k) => String(k).trim()).filter(Boolean) : [];
    } catch {
      return Array.isArray(fallback) ? [...fallback] : [];
    }
  }

  function writeJsonKeys(hidden, keys) {
    hidden.value = JSON.stringify(keys);
  }

  function renderCamChips() {
    const keys = readJsonKeys(camHidden, ["default_framing"]);
    const labels = eng()?.PROMPT3_CAMERA_OPTION_LABELS || {};
    camChips.replaceChildren();
    for (const key of keys) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.setAttribute("role", "listitem");
      const span = document.createElement("span");
      span.textContent = labels[key] || key;
      const rm = document.createElement("button");
      rm.type = "button";
      rm.setAttribute("aria-label", "Remove angle");
      rm.textContent = "\u00d7";
      rm.addEventListener("click", () => {
        const next = readJsonKeys(camHidden, []).filter((k) => k !== key);
        writeJsonKeys(camHidden, next.length ? next : ["default_framing"]);
        renderCamChips();
      });
      chip.appendChild(span);
      chip.appendChild(rm);
      camChips.appendChild(chip);
    }
  }

  function renderMoodChips() {
    const keys = readJsonKeys(moodHidden, []);
    moodChips.replaceChildren();
    for (const key of keys) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.setAttribute("role", "listitem");
      const span = document.createElement("span");
      span.textContent = MOOD_LABELS[key] || key;
      const rm = document.createElement("button");
      rm.type = "button";
      rm.setAttribute("aria-label", "Remove mood");
      rm.textContent = "\u00d7";
      rm.addEventListener("click", () => {
        const cur = readJsonKeys(moodHidden, []);
        writeJsonKeys(moodHidden, cur.filter((k) => k !== key));
        renderMoodChips();
      });
      chip.appendChild(span);
      chip.appendChild(rm);
      moodChips.appendChild(chip);
    }
  }

  function initChips() {
    if (camAdd.dataset.mobileWired === "1") return;
    camAdd.dataset.mobileWired = "1";
    let keys = readJsonKeys(camHidden, []);
    if (!keys.length) {
      keys = ["default_framing"];
      writeJsonKeys(camHidden, keys);
    }
    renderCamChips();
    camAdd.addEventListener("change", () => {
      const v = String(camAdd.value || "").trim();
      camAdd.selectedIndex = 0;
      if (!v) return;
      const cur = readJsonKeys(camHidden, []);
      if (cur.includes(v)) return;
      cur.push(v);
      writeJsonKeys(camHidden, cur);
      renderCamChips();
    });

    writeJsonKeys(moodHidden, readJsonKeys(moodHidden, []));
    renderMoodChips();
    moodAdd.addEventListener("change", () => {
      const v = String(moodAdd.value || "").trim();
      moodAdd.selectedIndex = 0;
      if (!v) return;
      const cur = readJsonKeys(moodHidden, []);
      if (cur.includes(v)) return;
      cur.push(v);
      writeJsonKeys(moodHidden, cur);
      renderMoodChips();
    });
  }

  function fillVideoSub() {
    const catalog = cat()?.videoStyle;
    const mainId = videoMain.value?.trim();
    const main = catalog?.mainStyles?.find((m) => m && m.id === mainId);
    const keepSub = videoSub.value?.trim();
    videoSub.replaceChildren();
    if (!main || !Array.isArray(main.subcategories) || !main.subcategories.length) {
      videoSub.disabled = true;
      return;
    }
    videoSub.disabled = false;
    for (const s of main.subcategories) {
      const o = document.createElement("option");
      o.value = s.id;
      o.textContent = s.label || s.id;
      const tip = String(s.hint || "").trim();
      if (tip) o.title = tip;
      videoSub.appendChild(o);
    }
    if (keepSub && [...videoSub.options].some((op) => op.value === keepSub)) {
      videoSub.value = keepSub;
    } else if (videoSub.options.length) {
      videoSub.selectedIndex = 0;
    }
  }

  function fillVideoStyle() {
    if (videoMain.dataset.mobileWired === "1") return;
    videoMain.dataset.mobileWired = "1";
    const catalog = cat()?.videoStyle;
    const mains = catalog?.mainStyles || [];
    videoMain.replaceChildren();
    videoSub.replaceChildren();
    if (!mains.length) {
      videoMain.disabled = true;
      videoSub.disabled = true;
      return;
    }
    videoMain.disabled = false;
    for (const m of mains) {
      const o = document.createElement("option");
      o.value = m.id;
      o.textContent = m.label || m.id;
      videoMain.appendChild(o);
    }
    videoMain.addEventListener("change", fillVideoSub);
    fillVideoSub();
  }

  function collectGods() {
    const cards = [...document.querySelectorAll("#character-rows .character-card")];
    const optional = p1OptionalNotes ? String(p1OptionalNotes.value || "").trim() : "";
    const out = [];
    for (const card of cards) {
      const godId = card.querySelector(".god-sel")?.value?.trim();
      const verId = card.querySelector(".ver-sel")?.value?.trim();
      if (!godId || !verId) continue;
      const god = findGod(godId);
      if (!god) continue;
      const label = String(god.label || god.id).trim();
      const lock = String(card.querySelector(".lock-ta")?.value || "").trim();
      out.push({ label, videoLock: lock });
    }
    if (out.length === 1 && optional) {
      out[0].optionalNotes = optional;
    }
    return out;
  }

  function collectBackground() {
    const bid = bgSelect.value?.trim();
    const vid = bgVersionSelect.value?.trim();
    const bg = cat()?.backgrounds?.backgrounds?.find((b) => b && b.id === bid);
    const ver = bg && Array.isArray(bg.versions) ? bg.versions.find((v) => v && v.id === vid) : null;
    if (!bg || !ver) return null;
    return {
      id: bg.id,
      label: String(bg.label || bg.id).trim(),
      videoLock: String(bgLock.value || ver.videoLock || ver.characterBrief || "").trim(),
    };
  }

  function buildP3State() {
    return {
      gods: collectGods(),
      background: collectBackground(),
      videoCatalog: cat()?.videoStyle,
      prompt3: {
        performance: document.getElementById("p3-performance")?.value,
        atmosphere: document.getElementById("p3-atmosphere")?.value,
        constraints: document.getElementById("p3-constraints")?.value,
        cameraKeys: readJsonKeys(camHidden, ["default_framing"]),
        moodKeys: readJsonKeys(moodHidden, []),
        videoMainId: videoMain.value?.trim(),
        videoSubId: videoSub.value?.trim(),
        priorityLines: document.getElementById("p3-priority")?.value ?? "",
      },
    };
  }

  document.getElementById("copy-p1")?.addEventListener("click", async () => {
    if (!eng()) return;
    const gods = collectGods();
    const text = eng().buildPrompt1(gods);
    const ok = await copyText(text);
    showToast(ok ? "Copied" : "Copy failed");
  });

  document.getElementById("copy-p2")?.addEventListener("click", async () => {
    if (!eng()) return;
    const bg = collectBackground();
    const notes = String(bgOptionalNotes.value || "").trim();
    const text = eng().buildPrompt2(bg, notes);
    const ok = await copyText(text);
    showToast(ok ? "Copied" : "Copy failed");
  });

  document.getElementById("copy-p3")?.addEventListener("click", async () => {
    if (!eng()) return;
    const text = eng().buildPrompt3Merged(buildP3State());
    const ok = await copyText(text);
    showToast(ok ? "Copied" : "Copy failed");
  });

  btnAddChar?.addEventListener("click", () => {
    addCharacterRow({});
  });

  async function loadCatalogs() {
    const fb = window.MythologyMobileCatalogFallback;
    let godsDoc = fb.gods;
    let bgDoc = fb.backgrounds;
    let priorityPresets = [];
    try {
      const [gRes, bRes, pRes] = await Promise.all([
        fetch("godCharacter.json", { cache: "no-store" }),
        fetch("backgroundCharacter.json", { cache: "no-store" }),
        fetch("prioritySceneBeats.json", { cache: "no-store" }),
      ]);
      const g = await gRes.json().catch(() => null);
      const b = await bRes.json().catch(() => null);
      const p = await pRes.json().catch(() => null);
      if (g && typeof g === "object" && Array.isArray(g.gods)) godsDoc = g;
      if (b && typeof b === "object" && Array.isArray(b.backgrounds)) bgDoc = b;
      if (p && typeof p === "object" && Array.isArray(p.presets)) priorityPresets = p.presets;
    } catch (e) {
      console.warn("Mythology mobile: catalog JSON fetch failed, using fallback.", e);
      godsDoc = fb.gods;
      bgDoc = fb.backgrounds;
      priorityPresets = [];
    }
    window.MythologyMobileCatalog = {
      gods: godsDoc,
      backgrounds: bgDoc,
      videoStyle: window.MythologyMobileDefaultVideoStyle,
    };
    window.MythologyMobilePriorityPresets = priorityPresets;
  }

  function populatePriorityPresets() {
    const sel = document.getElementById("priority-saved-select");
    if (!sel) return;
    const presets = window.MythologyMobilePriorityPresets || [];
    sel.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Saved preset…";
    sel.appendChild(ph);
    for (const pr of presets) {
      if (!pr || !pr.id) continue;
      const o = document.createElement("option");
      o.value = String(pr.id);
      o.textContent = String(pr.label || pr.id);
      sel.appendChild(o);
    }
  }

  function wirePriorityControlsOnce() {
    const sel = document.getElementById("priority-saved-select");
    const ta = document.getElementById("p3-priority");
    const row = document.getElementById("priority-examples-row");
    if (sel && sel.dataset.mobileWired !== "1") {
      sel.dataset.mobileWired = "1";
      sel.addEventListener("change", () => {
        const id = String(sel.value || "").trim();
        if (!id || !ta) return;
        const p = (window.MythologyMobilePriorityPresets || []).find((x) => x && String(x.id) === id);
        if (p) ta.value = String(p.text || "");
      });
    }
    if (row && row.dataset.mobileWired !== "1") {
      row.dataset.mobileWired = "1";
      for (const pr of window.MythologyMobilePriorityPresets || []) {
        if (!pr || !pr.quickFill) continue;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-example";
        btn.textContent = String(pr.label || "Example");
        btn.title = String(pr.text || "");
        btn.addEventListener("click", () => {
          if (ta) ta.value = String(pr.text || "");
        });
        row.appendChild(btn);
      }
    }
  }

  function init() {
    if (!cat() || !eng()) {
      showToast("Missing scripts");
      return;
    }
    rowsHost.replaceChildren();
    addCharacterRow({ godId: "shiva", versionId: "version1" });
    initBackgroundUI();
    initChips();
    fillVideoStyle();
    populatePriorityPresets();
    wirePriorityControlsOnce();
  }

  async function bootstrap() {
    await loadCatalogs();
    if (!eng()) {
      showToast("Missing prompt engine");
      return;
    }
    init();
  }

  bootstrap().catch((e) => {
    console.error(e);
    showToast("Load failed");
  });
})();
