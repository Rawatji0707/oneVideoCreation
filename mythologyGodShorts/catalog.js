/**
 * Default video style + tiny offline fallback if JSON fetch fails (e.g. file://).
 * Primary data: godCharacter.json, backgroundCharacter.json, prioritySceneBeats.json, VideoStyle.json, EditingState.json.
 * Merged catalogs are cached in localStorage after load; clear storage + reload to refresh from JSON.
 */
(function () {
  window.MythologyMobileDefaultVideoStyle = {
    mainStyles: [
      {
        id: "cinematic",
        label: "Cinematic mythic",
        subcategories: [
          {
            id: "vfx_fantasy",
            label: "VFX fantasy realism",
            hint: "Premium cinematic lighting, volumetric god-rays, subtle film grain, epic scale without clutter.",
          },
          {
            id: "naturalistic",
            label: "Naturalistic sacred",
            hint: "Grounded textures, soft daylight, believable materials, restrained magic in environment only.",
          },
        ],
      },
      {
        id: "stylized",
        label: "Stylized",
        subcategories: [
          {
            id: "painterly",
            label: "Painterly epic",
            hint: "Rich color grading, brushstroke-like atmosphere, readable silhouettes, mythic illustration feel.",
          },
        ],
      },
    ],
  };

  window.MythologyMobileCatalogFallback = {
    gods: {
      gods: [
        {
          id: "shiva",
          label: "Shiva",
          versions: [
            {
              id: "version1",
              label: "version1 - basic",
              videoLock: "[Shiva] : divine male deity, serene meditative presence",
            },
          ],
        },
      ],
    },
    backgrounds: {
      backgrounds: [
        {
          id: "kailash",
          label: "Kailash",
          versions: [
            {
              id: "version1",
              label: "version 1 - basic",
              videoLock:
                "[Kailash] : snow-capped sacred peaks, crisp high-altitude light, quiet vast scale",
            },
          ],
        },
      ],
    },
    videoStyle: window.MythologyMobileDefaultVideoStyle,
  };
})();
