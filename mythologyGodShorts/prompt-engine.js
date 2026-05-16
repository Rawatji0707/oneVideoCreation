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

  const PROMPT3_CAMERA_OPTION_LABELS = {
    default_framing: "Default framing — balanced readable shot from beats & locks (no fixed preset)",
    full_body_front: "Full body, eye level, facing camera",
    wide_establishing: "Wide establishing — figure smaller; environment readable",
    waist_up: "Waist-up — medium shot",
    close_face_hands: "Close — face and hands",
    low_angle: "Low angle — slight heroic lift",
    high_angle: "High angle — slight downward view",
    static_tripod: "Static camera — tripod feel; no travel",
    slow_push_in: "Slow push-in — subtle zoom toward subject",
    slow_drift_pan: "Slow drift / pan — minimal lateral move",
    aerial_top_zoom_10: "Top view — zoom 10% (figure ~5–10% of frame; bird’s-eye)",
    aerial_top_zoom_25: "Top view — zoom 25% (~4× farther than normal full-length)",
    aerial_25deg_from_top_zoom_25: "25° from top — zoom 25% (steep down, very wide)",
    aerial_25deg_from_top_zoom_50: "25° from top — zoom 50% (steep down, medium-wide)",
    aerial_50deg_from_top_zoom_50: "50° from top — zoom 50% (classic drone oblique)",
  };

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

  /**
   * @param {{ label: string, videoLock: string }[]} gods
   * @param {{ label: string, videoLock: string } | null} background
   * @param {*} prompt3
   * @param {*} videoCatalog
   */
  function buildPrompt3Merged(state) {
    const gods = state.gods || [];
    const background = state.background || null;
    const bgLockAll = String(background?.videoLock || "").trim();
    const priorityRaw = String(state.prompt3?.priorityLines || "").trim();
    if (!bgLockAll) {
      return [
        "Add text in the **Background lock** field (Step 2), then copy **Prompt 3** again.",
        "",
        "Prompt 3 merges that lock with Priority scene beats and your creative choices.",
      ].join("\n");
    }
    if (!priorityRaw) {
      return [
        "Add **Priority scene beats** (Step 3), then copy **Prompt 3** again.",
        "",
        "Those beats drive motion and staging together with the Background lock.",
      ].join("\n");
    }

    const perf = sceneChoice("performance", state.prompt3?.performance);
    const atm = sceneChoice("atmosphere", state.prompt3?.atmosphere);
    const cons = sceneChoice("constraints", state.prompt3?.constraints);
    const camKeys = Array.isArray(state.prompt3?.cameraKeys)
      ? state.prompt3.cameraKeys.map((k) => String(k).trim()).filter(Boolean)
      : ["default_framing"];
    const cam = { keys: camKeys, text: cameraTextFromKeys(camKeys) };
    const moodKeys = Array.isArray(state.prompt3?.moodKeys)
      ? state.prompt3.moodKeys.map((k) => String(k).trim()).filter(Boolean)
      : [];
    const moodLines = moodLinesFromKeys(moodKeys);
    const hasMood = moodLines.length > 0;
    const multiFig = gods.length >= 2;
    const bgLock = String(background.videoLock || "").trim();
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
        state.prompt3?.videoSubId
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
      "The paragraph may be **longer** when the locks below are detailed: **fidelity to those locks matters more than brevity**.",
      "",
    ];

    if (priorityRaw.length > 0) {
      lines.push(
        "=== PRIORITY SCENE BEATS (highest — use these lines first) ===",
        "If anything later in this message disagrees with this block on pose, action, props, motion, composition intent, or dynamics, **follow this block**.",
        multiFig
          ? "Still keep **every locked figure** and the place recognizable per the locks below unless this block explicitly rewrites an element (e.g. mount, seating, interaction)."
          : gods.length
            ? "Still keep the deity and place recognizable per the locks below unless this block explicitly rewrites an element (e.g. mount, seating)."
            : "Still keep the place recognizable per the environment lock below unless this block explicitly rewrites an element.",
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
    lines.push(
      "=== LOCKED — SETTING (must honor — do not replace with vague “mountains”) ===",
      `Place: ${background.label}.`,
      bgLock
        ? `Environment lock (carry terrain, sky, weather, light, wind, scale, debris, mood—match this prose): ${bgLock}`
        : "Keep scale, materials, and mood consistent with this place.",
      "",
      "=== FIDELITY RULES (critical) ===",
      ...PROMPT3_VERBATIM_QUALIFIER_RULES,
      "- Put lock detail into **natural sentences**, but **do not summarize away** named attributes (jewellery, serpent coils, trishul shape, damru, third eye glow, Neelkanth tone, storm/lightning/wind, rocky peaks, etc.).",
      multiFig
        ? "- **Priority scene beats** (if present above) control **action, motion, and dramatic beat**. Locks control **how each figure and the place look** during that action."
        : gods.length
          ? "- **Priority scene beats** (if present above) control **action, motion, and dramatic beat** (e.g. descent, trishul swing, intensity). Locks control **how the figure and place look** during that action."
          : "- **Priority scene beats** control **action, motion, and dramatic beat**. The **environment lock** controls **how the place looks** during that action.",
      multiFig
        ? "- If priority motion seems intense, still describe **each** locked figure using that figure’s **character lock**—not a generic silhouette."
        : gods.length
          ? "- If priority motion seems intense, still describe the figure using the **character lock’s** materials and anatomy—not a generic warrior silhouette."
          : "- If priority motion seems intense, keep staging coherent with the **environment lock** and **priority beats**—do not invent contradictory layout.",
      "- The **Video style** section below must read clearly in your paragraph (e.g. VFX/CGI fantasy elemental FX—use wording consistent with that selection).",
      "- Omit a lock clause **only** when this camera angle clearly cannot show it; otherwise keep it.",
      ...(perfLine
        ? []
        : [
            gods.length
              ? "- **Performance** is **None** — do **not** impose a default performance preset (e.g. hero stance / standing calm / grounded stillness). Motion comes from **priority scene beats** when present, otherwise from the character lock—preserve flight, descent, mid-air action, etc. when beats imply them."
              : "- **Performance** is **None** — do **not** impose a default performance preset (e.g. hero stance / standing calm / grounded stillness). Motion comes from **priority scene beats** and the environment lock when beats imply flight, descent, mid-air action, etc.",
          ]),
      ...(!atmLine
        ? [
            "- **Atmosphere** is **None** — do **not** impose a default lighting/mood template (e.g. golden hour only); infer sky, weather, and light from the **environment lock** and **priority beats** when consistent.",
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

    const combineParts = [
      multiFig ? "each figure’s distinct look" : gods.length === 1 ? "figure look" : "story motion from beats",
      "place look",
      "camera",
    ];
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
      : gods.length
        ? `- Combines ${combineParts.join(", ")}.${noneNote}`
        : `- Combines ${combineParts.join(", ")}—character appearance is driven only by **priority beats**, not catalog locks.${noneNote}`;

    const whatWrite = [
      "=== WHAT TO WRITE ===",
      "Compose **one** coherent paragraph that:",
      gods.length
        ? "- **Embeds** the Character lock(s) and Environment lock with **high fidelity**—not a shortened recap—**and** keeps **verbatim** hard-limit phrases from those locks and from **priority beats** when present (*strictly*, *exactly*, *only one*, etc.)."
        : "- **Embeds** the Environment lock with **high fidelity**—not a shortened recap—**and** keeps **verbatim** hard-limit phrases from that lock and from **priority beats** when present (*strictly*, *exactly*, *only one*, etc.).",
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
            : "- Where Priority clashes with a mild dropdown row (performance, atmosphere, or camera), **Priority wins** for action intensity; still honor the environment lock and beat wording."
          : gods.length
            ? "- Where Priority clashes with mild camera framing, **Priority wins** for action intensity; still describe costume, anatomy, and setting cues per the locks."
            : "- Where Priority clashes with mild camera framing, **Priority wins** for action intensity; still honor the environment lock and beat wording.",
        "- Keep edits readable unless Priority asks for fierce motion (then match that energy while keeping lock-accurate costume and setting)."
      );
    } else {
      whatWrite.push(
        "- Does **not** contradict the locks.",
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
    videoSubId
  ) {
    const n = camKeys.length;
    const camMap = PROMPT3_SCENE_EXPAND.camera;
    const godList = gods;
    const bgLock = String(background.videoLock || "").trim();
    const perfLine = hasExpandLine(perf);
    const atmLine = hasExpandLine(atm);
    const consLine = hasExpandLine(cons);
    const multiFig = godList.length >= 2;
    const idKeep =
      godList.length >= 2
        ? "**identical** locked figures (each entity keeps its **own** name, anatomy, and costume—never merge two into one)"
        : godList.length === 1
          ? "**identical** deity identity"
          : "**continuous** staging from **priority beats** and the **environment lock**";

    let beatIntroSecond;
    if (perfLine && atmLine && consLine) {
      beatIntroSecond = `Keep **one** continuous beat: ${idKeep}, **identical** place and environment, **identical** motion / performance, atmosphere, and constraints as in the shared blocks. **Do not** invent new story beats, time jumps, costume changes, or location changes between scenes.`;
    } else if (!perfLine && !atmLine && !consLine) {
      beatIntroSecond = `Keep **one** continuous beat: ${idKeep}, **identical** place and environment. **Performance**, **Atmosphere**, and **Constraints** are all **None** — do **not** invent default stance, lighting recipe, or constraint stack; use **locks**, **priority scene beats** (when present), and **video style** only. **Do not** invent new story beats, time jumps, costume changes, or location changes between scenes.`;
    } else {
      const have = [];
      if (perfLine) have.push("motion / performance");
      if (atmLine) have.push("atmosphere");
      if (consLine) have.push("constraints");
      const miss = [];
      if (!perfLine) miss.push("**Performance = None**");
      if (!atmLine) miss.push("**Atmosphere = None**");
      if (!consLine) miss.push("**Constraints = None**");
      beatIntroSecond = `Keep **one** continuous beat: ${idKeep}, **identical** place and environment, **identical** ${have.join(", ")} as in the shared blocks (${miss.join("; ")}—for omitted rows, follow **priority scene beats** and locks only). **Do not** invent new story beats, time jumps, costume changes, or location changes between scenes.`;
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

    if (priorityRaw.length > 0) {
      lines.push(
        "=== PRIORITY SCENE BEATS (highest — same beat for every scene’s paragraph) ===",
        perfLine
          ? "If anything disagrees with performance defaults on pose, action, props, motion, or dynamics, **follow this block** for every scene."
          : "**Performance = None** — this block is the primary driver of motion and staging (e.g. flight, descent, strikes); do **not** contradict it with a generic grounded stance.",
        ...(!atmLine
          ? [
              "**Atmosphere = None** — infer light, sky, and mood from the **environment lock** and this block, not a fixed atmosphere preset.",
            ]
          : []),
        ...(!consLine
          ? [
              "**Constraints = None** — do not stack extra rule lines unless this block or locks require them.",
            ]
          : []),
        multiFig
          ? "Still keep **every locked figure** and the place recognizable per the locks unless this block explicitly rewrites an element."
          : godList.length
            ? "Still keep the deity and place recognizable per the locks unless this block explicitly rewrites an element."
            : "Still keep the place recognizable per the environment lock unless this block explicitly rewrites an element.",
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
    lines.push(
      "=== LOCKED — SETTING (every scene) ===",
      `Place: ${background.label}.`,
      bgLock
        ? `Environment lock (match in every paragraph): ${bgLock}`
        : "Keep scale, materials, and mood consistent with this place.",
      "",
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
            "- **Atmosphere** is **None** — do **not** force a default lighting/mood template; keep sky, weather, and light coherent with the **environment lock** in every paragraph.",
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
      const title = PROMPT3_CAMERA_OPTION_LABELS[key] || key;
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
        : `- Matches **video style** from the shared blocks only (**Performance**, **Atmosphere**, and **Constraints** are **None** — use locks and beats for the rest).`;

    lines.push(
      "=== WHAT TO WRITE ===",
      `Write **${n}** English paragraphs total (one per scene). Each paragraph:`,
      multiFig
        ? "- **Embeds** the Character locks (**every** listed figure) and the Environment lock with high fidelity, including **verbatim** hard-limit phrases from the locks and beats when present (*strictly*, *exactly*, *only one*, etc.)."
        : godList.length
          ? "- **Embeds** the Character and Environment locks with high fidelity, including **verbatim** hard-limit phrases from the locks and beats when present (*strictly*, *exactly*, *only one*, etc.)."
          : "- **Embeds** the Environment lock with high fidelity, including **verbatim** hard-limit phrases from that lock and beats when present (*strictly*, *exactly*, *only one*, etc.). Character staging follows **priority beats**.",
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
          : "- Same action / emotional beat as the others; **no** new plot or props beyond what **priority beats** and the environment lock imply.",
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

  window.MythologyMobilePromptEngine = {
    buildPrompt1,
    buildPrompt2,
    buildPrompt3Merged,
    PROMPT3_CAMERA_OPTION_LABELS,
    PROMPT3_MOOD_EXPAND,
  };
})();
