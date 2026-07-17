# UI Design Checklist — Professional Grade

## 1. Typography
- [ ] **Font pairing**: Distinct heading font + body font + mono font (no Inter/Roboto)
- [ ] **Hierarchy**: 4-5 size steps clearly distinguishable (h1/h2/h3/h4/body/small)
- [ ] **Line height**: Body 1.5–1.7, headings 1.1–1.3
- [ ] **Letter spacing**: Headings -0.02em to -0.03em, body -0.01em
- [ ] **Max line length**: 60–75 characters for readability
- [ ] **Font weights**: Regular (400), Medium (500), Semibold (600) — no more than 3 weights
- [ ] **Code font**: Dedicated monospace font at 13–14px
- [ ] **Polish**: No excessive font files (2–3 families max), proper `font-display`

## 2. Color
- [ ] **Primary accent**: 1 dominant color used sparingly (buttons, links, active states)
- [ ] **Neutral palette**: 5-6 gray shades from darkest (text) to lightest (bg)
- [ ] **Semantic colors**: Success (green), Warning (amber), Error (red) — accessible contrast
- [ ] **Surface hierarchy**: bg → bg-secondary → bg-tertiary (clear differentiation, ~3-5% steps)
- [ ] **Text hierarchy**: heading → body → secondary → tertiary/muted (3–4 levels)
- [ ] **Border colors**: Subtle but visible on both bg and bg-secondary
- [ ] **Accent interactions**: Soft bg, border, and glow variants of accent for hover/focus
- [ ] **Contrast**: All text meets WCAG AA (4.5:1 body, 3:1 large text)
- [ ] **Dark mode**: Full dark palette switch — not just inverted colors

## 3. Layout & Spacing
- [ ] **Consistent unit**: 4px or 8px base spacing grid
- [ ] **Content max-width**: 640–720px for reading, 1200px for dashboards
- [ ] **Whitespace**: Generous padding (24–32px minimum in main content areas)
- [ ] **Page density**: Not cramped — breathing room between sections (32–48px)
- [ ] **Alignment**: Everything snaps to grid, no off-by-1px
- [ ] **Responsive**: Works at 320px, 768px, 1024px, 1440px+ breakpoints
- [ ] **Sticky elements**: Headers, sidebars with backdrop blur
- [ ] **Z-index stacking**: Organized system (header 50, modal 100, tooltip 200)

## 4. Visual Hierarchy
- [ ] **F-pattern / Z-pattern**: Content follows natural eye scanning
- [ ] **Primary action**: Most prominent button on page (single accent CTA)
- [ ] **Secondary actions**: Ghost/outline buttons, less visual weight
- [ ] **Information density**: Progressive disclosure — don't show everything at once
- [ ] **Section labeling**: Clear labels with visual anchors (accent bars, icons)
- [ ] **Empty states**: Informative, actionable, not blank

## 5. Components
- [ ] **Buttons**: 3 variants (accent/primary, ghost/outline, text/link) + sizes
- [ ] **Inputs**: Clear label, placeholder, focus ring, error state, disabled state
- [ ] **Cards**: Consistent radius (8–12px), shadow hierarchy, hover state
- [ ] **Navigation**: Clear active state, sticky, accessible
- [ ] **Modals/Dialogs**: Backdrop overlay, escape to close, focus trap
- [ ] **Tags/Badges**: Categorical colors, consistent padding and radius
- [ ] **Lists/Tables**: Row hover, alternating bg, clear separation
- [ ] **Progress indicators**: Size, color, placement — one consistent spinner

## 6. Motion & Animation
- [ ] **Purpose**: Every animation serves a purpose (no decorative fluff)
- [ ] **Duration**: 150–300ms micro-interactions, 300–500ms page transitions
- [ ] **Easing**: Custom cubic-bezier (not linear, not just ease-in-out)
- [ ] **Staggered reveals**: Elements enter in sequence (50–100ms delay between)
- [ ] **Motion hierarchy**: Page → section → component → micro-interaction
- [ ] **Reduced motion**: Respect `prefers-reduced-motion`
- [ ] **Hover states**: Subtle lift (translateY(-1px)) + shadow change
- [ ] **Press states**: Scale(0.98) or darker bg for tactile feedback

## 7. Micro-interactions & States
- [ ] **Loading**: Skeleton screens (preferred) → spinners → shimmer
- [ ] **Empty**: Illustration/icon + message + suggested next action
- [ ] **Error**: Clear message + recovery path (retry button, suggestion)
- [ ] **Success**: Brief confirmation (checkmark, toast, color change)
- [ ] **Disabled**: Reduced opacity + no-drop cursor, not invisible
- [ ] **Focus**: Visible ring (2px accent + offset) for keyboard users
- [ ] **Hover**: Immediate (150ms) feedback on interactive elements
- [ ] **Active/Pressed**: 100ms feedback, slight scale down
- [ ] **Transition duration**: 150–200ms for UI changes, 300ms for appearance

## 8. Accessibility
- [ ] **Color contrast**: WCAG AA minimum (4.5:1 text, 3:1 large text)
- [ ] **Focus indicators**: Never `outline: none` without replacement
- [ ] **Keyboard navigation**: Tab order matches visual order
- [ ] **Screen readers**: aria-labels, role attributes, semantic HTML
- [ ] **Touch targets**: Minimum 44x44px for interactive elements
- [ ] **Reduced motion**: Check `prefers-reduced-motion` media query
- [ ] **Reduced transparency**: Check `prefers-reduced-transparency`
- [ ] **Zoom**: Layout holds up to 200% zoom without horizontal scroll

## 9. Content & Copy
- [ ] **Microcopy**: Helpful, concise, human tone (not "An error occurred")
- [ ] **Labels**: Clear, scannable, sentence case or title case (consistent)
- [ ] **Placeholders**: Example values, not instructions
- [ ] **Empty states**: What happened + what to do next
- [ ] **Error messages**: What went wrong + how to fix it
- [ ] **Loading text**: What's happening (not just "Loading...")
- [ ] **Buttons**: Verb-driven ("Analyze repo", not "Submit")

## 10. Consistency
- [ ] **Design tokens**: CSS variables for all colors, spacing, font sizes, shadows
- [ ] **Component library**: Single source of truth, no repeated inline styles
- [ ] **Radius**: 1–2 values used everywhere (e.g., 6px small, 12px large)
- [ ] **Shadows**: 2–3 levels (sm/md/lg) used consistently
- [ ] **Iconography**: Same icon set throughout (lucide, feather, or custom)
- [ ] **Spacing**: Same padding/margin values repeated

## 11. Theming
- [ ] **Light/Dark**: Full support via CSS variables + media query
- [ ] **Dark mode colors**: Not just inverted — carefully chosen per surface
- [ ] **Brand alignment**: Accent color reflects product identity
- [ ] **Mode toggle**: User can override system preference (if applicable)

## 12. Performance Perception
- [ ] **Immediate feedback**: Click → 100ms visual response
- [ ] **Skeleton loading**: Match final layout shape, pulse animation
- [ ] **Optimistic UI**: Update UI before server confirms
- [ ] **Progressive loading**: Critical content first, secondary lazy
- [ ] **Font loading**: `font-display: swap` to prevent invisible text
