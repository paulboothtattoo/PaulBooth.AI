(() => {
  "use strict";

  const MEDIA_SELECTOR = [
    "img",
    "video",
    "audio",
    "picture",
    "source",
    ".protected-image",
    ".realm-card-image",
    ".about-photo-frame",
    ".visions-photo-card",
    ".visions-lightbox",
    ".folder-media-preview",
    ".motion-folder-preview",
    ".manifest-machine-preview",
    ".bb-gallery",
    ".bb-video-shell"
  ].join(",");

  const isProtectedTarget = (target) =>
    target instanceof Element && Boolean(target.closest(MEDIA_SELECTOR));

  const protectImage = (image) => {
    image.draggable = false;
    image.setAttribute("draggable", "false");
    image.setAttribute("oncontextmenu", "return false;");
  };

  const protectVideo = (video) => {
    video.setAttribute("controlsList", "nodownload noremoteplayback nofullscreen");
    video.controlsList?.add?.("nodownload");
    video.controlsList?.add?.("noremoteplayback");
    video.disablePictureInPicture = true;
    video.setAttribute("disablePictureInPicture", "");
    video.setAttribute("disableremoteplayback", "");
    video.setAttribute("oncontextmenu", "return false;");
    video.setAttribute("draggable", "false");
  };

  const protectAudio = (audio) => {
    audio.setAttribute("controlsList", "nodownload noremoteplayback");
    audio.controlsList?.add?.("nodownload");
    audio.controlsList?.add?.("noremoteplayback");
    audio.setAttribute("disableremoteplayback", "");
    audio.setAttribute("oncontextmenu", "return false;");
    audio.setAttribute("draggable", "false");
  };

  const protectMedia = (root = document) => {
    root.querySelectorAll?.("img").forEach(protectImage);
    root.querySelectorAll?.("video").forEach(protectVideo);
    root.querySelectorAll?.("audio").forEach(protectAudio);
  };

  document.addEventListener("contextmenu", (event) => {
    if (!isProtectedTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  document.addEventListener("dragstart", (event) => {
    if (!isProtectedTarget(event.target)) return;
    event.preventDefault();
  }, true);

  document.addEventListener("selectstart", (event) => {
    if (!isProtectedTarget(event.target)) return;
    event.preventDefault();
  }, true);

  document.addEventListener("copy", (event) => {
    if (!isProtectedTarget(event.target)) return;
    event.preventDefault();
  }, true);

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const blockedShortcut =
      (event.ctrlKey || event.metaKey) &&
      ["s", "u", "p"].includes(key);

    if (blockedShortcut) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;

        if (node.matches("img")) protectImage(node);
        if (node.matches("video")) protectVideo(node);
        if (node.matches("audio")) protectAudio(node);

        protectMedia(node);
      }
    }
  });

  const start = () => {
    protectMedia(document);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
