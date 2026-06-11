export default function Underlay() {
  return (
    <div className="underlay">
      <div className="underlay_top_row">
        <p className="underlay_logo">2taeyoon.com</p>
        <div className="underlay_nav">
          <p className="underlay_nav_item">HOME</p>
          <p className="underlay_nav_item">ABOUT</p>
          <p className="underlay_nav_item">PROJECT</p>
          <p className="underlay_nav_item">SKILL</p>
        </div>
        <p className="underlay_bracket">⎑</p>
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
