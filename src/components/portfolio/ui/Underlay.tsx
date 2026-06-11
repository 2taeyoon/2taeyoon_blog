"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Underlay({ onTogglePalette }: { onTogglePalette: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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

  return (
    <div className="underlay">
      <div className="underlay_top_row">
        <p className="underlay_logo">2taeyoon.com</p>
        <div className="underlay_nav">
          <p className="underlay_nav_item">HOME</p>
          <p className="underlay_nav_item">ABOUT</p>
          <p className="underlay_nav_item">PROJECT</p>
          <p className="underlay_nav_item">SKILL</p>
          <Link href="/blog" className="underlay_nav_item underlay_nav_link">BLOG</Link>
        </div>
        <div className="underlay_controls">
          <button type="button" className="underlay_control_button underlay_music_button" onClick={toggleMusic} aria-label={playing ? "배경 음악 정지" : "배경 음악 재생"} aria-pressed={playing}>
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
          <button type="button" className="underlay_control_button underlay_color_button" onClick={onTogglePalette} aria-label="색상 변경 팔레트 열기/닫기">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z" />
            </svg>
            <span>색상 변경</span>
          </button>
        </div>
      </div>

      <div className="underlay_gap underlay_gap_60" />

      <div className="underlay_intro_row">
        <p className="underlay_intro_text">
          A front-end developer with a sense of design
          <br />
          <b>—</b>
        </p>
        <div className="underlay_gutter" />
      </div>

      <div className="underlay_gap underlay_gap_10" />

      <div className="underlay_title_row">
        <p className="underlay_title_front">FRONT</p>
        <div className="underlay_gutter" />
        <p className="underlay_title_end">END</p>
      </div>

      <div className="underlay_gap underlay_gap_60" />

      <div className="underlay_bottom_row">
        <p className="underlay_roles">
          Designer
          <br />
          Publisher
          <br />
          Developer
        </p>
        <div className="underlay_gutter" />
        <p className="underlay_drag_hint">Move and drag the mouse</p>
        <div className="underlay_gutter" />
        <p className="underlay_bottom_spacer" />
      </div>
    </div>
  );
}
