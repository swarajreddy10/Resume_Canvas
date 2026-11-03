'use client';

import { getTemplatePreviewData } from '@/components/resume/templateDataHelper';
import { TEMPLATES } from '@/components/resume/templateLibrary';
import TemplateShowcase from '@/components/resume/TemplateShowcase';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
} from 'motion/react';
import * as m from 'motion/react-m';
import { useState } from 'react';

const CARD_W = 300; // active card px width
const CARD_H = Math.round(CARD_W * (297 / 210)); // A4 height ~424px
const PEEK_W = 240; // adjacent card width
const PEEK_H = Math.round(PEEK_W * (297 / 210)); // adjacent card height
const PEEK_OFFSET = 340; // horizontal offset of peek cards from center

function wrap(i: number, len: number) {
  return ((i % len) + len) % len;
}

/**
 * The interactive template carousel on the landing page. It renders five full resume
 * templates with sample data, so the landing page loads it on demand (LazyTemplateCarousel)
 * instead of in the first-load bundle. `m` + LazyMotion(domAnimation) keeps Motion to the
 * features used here; MotionConfig reducedMotion="user" drops the slide/scale transforms
 * for users who ask for reduced motion.
 */
export default function TemplateCarousel() {
  // Start at middle index
  const [activeIdx, setActiveIdx] = useState(Math.floor(TEMPLATES.length / 2));
  const go = (delta: number) => {
    setActiveIdx((i) => wrap(i + delta, TEMPLATES.length));
  };

  const active = TEMPLATES[activeIdx];

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* ── Name tabs ────────────────────────────── */}
        <div className="flex justify-center flex-wrap gap-2 px-5 mb-10">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={tpl.id}
              type="button"
              aria-pressed={i === activeIdx}
              onClick={() => setActiveIdx(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                i === activeIdx
                  ? 'bg-[#4f46e5] text-white border-[#4f46e5]'
                  : 'bg-white text-rc-muted border-[#e2e8f0] hover:border-[#c7d2fe] hover:text-[#4f46e5]'
              }`}
            >
              {tpl.name}
            </button>
          ))}
        </div>

        {/* ── Carousel stage ───────────────────────── */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: `${CARD_H + 48}px` }}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-4 sm:left-10 z-20 w-11 h-11 rounded-full bg-white border border-[#e2e8f0] shadow-md flex items-center justify-center hover:border-[#c7d2fe] hover:bg-[#eef2ff] transition-all"
            aria-label="Previous template"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5 text-[#11101d]" />
          </button>

          {/* Cards — render prev, active, next */}
          {[-1, 0, 1].map((rel) => {
            const idx = wrap(activeIdx + rel, TEMPLATES.length);
            const tpl = TEMPLATES[idx];
            const isActive = rel === 0;
            const BLUE = '#4f46e5';

            const xOffset = rel * PEEK_OFFSET;
            const scale = isActive ? 1 : 0.84;
            const opacity = isActive ? 1 : 0.6;
            const zIndex = isActive ? 10 : 5;
            const w = isActive ? CARD_W : PEEK_W;
            const h = isActive ? CARD_H : PEEK_H;

            return (
              <m.div
                key={tpl.id}
                className="absolute cursor-pointer"
                style={{ zIndex }}
                // The peek cards repeat what the tabs and arrows already offer, so they stay
                // out of the accessibility tree and tab order.
                aria-hidden={!isActive}
                animate={{ x: xOffset, scale, opacity }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                onClick={() => {
                  if (!isActive) setActiveIdx(idx);
                }}
              >
                <div
                  style={{
                    width: `${w}px`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? `0 0 0 3px #4f46e5, 0 20px 48px -12px #4f46e544`
                      : '0 6px 24px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.3s',
                    position: 'relative',
                  }}
                >
                  {/* Accent top bar on active */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: BLUE,
                        zIndex: 2,
                      }}
                    />
                  )}

                  <TemplateShowcase
                    template={tpl.id}
                    data={getTemplatePreviewData(tpl.id)}
                    mode="selector"
                    showFade={!isActive}
                    maxHeight={`${h}px`}
                    frameClassName="w-full bg-white overflow-hidden"
                  />

                  {/* Dim overlay on non-active */}
                  {!isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255,255,255,0.12)',
                        borderRadius: '16px',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
              </m.div>
            );
          })}

          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-4 sm:right-10 z-20 w-11 h-11 rounded-full bg-white border border-[#e2e8f0] shadow-md flex items-center justify-center hover:border-[#c7d2fe] hover:bg-[#eef2ff] transition-all"
            aria-label="Next template"
          >
            <ArrowRight aria-hidden="true" className="h-5 w-5 text-[#11101d]" />
          </button>
        </div>

        {/* ── Template label + description ─────────── */}
        <AnimatePresence mode="wait">
          <m.div
            key={active.id}
            className="max-w-xl mx-auto text-center px-5 mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div className="text-base font-bold mb-1 text-[#4f46e5]">
              {active.name}
            </div>
            <p className="text-sm text-rc-muted mb-3">{active.description}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {active.roles.map((r) => (
                <span
                  key={r}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-[#c7d2fe] bg-[#eef2ff] text-[#4f46e5]"
                >
                  {r}
                </span>
              ))}
            </div>
          </m.div>
        </AnimatePresence>

        {/* ── Dot nav: 24×24 targets (WCAG 2.5.8) around the visual dot ── */}
        <div className="flex justify-center gap-1 mt-6">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={tpl.id}
              type="button"
              aria-label={`Show ${tpl.name} template`}
              aria-pressed={i === activeIdx}
              onClick={() => setActiveIdx(i)}
              className="h-6 min-w-6 px-1 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46e5]"
            >
              <span
                aria-hidden="true"
                className="block h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === activeIdx ? '28px' : '8px',
                  // #7c8aa0 is 3.19:1 on the section background (WCAG 1.4.11 asks 3:1).
                  background: i === activeIdx ? '#4f46e5' : '#7c8aa0',
                }}
              />
            </button>
          ))}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
