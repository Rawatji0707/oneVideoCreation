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
  const p2SceneInput = document.getElementById("p2-scene-input");
  const bgSelect = document.getElementById("bg-select");
  const bgVersionSelect = document.getElementById("bg-version-select");
  const bgLock = document.getElementById("bg-lock");
  const camHidden = document.getElementById("cam-keys");
  const camChips = document.getElementById("cam-chips");
  const camAdd = document.getElementById("cam-add");
  const moodHidden = document.getElementById("mood-keys");
  const moodChips = document.getElementById("mood-chips");
  const moodAdd = document.getElementById("mood-add");
  const videoMain = document.getElementById("video-main");
  const videoSub = document.getElementById("video-sub");
  const toastEl = document.getElementById("toast");
  const catalogDialog = document.getElementById("catalog-dialog");
  const catalogDialogTitle = document.getElementById("catalog-dialog-title");
  const catalogDialogBody = document.getElementById("catalog-dialog-body");
  const catalogDialogError = document.getElementById("catalog-dialog-error");
  const catalogDialogSave = document.getElementById("catalog-dialog-save");

  const STORAGE_KEYS = {
    gods: "mythologyGodShorts.godCharacter.v1",
    backgrounds: "mythologyGodShorts.backgroundCharacter.v1",
    priorityBeats: "mythologyGodShorts.prioritySceneBeats.v1",
    editingState: "mythologyGodShorts.EditingState.v1",
  };

  let baseGodsDoc = null;
  let baseBackgroundsDoc = null;
  let basePriorityDoc = null;
  let baseEditingStateDoc = null;
  let activeEditingStateDoc = null;
  let activeDialogSave = null;
  let isApplyingEditingState = false;

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

  async function copyRawText(text) {
    const s = String(text ?? "");
    if (!s) {
      showToast("Nothing to copy");
      return false;
    }
    try {
      await navigator.clipboard.writeText(s);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = s;
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

  function selectAllInTextarea(el) {
    if (!el || el.tagName !== "TEXTAREA") return;
    const len = el.value.length;
    const apply = () => {
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
      if (typeof el.setSelectionRange === "function") {
        try {
          el.setSelectionRange(0, len);
        } catch {
          el.select();
        }
      } else if (typeof el.select === "function") {
        el.select();
      }
    };
    apply();
    queueMicrotask(apply);
    window.setTimeout(apply, 0);
    window.setTimeout(apply, 100);
  }

  function attachTextareaTools(ta) {
    if (!ta || ta.dataset.taTools === "1") return;
    const parent = ta.parentNode;
    if (!parent) return;
    ta.dataset.taTools = "1";
    const wrap = document.createElement("div");
    wrap.className = "textarea-with-tools";
    parent.insertBefore(wrap, ta);
    const toolbar = document.createElement("div");
    toolbar.className = "textarea-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Textarea actions");
    const btnSelectAll = document.createElement("button");
    btnSelectAll.type = "button";
    btnSelectAll.className = "btn-small btn-ta-tool";
    btnSelectAll.textContent = "Select all";
    btnSelectAll.setAttribute("aria-label", "Select all text in this field");
    btnSelectAll.addEventListener("click", (ev) => {
      ev.preventDefault();
      selectAllInTextarea(ta);
    });
    const btnCopy = document.createElement("button");
    btnCopy.type = "button";
    btnCopy.className = "btn-small btn-ta-tool btn-ta-tool-accent";
    btnCopy.textContent = "Copy";
    btnCopy.setAttribute("aria-label", "Copy this field to clipboard");
    btnCopy.addEventListener("click", async () => {
      const ok = await copyRawText(ta.value);
      showToast(ok ? "Copied" : "Copy failed");
    });
    toolbar.appendChild(btnSelectAll);
    toolbar.appendChild(btnCopy);
    wrap.appendChild(toolbar);
    wrap.appendChild(ta);
  }

  function wireMainPageTextareas() {
    document.querySelectorAll("main textarea").forEach((ta) => attachTextareaTools(ta));
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function prettyJson(doc) {
    return `${JSON.stringify(doc, null, 2)}\n`;
  }

  function slugId(raw) {
    return String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function uniqueId(base, exists) {
    const fallback = `item_${Date.now()}`;
    const root = slugId(base) || fallback;
    let id = root;
    let i = 2;
    while (exists(id)) {
      id = `${root}_${i}`;
      i += 1;
    }
    return id;
  }

  function readStoredDoc(key, isValid, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return cloneJson(fallback);
      const parsed = JSON.parse(raw);
      return isValid(parsed) ? parsed : cloneJson(fallback);
    } catch {
      return cloneJson(fallback);
    }
  }

  function mergeVersionedCatalog(baseDoc, storedDoc, listKey) {
    const baseList = Array.isArray(baseDoc?.[listKey]) ? baseDoc[listKey] : [];
    const storedList = Array.isArray(storedDoc?.[listKey]) ? storedDoc[listKey] : [];
    const mergedList = cloneJson(storedList);
    const byId = new Map(mergedList.filter((item) => item && item.id).map((item) => [String(item.id), item]));

    for (const baseItem of baseList) {
      if (!baseItem || !baseItem.id) continue;
      const existing = byId.get(String(baseItem.id));
      if (!existing) {
        mergedList.push(cloneJson(baseItem));
        continue;
      }
      if (!Array.isArray(existing.versions)) existing.versions = [];
      const existingVersionIds = new Set(
        existing.versions.filter((version) => version && version.id).map((version) => String(version.id))
      );
      for (const baseVersion of baseItem.versions || []) {
        if (!baseVersion || !baseVersion.id || existingVersionIds.has(String(baseVersion.id))) continue;
        existing.versions.push(cloneJson(baseVersion));
      }
    }

    return { [listKey]: mergedList };
  }

  function mergePriorityCatalog(baseDoc, storedDoc) {
    const basePresets = Array.isArray(baseDoc?.presets) ? baseDoc.presets : [];
    const storedPresets = Array.isArray(storedDoc?.presets) ? storedDoc.presets : [];
    const mergedPresets = cloneJson(storedPresets);
    const presetIds = new Set(
      mergedPresets.filter((preset) => preset && preset.id).map((preset) => String(preset.id))
    );
    for (const basePreset of basePresets) {
      if (!basePreset || !basePreset.id || presetIds.has(String(basePreset.id))) continue;
      mergedPresets.push(cloneJson(basePreset));
    }
    return { presets: mergedPresets };
  }

  function normalizeEditingState(doc) {
    const fields = doc && typeof doc === "object" && doc.fields && typeof doc.fields === "object" ? doc.fields : {};
    return {
      v: 1,
      updatedAt: typeof doc?.updatedAt === "string" ? doc.updatedAt : null,
      fields: { ...fields },
    };
  }

  function readEditingState(baseDoc) {
    const base = normalizeEditingState(baseDoc);
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.editingState);
      if (!raw) return base;
      const stored = normalizeEditingState(JSON.parse(raw));
      return {
        v: 1,
        updatedAt: stored.updatedAt || base.updatedAt,
        fields: { ...base.fields, ...stored.fields },
      };
    } catch {
      return base;
    }
  }

  function saveEditingState(doc) {
    activeEditingStateDoc = normalizeEditingState(doc);
    localStorage.setItem(STORAGE_KEYS.editingState, JSON.stringify(activeEditingStateDoc));
  }

  function saveStoredDoc(key, doc) {
    localStorage.setItem(key, JSON.stringify(doc));
  }

  function saveGodsDoc(doc) {
    saveStoredDoc(STORAGE_KEYS.gods, doc);
    window.MythologyMobileCatalog.gods = doc;
  }

  function saveBackgroundsDoc(doc) {
    saveStoredDoc(STORAGE_KEYS.backgrounds, doc);
    window.MythologyMobileCatalog.backgrounds = doc;
  }

  function savePriorityDoc(doc) {
    saveStoredDoc(STORAGE_KEYS.priorityBeats, doc);
    window.MythologyMobilePriorityPresets = Array.isArray(doc.presets) ? doc.presets : [];
  }

  function downloadJson(filename, doc) {
    const blob = new Blob([prettyJson(doc)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copyJsonDoc(doc) {
    const ok = await copyText(prettyJson(doc));
    showToast(ok ? "JSON copied" : "Copy failed");
  }

  function setDialogError(msg) {
    if (!catalogDialogError) return;
    catalogDialogError.textContent = String(msg || "");
    catalogDialogError.hidden = !msg;
  }

  function closeDialog() {
    activeDialogSave = null;
    setDialogError("");
    if (catalogDialog && typeof catalogDialog.close === "function") catalogDialog.close();
  }

  function openDialog(title, body, onSave, saveText) {
    if (!catalogDialog || !catalogDialogBody || typeof catalogDialog.showModal !== "function") {
      showToast("Popup not supported");
      return;
    }
    if (catalogDialogTitle) catalogDialogTitle.textContent = title;
    catalogDialogBody.replaceChildren(body);
    body.querySelectorAll("textarea").forEach((ta) => attachTextareaTools(ta));
    if (catalogDialogSave) catalogDialogSave.textContent = saveText || "Save";
    activeDialogSave = onSave;
    setDialogError("");
    catalogDialog.showModal();
  }

  function fieldWrap(labelText, input) {
    const wrap = document.createElement("div");
    wrap.className = "dialog-field";
    const label = document.createElement("label");
    label.textContent = labelText;
    if (input.id) label.htmlFor = input.id;
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }

  function makeInput(id, value) {
    const input = document.createElement("input");
    input.id = id;
    input.type = "text";
    input.autocomplete = "off";
    input.value = value || "";
    return input;
  }

  function makeTextarea(id, value, rows) {
    const ta = document.createElement("textarea");
    ta.id = id;
    ta.rows = rows || 5;
    ta.autocomplete = "off";
    ta.value = value || "";
    return ta;
  }

  function makeSelect(id, options, selectedValue) {
    const sel = document.createElement("select");
    sel.id = id;
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = String(opt.value);
      o.textContent = String(opt.label);
      sel.appendChild(o);
    }
    if (selectedValue && [...sel.options].some((o) => o.value === selectedValue)) {
      sel.value = selectedValue;
    }
    return sel;
  }

  function makeCheckbox(id, labelText, checked) {
    const wrap = document.createElement("label");
    wrap.className = "dialog-check";
    const input = document.createElement("input");
    input.id = id;
    input.type = "checkbox";
    input.checked = !!checked;
    wrap.appendChild(input);
    wrap.appendChild(document.createTextNode(labelText));
    return wrap;
  }

  function selectedCharacterCard() {
    return document.querySelector("#character-rows .character-card");
  }

  function collectEditingFields() {
    const rows = [...document.querySelectorAll("#character-rows .character-card")].map((card) => {
      const godIds = getSelectedGodIds(card);
      const legacyGod = godIds.length === 1 ? godIds[0] : "";
      return {
        godIds,
        godId: legacyGod,
        versionId: card.querySelector(".ver-sel")?.value?.trim() || "",
        lockText: card.querySelector(".lock-ta")?.value || "",
      };
    });
    return {
      characterRows: rows,
      "p2-scene-input": p2SceneInput?.value || "",
      "bg-select": bgSelect?.value || "",
      "bg-version-select": bgVersionSelect?.value || "",
      "bg-lock": bgLock?.value || "",
      "p3-performance": document.getElementById("p3-performance")?.value || "",
      "p3-atmosphere": document.getElementById("p3-atmosphere")?.value || "",
      "cam-keys": camHidden?.value || "",
      "p3-constraints": document.getElementById("p3-constraints")?.value || "",
      "mood-keys": moodHidden?.value || "",
      "video-main": videoMain?.value || "",
      "video-sub": videoSub?.value || "",
      "priority-saved-select": document.getElementById("priority-saved-select")?.value || "",
      "p3-priority": document.getElementById("p3-priority")?.value || "",
    };
  }

  function persistEditingState() {
    if (isApplyingEditingState) return;
    saveEditingState({
      v: 1,
      updatedAt: new Date().toISOString(),
      fields: collectEditingFields(),
    });
  }

  function setSelectValue(selectEl, value) {
    if (!selectEl || value == null) return false;
    const wanted = String(value);
    if (![...selectEl.options].some((option) => option.value === wanted)) return false;
    selectEl.value = wanted;
    return true;
  }

  function applyEditingState() {
    const fields = activeEditingStateDoc?.fields || {};
    isApplyingEditingState = true;
    try {
      if (Array.isArray(fields.characterRows) && fields.characterRows.length) {
        rowsHost.replaceChildren();
        for (const row of fields.characterRows) {
          const ids =
            Array.isArray(row.godIds) && row.godIds.length
              ? row.godIds
              : row.godId
                ? [String(row.godId).trim()].filter(Boolean)
                : [];
          addCharacterRow({
            godIds: ids,
            godId: ids[0] || "",
            versionId: row.versionId,
            lockText: row.lockText,
          });
        }
      }
      const savedSceneInfo =
        fields["p2-scene-input"] != null
          ? fields["p2-scene-input"]
          : fields["god-shorts-prompt2-scene-input"];
      if (p2SceneInput && savedSceneInfo != null) {
        p2SceneInput.value = String(savedSceneInfo);
      }

      const bgId = fields["bg-select"];
      const bgVersionId = fields["bg-version-select"];
      if (bgId || bgVersionId) {
        refreshBackgroundControls({ backgroundId: bgId, versionId: bgVersionId });
      }
      if (bgLock && fields["bg-lock"] != null) bgLock.value = String(fields["bg-lock"]);

      setSelectValue(document.getElementById("p3-performance"), fields["p3-performance"]);
      setSelectValue(document.getElementById("p3-atmosphere"), fields["p3-atmosphere"]);
      setSelectValue(document.getElementById("p3-constraints"), fields["p3-constraints"]);
      if (camHidden && fields["cam-keys"] != null) {
        camHidden.value = String(fields["cam-keys"]);
        renderCamChips();
      }
      if (moodHidden && fields["mood-keys"] != null) {
        moodHidden.value = String(fields["mood-keys"]);
        renderMoodChips();
      }

      if (setSelectValue(videoMain, fields["video-main"])) {
        fillVideoSub();
      }
      setSelectValue(videoSub, fields["video-sub"]);

      setSelectValue(document.getElementById("priority-saved-select"), fields["priority-saved-select"]);
      const priority = document.getElementById("p3-priority");
      if (priority && fields["p3-priority"] != null) priority.value = String(fields["p3-priority"]);
    } finally {
      isApplyingEditingState = false;
    }
  }

  function wireEditingStateAutosave() {
    const ids = [
      "p2-scene-input",
      "bg-select",
      "bg-version-select",
      "bg-lock",
      "p3-performance",
      "p3-atmosphere",
      "cam-keys",
      "p3-constraints",
      "mood-keys",
      "video-main",
      "video-sub",
      "priority-saved-select",
      "p3-priority",
    ];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el || el.dataset.editingStateWired === "1") continue;
      el.dataset.editingStateWired = "1";
      el.addEventListener("change", persistEditingState);
      el.addEventListener("input", persistEditingState);
    }
    if (rowsHost && rowsHost.dataset.editingStateWired !== "1") {
      rowsHost.dataset.editingStateWired = "1";
      rowsHost.addEventListener("change", persistEditingState);
      rowsHost.addEventListener("input", persistEditingState);
      rowsHost.addEventListener("click", () => window.setTimeout(persistEditingState, 0));
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

  function findVersionOrFallback(god, versionId) {
    if (!god || !Array.isArray(god.versions) || !god.versions.length) return null;
    const want = String(versionId || "").trim();
    if (want) {
      const v = god.versions.find((x) => x && x.id === want);
      if (v) return v;
    }
    for (let i = god.versions.length - 1; i >= 0; i--) {
      const v = god.versions[i];
      if (v?.id) return v;
    }
    return null;
  }

  /** Lock text for a catalog version; legacy JSON may only have `characterBrief`. */
  function catalogVersionLock(ver) {
    if (!ver || typeof ver !== "object") return "";
    const primary = String(ver.videoLock || "").trim();
    if (primary) return primary;
    return String(ver.characterBrief || "").trim();
  }

  function getSelectedGodIds(card) {
    if (!card) return [];
    const box = card.querySelector(".god-multi-box");
    if (!box) return [];
    return [...box.querySelectorAll(".god-multi-cb:checked")]
      .map((cb) => String(cb.value || "").trim())
      .filter(Boolean);
  }

  function fillGodMultiBox(box, selectedIds) {
    if (!box) return;
    box.replaceChildren();
    const want = new Set((Array.isArray(selectedIds) ? selectedIds : []).map((id) => String(id || "").trim()).filter(Boolean));
    const gods = cat()?.gods?.gods || [];
    for (const g of gods) {
      if (!g?.id) continue;
      const row = document.createElement("label");
      row.className = "god-multi-row";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "god-multi-cb";
      cb.value = g.id;
      cb.checked = want.has(g.id);
      const span = document.createElement("span");
      span.className = "god-multi-label-text";
      span.textContent = g.label || g.id;
      row.appendChild(cb);
      row.appendChild(span);
      box.appendChild(row);
    }
  }

  function applyGodNameReplacements(text, gods) {
    let s = String(text ?? "");
    const pairs = (Array.isArray(gods) ? gods : [])
      .map((g) => ({
        label: String(g?.label || "").trim(),
        lock: String(g?.videoLock || "").trim(),
      }))
      .filter((p) => p.label && p.lock);
    pairs.sort((a, b) => b.label.length - a.label.length);
    for (const { label, lock } of pairs) {
      if (!s.includes(label)) continue;
      s = s.split(label).join(lock);
    }
    return s;
  }

  function fillVersionSelect(godId, sel, preferredVersionId) {
    const god = findGod(godId);
    sel.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "None";
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
  }

  function syncLockFromRow(card) {
    const godIds = getSelectedGodIds(card);
    const verId = card.querySelector(".ver-sel")?.value?.trim();
    const ta = card.querySelector(".lock-ta");
    if (!ta) return;

    if (godIds.length === 0) {
      ta.value = "";
    } else if (godIds.length === 1) {
      const god = findGod(godIds[0]);
      const ver = god && verId ? findVersion(god, verId) : null;
      if (ver) {
        ta.value = catalogVersionLock(ver);
      } else {
        ta.value = "";
      }
    } else {
      const parts = [];
      for (const gid of godIds) {
        const god = findGod(gid);
        if (!god) continue;
        const ver = findVersionOrFallback(god, verId);
        const line = ver ? catalogVersionLock(ver) : "";
        const name = String(god.label || god.id).trim();
        if (line) parts.push(`[${name}]\n${line}`);
      }
      ta.value = parts.join("\n\n");
    }
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function wireCharacterCard(card) {
    const box = card.querySelector(".god-multi-box");
    const vSel = card.querySelector(".ver-sel");
    if (!box || !vSel) return;
    const onGodChange = () => {
      const ids = getSelectedGodIds(card);
      fillVersionSelect(ids[0] || "", vSel, "");
      syncLockFromRow(card);
    };
    box.addEventListener("change", onGodChange);
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
          <label class="god-label">God theme</label>
          <div class="god-multi-box" role="group" aria-label="God theme — select one or more"></div>
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
    const box = card.querySelector(".god-multi-box");
    const vSel = card.querySelector(".ver-sel");
    const prefIds =
      Array.isArray(preferred?.godIds) && preferred.godIds.length
        ? preferred.godIds
        : preferred?.godId
          ? [String(preferred.godId).trim()].filter(Boolean)
          : [];
    fillGodMultiBox(box, prefIds);
    fillVersionSelect(prefIds[0] || "", vSel, preferred?.versionId || "");
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
    attachTextareaTools(card.querySelector(".lock-ta"));
    refreshRemoveButtons();
  }

  function refreshCharacterControls(preferred) {
    const cards = [...document.querySelectorAll("#character-rows .character-card")];
    if (!cards.length) {
      addCharacterRow(preferred || {});
      return;
    }
    cards.forEach((card, index) => {
      const box = card.querySelector(".god-multi-box");
      const vSel = card.querySelector(".ver-sel");
      if (!box || !vSel) return;
      const oldIds = getSelectedGodIds(card);
      const oldVersion = vSel.value?.trim();
      const prefGodIds =
        index === 0 && Array.isArray(preferred?.godIds) && preferred.godIds.length
          ? preferred.godIds
          : index === 0 && preferred?.godId
            ? [String(preferred.godId).trim()].filter(Boolean)
            : oldIds;
      const nextVersion = index === 0 && preferred?.versionId ? preferred.versionId : oldVersion;
      fillGodMultiBox(box, prefGodIds);
      const firstId = getSelectedGodIds(card)[0] || "";
      fillVersionSelect(firstId, vSel, nextVersion);
      syncLockFromRow(card);
    });
    refreshRemoveButtons();
  }

  function initBackgroundUI() {
    if (bgSelect.dataset.mobileWired === "1") return;
    bgSelect.dataset.mobileWired = "1";
    bgSelect.addEventListener("change", () => {
      onBgChange("");
    });
    bgVersionSelect.addEventListener("change", () => {
      syncBgLock();
    });
    refreshBackgroundControls();
  }

  function refreshBackgroundControls(preferred) {
    const bgs = cat()?.backgrounds?.backgrounds || [];
    const keepBg = String(preferred?.backgroundId || bgSelect.value || "").trim();
    const keepVersion = String(preferred?.versionId || bgVersionSelect.value || "").trim();
    bgSelect.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "None";
    bgSelect.appendChild(ph);
    for (const b of bgs) {
      const o = document.createElement("option");
      o.value = b.id;
      o.textContent = b.label || b.id;
      bgSelect.appendChild(o);
    }
    if (keepBg && [...bgSelect.options].some((o) => o.value === keepBg)) {
      bgSelect.value = keepBg;
    }
    onBgChange(keepVersion);
  }

  function onBgChange(preferredVersionId) {
    const bid = bgSelect.value?.trim();
    const bg = cat()?.backgrounds?.backgrounds?.find((b) => b && b.id === bid);
    bgVersionSelect.replaceChildren();
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "None";
    bgVersionSelect.appendChild(ph);
    if (!bg || !Array.isArray(bg.versions) || !bg.versions.length) {
      bgVersionSelect.disabled = true;
      syncBgLock();
      return;
    }
    bgVersionSelect.disabled = false;
    for (const v of bg.versions) {
      const o = document.createElement("option");
      o.value = v.id;
      o.textContent = v.label || v.id;
      bgVersionSelect.appendChild(o);
    }
    const want = String(preferredVersionId || "").trim();
    if (want && [...bgVersionSelect.options].some((o) => o.value === want)) {
      bgVersionSelect.value = want;
    }
    syncBgLock();
  }

  function syncBgLock() {
    const bid = bgSelect.value?.trim();
    const vid = bgVersionSelect.value?.trim();
    const bg = bid ? cat()?.backgrounds?.backgrounds?.find((b) => b && b.id === bid) : null;
    const ver = bg && vid && Array.isArray(bg.versions) ? bg.versions.find((v) => v && v.id === vid) : null;
    if (!bid || !vid || !ver) {
      if (bgLock) {
        bgLock.value = "";
        bgLock.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return;
    }
    bgLock.value = catalogVersionLock(ver);
    bgLock.dispatchEvent(new Event("input", { bubbles: true }));
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
        persistEditingState();
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
        persistEditingState();
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
      persistEditingState();
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
      persistEditingState();
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
    const out = [];
    for (const card of cards) {
      const godIds = getSelectedGodIds(card);
      const verId = card.querySelector(".ver-sel")?.value?.trim() || "";
      const lockTa = String(card.querySelector(".lock-ta")?.value || "").trim();

      if (godIds.length === 0) {
        if (lockTa) out.push({ label: "Character", videoLock: lockTa });
        continue;
      }

      if (godIds.length === 1) {
        const god = findGod(godIds[0]);
        const ver = god && verId ? findVersion(god, verId) : null;
        if (godIds[0] && !god) continue;
        if (godIds[0] && verId && !ver) continue;
        if (godIds[0] && !verId && !lockTa) continue;
        const catalogLock = ver ? catalogVersionLock(ver) : "";
        const videoLock = lockTa || catalogLock;
        const label = god ? String(god.label || god.id).trim() : "Character";
        out.push({ label, videoLock });
        continue;
      }

      for (const gid of godIds) {
        const god = findGod(gid);
        if (!god) continue;
        const ver = findVersionOrFallback(god, verId);
        const videoLock = ver ? catalogVersionLock(ver) : "";
        const label = String(god.label || god.id).trim();
        if (label) out.push({ label, videoLock });
      }
    }
    return out;
  }

  function collectBackground() {
    const taLock = String(bgLock?.value || "").trim();
    if (!taLock) return null;
    const bid = bgSelect.value?.trim();
    const bg = bid ? cat()?.backgrounds?.backgrounds?.find((b) => b && b.id === bid) : null;
    return {
      id: bg?.id || "",
      label: bg ? String(bg.label || bg.id).trim() : "Setting",
      videoLock: taLock,
    };
  }

  function buildSceneBeatsHelperPrompt() {
    const gods = collectGods();
    const focalGod = gods[0] || null;
    const background = collectBackground();
    const sceneInfo = String(p2SceneInput?.value || "").trim();
    const godName = String(focalGod?.label || "").trim();
    const allFigureNames = gods.map((g) => String(g.label || "").trim()).filter(Boolean);
    const bgName = String(background?.label || "").trim();
    const bgLockText = String(background?.videoLock || "").trim();

    if (!sceneInfo) {
      return [
        "Add basic scene information in Step 2 (Basic scene information), then click Copy Prompt again.",
        "",
        "Example: focal figure strikes rock with a weapon; debris and dust burst outward; wide low-angle framing.",
      ].join("\n");
    }

    return [
      "You are a cinematic prompt writer for short AI video generation.",
      "",
      "OUTPUT LANGUAGE: STRICT ENGLISH ONLY.",
      "- Write only in standard English.",
      "- Do not use Hindi, Sanskrit, Hinglish, or mixed-language lines.",
      "- Keep proper names exactly as provided.",
      "",
      "TASK:",
      "Create output for ONE field only:",
      "Priority scene beats — concise action beats for motion and camera timing. Weave setting, atmosphere, terrain, light, weather, scale, and environment motion into the beats where relevant (do not add a separate environment paragraph).",
      "",
      "HARD RULES (NON-NEGOTIABLE):",
      "- Do NOT describe character appearance, anatomy, clothes, ornaments, face, body, age, skin, or any deity characteristics.",
      "- Assume the character lock already exists elsewhere; do not repeat or infer it.",
      godName
        ? `- Refer to the focal character as "${godName}" by name when the beat involves them—do not swap that name for vague words like "figure", "deity", or "the character".`
        : `- When the scene intent names a focal figure, keep that proper name exactly—do not substitute vague words like "figure" or "the character".`,
      "- Mounts and companions: If the scene intent names another entity (mount, companion, secondary figure, animal, object-as-character), preserve that name and role exactly as given. Never substitute the focal character name for a different named entity—keep each proper name distinct.",
      "- Follow the user's scene intent literally for who does what with whom (seated on, riding, beside, etc.).",
      "- No dialogue, no narration, no subtitles, no on-screen text.",
      "",
      godName
        ? `Selected focal character (first Step 1 row — use this exact name when beats center this figure): ${godName}`
        : "No deity row selected in Step 1 — take all figure names only from the scene intent below.",
      ...(allFigureNames.length > 1
        ? [
            `All locked figures (keep each name distinct in beats — never merge two entities): ${allFigureNames.join(", ")}`,
          ]
        : []),
      bgName ? `Selected background: ${bgName}` : "Selected background: (not selected)",
      bgLockText ? `Background lock/context: ${bgLockText}` : "Background lock/context: (none)",
      "",
      "Scene intent from user:",
      sceneInfo,
      "",
      "FORMAT YOUR RESPONSE EXACTLY AS:",
      "Priority scene beats:",
      "- <beat 1 — clear motion + camera; use proper names from scene intent (focal deity + any named mount/companion)>",
      "- <beat 2>",
      "- <beat 3>",
      "- <beat 4 optional>",
      "",
      allFigureNames.length > 1
        ? "Across the beats as a whole, every locked figure listed above should appear by name where relevant—do not collapse two entities into one name."
        : godName || allFigureNames.length
          ? "Across the beats as a whole, the focal deity should appear by name where they act; any mount/companion named in the scene intent must appear by name where relevant—do not collapse two entities into one name."
          : "Across the beats as a whole, preserve every proper name from the scene intent—do not collapse distinct entities into one name.",
      "Keep beats physically visual and actionable (camera-relevant), short, and coherent for a single short scene.",
      "Return only the section above. No extra commentary.",
    ].join("\n").trim();
  }

  function detectNaturalWorldAmplifications(src) {
    const text = String(src || "").toLowerCase();
    const rules = [];
    if (/river|ocean|sea|lake|waterfall|stream|wave|water|ganga|yamuna|flood|rain|torrent|cascade|tide/.test(text)) {
      rules.push(
        "Water: describe surface tension catching light, spray scattering into vapour, current direction, temperature, sound, and motion."
      );
    }
    if (/wind|breeze|gust|storm|cyclone|gale|cloth|fabric|silk|dhoti|sari|banner|flag|dust|sand/.test(text)) {
      rules.push(
        "Wind: show it through effects on cloth, hair, snow, dust, mist, particles, and directional pressure."
      );
    }
    if (/lightning|thunder|storm|thunderbolt|vajra|trishul|electric|charged|dark cloud|tempest|bolt/.test(text)) {
      rules.push(
        "Lightning/storm: use instantaneous branching light, charged air, delayed thunder, and brief illumination of terrain."
      );
    }
    if (/fire|flame|torch|agni|blaze|ember|spark|flicker|lamp|diya|glow|halo|aura|radiance|golden|corona/.test(text)) {
      rules.push(
        "Fire/radiance: make light breathe, cast moving shadows, and form structured halos or warm gradients instead of saying only 'glowing'."
      );
    }
    if (/mist|fog|cloud|haze|vapor|steam|smoke|incense|vapour/.test(text)) {
      rules.push(
        "Mist/cloud/smoke: describe moving volumes that reveal and hide depth in layered, breathing motion."
      );
    }
    if (/mountain|peak|kailash|himalaya|rock|cliff|boulder|stone|summit|glacier|ice|snow|ridge/.test(text)) {
      rules.push(
        "Mountain/rock/ice: give stone mass, fracture lines, ice facets, scale, altitude cold, and terrain weight."
      );
    }
    if (/forest|tree|jungle|grove|banyan|leaf|vine|flower|blossom|lotus|grass|meadow|petal/.test(text)) {
      rules.push(
        "Vegetation: make leaves, petals, grass, and canopy light feel alive through precise motion and dappled detail."
      );
    }
    if (/sky|stars|moon|sun|cosmos|galaxy|comet|eclipse|dawn|dusk|twilight|horizon|sunset|sunrise/.test(text)) {
      rules.push(
        "Sky/celestial: treat sky as part of the action with horizon light, moon/cloud edges, star depth, and silhouette scale."
      );
    }
    return rules;
  }

  function inferMoodFromBeatsText(text) {
    const t = String(text || "").toLowerCase();
    const found = [];
    if (/meditat|serene|peace|still|calm|quiet|tranquil/.test(t)) found.push("peace / serenity");
    if (/devot|bhakti|prayer|bow|namaste|worship|reverence|humble/.test(t)) found.push("bhakti / devotion");
    if (/wrath|rage|anger|fierce|fury|roar|destroy|battle|strike|war|thunder/.test(t)) {
      found.push("wrath / fierce intensity");
    }
    if (/awe|wonder|majestic|tremble|vast|infinite|cosmic/.test(t)) found.push("awe / majesty");
    if (/bless|grace|compassion|gentle|protect|heal|mercy|tender/.test(t)) found.push("compassion / grace");
    if (/triumph|victory|rise|soar|glory|prevail|ascend/.test(t)) found.push("triumph / uplift");
    if (/joy|danc|celebrat|festiv|sing|laugh|exult/.test(t)) found.push("festive / joyful energy");
    if (/grief|sorrow|mourn|tear|longing|miss|melanchol|ache/.test(t)) found.push("melancholy / longing");
    if (/power|presence|weight|gravity|overwhelm|aura|radiat/.test(t)) found.push("divine power / presence");
    return found.length ? found.join("; ") : "sacred intensity — mythic scale, spiritual weight";
  }

  function buildPriorityBeatsEnhancerPrompt() {
    const priorityRaw = String(document.getElementById("p3-priority")?.value || "").trim();
    if (!priorityRaw) {
      return [
        "Add one or more lines in Priority scene beats, then click Enhance wording again.",
        "",
        "This button copies a ChatGPT prompt that rewrites your beats with strict standard English, stronger cinematic motion, and enhanced natural-world effects.",
      ].join("\n");
    }

    const naturalRules = detectNaturalWorldAmplifications(priorityRaw);
    const moodText = inferMoodFromBeatsText(priorityRaw);
    const lineCount = priorityRaw
      .split(/\n|;/)
      .map((line) => line.trim())
      .filter(Boolean).length;
    const minOut = Math.max(2, lineCount);
    const maxOut = Math.max(4, Math.min(7, lineCount + 2));

    return [
      "You are a cinematic language specialist for AI video-generation prompts.",
      "Rewrite the rough Priority scene beats below into vivid, high-impact, sensory-rich English.",
      "Elevate vocabulary, rhythm, intensity, physical motion, camera clarity, and environmental detail without changing the story, beat sequence, or any entity mentioned.",
      "",
      "OUTPUT LANGUAGE: STRICT ENGLISH ONLY.",
      "- Use clear, natural, standard English.",
      "- Translate any mixed-language descriptive words into English.",
      "- Keep proper names exactly as written in the author beats.",
      "- Do not add Hindi, Sanskrit, or other non-English words for flavour.",
      "",
      "NON-NEGOTIABLE RULES:",
      "- Rewrite ONLY the Priority scene beats.",
      "- Do not add character appearance, clothes, ornaments, face, body, age, skin, or anatomy unless already present in the beats.",
      "- Do not invent new characters, weapons, places, or plot events.",
      "- Preserve every named entity and relationship exactly: rider, mount, companion, object, place, and action ownership.",
      "- Keep the result useful for a short AI video scene: visual, physical, camera-relevant, and actionable.",
      "- No dialogue, no narration, no subtitles, no on-screen text.",
      "",
      `Detected emotional register to amplify: ${moodText}`,
      naturalRules.length ? "Natural-world amplification instructions:" : "Natural-world amplification instructions: use precise sensory motion for environment, light, air, and terrain.",
      ...naturalRules.map((rule) => `- ${rule}`),
      "",
      `Return ${minOut}-${maxOut} polished beats.`,
      "FORMAT:",
      "- <enhanced beat 1>",
      "- <enhanced beat 2>",
      "- <enhanced beat 3>",
      "",
      "AUTHOR BEATS TO REWRITE:",
      priorityRaw,
      "",
      "Reply with only the rewritten bullet beats. No heading, no explanation.",
    ].join("\n").trim();
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

  function openAddGodDialog() {
    const godsDoc = cat()?.gods || { gods: [] };
    const currentCard = selectedCharacterCard();
    const currentGod = getSelectedGodIds(currentCard || null)[0] || "";
    const body = document.createElement("div");
    const mode = makeSelect(
      "dialog-god-mode",
      [
        { value: "version", label: "Add version to existing god" },
        { value: "god", label: "Add new god" },
      ],
      "version"
    );
    const existing = makeSelect(
      "dialog-existing-god",
      (godsDoc.gods || []).map((g) => ({ value: g.id, label: g.label || g.id })),
      currentGod
    );
    const godName = makeInput("dialog-new-god-name", "");
    const versionName = makeInput("dialog-new-god-version", "");
    const prompt = makeTextarea("dialog-new-god-prompt", "", 5);
    const existingWrap = fieldWrap("Existing god", existing);
    const godNameWrap = fieldWrap("New god name or id", godName);
    function syncAddGodDialogFields() {
      const isNewGod = mode.value === "god";
      existingWrap.hidden = isNewGod;
      godNameWrap.hidden = !isNewGod;
    }
    mode.addEventListener("change", syncAddGodDialogFields);
    body.appendChild(fieldWrap("Action", mode));
    body.appendChild(existingWrap);
    body.appendChild(godNameWrap);
    body.appendChild(fieldWrap("Version name or id", versionName));
    body.appendChild(fieldWrap("Video lock", prompt));
    syncAddGodDialogFields();
    openDialog("Add God or Version", body, () => {
      const doc = cloneJson(godsDoc);
      if (!Array.isArray(doc.gods)) doc.gods = [];
      const promptText = prompt.value.trim();
      const versionRaw = versionName.value.trim();
      if (!versionRaw) throw new Error("Enter a version name or id.");
      const versionId = uniqueId(versionRaw, (id) => {
        const targetGod = mode.value === "god" ? null : doc.gods.find((g) => g.id === existing.value);
        return !!targetGod?.versions?.some((v) => v.id === id);
      });
      const version = {
        id: versionId,
        label: versionRaw,
        videoLock: promptText,
      };
      let godId = "";
      if (mode.value === "god") {
        const godRaw = godName.value.trim();
        if (!godRaw) throw new Error("Enter a new god name or id.");
        godId = uniqueId(godRaw, (id) => doc.gods.some((g) => g.id === id));
        doc.gods.push({ id: godId, label: godRaw, versions: [version] });
      } else {
        godId = existing.value.trim();
        const god = doc.gods.find((g) => g.id === godId);
        if (!god) throw new Error("Select an existing god.");
        if (!Array.isArray(god.versions)) god.versions = [];
        if (god.versions.some((v) => v.id === versionId)) throw new Error("Version id already exists.");
        god.versions.push(version);
      }
      saveGodsDoc(doc);
      refreshCharacterControls({ godIds: [godId], versionId });
      showToast("God JSON saved locally");
    });
  }

  function updateSelectedGodVersion() {
    const cards = [...document.querySelectorAll("#character-rows .character-card")];
    const updates = [];
    for (const card of cards) {
      const godIds = getSelectedGodIds(card);
      const versionId = card.querySelector(".ver-sel")?.value?.trim();
      const text = card.querySelector(".lock-ta")?.value?.trim() || "";
      for (const godId of godIds) {
        if (godId && versionId) updates.push({ godId, versionId, text });
      }
    }
    if (!updates.length) return;
    const doc = cloneJson(cat()?.gods || { gods: [] });
    let saved = 0;
    for (const row of updates) {
      const god = doc.gods?.find((g) => g.id === row.godId);
      const version = god?.versions?.find((v) => v.id === row.versionId);
      if (!version) continue;
      version.videoLock = row.text;
      delete version.characterBrief;
      saved += 1;
    }
    if (!saved) {
      showToast("Version not found");
      return;
    }
    saveGodsDoc(doc);
    refreshCharacterControls();
    showToast(`${saved} god version(s) updated locally`);
  }

  function openDeleteGodDialog() {
    const godsDoc = cat()?.gods || { gods: [] };
    const currentGod = getSelectedGodIds(selectedCharacterCard() || null)[0] || "";
    const body = document.createElement("div");
    const mode = makeSelect(
      "dialog-delete-god-mode",
      [
        { value: "version", label: "Delete selected version" },
        { value: "god", label: "Delete entire god" },
      ],
      "version"
    );
    const godSelect = makeSelect(
      "dialog-delete-god",
      (godsDoc.gods || []).map((g) => ({ value: g.id, label: g.label || g.id })),
      currentGod
    );
    const versionSelect = makeSelect("dialog-delete-god-version", [], "");
    function fillVersions() {
      const god = (godsDoc.gods || []).find((g) => g.id === godSelect.value);
      versionSelect.replaceChildren();
      for (const v of god?.versions || []) {
        const o = document.createElement("option");
        o.value = v.id;
        o.textContent = v.label || v.id;
        versionSelect.appendChild(o);
      }
    }
    godSelect.addEventListener("change", fillVersions);
    fillVersions();
    body.appendChild(fieldWrap("Delete", mode));
    body.appendChild(fieldWrap("God", godSelect));
    body.appendChild(fieldWrap("Version", versionSelect));
    openDialog("Delete God or Version", body, () => {
      const doc = cloneJson(godsDoc);
      const godId = godSelect.value.trim();
      if (!godId) throw new Error("Select a god.");
      if (mode.value === "god") {
        if (!confirm(`Delete god "${godId}" and all versions?`)) return;
        doc.gods = (doc.gods || []).filter((g) => g.id !== godId);
      } else {
        const versionId = versionSelect.value.trim();
        if (!versionId) throw new Error("Select a version.");
        if (!confirm(`Delete version "${versionId}" under "${godId}"?`)) return;
        const god = doc.gods.find((g) => g.id === godId);
        god.versions = (god.versions || []).filter((v) => v.id !== versionId);
        if (!god.versions.length) doc.gods = doc.gods.filter((g) => g.id !== godId);
      }
      saveGodsDoc(doc);
      refreshCharacterControls();
      showToast("God JSON saved locally");
    }, "Delete");
  }

  function openAddBackgroundDialog() {
    const bgDoc = cat()?.backgrounds || { backgrounds: [] };
    const body = document.createElement("div");
    const mode = makeSelect(
      "dialog-bg-mode",
      [
        { value: "version", label: "Add version to existing background" },
        { value: "background", label: "Add new background" },
      ],
      "version"
    );
    const existing = makeSelect(
      "dialog-existing-bg",
      (bgDoc.backgrounds || []).map((b) => ({ value: b.id, label: b.label || b.id })),
      bgSelect.value
    );
    const bgName = makeInput("dialog-new-bg-name", "");
    const versionName = makeInput("dialog-new-bg-version", "");
    const prompt = makeTextarea("dialog-new-bg-prompt", "", 5);
    body.appendChild(fieldWrap("Action", mode));
    body.appendChild(fieldWrap("Existing background", existing));
    body.appendChild(fieldWrap("New background name or id", bgName));
    body.appendChild(fieldWrap("Version name or id", versionName));
    body.appendChild(fieldWrap("Background lock", prompt));
    openDialog("Add Background or Version", body, () => {
      const doc = cloneJson(bgDoc);
      if (!Array.isArray(doc.backgrounds)) doc.backgrounds = [];
      const promptText = prompt.value.trim();
      const versionRaw = versionName.value.trim();
      if (!versionRaw) throw new Error("Enter a version name or id.");
      const versionId = uniqueId(versionRaw, (id) => {
        const targetBg = mode.value === "background" ? null : doc.backgrounds.find((b) => b.id === existing.value);
        return !!targetBg?.versions?.some((v) => v.id === id);
      });
      const version = {
        id: versionId,
        label: versionRaw,
        videoLock: promptText,
      };
      let backgroundId = "";
      if (mode.value === "background") {
        const bgRaw = bgName.value.trim();
        if (!bgRaw) throw new Error("Enter a new background name or id.");
        backgroundId = uniqueId(bgRaw, (id) => doc.backgrounds.some((b) => b.id === id));
        doc.backgrounds.push({ id: backgroundId, label: bgRaw, versions: [version] });
      } else {
        backgroundId = existing.value.trim();
        const bg = doc.backgrounds.find((b) => b.id === backgroundId);
        if (!bg) throw new Error("Select an existing background.");
        if (!Array.isArray(bg.versions)) bg.versions = [];
        bg.versions.push(version);
      }
      saveBackgroundsDoc(doc);
      refreshBackgroundControls({ backgroundId, versionId });
      showToast("Background JSON saved locally");
    });
  }

  function updateSelectedBackgroundVersion() {
    const backgroundId = bgSelect.value?.trim();
    const versionId = bgVersionSelect.value?.trim();
    const text = bgLock.value?.trim() || "";
    if (!backgroundId || !versionId) return;
    const doc = cloneJson(cat()?.backgrounds || { backgrounds: [] });
    const bg = doc.backgrounds?.find((b) => b.id === backgroundId);
    const version = bg?.versions?.find((v) => v.id === versionId);
    if (!version) {
      showToast("Version not found");
      return;
    }
    version.videoLock = text;
    delete version.characterBrief;
    saveBackgroundsDoc(doc);
    refreshBackgroundControls({ backgroundId, versionId });
    showToast("Background version updated locally");
  }

  function openDeleteBackgroundDialog() {
    const bgDoc = cat()?.backgrounds || { backgrounds: [] };
    const body = document.createElement("div");
    const mode = makeSelect(
      "dialog-delete-bg-mode",
      [
        { value: "version", label: "Delete selected version" },
        { value: "background", label: "Delete entire background" },
      ],
      "version"
    );
    const bgChoice = makeSelect(
      "dialog-delete-bg",
      (bgDoc.backgrounds || []).map((b) => ({ value: b.id, label: b.label || b.id })),
      bgSelect.value
    );
    const versionChoice = makeSelect("dialog-delete-bg-version", [], "");
    function fillVersions() {
      const bg = (bgDoc.backgrounds || []).find((b) => b.id === bgChoice.value);
      versionChoice.replaceChildren();
      for (const v of bg?.versions || []) {
        const o = document.createElement("option");
        o.value = v.id;
        o.textContent = v.label || v.id;
        versionChoice.appendChild(o);
      }
    }
    bgChoice.addEventListener("change", fillVersions);
    fillVersions();
    body.appendChild(fieldWrap("Delete", mode));
    body.appendChild(fieldWrap("Background", bgChoice));
    body.appendChild(fieldWrap("Version", versionChoice));
    openDialog("Delete Background or Version", body, () => {
      const doc = cloneJson(bgDoc);
      const backgroundId = bgChoice.value.trim();
      if (!backgroundId) throw new Error("Select a background.");
      if (mode.value === "background") {
        if (!confirm(`Delete background "${backgroundId}" and all versions?`)) return;
        doc.backgrounds = (doc.backgrounds || []).filter((b) => b.id !== backgroundId);
      } else {
        const versionId = versionChoice.value.trim();
        if (!versionId) throw new Error("Select a version.");
        if (!confirm(`Delete version "${versionId}" under "${backgroundId}"?`)) return;
        const bg = doc.backgrounds.find((b) => b.id === backgroundId);
        bg.versions = (bg.versions || []).filter((v) => v.id !== versionId);
        if (!bg.versions.length) doc.backgrounds = doc.backgrounds.filter((b) => b.id !== backgroundId);
      }
      saveBackgroundsDoc(doc);
      refreshBackgroundControls();
      showToast("Background JSON saved locally");
    }, "Delete");
  }

  function openAddBeatsDialog() {
    const currentText = document.getElementById("p3-priority")?.value?.trim() || "";
    const body = document.createElement("div");
    const label = makeInput("dialog-beats-label", "");
    const text = makeTextarea("dialog-beats-text", currentText, 5);
    const quick = makeCheckbox("dialog-beats-quick", "Show as quick button", false);
    body.appendChild(fieldWrap("Preset label", label));
    body.appendChild(fieldWrap("Scene beats text", text));
    body.appendChild(quick);
    openDialog("Add Scene Beats", body, () => {
      const doc = { presets: cloneJson(window.MythologyMobilePriorityPresets || []) };
      const labelText = label.value.trim();
      const beatText = text.value.trim();
      if (!labelText) throw new Error("Enter a preset label.");
      if (!beatText) throw new Error("Enter scene beats text.");
      const id = uniqueId(`psb_${labelText}`, (x) => doc.presets.some((p) => p.id === x));
      const preset = { id, label: labelText, text: beatText };
      if (document.getElementById("dialog-beats-quick")?.checked) preset.quickFill = true;
      doc.presets.push(preset);
      savePriorityDoc(doc);
      populatePriorityPresets(id);
      showToast("Beats JSON saved locally");
    });
  }

  function updateSelectedBeatsPreset() {
    const sel = document.getElementById("priority-saved-select");
    const id = sel?.value?.trim();
    const text = document.getElementById("p3-priority")?.value?.trim() || "";
    if (!id) {
      showToast("Select a saved preset");
      return;
    }
    if (!text) {
      showToast("Enter scene beats text");
      return;
    }
    const doc = { presets: cloneJson(window.MythologyMobilePriorityPresets || []) };
    const preset = doc.presets.find((p) => p.id === id);
    if (!preset) {
      showToast("Preset not found");
      return;
    }
    preset.text = text;
    savePriorityDoc(doc);
    populatePriorityPresets(id);
    showToast("Beats preset updated locally");
  }

  function deleteSelectedBeatsPreset() {
    const sel = document.getElementById("priority-saved-select");
    const id = sel?.value?.trim();
    if (!id) {
      showToast("Select a saved preset");
      return;
    }
    if (!confirm(`Delete scene beats preset "${id}"?`)) return;
    const doc = { presets: cloneJson(window.MythologyMobilePriorityPresets || []).filter((p) => p.id !== id) };
    savePriorityDoc(doc);
    populatePriorityPresets();
    const ta = document.getElementById("p3-priority");
    if (ta) ta.value = "";
    showToast("Beats JSON saved locally");
  }

  function resetDoc(kind) {
    if (!confirm("Reset local changes and reload the checked-in JSON for this section?")) return;
    if (kind === "gods") {
      localStorage.removeItem(STORAGE_KEYS.gods);
      window.MythologyMobileCatalog.gods = cloneJson(baseGodsDoc);
      refreshCharacterControls();
      showToast("Gods reset");
    } else if (kind === "backgrounds") {
      localStorage.removeItem(STORAGE_KEYS.backgrounds);
      window.MythologyMobileCatalog.backgrounds = cloneJson(baseBackgroundsDoc);
      refreshBackgroundControls();
      showToast("Backgrounds reset");
    } else if (kind === "beats") {
      localStorage.removeItem(STORAGE_KEYS.priorityBeats);
      window.MythologyMobilePriorityPresets = cloneJson(basePriorityDoc).presets || [];
      populatePriorityPresets();
      showToast("Beats reset");
    } else if (kind === "state") {
      localStorage.removeItem(STORAGE_KEYS.editingState);
      activeEditingStateDoc = normalizeEditingState(baseEditingStateDoc);
      applyEditingState();
      showToast("Editing state reset");
    }
  }

  function restartAppToDefaults() {
    if (!confirm("Remove all localStorage edits for this app, including catalogs, presets, and editing state?")) return;
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  }

  function resetOnlyEditingState() {
    if (!confirm("Clear only local editing state and reload default EditingState.json?")) return;
    localStorage.removeItem(STORAGE_KEYS.editingState);
    window.location.reload();
  }

  document.getElementById("copy-p1")?.addEventListener("click", async () => {
    if (!eng()) return;
    const gods = collectGods();
    const raw = eng().buildPrompt1(gods);
    const text = applyGodNameReplacements(raw, gods);
    const ok = await copyText(text);
    showToast(ok ? "Copied" : "Copy failed");
  });

  document.getElementById("copy-scene-helper")?.addEventListener("click", async () => {
    const text = buildSceneBeatsHelperPrompt();
    const ok = await copyText(text);
    showToast(ok ? "Helper prompt copied" : "Copy failed");
  });

  document.getElementById("copy-p2")?.addEventListener("click", async () => {
    if (!eng()) return;
    const gods = collectGods();
    const bg = collectBackground();
    const raw = eng().buildPrompt2(bg);
    const text = applyGodNameReplacements(raw, gods);
    const ok = await copyText(text);
    showToast(ok ? "Copied" : "Copy failed");
  });

  document.getElementById("copy-p3")?.addEventListener("click", async () => {
    if (!eng()) return;
    const gods = collectGods();
    const raw = eng().buildPrompt3Merged(buildP3State());
    const text = applyGodNameReplacements(raw, gods);
    const ok = await copyText(text);
    showToast(ok ? "Copied" : "Copy failed");
  });

  document.getElementById("restart-app-btn")?.addEventListener("click", restartAppToDefaults);
  document.getElementById("reset-editing-state-top-btn")?.addEventListener("click", resetOnlyEditingState);

  document.getElementById("catalog-dialog-close")?.addEventListener("click", closeDialog);
  document.getElementById("catalog-dialog-cancel")?.addEventListener("click", closeDialog);
  catalogDialog?.addEventListener("cancel", () => {
    activeDialogSave = null;
    setDialogError("");
  });
  catalogDialogSave?.addEventListener("click", () => {
    if (!activeDialogSave) return;
    try {
      activeDialogSave();
      closeDialog();
    } catch (e) {
      setDialogError(e instanceof Error ? e.message : String(e));
    }
  });

  document.getElementById("god-add-btn")?.addEventListener("click", openAddGodDialog);
  document.getElementById("god-update-btn")?.addEventListener("click", updateSelectedGodVersion);
  document.getElementById("god-delete-btn")?.addEventListener("click", openDeleteGodDialog);
  document.getElementById("god-export-btn")?.addEventListener("click", () => {
    downloadJson("godCharacter.json", cat()?.gods || { gods: [] });
  });
  document.getElementById("god-copy-json-btn")?.addEventListener("click", () => {
    void copyJsonDoc(cat()?.gods || { gods: [] });
  });
  document.getElementById("god-reset-btn")?.addEventListener("click", () => resetDoc("gods"));

  document.getElementById("bg-add-btn")?.addEventListener("click", openAddBackgroundDialog);
  document.getElementById("bg-update-btn")?.addEventListener("click", updateSelectedBackgroundVersion);
  document.getElementById("bg-delete-btn")?.addEventListener("click", openDeleteBackgroundDialog);
  document.getElementById("bg-export-btn")?.addEventListener("click", () => {
    downloadJson("backgroundCharacter.json", cat()?.backgrounds || { backgrounds: [] });
  });
  document.getElementById("bg-copy-json-btn")?.addEventListener("click", () => {
    void copyJsonDoc(cat()?.backgrounds || { backgrounds: [] });
  });
  document.getElementById("bg-reset-btn")?.addEventListener("click", () => resetDoc("backgrounds"));

  document.getElementById("beats-add-btn")?.addEventListener("click", openAddBeatsDialog);
  document.getElementById("beats-enhance-btn")?.addEventListener("click", async () => {
    const text = buildPriorityBeatsEnhancerPrompt();
    const ok = await copyText(text);
    showToast(ok ? "Enhancer prompt copied" : "Copy failed");
  });
  document.getElementById("beats-update-btn")?.addEventListener("click", updateSelectedBeatsPreset);
  document.getElementById("beats-delete-btn")?.addEventListener("click", deleteSelectedBeatsPreset);
  document.getElementById("beats-export-btn")?.addEventListener("click", () => {
    downloadJson("prioritySceneBeats.json", { presets: window.MythologyMobilePriorityPresets || [] });
  });
  document.getElementById("beats-copy-json-btn")?.addEventListener("click", () => {
    void copyJsonDoc({ presets: window.MythologyMobilePriorityPresets || [] });
  });
  document.getElementById("beats-reset-btn")?.addEventListener("click", () => resetDoc("beats"));
  document.getElementById("state-export-btn")?.addEventListener("click", () => {
    downloadJson("EditingState.json", activeEditingStateDoc || normalizeEditingState(baseEditingStateDoc));
  });
  document.getElementById("state-copy-json-btn")?.addEventListener("click", () => {
    void copyJsonDoc(activeEditingStateDoc || normalizeEditingState(baseEditingStateDoc));
  });
  document.getElementById("state-reset-btn")?.addEventListener("click", () => resetDoc("state"));

  btnAddChar?.addEventListener("click", () => {
    addCharacterRow({});
    persistEditingState();
  });

  async function loadCatalogs() {
    const fb = window.MythologyMobileCatalogFallback;
    const embedded = window.MythologyMobileEmbeddedCatalog || {};
    let godsDoc =
      embedded.gods && Array.isArray(embedded.gods.gods) ? cloneJson(embedded.gods) : cloneJson(fb.gods);
    let bgDoc =
      embedded.backgrounds && Array.isArray(embedded.backgrounds.backgrounds)
        ? cloneJson(embedded.backgrounds)
        : cloneJson(fb.backgrounds);
    let videoStyleDoc =
      embedded.videoStyle && Array.isArray(embedded.videoStyle.mainStyles)
        ? cloneJson(embedded.videoStyle)
        : cloneJson(window.MythologyMobileDefaultVideoStyle);
    let editingStateDoc = normalizeEditingState(embedded.editingState || null);
    let priorityPresets =
      embedded.priorityBeats && Array.isArray(embedded.priorityBeats.presets)
        ? cloneJson(embedded.priorityBeats.presets)
        : [];
    try {
      const [gRes, bRes, pRes, vRes, eRes] = await Promise.all([
        fetch("godCharacter.json", { cache: "no-store" }),
        fetch("backgroundCharacter.json", { cache: "no-store" }),
        fetch("prioritySceneBeats.json", { cache: "no-store" }),
        fetch("VideoStyle.json", { cache: "no-store" }),
        fetch("EditingState.json", { cache: "no-store" }),
      ]);
      const g = await gRes.json().catch(() => null);
      const b = await bRes.json().catch(() => null);
      const p = await pRes.json().catch(() => null);
      const v = await vRes.json().catch(() => null);
      const e = await eRes.json().catch(() => null);
      if (g && typeof g === "object" && Array.isArray(g.gods)) godsDoc = g;
      if (b && typeof b === "object" && Array.isArray(b.backgrounds)) bgDoc = b;
      if (p && typeof p === "object" && Array.isArray(p.presets)) priorityPresets = p.presets;
      if (v && typeof v === "object" && Array.isArray(v.mainStyles)) videoStyleDoc = v;
      if (e && typeof e === "object" && e.fields && typeof e.fields === "object") {
        editingStateDoc = normalizeEditingState(e);
      }
    } catch (e) {
      console.warn("Mythology mobile: catalog JSON fetch failed, using fallback.", e);
    }
    baseGodsDoc = cloneJson(godsDoc);
    baseBackgroundsDoc = cloneJson(bgDoc);
    basePriorityDoc = { presets: cloneJson(priorityPresets) };
    baseEditingStateDoc = normalizeEditingState(editingStateDoc);
    activeEditingStateDoc = readEditingState(baseEditingStateDoc);
    const storedGodsDoc = readStoredDoc(STORAGE_KEYS.gods, (doc) => doc && Array.isArray(doc.gods), godsDoc);
    const storedBgDoc = readStoredDoc(
      STORAGE_KEYS.backgrounds,
      (doc) => doc && Array.isArray(doc.backgrounds),
      bgDoc
    );
    const storedPriorityDoc = readStoredDoc(
      STORAGE_KEYS.priorityBeats,
      (doc) => doc && Array.isArray(doc.presets),
      { presets: priorityPresets }
    );
    godsDoc = mergeVersionedCatalog(godsDoc, storedGodsDoc, "gods");
    bgDoc = mergeVersionedCatalog(bgDoc, storedBgDoc, "backgrounds");
    priorityPresets = mergePriorityCatalog({ presets: priorityPresets }, storedPriorityDoc).presets;
    window.MythologyMobileCatalog = {
      gods: godsDoc,
      backgrounds: bgDoc,
      videoStyle: videoStyleDoc,
    };
    window.MythologyMobilePriorityPresets = priorityPresets;
    try {
      saveStoredDoc(STORAGE_KEYS.gods, godsDoc);
      saveStoredDoc(STORAGE_KEYS.backgrounds, bgDoc);
      saveStoredDoc(STORAGE_KEYS.priorityBeats, { presets: priorityPresets });
    } catch (err) {
      console.warn("Mythology mobile: could not cache catalogs to localStorage.", err);
    }
  }

  function populatePriorityPresets(preferredId) {
    const sel = document.getElementById("priority-saved-select");
    if (!sel) return;
    const keep = String(preferredId || sel.value || "").trim();
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
    if (keep && [...sel.options].some((o) => o.value === keep)) {
      sel.value = keep;
    }
    renderPriorityExampleButtons();
  }

  function renderPriorityExampleButtons() {
    const row = document.getElementById("priority-examples-row");
    const ta = document.getElementById("p3-priority");
    if (!row) return;
    row.replaceChildren();
    for (const pr of window.MythologyMobilePriorityPresets || []) {
      if (!pr || !pr.quickFill) continue;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-example";
      btn.textContent = String(pr.label || "Example");
      btn.title = String(pr.text || "");
      btn.addEventListener("click", () => {
        if (ta) ta.value = String(pr.text || "");
        persistEditingState();
      });
      row.appendChild(btn);
    }
  }

  function wirePriorityControlsOnce() {
    const sel = document.getElementById("priority-saved-select");
    const ta = document.getElementById("p3-priority");
    if (sel && sel.dataset.mobileWired !== "1") {
      sel.dataset.mobileWired = "1";
      sel.addEventListener("change", () => {
        const id = String(sel.value || "").trim();
        if (!id || !ta) return;
        const p = (window.MythologyMobilePriorityPresets || []).find((x) => x && String(x.id) === id);
        if (p) ta.value = String(p.text || "");
        persistEditingState();
      });
    }
  }

  function init() {
    if (!cat() || !eng()) {
      showToast("Missing scripts");
      return;
    }
    rowsHost.replaceChildren();
    addCharacterRow({});
    initBackgroundUI();
    initChips();
    fillVideoStyle();
    populatePriorityPresets();
    wirePriorityControlsOnce();
    applyEditingState();
    wireEditingStateAutosave();
    wireMainPageTextareas();
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
