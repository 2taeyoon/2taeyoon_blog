"use client";

import "@/styles/pages/home.css";
import CustomCursor from "@/components/ui/CustomCursor";
import DotFieldCanvas from "@/components/canvas/DotFieldCanvas";

const skills = [
	{
		id: "design",
		label: "Design Tools",
		description: "Figma 기반 UI 시안 제작 및 컴포넌트 시스템 설계",
		items: ["Figma", "Photoshop", "Illustrator"],
	},
	{
		id: "frontend",
		label: "Frontend Stack",
		description: "인터랙션과 상태 관리를 고려한 UI 중심 설계",
		items: ["React", "Next.js", "TypeScript", "Zustand", "TanStack Query"],
	},
	{
		id: "backend",
		label: "Backend / BaaS",
		description: "간단한 API 연동과 Supabase 기반 데이터 연동 경험",
		items: ["Supabase", "REST API"],
	},
	{
		id: "devtools",
		label: "Dev Tools",
		description: "협업과 품질 관리를 위한 개발 환경 구성",
		items: ["Git", "Vercel", "ESLint", "Prettier"],
	},
] as const;

const timeline = [
	{
		year: "2022",
		title: "퍼블리셔로 시작",
		role: "웹 퍼블리셔",
		summary: "디자인 시안을 픽셀 단위로 구현하며 마크업과 반응형 레이아웃을 다룸",
		stack: ["HTML", "CSS", "Vanilla JS"],
	},
	{
		year: "2023",
		title: "프론트엔드 전향",
		role: "Frontend Developer",
		summary: "React & Next.js 기반 프로젝트를 진행하며 상태 관리와 라우팅 구조에 집중",
		stack: ["React", "Next.js", "TypeScript"],
	},
	{
		year: "2024",
		title: "인터랙션 중심 UI 설계",
		role: "Frontend Developer",
		summary: "애니메이션과 마이크로 인터랙션을 활용해 사용 경험을 개선하는 데 집중",
		stack: ["Framer Motion", "Canvas", "Design System"],
	},
] as const;

const projects = [
	{
		id: "portfolio",
		title: "인터랙티브 포트폴리오",
		role: "Frontend / UI Engineer",
		description: "캔버스와 커스텀 커서를 활용해 인터랙션에 집중한 개인 포트폴리오",
		highlights: ["App Router 구조 설계", "Canvas 기반 배경 인터랙션", "다크 모드 우선 설계"],
		tech: ["Next.js", "TypeScript", "Framer Motion", "Canvas"],
	},
	{
		id: "dashboard",
		title: "모니터링 대시보드 UI",
		role: "Frontend Developer",
		description: "실시간 지표를 시각적으로 표현하는 대시보드 레이아웃 구현",
		highlights: ["카드 그리드 시스템", "상태에 따른 강조 색상 설계", "반응형 레이아웃"],
		tech: ["React", "Recharts", "Tailwind CSS"],
	},
	{
		id: "design-system",
		title: "마이크로 UX 컴포넌트 킷",
		role: "UI Engineer",
		description: "버튼, 토글, 토스트 등 마이크로 UX 컴포넌트를 정리한 라이브러리",
		highlights: ["상태 기반 애니메이션", "토큰 기반 스타일링", "접근성 고려 포커스 스타일"],
		tech: ["React", "Storybook", "Framer Motion"],
	},
] as const;

const interactions = [
	{
		id: "cursor",
		title: "Custom Cursor & Canvas",
		description: "포인터 움직임에 따라 반응하는 커스텀 커서와 캔버스 배경",
		tag: "Pointer Interaction",
	},
	{
		id: "scroll",
		title: "Scroll-based Reveal",
		description: "스크롤 진행에 따라 섹션이 부드럽게 등장하는 애니메이션",
		tag: "Scroll Animation",
	},
	{
		id: "state",
		title: "State-driven UI",
		description: "상태에 따라 카드 레이아웃과 강조 요소가 변하는 인터랙션",
		tag: "Stateful UI",
	},
] as const;

