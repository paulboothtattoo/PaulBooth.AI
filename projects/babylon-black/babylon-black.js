(() => {
  "use strict";

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  };

  const player = document.querySelector("[data-player]");

  if (player) {
    const audio = player.querySelector("[data-audio]");
    const title = player.querySelector("[data-now-title]");
    const note = player.querySelector("[data-now-note]");
    const tracks = Array.from(player.querySelectorAll("[data-src]"));
    const playButton = player.querySelector("[data-play]");
    const muteButton = player.querySelector("[data-mute]");
    const volumeControl = player.querySelector("[data-volume]");
    const seek = player.querySelector("[data-seek]");
    const currentTime = player.querySelector("[data-current-time]");
    const duration = player.querySelector("[data-duration]");

    let currentTrackIndex = Math.max(
      0,
      tracks.findIndex((track) => track.classList.contains("active"))
    );

    audio.controls = false;
    audio.setAttribute("controlsList", "nodownload noremoteplayback");
    audio.setAttribute("disableremoteplayback", "");
    audio.disablePictureInPicture = true;

    const setActiveTrack = () => {
      tracks.forEach((track, index) => {
        track.classList.toggle("active", index === currentTrackIndex);
      });
    };

    const updatePlayLabel = () => {
      if (!playButton) return;
      playButton.textContent = audio.paused ? "Play" : "Pause";
      playButton.setAttribute("aria-label", audio.paused ? "Play" : "Pause");
    };

    const updateTimeline = () => {
      if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
      if (duration) duration.textContent = formatTime(audio.duration);
      if (seek && Number.isFinite(audio.duration) && audio.duration > 0) {
        seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
      }
    };

    const play = () => {
      const result = audio.play();
      if (result && typeof result.catch === "function") {
        result.catch((error) => {
          console.warn("[ZION_LOST_PLAYER] Playback failed:", error);
        });
      }
    };

    const loadTrack = (index, autoplay) => {
      if (!audio || !tracks.length) return;

      currentTrackIndex = (index + tracks.length) % tracks.length;
      const track = tracks[currentTrackIndex];

      setActiveTrack();
      if (title) title.textContent = track.dataset.title || "";
      if (note) note.textContent = track.dataset.note || "";

      audio.pause();
      audio.removeAttribute("src");
      audio.src = track.dataset.src;
      audio.preload = "metadata";
      audio.load();

      if (autoplay) {
        audio.addEventListener("canplay", play, { once: true });
      }
    };

    tracks.forEach((track, index) => {
      track.querySelector("button")?.addEventListener("click", () => {
        loadTrack(index, true);
      });
    });

    playButton?.addEventListener("click", () => {
      if (audio.paused) play();
      else audio.pause();
    });

    const updateVolumeLabel = () => {
      if (!muteButton) return;
      muteButton.textContent = audio.muted || audio.volume === 0 ? "Muted" : "Sound";
    };

    muteButton?.addEventListener("click", () => {
      audio.muted = !audio.muted;
      updateVolumeLabel();
    });

    volumeControl?.addEventListener("input", () => {
      const nextVolume = Math.min(1, Math.max(0, Number(volumeControl.value)));
      audio.volume = nextVolume;
      audio.muted = nextVolume === 0;
      updateVolumeLabel();
    });

    audio.addEventListener("volumechange", () => {
      if (volumeControl && !audio.muted) {
        volumeControl.value = String(audio.volume);
      }
      updateVolumeLabel();
    });

    seek?.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    });

    audio.addEventListener("play", updatePlayLabel);
    audio.addEventListener("pause", updatePlayLabel);
    audio.addEventListener("loadedmetadata", updateTimeline);
    audio.addEventListener("durationchange", updateTimeline);
    audio.addEventListener("timeupdate", updateTimeline);
    audio.addEventListener("ended", () => loadTrack(currentTrackIndex + 1, true));
    audio.addEventListener("contextmenu", (event) => event.preventDefault());

    audio.volume = 1;
    if (volumeControl) volumeControl.value = String(audio.volume);
    updatePlayLabel();
    updateVolumeLabel();
    loadTrack(currentTrackIndex, false);
  }

  const dialog = document.querySelector(".bb-lightbox");

  if (dialog) {
    const dialogImg = dialog.querySelector("img");

    document.querySelectorAll(".bb-gallery [data-full]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!dialogImg) return;
        dialogImg.src = button.dataset.full;
        dialog.showModal();
      });
    });

    dialog.querySelector("button")?.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
})();
