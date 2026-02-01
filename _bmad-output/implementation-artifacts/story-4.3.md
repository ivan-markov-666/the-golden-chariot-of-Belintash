# Story 4.3: Create Screen Layouts

**Story ID:** 4.3  
**Epic:** Epic 4 - UI Components  
**Story Points:** 3 SP  
**Priority:** High  
**Assignee:** Dev Persona  
**Sprint:** Sprint 3  
**Status:** Completed  
**Started:** Feb 1, 2026  
**Completed:** Feb 1, 2026  
**Dependencies:** Stories 4.1, 4.2

---

## User Story

> **As a** developer  
> **I want** standardized screen layouts  
> **So that** all screens have consistent structure and spacing

---

## Acceptance Criteria

### Must Have
- [x] ScreenContainer component (base container with safe area)
- [x] ScrollableScreen component (scrollable content with proper padding)
- [x] GameScreen component (layout for gameplay - narrative + choices)
- [x] MenuScreen component (layout for menus - centered content)
- [x] SplitScreen component (two-column layout for tablet support)
- [x] Safe area handling (notches, home indicator)
- [x] Keyboard avoidance for inputs
- [x] Responsive to screen size
- [x] TypeScript types for all components
- [x] Accessibility labels

### Should Have
- [ ] Loading states
- [ ] Error boundaries
- [ ] Orientation change handling
- [ ] Header component integration

### Nice to Have
- [ ] Animation on screen transitions
- [ ] Pull-to-refresh support
- [ ] Skeleton loading screens

---

## Implementation Tasks

1. Create layouts directory structure
2. Implement ScreenContainer with SafeAreaView
3. Implement ScrollableScreen with keyboard avoidance
4. Implement GameScreen for narrative + choices layout
5. Implement MenuScreen for centered menu content
6. Implement SplitScreen for tablet/desktop support
7. Create index.ts for layouts library
8. Add TypeScript types and accessibility

---

## Files to Create

- `app/src/components/layouts/ScreenContainer.tsx`
- `app/src/components/layouts/ScrollableScreen.tsx`
- `app/src/components/layouts/GameScreen.tsx`
- `app/src/components/layouts/MenuScreen.tsx`
- `app/src/components/layouts/SplitScreen.tsx`
- `app/src/components/layouts/index.ts`

---

## Definition of Done

- [ ] All layout components created
- [ ] Safe area handling implemented
- [ ] Keyboard avoidance working
- [ ] TypeScript types defined
- [ ] Accessibility labels added
- [ ] Components tested (80%+ coverage)
- [ ] Responsive to screen size
- [ ] Code reviewed and pushed

---

## Notes

- Screen layouts are foundation for all game screens
- GameScreen is critical for narrative gameplay experience
- MenuScreen should be centered and clean
- SplitScreen enables tablet/desktop optimization
- All layouts must support both light and dark themes
