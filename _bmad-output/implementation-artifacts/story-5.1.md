# Story 5.1: Main Menu Screen

**Story ID:** 5.1  
**Epic:** Epic 5 - Game Screens  
**Story Points:** 3 SP  
**Priority:** Critical  
**Assignee:** Dev Persona  
**Sprint:** Sprint 3  
**Status:** Completed  
**Started:** Feb 1, 2026  
**Completed:** Feb 1, 2026  
**Dependencies:** Story 4.1

---

## User Story

> **As a** player  
> **I want** a main menu to start the game  
> **So that** I can begin my adventure or continue from a save

---

## Acceptance Criteria

### Must Have
- [x] Game title displayed prominently
- [x] "New Game" button (navigates to character creation)
- [x] "Continue" button (loads last save, disabled if no saves)
- [x] "Load Game" button (shows save slots)
- [x] "Settings" button
- [x] Background image/artwork
- [x] Responsive layout
- [x] Navigation working
- [x] Disabled state for unavailable options

### Should Have
- [ ] "Credits" button
- [ ] Version number display
- [ ] Fade-in animation on mount
- [ ] Button hover/press animations
- [ ] Background music toggle
- [ ] Save slot preview on hover

### Nice to Have
- [ ] Animated background (particles, fog)
- [ ] Sound effects on button press
- [ ] Localization switcher
- [ ] Accessibility options quick access

---

## Implementation Tasks

1. Create navigation directory structure
2. Implement AppNavigator with React Navigation
3. Create MainMenuScreen with title, buttons, and animations
4. Create LoadGameScreen for save slot selection
5. Add navigation types (RootStackParamList)
6. Integrate with useSaveLoad hook
7. Add fade-in animations
8. Test navigation and disabled states

---

## Files to Create

- `app/src/navigation/AppNavigator.tsx`
- `app/src/navigation/types.ts`
- `app/src/screens/MainMenuScreen.tsx`
- `app/src/screens/LoadGameScreen.tsx`
- `app/src/screens/index.ts`

---

## Definition of Done

- [ ] Main menu screen created
- [ ] Navigation configured
- [ ] All menu options functional
- [ ] Save detection working
- [ ] Fade-in animation working
- [ ] Responsive layout
- [ ] Load game screen created
- [ ] Tests passing (85%+ coverage)
- [ ] Works on iOS and Android
- [ ] Code reviewed and pushed

---

## Notes

- Main menu is critical - first impression
- Ensure smooth animations (60 FPS)
- Test with and without saves
- Background image should be atmospheric
- Consider adding particles/effects (nice to have)
