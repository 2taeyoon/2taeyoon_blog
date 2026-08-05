"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface UnderlayProps {
  onTogglePalette: () => void;
  onClosePalette: () => void;
  /** Main Scene 히어로 콘텐츠 표시 여부 (top bar는 항상 유지) */
  heroVisible: boolean;
}

export default function Underlay({ onTogglePalette, onClosePalette, heroVisible }: UnderlayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const graphWiredRef = useRef(false);
  const volumeRef = useRef(100);
  // const unlockHandlerRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const playingRef = useRef(false);

  volumeRef.current = volume;
  playingRef.current = playing;

  const wireAudioGraph = () => {
    if (graphWiredRef.current || !audioRef.current) return;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);
    const gain = ctx.createGain();
    gain.gain.value = volumeRef.current / 100;
    source.connect(gain);
    gain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    gainRef.current = gain;
    graphWiredRef.current = true;
  };

  const resumeAudioContext = async () => {
    try {
      await audioCtxRef.current?.resume();
    } catch {
      // ignore
    }
  };

  const applyVolume = (percent: number) => {
    const level = percent / 100;
    if (gainRef.current) {
      gainRef.current.gain.value = level;
    }
    if (audioRef.current) {
      // iOS 등에서 element.volume만으로는 안 줄어드는 경우가 있어 GainNode가 주 경로
      audioRef.current.volume = level;
    }
  };

  const createAudio = () => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio("/audio/Amber_Angles.mp3");
    audio.loop = true;
    audio.volume = volumeRef.current / 100;
    audioRef.current = audio;
    wireAudioGraph();
    return audio;
  };

  const tryPlay = async () => {
    const audio = createAudio();
    await resumeAudioContext();
    try {
      await audio.play();
      setPlaying(true);
      return true;
    } catch {
      setPlaying(false);
      return false;
    }
  };

  // const removeUnlockListeners = () => {
  //   const handler = unlockHandlerRef.current;
  //   if (!handler) return;
  //   window.removeEventListener("pointerdown", handler);
  //   window.removeEventListener("keydown", handler);
  //   unlockHandlerRef.current = null;
  // };

  // --- 현재: 처음 렌더링 시 자동 재생 (차단되면 첫 클릭/키 입력에 재시도) ---
  // useEffect(() => {
  //   void tryPlay();

  //   // Chrome/Safari 등은 사용자 제스처 없이 audio.play()를 막음 → 첫 상호작용 때 한 번 더 시도
  //   const unlockOnInteraction = () => {
  //     void tryPlay().then((ok) => {
  //       if (ok) removeUnlockListeners();
  //     });
  //   };
  //   unlockHandlerRef.current = unlockOnInteraction;
  //   window.addEventListener("pointerdown", unlockOnInteraction);
  //   window.addEventListener("keydown", unlockOnInteraction);

  //   return () => {
  //     removeUnlockListeners();
  //     audioRef.current?.pause();
  //     audioRef.current = null;
  //     void audioCtxRef.current?.close();
  //     audioCtxRef.current = null;
  //     gainRef.current = null;
  //     graphWiredRef.current = false;
  //   };
  // // eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 시 1회만 실행
  // }, []);

  // --- 개발 시: 처음 렌더링 시 자동 재생 없음 ---
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // 다른 탭/창으로 포커스가 떠나면 일시정지, 다시 돌아오면 재생 중이던 경우만 재개
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        audioRef.current?.pause();
        void audioCtxRef.current?.suspend();
        return;
      }
      if (!playingRef.current || !audioRef.current) return;
      void (async () => {
        try {
          await audioCtxRef.current?.resume();
          await audioRef.current?.play();
        } catch {
          // 브라우저 자동재생 정책 등으로 실패하면 UI는 유지
        }
      })();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const toggleMusic = () => {
    const audio = createAudio();

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void tryPlay();
    }
  };

  const volumeSliderRef = useRef<HTMLInputElement>(null);

  const handleVolumeChange = (next: number) => {
    const clamped = Math.min(100, Math.max(0, next));
    setVolume(clamped);
    createAudio();
    void resumeAudioContext();
    applyVolume(clamped);
  };

  const setVolumeFromClientX = (clientX: number) => {
    const slider = volumeSliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    handleVolumeChange(Math.round(ratio * 100));
  };

  // 터치 기기에서는 setPointerCapture가 네이티브 range 슬라이더를 막으므로 마우스에서만 사용
  const onVolumeSliderPointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.pointerType !== "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setVolumeFromClientX(e.clientX);
  };

  const onVolumeSliderPointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    if (e.pointerType !== "mouse") return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.stopPropagation();
    setVolumeFromClientX(e.clientX);
  };

  const onVolumeSliderPointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    if (e.pointerType !== "mouse") return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // 볼륨 창과 팔레트 창은 동시에 열리지 않도록 서로 닫아줌
  const toggleVolume = () => {
    setVolumeOpen((prev) => !prev);
    onClosePalette();
  };

  const togglePalette = () => {
    setVolumeOpen(false);
    onTogglePalette();
  };

  // 클릭이 캔버스(window pointerdown)로 전파되어 큐브가 따라오는 것을 차단
  const blockPointer = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div className="underlay">
      <div className="underlay_top_row">
        <p className="underlay_logo">2taeyoon.com</p>
        <div className="underlay_nav" onPointerDown={blockPointer}>
          <Link href="/blog" className="underlay_nav_item underlay_nav_link">BLOG</Link>
          <a href="https://github.com/2taeyoon" target="_blank" rel="noreferrer" className="underlay_nav_item underlay_nav_link">GITHUB</a>
        </div>
        <div className="underlay_controls" onPointerDown={blockPointer}>
          <button type="button" className="underlay_control_button" onClick={toggleMusic} aria-label={playing ? "배경 음악 정지" : "배경 음악 재생"} aria-pressed={playing}>
            {playing ? (
              <svg className="underlay_music_icon" viewBox="0 0 48 24" width="24" height="24" aria-hidden="true">
                <path className="underlay_music_wave_path" d="M0 12 Q 6 4 12 12 T 24 12 T 36 12 T 48 12 T 60 12 T 72 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="underlay_music_icon" viewBox="0 0 48 24" width="24" height="24" aria-hidden="true">
                <line x1="6" y1="12" x2="42" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <div className="underlay_volume_wrap">
            <button type="button" className="underlay_control_button" onClick={toggleVolume} aria-label="볼륨 조절 열기/닫기" aria-expanded={volumeOpen}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
            {volumeOpen && (
              <div className="underlay_volume_panel" onPointerDown={blockPointer}>
                <div className="underlay_volume_row">
                  <input
                    ref={volumeSliderRef}
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    onInput={(e) => handleVolumeChange(Number(e.currentTarget.value))}
                    onPointerDown={onVolumeSliderPointerDown}
                    onPointerMove={onVolumeSliderPointerMove}
                    onPointerUp={onVolumeSliderPointerUp}
                    onPointerCancel={onVolumeSliderPointerUp}
                    className="underlay_volume_slider"
                    aria-label="앱 재생 볼륨"
                  />
                  <span className="underlay_volume_value">{volume}</span>
                </div>
              </div>
            )}
          </div>
          <button type="button" className="underlay_control_button" onClick={togglePalette} aria-label="색상 변경 팔레트 열기/닫기">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`underlay_hero${heroVisible ? " is_visible" : ""}`} aria-hidden={!heroVisible}>
        <div className="underlay_intro_row">
          <div className="underlay_intro_text">
            <div>Assembling aesthetics and technology piece by piece.</div>
            <div className="underlay_intro_dash">—</div>
          </div>
        </div>

        <div className="underlay_title_row">
          <p className="underlay_title_front"></p>
          <p className="underlay_title_end"></p>
        </div>

        <div className="underlay_bottom_row">
          <div className="underlay_roles">
            <div>Frontend</div>
            <div>Backend</div>
          </div>
          <div className="underlay_gutter" />
          <p className="underlay_drag_hint">Move and drag the mouse</p>
          <div className="underlay_gutter" />
          <div className="underlay_roles_right">
            <div>Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
