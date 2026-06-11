"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface UnderlayProps {
  onTogglePalette: () => void;
  onClosePalette: () => void;
}

export default function Underlay({ onTogglePalette, onClosePalette }: UnderlayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [volumeOpen, setVolumeOpen] = useState(false);

  // 언마운트 시 음악 정지
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/Amber_Angles.mp3");
      audio.loop = true; // 곡이 끝나면 처음부터 다시 재생
      audio.volume = volume / 100;
      audioRef.current = audio;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleVolumeChange = (next: number) => {
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next / 100;
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
              <div className="underlay_volume_panel">
                <input type="range" min={0} max={100} value={volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} className="underlay_volume_slider" aria-label="볼륨" />
                <span className="underlay_volume_value">{volume}</span>
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

      <div className="underlay_intro_row">
        <div className="underlay_intro_text">
          <div>A front-end developer with a sense of design</div>
          <div className="underlay_intro_dash">—</div>
        </div>
      </div>

      <div className="underlay_title_row">
        <p className="underlay_title_front">FRONT</p>
        <p className="underlay_title_end">END</p>
      </div>

      <div className="underlay_bottom_row">
        <div className="underlay_roles">
          <div>UI/UX Designer</div>
          <div>Web Publisher</div>
        </div>
        <div className="underlay_gutter" />
        <p className="underlay_drag_hint">Move and drag the mouse</p>
        <div className="underlay_gutter" />
        <div className="underlay_roles_right">
          <div>Frontend Developer</div>
          <div>Backend Developer</div>
        </div>
      </div>
    </div>
  );
}
