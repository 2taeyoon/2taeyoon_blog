"use client";

import { SKILL_CATEGORIES } from "@/data/portfolio/skills";
import type { SceneId } from "@/lib/portfolio/scenes";

interface SceneContentProps {
  scene: SceneId;
  visible: boolean;
}

/** Main 이외 Scene들의 DOM 콘텐츠 — 같은 큐브 안에서 Scene만 교체된다 */
export default function SceneContent({ scene, visible }: SceneContentProps) {
  if (scene === "main") return null;

  return (
    <div className={`scene_overlay${visible ? " is_visible" : ""}`} aria-hidden={!visible}>
      {scene === "about" && (
        <div className="scene_overlay_inner">
          <span className="scene_tag">ABOUT</span>
          <h2 className="scene_title">
            Design-minded
            <br />
            Front-end Developer
          </h2>
          <p className="scene_desc">
            디자인 감각을 지닌 프론트엔드 개발자 이태윤입니다.
            <br />
            UI/UX 디자인부터 퍼블리싱, 프론트엔드, 백엔드까지
            <br />
            화면에 보이는 경험 전체를 만드는 것을 좋아합니다.
          </p>
        </div>
      )}

      {scene === "skills" && (
        <div className="scene_overlay_inner">
          <span className="scene_tag">SKILLS</span>
          <h2 className="scene_title">What I can do</h2>
          <div className="scene_skill_list">
            {SKILL_CATEGORIES.map((category) => (
              <div key={category.id} className="scene_skill_category">
                <h3 className="scene_skill_label">{category.label}</h3>
                <div className="scene_skill_chips">
                  {category.skills.map((skill) => (
                    <span key={skill} className="scene_skill_chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scene === "projects" && (
        <div className="scene_overlay_inner">
          <span className="scene_tag">PROJECTS</span>
          <h2 className="scene_title">Things I built</h2>
          <div className="scene_project_list">
            <a href="https://www.2taeyoon.com/blog" className="scene_project_card">
              <h3 className="scene_project_name">2taeyoon Blog &amp; Portfolio</h3>
              <p className="scene_project_desc">
                Next.js 기반의 개인 블로그 겸 포트폴리오. React Three Fiber로 만든 인터랙티브 3D 메인과 마크다운 스터디 로그를 담고 있습니다.
              </p>
              <span className="scene_project_stack">Next.js · TypeScript · React Three Fiber</span>
            </a>
            <a href="https://github.com/2taeyoon" target="_blank" rel="noreferrer" className="scene_project_card">
              <h3 className="scene_project_name">More on GitHub</h3>
              <p className="scene_project_desc">그 외 작업과 실험들은 GitHub 저장소에서 확인할 수 있습니다.</p>
              <span className="scene_project_stack">github.com/2taeyoon</span>
            </a>
          </div>
        </div>
      )}

      {scene === "contact" && (
        <div className="scene_overlay_inner">
          <span className="scene_tag">CONTACT</span>
          <h2 className="scene_title">
            Let&apos;s work
            <br />
            together
          </h2>
          <div className="scene_contact_links">
            <a href="https://github.com/2taeyoon" target="_blank" rel="noreferrer" className="scene_contact_link">
              GITHUB
            </a>
            <a href="/blog" className="scene_contact_link">
              BLOG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
