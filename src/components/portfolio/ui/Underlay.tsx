export default function Underlay() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2,
        width: "100%",
        height: "100%",
        padding: 40,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: 0,
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          className="link"
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            flex: "1 1 0%",
            height: 30,
            fontSize: 30,
            fontWeight: "700",
            lineHeight: "30px",
            color: "black",
            letterSpacing: -2,
          }}
        >
          2taeyoon.com
        </p>
        <div style={{ flex: "1 1 0%", display: "flex", gap: "2em" }}>
          <p
            className="full"
            style={{
              flex: "1 1 0%",
              height: 12,
              fontSize: 12,
              lineHeight: "12px",
              textAlign: "center",
              color: "black",
              whiteSpace: "nowrap",
            }}
          >
            HOME
          </p>
          <p
            className="full"
            style={{
              flex: "1 1 0%",
              height: 12,
              fontSize: 12,
              lineHeight: "12px",
              textAlign: "center",
              color: "black",
            }}
          >
            ABOUT
          </p>
          <p
            className="full"
            style={{
              flex: "1 1 0%",
              height: 12,
              fontSize: 12,
              lineHeight: "12px",
              textAlign: "center",
              color: "black",
            }}
          >
            PROJECT
          </p>
          <p
            className="full"
            style={{
              flex: "1 1 0%",
              height: 12,
              fontSize: 12,
              lineHeight: "12px",
              textAlign: "center",
              color: "black",
            }}
          >
            SKILL
          </p>
        </div>
        <p
          style={{
            flex: "1 1 0%",
            height: 30,
            fontSize: 30,
            lineHeight: "30px",
            textAlign: "right",
            color: "black",
          }}
        >
          ⎑
        </p>
      </div>

      <div style={{ height: 60 }} />

      <div
        style={{
          width: "100%",
          padding: 0,
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            flex: "1 1 0%",
            height: "100%",
            fontSize: 12,
            lineHeight: "1.5em",
            color: "black",
          }}
        >
          A front-end developer with a sense of design
          <br />
          <b>—</b>
        </p>
        <div style={{ width: 10 }} />
      </div>

      <div style={{ height: 10 }} />

      <div
        className="full"
        style={{
          width: "100%",
          flex: "1 1 0%",
          padding: 0,
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            flex: "1 1 0%",
            fontSize: 250,
            lineHeight: "1em",
            color: "black",
            margin: 0,
            letterSpacing: -10,
          }}
        >
          FRONT
        </p>
        <div style={{ width: 10 }} />
        <p
          style={{
            flex: "1 1 0%",
            fontSize: 250,
            lineHeight: "100%",
            textAlign: "right",
            color: "black",
            margin: 0,
            letterSpacing: -10,
          }}
        >
          END
        </p>
      </div>

      <div style={{ height: 60 }} />

      <div
        style={{
          pointerEvents: "all",
          cursor: "auto",
          width: "100%",
          padding: 0,
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <p
          className="full"
          style={{
            whiteSpace: "nowrap",
            flex: "1 1 0%",
            fontSize: 12,
            lineHeight: "1.5em",
            color: "black",
          }}
        >
          Designer
          <br />
          Publisher
          <br />
          Developer
        </p>
        <div style={{ width: 10 }} />
        <p
          className="full"
          style={{
            flex: "1 1 0%",
            fontSize: 16,
            fontWeight: "700",
            lineHeight: "1em",
            textAlign: "center",
            color: "black",
            letterSpacing: -0.5,
            whiteSpace: "nowrap",
          }}
        >
          Move and drag the mouse
        </p>
        <div style={{ width: 10 }} />
        <p
          className="full"
          style={{
            flex: "1 1 0%",
            fontSize: 12,
            lineHeight: "1em",
            textAlign: "right",
            color: "black",
          }}
        ></p>
      </div>
    </div>
  );
}
