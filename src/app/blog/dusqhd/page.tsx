"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import "./dusqhd.css";

// ============================================
// 이미지 경로 설정
// ============================================
const IMAGES = {
  // 모듈 작업 이미지 (public/images/blog/dusqhd 내 module* 전부)
  module: [
    {
      title: "비회원 이수증 관련",
      desc: "나미희 회원 뿐만 아니라 모든 비회원의 이수증이 누락되어 있는 문제",
      images: [
        "/images/blog/dusqhd/module1-1.png",
        "/images/blog/dusqhd/module1-2.png",
        "/images/blog/dusqhd/module1-3.png",
      ],
    },
    {
      title: "발표 증명서 관련",
      desc: "통 이미지로 되어있었고, AcademyAjaxController에 해당 부분의 데이터를 불러 오는 것이 없었음",
      images: [
        "/images/blog/dusqhd/module2-1.png",
        "/images/blog/dusqhd/module2-2.png",
        "/images/blog/dusqhd/module2-3.png",
      ],
    },
    {
      title: "InputList 정렬",
      images: ["/images/blog/dusqhd/module3-1.png", "/images/blog/dusqhd/module3-2.png"],
    },
    {
      title: "사전등록시 마감처리",
      desc: "후원업체 옵션으로 처리하려 했으나 해당 사이트는 후원업체 옵션이 개발되기 전의 사이트라서, 혹여 생길 문제를 대비해서 seq(228) 잡아서 마감표시처리",
      images: [
        "/images/blog/dusqhd/module4-1.png",
        "/images/blog/dusqhd/module4-2.png",
        "/images/blog/dusqhd/module4-3.png",
      ],
    },
  ],
  // 프로젝트 하단 갤러리 (sitelist1 제외)
  projectGallery: [
    { src: "/images/blog/dusqhd/sitelist2-1.png", title: "대한병리학회 - 온라인 교육 시스템" },
    { src: "/images/blog/dusqhd/sitelist2-2.png", title: "대한병리학회 - 증례 학습" },
    { src: "/images/blog/dusqhd/sitelist3-1.png", title: "서울대병원외과 - 온라인 교육 시스템" },
    { src: "/images/blog/dusqhd/sitelist3-2.png", title: "서울대병원외과 - Checklist" },
    { src: "/images/blog/dusqhd/sitelist4-1.png", title: "대한중환자의학회 - 연수교육 시스템" },
    { src: "/images/blog/dusqhd/sitelist4-2.png", title: "대한중환자의학회 - VOD 강의" },
    { src: "/images/blog/dusqhd/sitelist4-3.png", title: "대한중환자의학회 - VOD 대시보드" },
  ],
  // IT 업무 이미지
  itwork: [
    { src: "/images/blog/dusqhd/itwork1-1.png", title: "IT 업무 처리 현황 - 1주차" },
    { src: "/images/blog/dusqhd/itwork1-2.png", title: "IT 업무 처리 현황 - 2주차" },
    { src: "/images/blog/dusqhd/itwork1-3.png", title: "IT 업무 처리 현황 - 3주차" },
  ],
  // 가이드 이미지
  guide: [
    { src: "/images/blog/dusqhd/guide1-0.png", title: "자주 사용하는 작업 가이드 캡처본" },
    { src: "/images/blog/dusqhd/guide1-1.png", title: "InputList 캘린더 연동 가이드" },
    { src: "/images/blog/dusqhd/guide1-2.png", title: "회원폼 면허번호 중복 처리 가이드" },
    { src: "/images/blog/dusqhd/guide1-3.png", title: "행사 썸네일 작업 가이드" },
  ],
};

