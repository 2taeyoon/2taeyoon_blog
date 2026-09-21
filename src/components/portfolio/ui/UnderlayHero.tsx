interface UnderlayHeroProps {
  visible: boolean;
}

export default function UnderlayHero({ visible }: UnderlayHeroProps) {
  return (
    <div className="underlay">
      <div
        className={`underlay_hero${visible ? " is_visible" : ""}`}
        aria-hidden={!visible}
      >
        <div className="underlay_intro_row">
          <div className="underlay_intro_text">
            <div className="underlay_intro_text_ko">
              미학과 기술을 하나씩 조립해 완성해 나갑니다.
            </div>
            <div className="underlay_intro_text_en">
              Assembling aesthetics and technology piece by piece.
            </div>
          </div>
        </div>

        <div className="underlay_title_row" />

        <div className="underlay_bottom_row">
          <div className="underlay_roles">
            <div>Frontend</div>
            <div>Backend</div>
          </div>
          <div className="underlay_gutter" />
          <p className="underlay_drag_hint">Move and drag the mouse</p>
          <div className="underlay_gutter" />
          <div className="underlay_roles_right">
            <div className="underlay_scroll_down">
              <span>Scroll Down</span>
              <svg
                className="underlay_scroll_down_icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M12 4V19M6.5 13.5L12 19L17.5 13.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
