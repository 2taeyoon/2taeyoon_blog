export default function Overlay() {
  return (
    <div style={{ position: "absolute", bottom: 40, right: 40, zIndex: 3 }}>
      <p
        style={{
          flex: "1 1 0%",
          fontSize: 12,
          lineHeight: "1em",
          textAlign: "right",
          color: "black",
        }}
      >
        <a
          href="https://github.com/2taeyoon"
          target="_blank"
          rel="noreferrer"
        >
          github
        </a>
      </p>
    </div>
  );
}
