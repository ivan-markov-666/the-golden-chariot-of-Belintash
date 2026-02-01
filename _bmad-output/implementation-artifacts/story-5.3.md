# Story 5.3: Gameplay Screen

**Story ID:** 5.3  
**Epic:** Epic 5 - Game Screens  
**Story Points:** 4 SP  
**Priority:** Critical  
**Assignee:** Dev Persona  
**Sprint:** Sprint 3  
**Status:** In Progress  
**Started:** Feb 1, 2026  
**Dependencies:** Stories 5.1, 5.2, 4.2

---

## User Story

> **As a** player  
> **I want** to experience scenarios and make choices  
> **So that** I can progress through the story

---

## Acceptance Criteria

### Must Have
- [ ] Display current scenario title
- [ ] Display scenario narrative text
- [ ] Show available choices
- [ ] Handle choice selection
- [ ] Display character resources (health, mana, gold)
- [ ] Resource bars in footer
- [ ] Scrollable content
- [ ] Loading state
- [ ] Error handling for scenario loading

### Should Have
- [ ] Choice filtering based on conditions
- [ ] Skill check indicators on choices
- [ ] Locked choices display
- [ ] Auto-save after choice
- [ ] Transition animations

### Nice to Have
- [ ] Active quests display
- [ ] Sound effects on choice
- [ ] Narrative typewriter effect
- [ ] Background images per scenario

---

## Implementation Tasks

1. Create GameplayScreen component
2. Integrate with GameScreen layout
3. Add scenario loading logic
4. Display scenario title and narrative
5. Render ChoiceCard components for choices
6. Add ResourceBar in footer
7. Handle choice selection
8. Add loading and error states
9. Test with sample scenarios

---

## Files to Create/Modify

- `app/src/screens/GameplayScreen.tsx`
- Update `app/src/screens/index.ts`
- Update `app/src/navigation/AppNavigator.tsx` (replace placeholder)

---

## Definition of Done

- [ ] Gameplay screen displays scenario
- [ ] Narrative text renders correctly
- [ ] Choices are clickable
- [ ] Choice selection triggers navigation
- [ ] Resource bars display current values
- [ ] Loading state shown while loading
- [ ] Error handling implemented
- [ ] Responsive layout works
- [ ] Tests passing (85%+ coverage)
- [ ] Code reviewed and pushed

---

## Notes

- GameplayScreen is the core of the game experience
- Must integrate with existing GameScreen layout from Story 4.3
- ChoiceCard components from Story 4.2 should be reused
- ResourceBar from Story 4.2 should be used in footer
- Scenario loading will be mocked for now (actual loader in future story)
