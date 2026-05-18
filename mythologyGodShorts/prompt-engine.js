/**
 * Standalone prompt builders for mobile God Shorts UI.
 * Logic aligned with desktop mythology God Shorts prompt-builder (no shared imports).
 */
(function () {
  const PROMPT3_SCENE_EXPAND = {
    performance: {
      standing_calm:
        "Performance: standing calm with subtle breathing; minimal motion—no busy choreography.",
      slow_ritual:
        "Performance: slow ritual motion—mudras or gentle hand movement; eyes may be soft or half-closed.",
      slow_walk:
        "Performance: slow walking—clear direction along the ground plane (toward camera or along path); grounded and deliberate.",
      meditating:
        "Performance: meditating—seated or standing still; inward focus; almost no locomotion.",
      blessing_gesture:
        "Performance: blessing or abhaya-style gesture—one clear hand movement then hold; readable silhouette.",
      running_striding:
        "Performance: running or striding—energetic forward motion; keep readable and controlled for a short clip.",
      hero_stance:
        "Performance: heroic still stance—strong pose; optional subtle wind in fabric; no frantic motion.",
    },
    camera: {
      default_framing:
        "Camera: **default / natural readable framing** — choose a single balanced coverage that serves **priority scene beats** and locks (typical feel: eye level or mild three-quarter, medium or modest wide as the action needs). **Do not** force bird’s-eye, extreme miniature figure-in-frame, or macro face/hands **unless beats or locks explicitly require it**. Keep figure and environment **clear and proportionate** for a short clip; no specialized lens grammar beyond what the story demands.",
      full_body_front:
        "Camera: full-length figure, eye level, facing the camera—simple frontal readability.",
      wide_establishing:
        "Camera: wide establishing shot—figure smaller in frame; environment and scale readable.",
      waist_up: "Camera: waist-up medium shot—balance of face and costume.",
      close_face_hands:
        "Camera: close on face and hands—intimate; preserve jewelry and gesture clarity.",
      low_angle: "Camera: slight low angle—modest heroic lift; avoid extreme distortion.",
      high_angle: "Camera: slight high angle—looking down a little; calm or distant mood.",
      static_tripod:
        "Camera: static tripod feel—no handheld shake; no orbit or whip pan.",
      slow_push_in:
        "Camera: slow push-in—subtle zoom toward subject only; no fast zoom.",
      slow_drift_pan:
        "Camera: slow drift or pan—minimal lateral movement; smooth and restrained.",
      aerial_top_zoom_10:
        "Camera: drone / aerial—**top view** (near-vertical bird’s-eye, straight down); subject scale **~zoom 10%** vs a normal full-length framing—the figure fills only about **5–10%** of the frame; vast landscape or set dominant; character still visible as a small readable silhouette or form; slow drift or static tripod feel only—no whip pan, no aggressive dive.",
      aerial_top_zoom_25:
        "Camera: drone / aerial—**top view** (bird’s-eye); subject scale **~zoom 25%**—about **four times farther** in feel than a normal full-length shot (figure small but clearer than 10%); wide environment readable; stable or very slow lateral drift.",
      aerial_25deg_from_top_zoom_25:
        "Camera: drone / aerial—sightline **25° from vertical** (mostly from above, slight oblique); subject scale **~zoom 25%**—very wide; figure small; terrain, sky, and scale of place lead the frame; gentle parallax acceptable; no close facial detail.",
      aerial_25deg_from_top_zoom_50:
        "Camera: drone / aerial—sightline **25° from vertical** (steep high angle); subject scale **~zoom 50%**—half the apparent size of a normal full-length framing; environment still large; deity readable with costume massing, not macro face detail.",
      aerial_50deg_from_top_zoom_50:
        "Camera: drone / aerial—sightline **50° from vertical** (classic high **oblique** / three-quarter-from-above drone grammar); subject scale **~zoom 50%**; horizon and depth cues natural; figure clearly placed in the world without filling the frame.",
    },
    atmosphere: {
      soft_daylight:
        "Atmosphere: soft daylight—open air; gentle shadows; natural color.",
      golden_hour:
        "Atmosphere: golden hour—warm rim light; long soft shadows; nostalgic calm.",
      overcast_soft:
        "Atmosphere: overcast / soft—diffused even light; low contrast; gentle mood.",
      moonlit_night:
        "Atmosphere: moonlit night—cool ambient; stars optional; quiet stillness.",
      mist_fog:
        "Atmosphere: mist or fog—layered depth; soft silhouettes; serene mystery.",
      harsh_sun:
        "Atmosphere: clear harsh sun—strong shadows and contrast; bold sculpting light.",
      high_altitude_crisp:
        "Atmosphere: crisp high-altitude light—thin cold air; sharp clarity (mountain / sky scale).",
    },
    constraints: {
      single_action:
        "Constraints: one primary action only—do not stack unrelated beats in the same shot.",
      no_subtitles: "Constraints: no subtitles, captions, or on-screen text.",
      no_dialogue:
        "Constraints: no spoken dialogue or narration in the video track.",
      match_locks:
        "Constraints: must stay faithful to the character and setting locks below—no contradictions.",
      one_figure_only:
        "Constraints: only one figure in frame—no crowds or extra characters.",
      wardrobe_consistency:
        "Constraints: wardrobe, jewelry, and palette must stay consistent with the character lock.",
      short_single_beat:
        "Constraints: one clear intent suitable for a short clip (about 5–15 seconds of screen time).",
    },
  };

  const PROMPT3_VERBATIM_QUALIFIER_RULES = [
    "- **Verbatim hard limits:** In the **character lock** and **priority scene beats**, any wording that sets identity, counts, or negatives — including **strictly**, **exactly**, **only one**, **no second**, **never**, **must not** — must appear **word-for-word** in your answer wherever that detail applies. Do **not** drop or replace those words for smoother prose.",
    "- **Examples:** *strictly single moon* stays *strictly single moon* (not merely *a single moon*); *exactly one serpent* stays *exactly one serpent*.",
  ];

  const PROMPT3_MULTI_FIGURE_SEPARATION_RULES = [
    "=== SEPARATE FIGURES — NO MERGE / NO FUSION (when multiple character locks) ===",
    "These are **distinct characters** in one shot. They are **not** one hybrid creature and **not** a single fused body.",
    "- **Trait ownership is strict:** each lock's attributes belong only to that named figure. Keep ornaments, anatomy, markings, weapons, and facial traits attached to their original owner.",
    "- **Forbidden trait transfer:** do **not** copy one figure's defining traits onto another figure (example: a deity's third eye, ash markings, trident, serpent, or crown must not appear on a mount/companion unless that second lock explicitly includes it).",
    "- **Forbidden:** merging, blending, or fusing two figures; **one character’s hands, arms, face, or torso growing from, attached to, or replacing part of another’s body**; hybrid anatomy (e.g. human-form limbs emerging from a mount’s body or vice versa).",
    "- **Forbidden:** reassigning jewellery, skin, or props from one lock to another character’s body unless **priority scene beats** explicitly require it.",
    "- **Required:** each named figure has a **complete, separate** body and **correct species and proportions** per that figure’s lock (e.g. human-form deity vs. bovine — each keeps its own limbs, head, and scale).",
    "- **Interaction is allowed** (standing beside, blessing toward, hand on shoulder, rider and mount) as **two or more separate bodies** in contact or close frame—**not** anatomically merged.",
    "- Describe **readable silhouette separation** when framing allows: **clear** distinct entities, not an ambiguous fused mass.",
    "",
  ];

  /** @type {{ id: string, label: string, imagePct: number, videoPct: number, sort: number }[]} */
  const PROMPT3_CAMERA_OPTIONS = [
    { id: "default_framing", label: "Default framing — balanced readable shot from beats & locks", imagePct: 92, videoPct: 90, sort: 1 },
    { id: "full_body_front", label: "Full body, eye level, facing camera", imagePct: 95, videoPct: 92, sort: 2 },
    { id: "wide_establishing", label: "Wide establishing — figure smaller; environment readable", imagePct: 88, videoPct: 90, sort: 3 },
    { id: "waist_up", label: "Waist-up — medium shot", imagePct: 90, videoPct: 88, sort: 4 },
    { id: "close_face_hands", label: "Close — face and hands", imagePct: 93, videoPct: 75, sort: 5 },
    { id: "low_angle", label: "Low angle — slight heroic lift", imagePct: 88, videoPct: 85, sort: 6 },
    { id: "aerial_50deg_from_top_zoom_50", label: "50° from top — zoom 50% (classic drone oblique)", imagePct: 82, videoPct: 88, sort: 7 },
    { id: "aerial_25deg_from_top_zoom_50", label: "25° from top — zoom 50% (steep down, medium-wide)", imagePct: 80, videoPct: 85, sort: 8 },
    { id: "aerial_top_zoom_25", label: "Top view — zoom 25% (~4× farther than normal full-length)", imagePct: 72, videoPct: 80, sort: 9 },
    { id: "aerial_25deg_from_top_zoom_25", label: "25° from top — zoom 25% (steep down, very wide)", imagePct: 70, videoPct: 78, sort: 10 },
    { id: "high_angle", label: "High angle — slight downward view", imagePct: 65, videoPct: 68, sort: 11 },
    { id: "aerial_top_zoom_10", label: "Top view — zoom 10% (figure ~5–10% of frame; bird’s-eye)", imagePct: 78, videoPct: 45, sort: 1 },
    { id: "slow_push_in", label: "Slow push-in — subtle zoom toward subject", imagePct: 40, videoPct: 90, sort: 1 },
    { id: "slow_drift_pan", label: "Slow drift / pan — minimal lateral move", imagePct: 38, videoPct: 88, sort: 2 },
    { id: "static_tripod", label: "Static camera — tripod feel; no travel", imagePct: 35, videoPct: 75, sort: 3 },
  ];

  function cameraUsageScoreLabel(opt) {
    const i = Math.max(0, Math.min(100, Number(opt.imagePct) || 0));
    const v = Math.max(0, Math.min(100, Number(opt.videoPct) || 0));
    return `I: ${i}%, V: ${v}%`;
  }

  function cameraSortTier(opt) {
    const i = opt.imagePct;
    const v = opt.videoPct;
    const minBoth = Math.min(i, v);
    if (minBoth >= 55) return 0;
    if (i >= 55 && i >= v + 10) return 1;
    if (v >= 55 && v >= i + 10) return 2;
    return 3;
  }

  function sortCameraOptions(list) {
    return [...list].sort((a, b) => {
      const ta = cameraSortTier(a);
      const tb = cameraSortTier(b);
      if (ta !== tb) return ta - tb;
      const minA = Math.min(a.imagePct, a.videoPct);
      const minB = Math.min(b.imagePct, b.videoPct);
      if (minB !== minA) return minB - minA;
      const avgA = (a.imagePct + a.videoPct) / 2;
      const avgB = (b.imagePct + b.videoPct) / 2;
      if (avgB !== avgA) return avgB - avgA;
      return a.sort - b.sort;
    });
  }

  const PROMPT3_CAMERA_OPTIONS_SORTED = sortCameraOptions(PROMPT3_CAMERA_OPTIONS);

  const PROMPT3_CAMERA_BY_ID = Object.fromEntries(PROMPT3_CAMERA_OPTIONS.map((o) => [o.id, o]));

  const PROMPT3_CAMERA_OPTION_LABELS = Object.fromEntries(
    PROMPT3_CAMERA_OPTIONS_SORTED.map((o) => [o.id, `${o.label} · ${cameraUsageScoreLabel(o)}`])
  );

  function cameraPromptTitle(cameraId) {
    const o = PROMPT3_CAMERA_BY_ID[cameraId];
    return o ? o.label : String(cameraId || "");
  }

  const PROMPT3_MOOD_EXPAND = {
    bhakti:
      "Mood — **Bhakti**: infuse **devotion**—soft gaze, reverent posture or gesture, warmth toward the sacred; humble joy without melodrama.",
    courage:
      "Mood — **Courage**: infuse **steadfast resolve**—open chest, deliberate motion, heroic calm (not cartoon bravado); grounded bravery.",
    peace:
      "Mood — **Peace**: infuse **stillness and ease**—unhurried rhythm, gentle fabric and light; no frantic cuts implied in prose.",
    awe:
      "Mood — **Awe**: infuse **wonder and scale**—small figure against vast sky/peaks; breath-held reverence; sublime light.",
    wrath:
      "Mood — **Wrath**: infuse **righteous divine intensity**—storm sync, sharp gestures, controlled fury; never silly or petty.",
    compassion:
      "Mood — **Compassion**: infuse **gentle mercy**—softened eyes, protective stance, tender framing.",
    mystery:
      "Mood — **Mystery**: infuse **the unknown**—half-lit detail, veils of mist or shadow; withhold explanation; sacred ambiguity.",
    triumph:
      "Mood — **Triumph**: infuse **victory and uplift**—rising motion, cleared sky, radiant silhouette; earned exaltation.",
    melancholy:
      "Mood — **Melancholy**: infuse **tender sorrow or longing**—slow tempo, muted highlights; bittersweet dignity.",
    festive:
      "Mood — **Festive**: infuse **celebration**—rich color accents, energetic ornament shimmer; joyful crowd-scale energy even if one figure.",
    serenity:
      "Mood — **Serenity**: infuse **clear luminous calm**—even breath in cloth and smoke; balanced composition; unruffled power.",
    power:
      "Mood — **Power**: infuse **overwhelming divine presence**—weight in stillness, pressure in light and wind; awe without hysteria.",
  };

  function sceneChoice(group, key) {
    const k = String(key || "").trim();
    if ((group === "performance" || group === "atmosphere" || group === "constraints") && k === "none") {
      return { key: "none", text: "" };
    }
    const map = PROMPT3_SCENE_EXPAND[group];
    const text = map && k && map[k] ? map[k] : "(Not specified)";
    return { key: k, text };
  }

  function hasExpandLine(choice) {
    return Boolean(choice && String(choice.text || "").trim());
  }

  function moodLinesFromKeys(keys) {
    const lines = [];
    for (const key of keys) {
      const line = PROMPT3_MOOD_EXPAND[key];
      if (line) lines.push(line);
    }
    return lines;
  }

  function cameraTextFromKeys(keys) {
    const map = PROMPT3_SCENE_EXPAND.camera;
    const lines = [];
    for (const key of keys) {
      if (map && map[key]) lines.push(map[key]);
    }
    return lines.length ? lines.join("\n") : "(Not specified)";
  }

  function videoStyleLines(catalog, mainId, subId) {
    const main = String(mainId || "").trim();
    const sub = String(subId || "").trim();
    if (!main || !sub) return "Video style: select main style and subcategory.";
    const m = catalog?.mainStyles?.find((x) => x && x.id === main);
    const s =
      m && Array.isArray(m.subcategories) ? m.subcategories.find((x) => x && x.id === sub) : null;
    if (!m || !s) return "Video style: select a valid main style and subcategory.";
    const hint = String(s.hint || "").trim();
    const parts = [
      `Video style — main: ${m.label} (${m.id}).`,
      `Video style — subcategory: ${s.label} (${s.id}).`,
    ];
    if (hint) parts.push(`Video style — visual aim: ${hint}`);
    return parts.join("\n");
  }

  const P3_USE_IMAGES_MODES = ["none", "one", "first_last", "all_three"];

  function normalizeUseImagesMode(mode) {
    const m = String(mode || "one").trim();
    return P3_USE_IMAGES_MODES.includes(m) ? m : "one";
  }

  function prompt3FigureImageSuffix(useImagesMode) {
    const mode = normalizeUseImagesMode(useImagesMode);
    if (mode === "one") return "use attached driving image";
    if (mode === "first_last") return "use attached images — first and second";
    if (mode === "all_three") return "use attached images — first, second, and third";
    return "";
  }

  function prompt3AttachedImagePhrases(
    figureLabels,
    backgroundSelection,
    includeFigureLock,
    includeEnvironmentLock,
    useImagesMode
  ) {
    const mode = normalizeUseImagesMode(useImagesMode);
    if (mode === "none") return [];
    const figSuffix = prompt3FigureImageSuffix(mode);
    const envSuffix =
      mode === "one"
        ? "use attached driving image"
        : mode === "first_last"
          ? "use attached images — first and second"
          : "use attached images — first, second, and third";
    const phrases = [];
    if (!includeFigureLock) {
      const figures = Array.isArray(figureLabels) ? figureLabels : [];
      if (figures.length) {
        for (const g of figures) {
          const name = String(g?.label || "").trim();
          if (name) phrases.push(`${name} (${figSuffix})`);
        }
      } else {
        phrases.push(`(${figSuffix} for deity / figure)`);
      }
    }
    if (!includeEnvironmentLock) {
      const envName = String(backgroundSelection?.label || "").trim() || "Environment";
      phrases.push(`${envName} (${envSuffix})`);
    }
    return phrases;
  }

  function prompt3TextOnlySection() {
    return [
      "=== GENERATION (text only — no images in Grok) ===",
      "The user refines this prompt in **ChatGPT** (text only), then runs **video generation in Grok without attaching reference images**.",
      "The final paragraph must be **self-contained**: use character/environment locks and **priority scene beats** for look and action—do not refer to attached or driving images.",
      "",
    ];
  }

  function prompt3ImageReferenceSection(useImagesMode, referenceCameraTitle) {
    const mode = normalizeUseImagesMode(useImagesMode);
    if (mode === "none") return prompt3TextOnlySection();

    const camLine = referenceCameraTitle
      ? `Storyboard frames (if used) come from **Copy Image Prompt** for camera angle: **${referenceCameraTitle}**.`
      : "Storyboard frames (if used) come from **Copy Image Prompt** for the selected camera angle.";

    const lines = [
      "=== IMAGE REFERENCES (Grok — user attaches manually) ===",
      camLine,
      "The user refines text in **ChatGPT** (no images), then pastes the result into **Grok** and attaches image(s) **in the order below**.",
      "",
    ];

    if (mode === "one") {
      lines.push(
        "Attach **one** image in Grok: the **driving reference** (clear figure/character and scene look).",
        "This is **not** a storyboard “start frame”—it **drives** visual identity and composition. **Motion and action** follow **priority beats** and creative rows; do not contradict the driving image.",
        ""
      );
    } else if (mode === "first_last") {
      lines.push(
        "Attach **two** images in Grok, **in this order**:",
        "1. **First image** — starting reference (opening pose, composition, lighting).",
        "2. **Second image** — ending reference (closing pose/state at end of clip).",
        "The clip must **progress from the first image toward the second**. Keep figure identity and environment consistent; only motion and staging evolve.",
        ""
      );
    } else {
      lines.push(
        "Attach **three** images in Grok, **in this order**:",
        "1. **First image** — starting reference.",
        "2. **Second image** — middle reference (mid-beat / mid-action).",
        "3. **Third image** — ending reference.",
        "Follow **first → second → third** in time. Keep figure and environment consistent across all three.",
        ""
      );
    }
    return lines;
  }

  function prompt3AttachedImageIdentitySection(
    figureLabels,
    backgroundSelection,
    includeFigureLock,
    includeEnvironmentLock,
    useImagesMode
  ) {
    if (includeFigureLock && includeEnvironmentLock) return [];
    const mode = normalizeUseImagesMode(useImagesMode);
    if (mode === "none") return [];

    const phrases = prompt3AttachedImagePhrases(
      figureLabels,
      backgroundSelection,
      includeFigureLock,
      includeEnvironmentLock,
      useImagesMode
    );
    if (!phrases.length) return [];

    const figSuffix = prompt3FigureImageSuffix(mode);
    const envSuffix =
      mode === "one"
        ? "use attached driving image"
        : mode === "first_last"
          ? "use attached images — first and second"
          : "use attached images — first, second, and third";

    const lines = ["=== IDENTITY (names + image roles for Grok) ==="];
    if (!includeFigureLock) {
      const figures = Array.isArray(figureLabels) ? figureLabels.filter((g) => String(g?.label || "").trim()) : [];
      if (figures.length) {
        figures.forEach((g, i) => {
          const name = String(g.label).trim();
          const tag = figures.length > 1 ? `Figure ${i + 1}` : "Deity / figure";
          lines.push(`${tag}: ${name} (${figSuffix})`);
        });
      } else {
        lines.push(`Deity / figure: (${figSuffix})`);
      }
    }
    if (!includeEnvironmentLock) {
      const envName = String(backgroundSelection?.label || "").trim() || "Environment";
      lines.push(`Environment: ${envName} (${envSuffix})`);
    }
    lines.push(
      `In your **final** English output, weave in **verbatim** each phrase: ${phrases.map((p) => `\`${p}\``).join(", ")}.`,
      "For those tags: **do not** invent detailed costume, anatomy, jewelry, terrain, sky, or lighting prose—images supply look; **priority beats** supply motion.",
      ""
    );
    return lines;
  }

  function prompt3PriorityLockHint({
    includeFigureLock,
    includeEnvironmentLock,
    multiFig,
    hasGods,
    figureLabels,
    backgroundSelection,
    useImagesMode,
  }) {
    const mode = normalizeUseImagesMode(useImagesMode);
    if (multiFig && includeFigureLock) {
      return "Still keep **every locked figure** and the place recognizable per the locks below unless this block explicitly rewrites an element (e.g. mount, seating, interaction).";
    }
    if (hasGods && includeFigureLock) {
      return "Still keep the deity and place recognizable per the locks below unless this block explicitly rewrites an element (e.g. mount, seating).";
    }
    if (includeEnvironmentLock) {
      return "Still keep the place recognizable per the environment lock below unless this block explicitly rewrites an element.";
    }
    if (includeFigureLock) {
      return "Still keep the figure recognizable per the character lock below unless this block explicitly rewrites an element.";
    }
    if (mode === "none") {
      return "Follow **priority scene beats** for motion and staging; the user will **not** attach images in Grok—do not refer to attached images.";
    }
    const phrases = prompt3AttachedImagePhrases(
      figureLabels,
      backgroundSelection,
      includeFigureLock,
      includeEnvironmentLock,
      useImagesMode
    );
    if (phrases.length) {
      return `Name deity/figure and environment using **IDENTITY** above (${phrases.join("; ")}) unless this block explicitly rewrites an element—no detailed look prose for those tags.`;
    }
    return "Follow **priority scene beats**; image roles are defined in **IMAGE REFERENCES** above.";
  }

  /**
   * @param {{ label: string, videoLock: string }[]} gods
   * @param {{ label: string, videoLock: string } | null} background
   * @param {*} prompt3
   * @param {*} videoCatalog
   */
  function buildPrompt3Merged(state) {
    const includeFigureLock = Boolean(state?.includeFigureLock);
    const includeEnvironmentLock = Boolean(state?.includeEnvironmentLock);
    const useImagesMode = normalizeUseImagesMode(state?.useImagesMode);
    const godsAll = state.gods || [];
    const figureLabels = Array.isArray(state.figureLabels) ? state.figureLabels : godsAll;
    const backgroundSelection = state.backgroundSelection || null;
    const gods = includeFigureLock ? godsAll : [];
    const background = includeEnvironmentLock ? state.background || null : null;
    const bgLockAll = includeEnvironmentLock ? String(background?.videoLock || "").trim() : "";
    const priorityRaw = String(state.prompt3?.priorityLines || "").trim();
    if (includeEnvironmentLock && !bgLockAll) {
      return [
        "Add text in the **Background lock** field (Step 2), or uncheck **Add Environment lock** and use image roles in **Use images**, then copy **Video Prompt** again.",
        "",
        "Prompt 3 merges that lock with Priority scene beats and your creative choices.",
      ].join("\n");
    }
    if (!priorityRaw) {
      return [
        "Add **Priority scene beats** (Step 3), then copy **Video Prompt** again.",
        "",
        includeEnvironmentLock
          ? "Those beats drive motion and staging together with the Environment lock."
          : useImagesMode === "none"
            ? "Those beats drive motion and staging; text-only in Grok (no attached images)."
            : "Those beats drive motion and staging; name deity and environment per **IDENTITY** when locks are unchecked.",
      ].join("\n");
    }

    const perf = sceneChoice("performance", state.prompt3?.performance);
    const atm = sceneChoice("atmosphere", state.prompt3?.atmosphere);
    const cons = sceneChoice("constraints", state.prompt3?.constraints);
    const camKeys = Array.isArray(state.prompt3?.cameraKeys)
      ? state.prompt3.cameraKeys.map((k) => String(k).trim()).filter(Boolean)
      : ["default_framing"];
    const referenceCameraTitle = cameraPromptTitle(camKeys[0]) || camKeys[0] || "Default framing";
    const cam = { keys: camKeys, text: cameraTextFromKeys(camKeys) };
    const moodKeys = Array.isArray(state.prompt3?.moodKeys)
      ? state.prompt3.moodKeys.map((k) => String(k).trim()).filter(Boolean)
      : [];
    const moodLines = moodLinesFromKeys(moodKeys);
    const hasMood = moodLines.length > 0;
    const multiFig = includeFigureLock && gods.length >= 2;
    const bgLock = background ? String(background.videoLock || "").trim() : "";
    const perfLine = hasExpandLine(perf);
    const atmLine = hasExpandLine(atm);
    const consLine = hasExpandLine(cons);

    if (cam.keys.length >= 2) {
      return buildPrompt3MultiCamera(
        cam.keys,
        perf,
        atm,
        cons,
        priorityRaw,
        gods,
        background,
        hasMood,
        moodLines,
        state.videoCatalog,
        state.prompt3?.videoMainId,
        state.prompt3?.videoSubId,
        includeFigureLock,
        includeEnvironmentLock,
        figureLabels,
        backgroundSelection,
        useImagesMode,
        referenceCameraTitle
      );
    }

    const lines = [
      "You help write **one** **English** video-generation prompt for a **single short scene** (one shot idea).",
      "",
      "Output: **one** fluent paragraph in plain English—no bullet lists, no labeled sections like Character or Camera—so it can be pasted into a video or image-to-video tool.",
      ...(multiFig
        ? [
            "With **multiple** character locks: the **one** paragraph must still describe **each** figure as a **separate, complete** being (distinct bodies, distinct anatomy per lock). **Do not** merge identities into one hybrid creature.",
            "",
          ]
        : []),
      "Fluency must **not** remove **verbatim** hard-limit wording from the locks or beats (e.g. *strictly*, *exactly one*) — see **FIDELITY RULES** below.",
      includeFigureLock || includeEnvironmentLock
        ? "The paragraph may be **longer** when the locks below are detailed: **fidelity to those locks matters more than brevity**."
        : useImagesMode === "none"
          ? "The paragraph may be **longer** when beats are detailed: text-only generation—beat fidelity over brevity."
          : "The paragraph may be **longer** when beats are detailed: include required image-role name tags from **IDENTITY** and beat fidelity over brevity.",
      "",
    ];
    lines.push(...prompt3ImageReferenceSection(useImagesMode, referenceCameraTitle));
    lines.push(
      ...prompt3AttachedImageIdentitySection(
        figureLabels,
        backgroundSelection,
        includeFigureLock,
        includeEnvironmentLock,
        useImagesMode
      )
    );

    if (priorityRaw.length > 0) {
      lines.push(
        "=== PRIORITY SCENE BEATS (highest — use these lines first) ===",
        "If anything later in this message disagrees with this block on pose, action, props, motion, composition intent, or dynamics, **follow this block**.",
        prompt3PriorityLockHint({
          includeFigureLock,
          includeEnvironmentLock,
          multiFig,
          hasGods: includeFigureLock ? gods.length > 0 : figureLabels.length > 0,
          figureLabels,
          backgroundSelection,
          useImagesMode,
        }),
        "",
        priorityRaw,
        ""
      );
    }

    if (gods.length > 0) {
      lines.push("=== LOCKED — CHARACTER (must honor — do not reduce to a generic “deity” description) ===");
      gods.forEach((g, gi) => {
        const godLock = String(g.videoLock || "").trim();
        const tag = gods.length > 1 ? `Figure ${gi + 1}` : "Figure";
        lines.push(`${tag}: ${g.label}.`);
        lines.push(
          godLock
            ? `Appearance / costume lock (carry **all** substantive detail below into the paragraph—skin, face, eyes, costume, posture, build, species/anatomy for non-human figures, aura—where visible in this shot): ${godLock}`
            : "Keep traditional depiction consistent."
        );
        if (gi < gods.length - 1) lines.push("");
      });
      if (multiFig) {
        lines.push(...PROMPT3_MULTI_FIGURE_SEPARATION_RULES);
      }
    }
    if (includeEnvironmentLock && background) {
      lines.push(
        "=== LOCKED — SETTING (must honor — do not replace with vague “mountains”) ===",
        `Place: ${background.label}.`,
        bgLock
          ? `Environment lock (carry terrain, sky, weather, light, wind, scale, debris, mood—match this prose): ${bgLock}`
          : "Keep scale, materials, and mood consistent with this place.",
        ""
      );
    }
    lines.push(
      "=== FIDELITY RULES (critical) ===",
      ...PROMPT3_VERBATIM_QUALIFIER_RULES,
      "- Put lock detail into **natural sentences**, but **do not summarize away** named attributes (jewellery, serpent coils, trishul shape, damru, third eye glow, Neelkanth tone, storm/lightning/wind, rocky peaks, etc.).",
      multiFig
        ? "- **Priority scene beats** (if present above) control **action, motion, and dramatic beat**. Locks control **how each figure and the place look** during that action."
        : gods.length
          ? includeEnvironmentLock
            ? "- **Priority scene beats** (if present above) control **action, motion, and dramatic beat** (e.g. descent, trishul swing, intensity). Locks control **how the figure and place look** during that action."
            : useImagesMode === "none"
              ? "- **Priority scene beats** (if present above) control **action, motion, and dramatic beat**. The **character lock** controls figure look; **place** from beats or environment lock."
              : "- **Priority scene beats** (if present above) control **action, motion, and dramatic beat**. The **character lock** controls figure look; **place** uses the environment image-role tag from **IDENTITY**."
          : includeEnvironmentLock
            ? "- **Priority scene beats** control **action, motion, and dramatic beat**. The **environment lock** controls **how the place looks** during that action."
            : useImagesMode === "none"
              ? "- **Priority scene beats** control **action, motion, and dramatic beat**; text-only in Grok—no image references."
              : "- **Priority scene beats** control **action, motion, and dramatic beat**. Name figure and environment with image-role tags from **IDENTITY**—no detailed look prose.",
      multiFig
        ? "- If priority motion seems intense, still describe **each** locked figure using that figure’s **character lock**—not a generic silhouette."
        : gods.length
          ? "- If priority motion seems intense, still describe the figure using the **character lock’s** materials and anatomy—not a generic warrior silhouette."
          : includeEnvironmentLock
            ? "- If priority motion seems intense, keep staging coherent with the **environment lock** and **priority beats**—do not invent contradictory layout."
            : useImagesMode === "none"
              ? "- If priority motion seems intense, keep staging coherent with **priority beats**—text-only."
              : "- If priority motion seems intense, keep staging coherent with image-role identity tags and **priority beats**—do not invent contradictory layout.",
      "- The **Video style** section below must read clearly in your paragraph (e.g. VFX/CGI fantasy elemental FX—use wording consistent with that selection).",
      "- Omit a lock clause **only** when this camera angle clearly cannot show it; otherwise keep it.",
      ...(perfLine
        ? []
        : [
            gods.length
              ? "- **Performance** is **None** — do **not** impose a default performance preset (e.g. hero stance / standing calm / grounded stillness). Motion comes from **priority scene beats** when present, otherwise from the character lock—preserve flight, descent, mid-air action, etc. when beats imply them."
              : includeEnvironmentLock
                ? "- **Performance** is **None** — do **not** impose a default performance preset (e.g. hero stance / standing calm / grounded stillness). Motion comes from **priority scene beats** and the environment lock when beats imply flight, descent, mid-air action, etc."
                : useImagesMode === "none"
                  ? "- **Performance** is **None** — motion comes from **priority scene beats** only (text-only in Grok)."
                  : "- **Performance** is **None** — motion comes from **priority scene beats**; keep image-role identity tags when beats imply flight, descent, mid-air action, etc.",
          ]),
      ...(!atmLine
        ? [
            includeEnvironmentLock
              ? "- **Atmosphere** is **None** — do **not** impose a default lighting/mood template (e.g. golden hour only); infer sky, weather, and light from the **environment lock** and **priority beats** when consistent."
              : useImagesMode === "none"
                ? "- **Atmosphere** is **None** — infer sky, weather, and light from **priority beats** only."
                : "- **Atmosphere** is **None** — do not invent sky/weather prose beyond image-role environment tags and **priority beats**.",
          ]
        : []),
      ...(!consLine
        ? [
            "- **Constraints** is **None** — do **not** stack extra constraint lines (single action, no dialogue, etc.) unless **priority beats** or the brief require them.",
          ]
        : []),
      ...(hasMood
        ? [
            "- **Mood** (tags below): **amplify** the emotional read—expression, tempo of motion, and light—**without** contradicting locks, priority beats, or the **Atmosphere** row when set.",
          ]
        : []),
      "",
      "=== CREATIVE CHOICES FOR THIS SCENE ===",
      ...(perfLine ? [perf.text] : []),
      cam.text,
      ...(atmLine ? [atm.text] : []),
      ...(consLine ? [cons.text] : []),
      ...(hasMood ? ["", "=== MOOD (amplify emotional tone) ===", ...moodLines] : []),
      "",
      "=== VIDEO STYLE (overall look; must read consistent on screen) ===",
      videoStyleLines(state.videoCatalog, state.prompt3?.videoMainId, state.prompt3?.videoSubId),
      ""
    );

    const attachedPhrases = prompt3AttachedImagePhrases(
      figureLabels,
      backgroundSelection,
      includeFigureLock,
      includeEnvironmentLock,
      useImagesMode
    );
    const combineParts = ["camera"];
    if (multiFig) combineParts.unshift("each figure’s distinct look");
    else if (gods.length === 1) combineParts.unshift("figure look");
    else if (!includeFigureLock && useImagesMode !== "none")
      combineParts.unshift("deity name with image-role tags");
    else combineParts.unshift("story motion from beats");
    if (includeEnvironmentLock) combineParts.splice(combineParts.length - 1, 0, "place look");
    else if (!includeEnvironmentLock && useImagesMode !== "none")
      combineParts.splice(combineParts.length - 1, 0, "environment with image-role tags");
    if (perfLine) combineParts.push("performance");
    if (atmLine) combineParts.push("atmosphere");
    if (consLine) combineParts.push("constraints");
    if (hasMood) combineParts.push("selected moods");
    combineParts.push("video style");
    const noneDims = [];
    if (!perfLine) noneDims.push("Performance");
    if (!atmLine) noneDims.push("Atmosphere");
    if (!consLine) noneDims.push("Constraints");
    const noneNote = noneDims.length
      ? ` (${noneDims.join(", ")} = None — no default rows for those.)`
      : "";

    const integrationLine = multiFig
      ? `- **Covers** ${combineParts.join(", ")} in **one** paragraph by describing **coexisting** distinct figures—**not** by merging or fusing them.${noneNote} Use connectors such as *beside*, *with*, or *while* for spatial relation; **never** hybrid or fused anatomy.`
      : gods.length || includeFigureLock || includeEnvironmentLock
        ? `- Combines ${combineParts.join(", ")}.${noneNote}`
        : useImagesMode === "none"
          ? `- Combines ${combineParts.join(", ")}—text-only in Grok; **priority beats** and creative rows carry look and motion.${noneNote}`
          : `- Combines ${combineParts.join(", ")}—include required image-role name tags from **IDENTITY** and **priority beats**; no catalog lock prose.${noneNote}`;

    const embedLocksLine = (() => {
      if (gods.length && includeEnvironmentLock) {
        return "- **Embeds** the Character lock(s) and Environment lock with **high fidelity**—not a shortened recap—**and** keeps **verbatim** hard-limit phrases from those locks and from **priority beats** when present (*strictly*, *exactly*, *only one*, etc.).";
      }
      if (gods.length) {
        const placeNote =
          useImagesMode === "none"
            ? "**Place** follows the environment lock or beats."
            : "**Place** uses the environment image-role tag from **IDENTITY**—no terrain prose.";
        return `- **Embeds** the Character lock(s) with **high fidelity**—not a shortened recap—**and** keeps **verbatim** hard-limit phrases from those locks and from **priority beats** when present (*strictly*, *exactly*, *only one*, etc.). ${placeNote}`;
      }
      if (includeEnvironmentLock) {
        return "- **Embeds** the Environment lock with **high fidelity**—not a shortened recap—**and** keeps **verbatim** hard-limit phrases from that lock and from **priority beats** when present (*strictly*, *exactly*, *only one*, etc.).";
      }
      if (useImagesMode === "none") {
        return "- **Text-only** in Grok: the paragraph must stand alone using **priority beats** (and any partial locks); do not refer to attached images.";
      }
      if (attachedPhrases.length) {
        return `- **Must include verbatim** in the paragraph: ${attachedPhrases.map((p) => `\`${p}\``).join(", ")}. **Do not** add detailed costume or environment description for those tags—**priority beats** carry motion and staging.`;
      }
      return "- Follow image roles in **IMAGE REFERENCES**; **priority beats** carry motion—no invented look prose.";
    })();

    const whatWrite = [
      "=== WHAT TO WRITE ===",
      "Compose **one** coherent paragraph that:",
      embedLocksLine,
      ...(multiFig
        ? [
            "- **Each** character lock maps to a **separate** on-screen body (own limbs, species, proportions). **Forbidden:** merged hands/faces/torsos, or one lock’s anatomy growing from another’s body.",
            "- Keep **attribute ownership** strict: never transfer one figure's signature features (third eye, ash marks, specific jewelry, weapon forms, etc.) to another figure unless that second figure's own lock explicitly contains them.",
          ]
        : []),
      integrationLine,
    ];
    if (priorityRaw.length > 0) {
      const anySceneExpand = perfLine || atmLine || consLine;
      whatWrite.push(
        anySceneExpand
          ? "- **Priority scene beats** define the **story motion**; dropdown performance / atmosphere / constraints / camera rows are **defaults**—yield to Priority for descent, strikes, flight, etc."
          : "- **Priority scene beats** define the **story motion**; **Performance**, **Atmosphere**, and **Constraints** are **None**—beats and locks fully control action and staging; **camera** and **video style** refine the look.",
        perfLine || atmLine || consLine
          ? gods.length
            ? "- Where Priority clashes with a mild dropdown row (performance, atmosphere, or camera), **Priority wins** for action intensity; still describe costume, anatomy, and setting cues per the locks."
            : includeEnvironmentLock
              ? "- Where Priority clashes with a mild dropdown row (performance, atmosphere, or camera), **Priority wins** for action intensity; still honor the environment lock and beat wording."
              : useImagesMode === "none"
                ? "- Where Priority clashes with a mild dropdown row (performance, atmosphere, or camera), **Priority wins** for action intensity; text-only—no image references."
                : "- Where Priority clashes with a mild dropdown row (performance, atmosphere, or camera), **Priority wins** for action intensity; still keep required image-role name tags and beat wording."
          : gods.length
            ? "- Where Priority clashes with mild camera framing, **Priority wins** for action intensity; still describe costume, anatomy, and setting cues per the locks."
            : includeEnvironmentLock
              ? "- Where Priority clashes with mild camera framing, **Priority wins** for action intensity; still honor the environment lock and beat wording."
              : useImagesMode === "none"
                ? "- Where Priority clashes with mild camera framing, **Priority wins** for action intensity; text-only—no image references."
                : "- Where Priority clashes with mild camera framing, **Priority wins** for action intensity; still keep required image-role name tags and beat wording.",
        includeFigureLock || includeEnvironmentLock
          ? "- Keep edits readable unless Priority asks for fierce motion (then match that energy while keeping lock-accurate costume and setting)."
          : useImagesMode === "none"
            ? "- Keep edits readable unless Priority asks for fierce motion (then match that energy using beats and text only)."
            : "- Keep edits readable unless Priority asks for fierce motion (then match that energy while keeping image-role tags and beats)."
      );
    } else {
      whatWrite.push(
        includeFigureLock || includeEnvironmentLock
          ? "- Does **not** contradict the locks."
          : useImagesMode === "none"
            ? "- Text-only generation; does **not** refer to attached images."
            : attachedPhrases.length
              ? `- Includes ${attachedPhrases.map((p) => `\`${p}\``).join(", ")} and does **not** invent contradictory look prose.`
              : "- Follows **IMAGE REFERENCES** and does **not** invent contradictory look prose.",
        "- Keeps motion and camera modest and readable (no chaotic edits, no rapid cuts)."
      );
    }
    whatWrite.push(
      "- Names the **video style** intent (e.g. cinematic VFX fantasy elemental energy) so the generator matches the Video style block.",
      consLine
        ? "- States clearly if the shot has **no** dialogue and **no** on-screen text (per constraints)."
        : "- **Constraints = None** — state dialogue / on-screen text choices explicitly using sensible short-clip defaults unless **priority beats** require otherwise.",
      "",
      "Reply with **only** that paragraph—nothing else."
    );
    lines.push(...whatWrite);

    return lines.join("\n").trim();
  }

  function buildPrompt3MultiCamera(
    camKeys,
    perf,
    atm,
    cons,
    priorityRaw,
    gods,
    background,
    hasMood,
    moodLines,
    videoCatalog,
    videoMainId,
    videoSubId,
    includeFigureLock,
    includeEnvironmentLock,
    figureLabels,
    backgroundSelection,
    useImagesMode,
    referenceCameraTitle
  ) {
    const n = camKeys.length;
    const camMap = PROMPT3_SCENE_EXPAND.camera;
    const godList = includeFigureLock ? gods : [];
    const mode = normalizeUseImagesMode(useImagesMode);
    const attachedPhrases = prompt3AttachedImagePhrases(
      figureLabels,
      backgroundSelection,
      includeFigureLock,
      includeEnvironmentLock,
      useImagesMode
    );
    const bgLock = background ? String(background.videoLock || "").trim() : "";
    const perfLine = hasExpandLine(perf);
    const atmLine = hasExpandLine(atm);
    const consLine = hasExpandLine(cons);
    const multiFig = includeFigureLock && godList.length >= 2;
    const idKeep =
      godList.length >= 2
        ? "**identical** locked figures (each entity keeps its **own** name, anatomy, and costume—never merge two into one)"
        : godList.length === 1
          ? "**identical** deity identity"
          : includeEnvironmentLock
            ? "**continuous** staging from **priority beats** and the **environment lock**"
            : mode === "none"
              ? "**continuous** staging from **priority beats** (text-only in Grok) in every scene"
              : "**continuous** staging from **priority beats** with the same image-role identity tags in every scene";

    let beatIntroSecond;
    if (perfLine && atmLine && consLine) {
      beatIntroSecond = `Keep **one** continuous beat: ${idKeep}, **identical** place and environment, **identical** motion / performance, atmosphere, and constraints as in the shared blocks. **Do not** invent new story beats, time jumps, costume changes, or location changes between scenes.`;
    } else if (!perfLine && !atmLine && !consLine) {
      beatIntroSecond = `Keep **one** continuous beat: ${idKeep}, **identical** place and environment. **Performance**, **Atmosphere**, and **Constraints** are all **None** — do **not** invent default stance, lighting recipe, or constraint stack; use ${includeFigureLock || includeEnvironmentLock ? "**locks**, " : ""}**priority scene beats** (when present), ${includeFigureLock || includeEnvironmentLock || mode === "none" ? "" : "the same image-role identity tags, "}and **video style** only. **Do not** invent new story beats, time jumps, costume changes, or location changes between scenes.`;
    } else {
      const have = [];
      if (perfLine) have.push("motion / performance");
      if (atmLine) have.push("atmosphere");
      if (consLine) have.push("constraints");
      const miss = [];
      if (!perfLine) miss.push("**Performance = None**");
      if (!atmLine) miss.push("**Atmosphere = None**");
      if (!consLine) miss.push("**Constraints = None**");
      beatIntroSecond = `Keep **one** continuous beat: ${idKeep}, **identical** place and environment, **identical** ${have.join(", ")} as in the shared blocks (${miss.join("; ")}—for omitted rows, follow **priority scene beats**${includeFigureLock || includeEnvironmentLock ? " and locks" : mode === "none" ? " only" : " and image-role identity tags"} only). **Do not** invent new story beats, time jumps, costume changes, or location changes between scenes.`;
    }

    const lines = [
      `You help write **${n}** separate **English** video prompts as **labeled scenes** — **Scene 1** through **Scene ${n}** — for what is effectively the **same** on-screen mythic moment.`,
      beatIntroSecond,
      "The **only** intentional variation from scene to scene is **camera / framing / lens grammar** according to each scene’s camera binding below.",
      ...(multiFig
        ? [
            "With **multiple** character locks: every **Video Prompt (English):** paragraph must still show **separate, complete** bodies for each named figure—**no** merged limbs, **no** hybrid of two locks into one anatomy.",
            "",
          ]
        : []),
      consLine
        ? "**Language:** Each **Video Prompt (English):** paragraph must be **English only** (no Hindi, no Devanagari). Respect the **Constraints** row for dialogue / on-screen text rules."
        : "**Language:** Each **Video Prompt (English):** paragraph must be **English only** (no Hindi, no Devanagari). **Constraints = None** — use sensible short-clip defaults unless **priority beats** explicitly call for dialogue or on-screen text.",
      "",
      "=== HARD REPLY SHAPE ===",
      "Your reply MUST begin **immediately** with the characters `Scene 1:` (then newline). No preamble, no overview bullets, no markdown `#` headings, no emojis.",
      "",
      "Use **exactly** this per-scene template (copy the labels literally, including colons):",
      "",
      "Scene k: <short English title>",
      "Video Prompt (English):",
      "<one fluent English paragraph>",
      "",
      `Produce **exactly ${n}** consecutive scenes. Do **not** output a Narration line, Hindi text, or audio script.`,
      "",
    ];
    lines.push(...prompt3ImageReferenceSection(useImagesMode, referenceCameraTitle));
    lines.push(
      ...prompt3AttachedImageIdentitySection(
        figureLabels,
        backgroundSelection,
        includeFigureLock,
        includeEnvironmentLock,
        useImagesMode
      )
    );

    if (priorityRaw.length > 0) {
      lines.push(
        "=== PRIORITY SCENE BEATS (highest — same beat for every scene’s paragraph) ===",
        perfLine
          ? "If anything disagrees with performance defaults on pose, action, props, motion, or dynamics, **follow this block** for every scene."
          : "**Performance = None** — this block is the primary driver of motion and staging (e.g. flight, descent, strikes); do **not** contradict it with a generic grounded stance.",
        ...(!atmLine
          ? [
              includeEnvironmentLock
                ? "**Atmosphere = None** — infer light, sky, and mood from the **environment lock** and this block, not a fixed atmosphere preset."
                : mode === "none"
                  ? "**Atmosphere = None** — infer light, sky, and mood from this block and beats, not a fixed atmosphere preset."
                  : "**Atmosphere = None** — infer light, sky, and mood from image-role environment tags and this block, not a fixed atmosphere preset.",
            ]
          : []),
        ...(!consLine
          ? [
              "**Constraints = None** — do not stack extra rule lines unless this block or locks require them.",
            ]
          : []),
        prompt3PriorityLockHint({
          includeFigureLock,
          includeEnvironmentLock,
          multiFig,
          hasGods: includeFigureLock ? godList.length > 0 : (figureLabels || []).length > 0,
          figureLabels,
          backgroundSelection,
          useImagesMode,
        }),
        "",
        priorityRaw,
        ""
      );
    }

    if (godList.length > 0) {
      lines.push("=== LOCKED — CHARACTER (every scene — same fidelity) ===");
      godList.forEach((g, gi) => {
        const godLock = String(g.videoLock || "").trim();
        const tag = godList.length > 1 ? `Figure ${gi + 1}` : "Figure";
        lines.push(`${tag}: ${g.label}.`);
        lines.push(
          godLock
            ? `Appearance / costume lock (carry substantive detail into **each** paragraph where visible at that framing): ${godLock}`
            : "Keep traditional depiction consistent."
        );
        if (gi < godList.length - 1) lines.push("");
      });
      if (multiFig) {
        lines.push(...PROMPT3_MULTI_FIGURE_SEPARATION_RULES);
      }
    }
    if (includeEnvironmentLock && background) {
      lines.push(
        "=== LOCKED — SETTING (every scene) ===",
        `Place: ${background.label}.`,
        bgLock
          ? `Environment lock (match in every paragraph): ${bgLock}`
          : "Keep scale, materials, and mood consistent with this place.",
        ""
      );
    }
    lines.push(
      "=== FIDELITY RULES (every scene) ===",
      ...PROMPT3_VERBATIM_QUALIFIER_RULES,
      "- Put lock detail into **natural sentences**; do not summarize away named attributes.",
      "- **Priority scene beats** (if present) define **story motion** for **all** scenes; camera rows below change **only** how the same moment is framed.",
      ...(perfLine
        ? []
        : [
            "- **Performance** is **None** — do **not** impose a default grounded / hero-stance performance across scenes; keep flight, descent, or beats-driven motion consistent in every paragraph.",
          ]),
      ...(!atmLine
        ? [
            includeEnvironmentLock
              ? "- **Atmosphere** is **None** — do **not** force a default lighting/mood template; keep sky, weather, and light coherent with the **environment lock** in every paragraph."
              : mode === "none"
                ? "- **Atmosphere** is **None** — do **not** force a default lighting/mood template; infer from beats in every paragraph."
                : "- **Atmosphere** is **None** — do **not** force a default lighting/mood template; keep sky, weather, and light implied via image-role environment tags in every paragraph.",
          ]
        : []),
      ...(!consLine
        ? [
            "- **Constraints** is **None** — do **not** append a long rule stack (single action, no dialogue, etc.) unless **priority beats** or locks require it.",
          ]
        : []),
      ...(hasMood
        ? [
            "- **Mood** (tags below): **amplify** the felt emotional tone in **each** paragraph—expression, pacing, and light quality—**without** contradicting locks, priority beats, or the **Atmosphere** row when set.",
          ]
        : []),
      "- The **Video style** block must read clearly in **each** paragraph.",
      "",
      "=== SHARED CREATIVE (same for every scene — do not vary these between scenes) ===",
      ...(perfLine ? [perf.text] : []),
      ...(atmLine ? [atm.text] : []),
      ...(consLine ? [cons.text] : []),
      ...(hasMood ? ["", "=== MOOD (amplify — same for every scene) ===", ...moodLines] : []),
      "",
      "=== VIDEO STYLE (every scene) ===",
      videoStyleLines(videoCatalog, videoMainId, videoSubId),
      "",
      "=== CAMERA — ONE BINDING PER SCENE (Scene k uses **only** row k) ==="
    );

    const DEFAULT_CAMERA_KEY = "default_framing";
    for (let i = 0; i < n; i++) {
      const key = camKeys[i];
      const title = cameraPromptTitle(key) || key;
      const expanded = camMap && camMap[key] ? camMap[key] : "Camera: (not specified)";
      lines.push(
        `**Scene ${i + 1}** — the line after \`Scene ${i + 1}:\` must be exactly this short title (no extra words): **${title}**`,
        `Then \`Video Prompt (English):\` and one paragraph that honors **only** this camera row (do not describe other shot scales in this paragraph):`,
        expanded,
        ...(n >= 2 && key === DEFAULT_CAMERA_KEY
          ? [
              "Scene note — **Default framing** with other camera rows selected: keep this paragraph’s geometry **generic and balanced**; **do not** paste bird’s-eye / miniature-figure / zoom-% language from a sibling scene unless **priority beats** explicitly require it.",
            ]
          : []),
        ""
      );
    }

    const mixesDefaultAndSpecific =
      n >= 2 &&
      camKeys.includes(DEFAULT_CAMERA_KEY) &&
      camKeys.some((k) => k !== DEFAULT_CAMERA_KEY);

    if (n >= 2) {
      lines.push(
        "",
        "=== MULTI-CAMERA — FRAMING MUST DIFFER (Camera dropdown only — mandatory) ===",
        "The **Camera** multi-select produced **multiple** bindings. **Only** this dimension may change how you write each paragraph (Performance / Atmosphere / Constraints / Mood / Video style stay shared as above).",
        "- **Forbidden:** copy-pasting or lightly rephrasing the **same** `Video Prompt (English):` body for two scenes when their Camera rows differ — write **separate** prose per scene index.",
        "- Each paragraph must make the **shot geometry** legible: relative **figure size in frame**, **vantage** (ground / high / vertical top), and **environment vs subject dominance** must match **that scene’s row**, not another scene’s.",
        "- When two rows specify **different** numbers or angles (e.g. figure ~5–10% of frame vs ~25% top view), the text must reflect that **concrete** difference — not interchangeable poetic description.",
        ...(mixesDefaultAndSpecific
          ? [
              "",
              "**Default framing** appears **together with** one or more **preset** cameras:",
              "- For the scene(s) bound to **Default framing** — use **natural, balanced** readable coverage implied by **priority beats** and locks; **do not** import bird’s-eye / miniature-silhouette / zoom-% language from a sibling scene **unless beats explicitly require that look**.",
              "- For every scene bound to a **non-default** Camera row — prose must **encode that preset’s** framing and **read differently** from the Default scene and from each other specialized row.",
            ]
          : []),
        ""
      );
    }

    const matchDims = [];
    if (perfLine) matchDims.push("**performance**");
    if (atmLine) matchDims.push("**atmosphere**");
    if (consLine) matchDims.push("**constraints**");
    if (hasMood) matchDims.push("**mood**");
    const matchSharedLine =
      matchDims.length > 0
        ? `- Matches ${matchDims.join(", ")}, and **video style** from the shared blocks.`
        : `- Matches **video style** from the shared blocks only (**Performance**, **Atmosphere**, and **Constraints** are **None** — use ${includeFigureLock || includeEnvironmentLock ? "locks and beats" : mode === "none" ? "beats only (text-only)" : "image-role identity tags and beats"} for the rest).`;

    lines.push(
      "=== WHAT TO WRITE ===",
      `Write **${n}** English paragraphs total (one per scene). Each paragraph:`,
      multiFig
        ? "- **Embeds** the Character locks (**every** listed figure) and the Environment lock with high fidelity, including **verbatim** hard-limit phrases from the locks and beats when present (*strictly*, *exactly*, *only one*, etc.)."
        : godList.length && includeEnvironmentLock
          ? "- **Embeds** the Character and Environment locks with high fidelity, including **verbatim** hard-limit phrases from the locks and beats when present (*strictly*, *exactly*, *only one*, etc.)."
          : godList.length
            ? `- **Embeds** the Character lock with high fidelity, including **verbatim** hard-limit phrases from the locks and beats when present (*strictly*, *exactly*, *only one*, etc.). ${mode === "none" ? "**Place** from environment lock or beats." : "**Place** uses environment image-role tag in every scene."}`
            : includeEnvironmentLock
              ? "- **Embeds** the Environment lock with high fidelity, including **verbatim** hard-limit phrases from that lock and beats when present (*strictly*, *exactly*, *only one*, etc.). Character staging follows **priority beats**."
              : mode === "none"
                ? "- **Text-only** in every scene: self-contained prose from **priority beats**; no image references."
                : attachedPhrases.length
                  ? `- **Every** scene paragraph **must include verbatim**: ${attachedPhrases.map((p) => `\`${p}\``).join(", ")}. No detailed look prose for those tags; **priority beats** define motion. Same image references for all scenes—only camera framing changes.`
                  : "- Every scene follows **IMAGE REFERENCES**; **priority beats** define motion. Same image references for all scenes—only camera framing changes.",
      ...(multiFig
        ? [
            "- **Each** named figure is a **separate, complete** body in the text (own limbs, own species/anatomy per lock). **Do not** merge or fuse two character locks into one hybrid being; **do not** attach one figure’s hands, arms, or face to another’s body.",
            "- Keep **attribute ownership** explicit: a trait named in one lock must stay with that figure only (for example, do not give deity-only face markings, eyes, ornaments, or weapons to a mount/companion unless that second lock says so).",
          ]
        : []),
      matchSharedLine,
      "- Uses **only** its scene’s camera binding — no mixing of other camera rows; when bindings differ, paragraphs must **not** be duplicates.",
      multiFig
        ? "- Same action / emotional beat as the others; **no** new plot, props, or extra unnamed figures—only the locked figures above (and anyone explicitly named in **priority scene beats**)."
        : godList.length
          ? "- Same action / emotional beat as the others; **no** new plot, props, or characters beyond what **locks** and **priority beats** name."
          : includeEnvironmentLock
            ? "- Same action / emotional beat as the others; **no** new plot or props beyond what **priority beats** and the environment lock imply."
            : mode === "none"
              ? "- Same action / emotional beat as the others; **no** new plot or props beyond what **priority beats** imply."
              : "- Same action / emotional beat as the others; **no** new plot or props beyond what **priority beats** and image-role identity tags imply.",
      "",
      "Reply with **only** the scene blocks from `Scene 1:` through the end of Scene " +
        String(n) +
        "’s paragraph — nothing else."
    );

    return lines.join("\n").trim();
  }

  function buildPrompt1(gods) {
    const list = Array.isArray(gods) ? gods.filter((g) => g && String(g.label || "").trim()) : [];
    const god = list[0] || null;

    if (!list.length || !god) {
      return [
        "A brief realistic video set on an open green grassland in soft daylight, with a calm sky and gentle horizon and nothing crowded in the frame.",
        "Keep the camera steady or use only a very slight slow zoom—avoid orbiting, cranes, dollies, or complicated motion.",
        "Do not add subtitles, captions, or spoken dialogue; this should read as a quiet, visual moment.",
      ]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    }
    const labels = list.map((g) => g.label).join(", ");
    const figureIntro =
      list.length === 1 ? `Only one figure appears: ${god.label}.` : `These figures appear together: ${labels}.`;

    const lockParts = list.map((g) => {
      const lock = String(g.videoLock || "").trim();
      return lock
        ? `For ${g.label}, show this appearance: ${lock}`
        : `Keep ${g.label} consistent with how they are usually depicted.`;
    });

    const para = [
      "A brief realistic video set on an open green grassland in soft daylight, with a calm sky and gentle horizon and nothing crowded in the frame.",
      figureIntro,
      ...lockParts,
      list.length === 1
        ? "The figure stands full length, relaxed and upright, facing straight toward the camera in a simple frontal view."
        : "The figures stand full length, relaxed and upright, facing straight toward the camera in a simple frontal view.",
      "Keep the camera steady or use only a very slight slow zoom—avoid orbiting, cranes, dollies, or complicated motion.",
      "Do not add subtitles, captions, or spoken dialogue; this should read as a quiet, visual moment.",
    ].join(" ");

    return para.replace(/\s+/g, " ").trim();
  }

  function buildPrompt2(background) {
    const lock = String(background?.videoLock || "").trim();
    if (!lock) {
      return [
        "Add text in the **Background lock** field (Step 2), then copy **Prompt 2** again.",
        "",
        "Prompt 2 describes only the environment using that lock.",
      ].join("\n");
    }
    const label = String(background?.label || "Setting").trim();
    const para = [
      "A brief realistic video that establishes only the place and atmosphere—no characters, crowds, or dialogue.",
      `The location is ${label}.`,
      `Show the environment with this look: ${lock}`,
      "Use a calm establishing composition: wide or medium-wide framing, steady camera or a very slight slow drift—avoid whip pans, handheld shake, or flashy transitions.",
      "Do not add subtitles, captions, or spoken narration; this should read as a quiet visual study of the setting.",
    ].join(" ");

    return para.replace(/\s+/g, " ").trim();
  }

  function buildPrompt3ImageSequence(state) {
    const gods = state.gods || [];
    const background = state.background || null;
    const bgLock = String(background?.videoLock || "").trim();
    const priorityRaw = String(state.prompt3?.priorityLines || "").trim();
    if (!bgLock) {
      return [
        "Add text in the **Background lock** field (Step 2), then copy **Image Prompt** again.",
        "",
        "Image prompts need the place lock to keep all shots consistent.",
      ].join("\n");
    }
    if (!priorityRaw) {
      return [
        "Add **Priority scene beats** (Step 3), then copy **Image Prompt** again.",
        "",
        "Those beats define the visual sequence for each camera angle.",
      ].join("\n");
    }

    const perf = sceneChoice("performance", state.prompt3?.performance);
    const atm = sceneChoice("atmosphere", state.prompt3?.atmosphere);
    const cons = sceneChoice("constraints", state.prompt3?.constraints);
    const camKeys = Array.isArray(state.prompt3?.cameraKeys)
      ? state.prompt3.cameraKeys.map((k) => String(k).trim()).filter(Boolean)
      : ["default_framing"];
    const moodKeys = Array.isArray(state.prompt3?.moodKeys)
      ? state.prompt3.moodKeys.map((k) => String(k).trim()).filter(Boolean)
      : [];
    const moodLines = moodLinesFromKeys(moodKeys);
    const godList = gods.filter((g) => g && String(g.label || "").trim());
    const multiFig = godList.length >= 2;

    const lines = [
      "You write prompts for high-quality AI image generation.",
      "",
      "OUTPUT LANGUAGE: STRICT ENGLISH ONLY.",
      "- Write only in standard English.",
      "- No Hindi/Sanskrit/Hinglish.",
      "- Keep proper names exactly as provided.",
      "",
      "TASK:",
      "Generate image prompts in a storyboard sequence for Instagram post images.",
      `For EACH camera angle listed below, output exactly 3 images (Image 1 to Image 3) in chronological progression of the same scene.`,
      "",
      "GLOBAL RULES:",
      "- Keep all locked figures and environment faithful across all images.",
      "- Each image prompt should be a single compact paragraph suitable for image generation.",
      "- No dialogue, subtitles, captions, watermarks, logos, text overlays, or UI text inside images.",
      "- Keep continuity across Image 1..3 within each camera angle (same scene progression).",
      "- Camera framing must follow each camera angle strictly.",
      "- Use Priority scene beats as the primary action timeline.",
      "",
      ...(godList.length
        ? [
            "=== DEITY / FIGURE APPEARANCE — MUST NOT CHANGE (every image where they appear) ===",
            "When a locked figure appears in any image prompt, their **visual identity is fixed** for the entire run:",
            "- **Same appearance in Image 1 through Image 3** within each camera angle, and **the same appearance across every camera angle**—only pose, action, and framing may change.",
            "- **Do not** alter face, skin tone, body build, hair/jata, ornaments, malas, weapons, serpent, cloth, markings (tripundra, third eye, etc.), or prop count unless the character lock explicitly allows variation.",
            "- **Do not** simplify, omit, or “reinterpret” lock details for later images; carry the **same substantive lock wording** into each paragraph where that figure is visible (especially close and medium shots).",
            "- **Do not** merge two locked figures into one hybrid body or swap one figure’s traits onto another.",
            ...PROMPT3_VERBATIM_QUALIFIER_RULES,
            "- If an image shows only environment with no figure, omit character description; if a figure is present, the lock applies fully.",
            "",
          ]
        : []),
      "=== PRIORITY SCENE BEATS (highest) ===",
      priorityRaw,
      "",
      ...(godList.length
        ? [
            "=== LOCKED — CHARACTERS ===",
            ...godList.flatMap((g, i) => {
              const lock = String(g.videoLock || "").trim();
              const prefix = godList.length > 1 ? `Figure ${i + 1}` : "Figure";
              return [
                `${prefix}: ${g.label}`,
                lock ? `Character lock: ${lock}` : "Character lock: keep traditional depiction consistent.",
                "",
              ];
            }),
          ]
        : []),
      ...(multiFig ? [...PROMPT3_MULTI_FIGURE_SEPARATION_RULES] : []),
      "=== LOCKED — ENVIRONMENT ===",
      `Place: ${String(background?.label || "Setting").trim() || "Setting"}`,
      `Environment lock: ${bgLock}`,
      "",
      ...(hasExpandLine(perf) ? ["=== PERFORMANCE ===", perf.text, ""] : []),
      ...(hasExpandLine(atm) ? ["=== ATMOSPHERE ===", atm.text, ""] : []),
      ...(hasExpandLine(cons) ? ["=== CONSTRAINTS ===", cons.text, ""] : []),
      ...(moodLines.length ? ["=== MOOD TAGS ===", ...moodLines, ""] : []),
      "=== IMAGE STYLE (use same style family as video) ===",
      videoStyleLines(state.videoCatalog, state.prompt3?.videoMainId, state.prompt3?.videoSubId),
      "",
      "=== CAMERA ANGLES TO RENDER ===",
    ];

    for (const key of camKeys) {
      const title = cameraPromptTitle(key) || key;
      const camOpt = PROMPT3_CAMERA_BY_ID[key];
      const usageNote = camOpt ? ` (${cameraUsageScoreLabel(camOpt)})` : "";
      const expanded = PROMPT3_SCENE_EXPAND.camera?.[key] || "Camera: (not specified)";
      lines.push(`- ${title}${usageNote}`, expanded, "");
    }

    lines.push(
      "OUTPUT FORMAT (STRICT):",
      "For each camera angle, output exactly this structure:",
      "Camera Angle: <exact camera title from the list>",
      "Image 1: <prompt paragraph>",
      "Image 2: <prompt paragraph>",
      "Image 3: <prompt paragraph>",
      "",
      "Repeat the same block for every camera angle in the same order as listed.",
      ...(godList.length
        ? [
            "In every `Image N:` line where a locked deity/figure is in frame, restate or embed their appearance from the character lock so generators cannot drift between shots.",
          ]
        : []),
      "Return only these blocks. No explanations."
    );

    return lines.join("\n").trim();
  }

  window.MythologyMobilePromptEngine = {
    buildPrompt1,
    buildPrompt2,
    buildPrompt3Merged,
    buildPrompt3ImageSequence,
    PROMPT3_CAMERA_OPTIONS: PROMPT3_CAMERA_OPTIONS_SORTED,
    PROMPT3_CAMERA_OPTION_LABELS,
    cameraUsageScoreLabel,
    cameraPromptTitle,
    PROMPT3_MOOD_EXPAND,
  };
})();
