/** 블로그 상세 URL용 슬러그 — 공백은 `-`, URL을 끊는 문자는 제거 */
export function toBlogSlug(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[?#&]+/g, "");
}