export default function Home() {
	return (
		<>
			<DotFieldCanvas />
			<CustomCursor />

			<main className="home_page">
				{/* Hero Section */}
				<section className="home_section home_hero">
					<div className="home_hero_badge">Frontend · Interaction · UI Engineering</div>
					<h1 className="home_hero_title">
						인터랙션에 강한
						<br />
						프론트엔드 개발자
					</h1>
					<p className="home_hero_sub">
						코드보다 경험에 집중해, 화면 전환·마이크로 인터랙션·상태 변화를 설계하는
						<br />
						프론트엔드 개발자 <strong>2taeyoon</strong> 입니다.
					</p>

					<div className="home_hero_actions">
						<a href="#projects" className="home_button home_button_primary">
							프로젝트 먼저 보기
						</a>
						<a href="#skills" className="home_button home_button_secondary">
							스킬 & 경력 살펴보기
						</a>
					</div>

					<div className="home_hero_meta">
						<span>Interaction-focused Frontend Developer</span>
						<span>Based in Korea · Open to remote</span>
					</div>

					<div className="home_scroll_hint">
						<span>Scroll to explore</span>
					</div>
				</section>

				{/* Skills Section */}
				<section id="skills" className="home_section home_skills">
					<header className="home_section_header">
						<h2>인터랙티브 스킬 스택</h2>
						<p>아이콘 나열이 아닌, 실제로 어떻게 사용하는지에 집중한 기술 스택입니다.</p>
					</header>

					<div className="home_skills_grid">
						{skills.map((group) => (
							<div key={group.id} className="home_skill_group">
								<div className="home_skill_header">
									<span className="home_skill_label">{group.label}</span>
									<p className="home_skill_desc">{group.description}</p>
								</div>
								<ul className="home_skill_list">
									{group.items.map((item) => (
										<li key={item} className="home_skill_item">
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>

				{/* Timeline Section */}
				<section id="timeline" className="home_section home_timeline">
					<header className="home_section_header">
						<h2>경력 타임라인</h2>
						<p>퍼블리셔에서 인터랙션 중심 프론트엔드 개발자로 이어지는 흐름입니다.</p>
					</header>

					<ol className="home_timeline_list">
						{timeline.map((item) => (
							<li key={item.year} className="home_timeline_item">
								<div className="home_timeline_year">{item.year}</div>
								<div className="home_timeline_content">
									<h3>{item.title}</h3>
									<p className="home_timeline_role">{item.role}</p>
									<p className="home_timeline_summary">{item.summary}</p>
									<ul className="home_timeline_stack">
										{item.stack.map((tech) => (
											<li key={tech}>{tech}</li>
										))}
									</ul>
								</div>
							</li>
						))}
					</ol>
				</section>

				{/* Projects Section */}
				<section id="projects" className="home_section home_projects">
					<header className="home_section_header">
						<h2>프로젝트 하이라이트</h2>
						<p>무엇을 만들었는가보다, 어떻게 만들었는가에 집중한 프로젝트들입니다.</p>
					</header>

					<div className="home_projects_grid">
						{projects.map((project) => (
							<article key={project.id} className="home_project_card">
								<div className="home_project_header">
									<h3>{project.title}</h3>
									<span className="home_project_role">{project.role}</span>
								</div>
								<p className="home_project_desc">{project.description}</p>
								<ul className="home_project_highlights">
									{project.highlights.map((highlight) => (
										<li key={highlight}>{highlight}</li>
									))}
								</ul>
								<div className="home_project_footer">
									<ul className="home_project_tech">
										{project.tech.map((tech) => (
											<li key={tech}>{tech}</li>
										))}
									</ul>
									<button type="button" className="home_project_button">
										상세 보기
									</button>
								</div>
							</article>
						))}
					</div>
				</section>

				{/* Interaction Showcase */}
				<section id="interactions" className="home_section home_interactions">
					<header className="home_section_header">
						<h2>Interaction & Micro UX</h2>
						<p>말로 설명하지 않고, 직접 보여줄 수 있는 인터랙션 요소들입니다.</p>
					</header>

					<div className="home_interactions_grid">
						{interactions.map((item) => (
							<div key={item.id} className="home_interaction_card">
								<div className="home_interaction_tag">{item.tag}</div>
								<h3>{item.title}</h3>
								<p>{item.description}</p>
								<p className="home_interaction_hint">이 페이지 곳곳에서 직접 경험해 보실 수 있습니다.</p>
							</div>
						))}
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="home_section home_about">
					<header className="home_section_header">
						<h2>About & Background</h2>
						<p>편집디자인 기반의 시각 경험 위에, 프론트엔드 개발 역량을 쌓아왔습니다.</p>
					</header>

					<div className="home_about_grid">
						<div className="home_about_block">
							<h3>디자인에서 개발까지</h3>
							<p>
								레이아웃, 타이포그래피, 컬러 시스템을 이해하는 디자이너적 시선으로 UI를 바라봅니다.
								이후 퍼블리싱과 프론트엔드 개발을 거치며, 디자인과 개발 사이의 간극을 줄이는 역할을 해왔습니다.
							</p>
						</div>
						<div className="home_about_block">
							<h3>개발 성향</h3>
							<p>
								&apos;눈에 보이는 경험&apos;을 중심에 두고 상태 관리와 컴포넌트 구조를 설계합니다.
								과한 효과보다는, 의도가 분명한 인터랙션과 자연스러운 플로우를 선호합니다.
							</p>
						</div>
					</div>
				</section>

				{/* Contact / CTA Section */}
				<section id="contact" className="home_section home_contact">
					<header className="home_section_header">
						<h2>Contact & Links</h2>
						<p>부담 없이, 필요하신 방식으로 연락 주세요.</p>
					</header>

					<div className="home_contact_grid">
						<div className="home_contact_block">
							<h3>연락처</h3>
							<ul>
								<li>
									<span>Email</span>
									<a href="mailto:taeyoon.dev02@gmail.com">taeyoon.dev02@gmail.com</a>
								</li>
								<li>
									<span>GitHub</span>
									<a href="https://github.com/2taeyoon" target="_blank" rel="noreferrer">
										@2taeyoon
									</a>
								</li>
							</ul>
						</div>
						<div className="home_contact_block">
							<h3>추가 자료</h3>
							<ul>
								<li>
									<span>Notion</span>
									<a href="https://www.notion.so" target="_blank" rel="noreferrer">
										프로젝트 정리 & 기록
									</a>
								</li>
								<li>
									<span>Resume</span>
									<a href="/resume.pdf" target="_blank" rel="noreferrer">
										PDF 이력서 다운로드
									</a>
								</li>
							</ul>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}