/** 가이드 그리드 하단 「나는 AI를 이렇게 사용한다」 스토리보드 */
const GUIDE_AI_USAGE = [
  {
    src: "/images/blog/dusqhd/guide1-4.png",
    label: "Warp 터미널",
    body: (
      <>
        <strong>Warp</strong>는 터미널 안에서 AI 에이전트와 대화하며 작업할 수 있는 환경입니다.
        로컬 폴더 이동처럼 보통은 영어 명령으로 치는 작업도, <strong>한글로 요청하면</strong> 에이전트가
        적절한 셸 명령으로 바꿔 실행해 줍니다. 아래 화면은 한글 입력으로 경로를 이동한 예입니다.
      </>
    ),
  },
  {
    src: "/images/blog/dusqhd/guide1-5.png",
    label: "cursor-agent 실행",
    body: (
      <>
        프로젝트 디렉터리에서 <strong>cursor-agent</strong>를 실행한 모습입니다.
        터미널에서 바로 에이전트에 연결되어 검색·계획·코드 수정까지 이어갈 수 있습니다.
      </>
    ),
  },
  {
    src: "/images/blog/dusqhd/guide1-6.png",
    label: "가이드 텍스트 복사·붙여넣기",
    body: (
      <>
        미리 정리해 둔 <strong>「행사 썸네일 작업 가이드」</strong> 본문을 그대로 복사해 에이전트에 붙여 넣었습니다.
        어떤 모듈·컨트롤러·뷰를 건드려야 하는지 한 번에 전달할 수 있어, 반복 설명을 줄였습니다.
      </>
    ),
  },
  {
    src: "/images/blog/dusqhd/guide1-7.png",
    label: "작업 전 · KGOG 테스트 사이트",
    body: (
      <>
        실제 배포 전, <strong>KGOG 테스트 사이트</strong>에서 확인한 화면입니다.
        썸네일·이미지 연동이 반영되기 전의 목록 상태입니다.
      </>
    ),
  },
  {
    src: "/images/blog/dusqhd/guide1-8.png",
    label: "작업 후",
    body: (
      <>
        에이전트 작업으로 썸네일이 반영된 <strong>이후 화면</strong>입니다.
        다만 <strong>CSS 스타일링은 가이드에 포함하지 않았습니다.</strong> 학회마다 이미지 비율·디자인·노출 방식
        요구가 모두 달라, 공통 문서로 묶기 어렵기 때문입니다. 가이드는 데이터 연동·표시 로직 위주로 두고,
        스타일은 사이트별로 따로 맞추는 편이 안전합니다.
      </>
    ),
  },
];

// ============================================
// 이미지 모달 · 캐러셀
// ============================================
type CarouselSlide = { src: string; title?: string };

function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && src) dialogRef.current?.focus();
  }, [mounted, src]);

  useEffect(() => {
    if (!mounted || !src) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [mounted, src, onClose]);

  if (!src || !mounted) return null;

  return createPortal(
    <div className="dusqhd-image-modal" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="dusqhd-carousel-shell dusqhd-carousel-shell--single"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="확대 이미지"
      >
        <Image
          src={src}
          alt="확대 이미지"
          width={1200}
          height={800}
          className="dusqhd-carousel-image"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>,
    document.body
  );
}

