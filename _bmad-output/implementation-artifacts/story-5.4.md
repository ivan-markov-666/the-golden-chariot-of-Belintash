# Story 5.4: Inventory & Character Screen

**Story ID:** 5.4  
**Epic:** Epic 5 - Game Screens  
**Story Points:** 2 SP  
**Priority:** Medium  
**Assignee:** Dev Persona  
**Sprint:** Sprint 3  
**Status:** ✅ COMPLETED  
**Started:** Feb 1, 2026  
**Completed:** Feb 1, 2026  
**Dependencies:** Stories 5.3, 4.2

---

## User Story

> **As a** player  
> **I want** to view my character stats and manage inventory  
> **So that** I can track my progress and equipment

---

## Acceptance Criteria

### Character Screen - Must Have
- [ ] Display all 8 attributes with current values
- [ ] Show character level and XP progress bar
- [ ] Display equipped items (head, body, weapon, accessory)
- [ ] Show active status effects/buffs
- [ ] Back button to gameplay

### Inventory Screen - Must Have
- [ ] Grid view of inventory items
- [ ] Item icons with quantity badges
- [ ] Equip/unequip functionality
- [ ] Use consumables
- [ ] Empty slot placeholders
- [ ] Back button to gameplay

### Should Have
- [ ] Equipment comparison
- [ ] Item descriptions on tap
- [ ] Sort/filter options
- [ ] Gold display

### Nice to Have
- [ ] Item rarity colors
- [ ] Equipment sets bonuses
- [ ] Character avatar
- [ ] Drag and drop equipping

---

## Implementation Tasks

1. Create CharacterScreen component
2. Create InventoryScreen component
3. Add character stats display
4. Add equipment slots visualization
5. Add inventory grid
6. Implement equip/unequip logic
7. Add item use functionality
8. Integrate with navigation
9. Add back buttons
10. Test both screens

---

## Files to Create/Modify

- `app/src/screens/CharacterScreen.tsx`
- `app/src/screens/InventoryScreen.tsx`
- Update `app/src/screens/index.ts`
- Update `app/src/navigation/AppNavigator.tsx` (replace placeholders)

---

## Definition of Done

- [ ] Character screen displays all stats
- [ ] Inventory screen shows items in grid
- [ ] Equip/unequip working
- [ ] Use consumables working
- [ ] Navigation between screens functional
- [ ] Back to gameplay working
- [ ] Responsive layout
- [ ] Tests passing (80%+ coverage)
- [ ] Code reviewed and pushed

---

## Notes

- This is the LAST story of the foundation phase!
- After completing this, Epic 5 is done and we can start content creation
- Uses StatDisplay and Card components from Epic 4
- Mock data for items/equipment for now