function ImageCarouselModal({
  items,
  startIndex,
  onClose,
}: {
  items: CarouselSlide[];
  startIndex: number;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const safeStart = Math.min(Math.max(0, startIndex), Math.max(0, items.length - 1));
  const [index, setIndex] = useState(safeStart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIndex(Math.min(Math.max(0, startIndex), Math.max(0, items.length - 1)));
  }, [startIndex, items.length]);

  useEffect(() => {
    if (mounted) dialogRef.current?.focus();
  }, [mounted]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);
  const goNext = useCallback(() => {
    setIndex((i) => Math.min(items.length - 1, i + 1));
  }, [items.length]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (items.length <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        setIndex((i) => Math.min(items.length - 1, i + 1));
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [items.length, onClose, mounted]);

  const current = items[index];
  if (!current || !mounted) return null;

  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  return createPortal(
    <div className="dusqhd-image-modal" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="dusqhd-carousel-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="이미지 갤러리"
      >
        <div className="dusqhd-carousel-body">
          <div className="dusqhd-carousel-viewport">
            <Image
              key={current.src}
              src={current.src}
              alt={current.title ?? "확대 이미지"}
              width={1200}
              height={800}
              className="dusqhd-carousel-image"
              style={{ objectFit: "contain" }}
            />
            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  className="dusqhd-carousel-nav dusqhd-carousel-nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  disabled={!canPrev}
                  aria-label="이전 이미지"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="dusqhd-carousel-nav dusqhd-carousel-nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  disabled={!canNext}
                  aria-label="다음 이미지"
                >
                  ›
                </button>
              </>
            ) : null}
          </div>
          {current.title ? <p className="dusqhd-carousel-caption">{current.title}</p> : null}
          {items.length > 1 ? (
            <p className="dusqhd-carousel-counter">
              {index + 1} / {items.length}
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// HERO 섹션
// ============================================
function HeroSection() {
  return (
    <section className="dusqhd-hero">
      <div className="dusqhd-hero-badge">1년간의 성과 보고서</div>
      <h1 className="dusqhd-hero-title">
        프론트엔드 개발자<br/>성과 포트폴리오
      </h1>
      <p className="dusqhd-hero-subtitle">
        단순 퍼블리싱이 아닌 모듈과 컨트롤러를 수정하는 프론트엔드로서
        1년간의 성과와 역량을 정리했습니다
      </p>
      <div className="dusqhd-hero-stats">
        <div className="dusqhd-stat-card">
          <span className="dusqhd-stat-number">34</span>
          <span className="dusqhd-stat-label">프로젝트 참여</span>
        </div>
        <div className="dusqhd-stat-card">
          <span className="dusqhd-stat-number">237</span>
          <span className="dusqhd-stat-label">IT 업무 처리 (3주)</span>
        </div>
        <div className="dusqhd-stat-card">
          <span className="dusqhd-stat-number">1,451</span>
          <span className="dusqhd-stat-label">총 MERP 처리 건수<br/>(2025-5-19 ~ 2026-5-12)</span>
        </div>
      </div>
			<div className="dusqhd-hero-logo">
				<Image
					src="/images/blog/dusqhd/logo_w.png"
					alt="logo"
					width={200}
					height={67}
					style={{ width: "200px", height: "auto" }}
					priority
				/>
			</div>
      <div className="dusqhd-scroll-indicator">스크롤</div>
    </section>
  );
}

// ============================================
// 역량 소개 섹션
// ============================================
function RoleSection() {
  return (
    <section className="dusqhd-section dusqhd-role">
      <div className="dusqhd-section-header">
        <span className="dusqhd-section-tag">My Role</span>
        <h2 className="dusqhd-section-title">메드소프트에서 나의 역량</h2>
        <p className="dusqhd-section-desc">
          단순 퍼블리싱이 아닌, 개발된 모듈과 컨트롤러를 수정하고 구현하는 프론트엔드 개발자입니다
        </p>
      </div>
      <div className="dusqhd-role-grid">
        <div className="dusqhd-role-card">
          <div className="dusqhd-role-icon">🎨</div>
          <h3 className="dusqhd-role-title">디자인 감각</h3>
          <p className="dusqhd-role-desc">
            디자이너을 볼 줄 아는 감각을 가지고 있어, 대충 잡은 HTML 마크업 구조를
            트렌드있게 구현해냅니다.
          </p>
        </div>
        <div className="dusqhd-role-card">
          <div className="dusqhd-role-icon">⚙️</div>
          <h3 className="dusqhd-role-title">모듈/컨트롤러 수정</h3>
          <p className="dusqhd-role-desc">
            기존에 개발된 PHP 모듈과 컨트롤러를 분석하고 수정하여 기능을 구현합니다. 
            단순 마크업을 넘어서는 개발 역량을 보유하고 있습니다.
          </p>
        </div>

        <div className="dusqhd-role-card">
          <div className="dusqhd-role-icon">🚀</div>
          <h3 className="dusqhd-role-title">업무 효율성</h3>
          <p className="dusqhd-role-desc">
            반복적인 작업은 자체 가이드를 만들어 복사-붙여넣기로 처리하고,
            AI를 적극 활용하여 업무 효율성을 극대화합니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 모듈 작업 섹션
// ============================================
function ModuleSection() {
  const [moduleCarousel, setModuleCarousel] = useState<{
    items: CarouselSlide[];
    startIndex: number;
  } | null>(null);

  return (
    <section className="dusqhd-section dusqhd-module">
      <div className="dusqhd-section-header">
        <span className="dusqhd-section-tag">Development</span>
        <h2 className="dusqhd-section-title">단순 퍼블리셔가 아니라 프론트엔드 개발자입니다</h2>
        <p className="dusqhd-section-desc">
          통으로 개발은 못하지만, 이미 개발된 부분에서의 수정은 가능합니다.<br/>
          예시로 아래 4가지 업무는 모두 모듈과 컨트롤러를 수정해야 가능한 작업입니다.
        </p>
      </div>

      <div className="dusqhd-module-highlight">
        <div className="dusqhd-module-highlight-icon">💡</div>
        <p className="dusqhd-module-highlight-text">
          <strong>아래 4가지 업무는 단순 퍼블 작업으로는 불가능합니다. 모듈을 이해하고 
          Controller, Model, View의 수정이 필요한 프론트엔드 업무입니다.</strong>
        </p>
      </div>

      <div className="dusqhd-module-grid">
        {IMAGES.module.map((item, index) => (
          <div key={index} className="dusqhd-module-card">
            <div className="dusqhd-module-card-header">
              <div className="dusqhd-module-number">{index + 1}</div>
              <h3 className="dusqhd-module-card-title">{item.title}</h3>
            </div>
            <div className="dusqhd-module-card-content">
              <div className="dusqhd-module-card-images">
                {item.images.map((src, imgIdx) => (
                  <Image
                    key={src}
                    src={src}
                    alt={item.title}
                    width={400}
                    height={260}
                    className="dusqhd-module-image"
                    onClick={() =>
                      setModuleCarousel({
                        items: item.images.map((s) => ({ src: s, title: item.title })),
                        startIndex: imgIdx,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>
            <p className="dusqhd-module-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>

      {moduleCarousel ? (
        <ImageCarouselModal
          items={moduleCarousel.items}
          startIndex={moduleCarousel.startIndex}
          onClose={() => setModuleCarousel(null)}
        />
      ) : null}
    </section>
  );
}

// ============================================
// 프로젝트 섹션
// ============================================
function ProjectSection() {
  const [overviewModal, setOverviewModal] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  return (
    <section className="dusqhd-section dusqhd-project">
      <div className="dusqhd-section-header">
        <span className="dusqhd-section-tag">Projects</span>
        <h2 className="dusqhd-section-title">
				프로젝트 업무 실적
        </h2>
        <p className="dusqhd-section-desc">
          30개 이상의 프로젝트에 참여하여 다양한 학회와 병원의 웹사이트를 구축했습니다
        </p>
      </div>

      <div className="dusqhd-project-intro">
        <div className="dusqhd-project-intro-grid">
          <div className="dusqhd-project-intro-item">
            <span className="dusqhd-project-intro-number">34</span>
            <span className="dusqhd-project-intro-label">총 프로젝트 수</span>
          </div>
          <div className="dusqhd-project-intro-item">
            <span className="dusqhd-project-intro-number">3</span>
            <span className="dusqhd-project-intro-label">주요 학회 시스템 사이트 수</span>
          </div>
          {/* <div className="dusqhd-project-intro-item">
            <span className="dusqhd-project-intro-number">100%</span>
            <span className="dusqhd-project-intro-label">클라이언트 만족도</span>
          </div> */}
        </div>
      </div>

      <div className="dusqhd-project-overview">
        <Image
          src="/images/blog/dusqhd/sitelist1.png"
          alt="프로젝트 담당 사이트 수 (전담, 서브)"
          width={1200}
          height={480}
          className="dusqhd-project-overview-image"
          onClick={() => setOverviewModal("/images/blog/dusqhd/sitelist1.png")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="dusqhd-project-grid">
        {/* 대한병리학회 */}
        <div className="dusqhd-project-card featured">
          <Image
            src="/images/blog/dusqhd/sitelist2-2.png"
            alt="대한병리학회"
            width={400}
            height={200}
            className="dusqhd-project-image"
          />
          <div className="dusqhd-project-card-content">
            <span className="dusqhd-project-card-tag">온라인 교육 시스템</span>
            <h3 className="dusqhd-project-card-title">대한병리학회</h3>
            <p className="dusqhd-project-card-desc">
              <strong>병리학 전문의를 위한 온라인 학습 시스템 사이트</strong>
            </p>
          </div>
        </div>

        {/* 서울대병원외과 */}
        <div className="dusqhd-project-card featured">
          <Image
            src="/images/blog/dusqhd/sitelist3-2.png"
            alt="서울대병원외과"
            width={400}
            height={200}
            className="dusqhd-project-image"
          />
          <div className="dusqhd-project-card-content">
            <span className="dusqhd-project-card-tag">온라인 교육 시스템</span>
            <h3 className="dusqhd-project-card-title">서울대병원외과</h3>
            <p className="dusqhd-project-card-desc">
              <strong>SSIL, Checklist, VOD 등 다양한 교육 사이트</strong>
            </p>
          </div>
        </div>

        {/* 대한중환자 */}
        <div className="dusqhd-project-card featured">
          <Image
            src="/images/blog/dusqhd/sitelist4-3.png"
            alt="대한중환자"
            width={400}
            height={200}
            className="dusqhd-project-image"
          />
          <div className="dusqhd-project-card-content">
            <span className="dusqhd-project-card-tag">연수평점 시스템</span>
            <h3 className="dusqhd-project-card-title">대한중환자의학회</h3>
            <p className="dusqhd-project-card-desc">
              <strong>연수평점 시스템 사이트</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="dusqhd-project-gallery">
        {IMAGES.projectGallery.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.title}
            width={600}
            height={400}
            onClick={() => setGalleryIndex(i)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>

      {overviewModal ? <ImageModal src={overviewModal} onClose={() => setOverviewModal(null)} /> : null}
      {galleryIndex !== null ? (
        <ImageCarouselModal
          items={IMAGES.projectGallery}
          startIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      ) : null}
    </section>
  );
}

// ============================================
// IT 업무 섹션
// ============================================
function ItWorkSection() {
  return (
    <section className="dusqhd-section dusqhd-itwork">
      <div className="dusqhd-section-header">
        <span className="dusqhd-section-tag">IT Support</span>
        <h2 className="dusqhd-section-title">
				IT/프로젝트 업무 병행 실적
        </h2>
        <p className="dusqhd-section-desc">
          프로젝트 업무와 병행하여 3주간(1월 5일 ~ 1월 23일) IT 업무를 수행했습니다.
          <br/>동시대 입사자와 비교했을 때, 같은 수준의 업무를 주었다고 전달받았는데
					<br/>그 대비 월등히 빠른 처리 능력을 보여주었습니다.
        </p>
      </div>

      <div className="dusqhd-itwork-hero">
        <div className="dusqhd-itwork-stats">
          <div className="dusqhd-itwork-stat">
            <span className="dusqhd-itwork-stat-number">70</span>
            <span className="dusqhd-itwork-stat-label">1주차 처리 건수</span>
          </div>
          <div className="dusqhd-itwork-stat">
            <span className="dusqhd-itwork-stat-number">107</span>
            <span className="dusqhd-itwork-stat-label">2주차 처리 건수</span>
          </div>
          <div className="dusqhd-itwork-stat">
            <span className="dusqhd-itwork-stat-number">60</span>
            <span className="dusqhd-itwork-stat-label">3주차 처리 건수</span>
          </div>
        </div>
        <div className="dusqhd-itwork-total">
          <span className="dusqhd-itwork-total-number">237건</span>
          <span className="dusqhd-itwork-total-label">총 처리 건수 (3주 간: 1월 5일 ~ 1월 23일)</span>
        </div>
      </div>

      <div className="dusqhd-itwork-details">
        <div className="dusqhd-itwork-week">
          <div className="dusqhd-itwork-week-header">
            <span className="dusqhd-itwork-week-title">1주차</span>
            <span className="dusqhd-itwork-week-count">70 건</span>
          </div>
          <p className="dusqhd-itwork-week-content">
            <strong>
              • 프로젝트, 아주대 메인 프로젝트 병행<br />
              • IT 업무 70건 처리<br />
            </strong>
          </p>
        </div>
        <div className="dusqhd-itwork-week">
          <div className="dusqhd-itwork-week-header">
            <span className="dusqhd-itwork-week-title">2주차</span>
            <span className="dusqhd-itwork-week-count">107건</span>
          </div>
          <p className="dusqhd-itwork-week-content">
            <strong>
              • 프로젝트, 아주대 메인 수정 + 핑크소식 제작<br />
              • 프로젝트, 핑크레터 데이터 PPT 제작<br />
              • 1월 16일 생일 반차, 107건 달성
            </strong>
          </p>
        </div>
        <div className="dusqhd-itwork-week">
          <div className="dusqhd-itwork-week-header">
            <span className="dusqhd-itwork-week-title">3주차</span>
            <span className="dusqhd-itwork-week-count">60건</span>
          </div>
          <p className="dusqhd-itwork-week-content">
            <strong>
              • 온라인 병리학회 + 서울대 메인코딩<br />
              • 프로젝트, 대한부인종양 메인코딩<br />
              • 60건 처리
            </strong>
          </p>
        </div>
      </div>

      <div className="dusqhd-itwork-gallery">
        {IMAGES.itwork.map((img, i) => (
          <a
            key={i}
            href={img.src}
            target="_blank"
            rel="noopener noreferrer"
            className="dusqhd-itwork-gallery-link"
          >
            <Image src={img.src} alt={img.title} width={400} height={300} />
          </a>
        ))}
      </div>
    </section>
  );
}

// ============================================
// 가이드/효율화 섹션
// ============================================
function GuideSection() {
  const [guideGridIndex, setGuideGridIndex] = useState<number | null>(null);

  return (
    <section className="dusqhd-section dusqhd-guide">
      <div className="dusqhd-section-header">
        <span className="dusqhd-section-tag">Efficiency</span>
        <h2 className="dusqhd-section-title">
				업무 효율화 &amp; 가이드
        </h2>
        <p className="dusqhd-section-desc">
          개발자의 시간을 아끼기 위해 자체 가이드를 만들고
					<br/>AI를 활용하여 업무 효율을 극대화합니다
        </p>
      </div>

      <div className="dusqhd-guide-intro">
        <p className="dusqhd-guide-intro-text">
          <strong>&quot;개발자한테 이것저것 물어보는게 그 사람의 작업시간을 빼앗는 거라고 생각해서&quot;</strong>
          <br />
          자주 사용될 것 같은 작업은 직접 캡처하여 가이드를 만들고, 텍스트 문서로 관리하여
          <br />
          복사-붙여넣기만으로 처리할 수 있도록 체계화했습니다.
        </p>
      </div>

      <div className="dusqhd-guide-grid">
        {IMAGES.guide.map((img, i) => (
          <div
            key={i}
            className="dusqhd-guide-card"
            onClick={() => setGuideGridIndex(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setGuideGridIndex(i);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${img.title} 보기`}
          >
            <Image
              src={img.src}
              alt={img.title}
              width={300}
              height={160}
            />
            <div className="dusqhd-guide-card-content">
              <h4 className="dusqhd-guide-card-title">{img.title}</h4>
              <p className="dusqhd-guide-card-desc">자체 제작 가이드 문서</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dusqhd-guide-ai-usage">
        <h3 className="dusqhd-guide-ai-usage-title">나는 AI를 이렇게 사용한다.</h3>
        <p className="dusqhd-guide-ai-usage-lead">
          터미널·에이전트·자체 가이드를 한 흐름으로 묶어, 행사 썸네일 같은 반복 작업을 처리하는 방식입니다.
        </p>
        <div className="dusqhd-guide-ai-usage-steps">
          {GUIDE_AI_USAGE.map((item) => (
            <article key={item.src} className="dusqhd-guide-ai-step">
              <h4 className="dusqhd-guide-ai-step-label">{item.label}</h4>
              <div className="dusqhd-guide-ai-step-body">{item.body}</div>
              <Image
                src={item.src}
                alt={item.label}
                width={960}
                height={540}
                className="dusqhd-guide-ai-step-image"
              />
            </article>
          ))}
        </div>
      </div>


      {guideGridIndex !== null ? (
        <ImageCarouselModal
          items={IMAGES.guide}
          startIndex={guideGridIndex}
          onClose={() => setGuideGridIndex(null)}
        />
      ) : null}
    </section>
  );
}

// ============================================
// CTA 섹션
// ============================================
function CtaSection() {
  return (
    <section className="dusqhd-cta">
      <div className="dusqhd-cta-box">
        <div className="dusqhd-cta-icon">🎯</div>
        <h2 className="dusqhd-cta-title">
          1년간의 성과, 그리고 앞으로의 약속
        </h2>
        <p className="dusqhd-cta-desc">
          입사 1년간 단순 퍼블리싱을 넘어 모듈/컨트롤러 수정, 프로젝트 병행,
          IT 업무 처리까지 다양한 역량을 입증했다고 생각합니다.
          <br />
					<strong>이와 같이 앞으로도 조금 더 성장하는 팀원이 될 것입니다.</strong><br /><br />
          <span className="dusqhd-cta-subtitle">다만,</span>
        </p>
        <div className="dusqhd-cta-points">
          <div className="dusqhd-cta-point">
            <div className="dusqhd-cta-point-icon">🏢</div>
            <div className="dusqhd-cta-point-title">근태</div>
            <div className="dusqhd-cta-point-desc">근태 관련으로 지적받지 않도록 하겠습니다.</div>
          </div>
          <div className="dusqhd-cta-point">
            <div className="dusqhd-cta-point-icon">🧑</div>
            <div className="dusqhd-cta-point-title">태도</div>
            <div className="dusqhd-cta-point-desc">업무를 바라보는 태도를 바꾸겠습니다.</div>
          </div>
          <div className="dusqhd-cta-point">
            <div className="dusqhd-cta-point-icon">💬</div>
            <div className="dusqhd-cta-point-title">언행</div>
            <div className="dusqhd-cta-point-desc">업무 관련 언행을 조심하겠습니다.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 푸터
// ============================================
function Footer() {
  return (
    <footer className="dusqhd-footer">
      <p className="dusqhd-footer-text">
        © 2026 프론트엔드 개발자 | 1년간의 성과 보고서
      </p>
    </footer>
  );
}

// ============================================
// 메인 페이지
// ============================================
export default function DusqhdPage() {
  return (
    <main className="dusqhd-container">
      <HeroSection />
      <RoleSection />
      <ModuleSection />
      <ProjectSection />
      <ItWorkSection />
      <GuideSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
