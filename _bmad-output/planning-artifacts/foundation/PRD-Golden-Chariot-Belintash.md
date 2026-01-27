# Product Requirements Document (PRD)
## The Golden Chariot of Belintash

**Version:** 1.0  
**Date:** January 12, 2026  
**Document Owner:** Product Team  
**Status:** Draft for BMAD Implementation

---

## Executive Summary

**The Golden Chariot of Belintash** is a premium text-based RPG mobile game set in 1221 Bulgaria, combining rich historical narrative with folklore-inspired fantasy. Players embark on a quest through the Rhodope Mountains to uncover an ancient Thracian artifact while making meaningful choices that shape the story's outcome.

### Key Differentiators
- **100% Offline Functionality** - Zero internet dependency
- **Literary Quality Narrative** - Inspired by Aleko Konstantinov's descriptive style
- **Historical Authenticity** - Accurate 13th-century Bulgarian setting
- **Deep Choice Systems** - Multiple endings based on player decisions
- **Extensive Content** - 150+ scenario scenes across main quest, side quests, and 4 DLC expansions

### Platform
- **Primary:** iOS and Android mobile devices
- **Technology:** React Native + Expo (managed workflow)
- **Language:** TypeScript
- **Distribution:** App Store & Google Play Store

---

## 1. Product Vision & Goals

### Vision Statement
Create an immersive, story-driven RPG experience that preserves Bulgarian cultural heritage while delivering modern gameplay mechanics through choice-driven narrative and meaningful character progression—all accessible completely offline.

### Primary Goals

#### Business Goals
1. **Market Positioning:** Establish as premium narrative RPG in Bulgarian/Eastern European market
2. **Monetization:** Paid base game ($4.99) + optional DLC expansions ($2.99 each)
3. **User Acquisition:** 10K+ downloads in first 6 months
4. **Retention:** 40%+ 30-day retention rate
5. **Cultural Impact:** Showcase Bulgarian history and folklore to international audience

#### User Goals
1. Experience compelling historical fantasy narrative
2. Make meaningful choices with lasting consequences
3. Explore richly detailed 13th-century Bulgarian world
4. Progress character through skills, items, and reputation
5. Replay with different outcomes and choices

#### Technical Goals
1. **Performance:** 60 FPS on devices from 2020+
2. **Storage:** < 500MB total installation
3. **Offline:** 100% functionality without internet
4. **Cross-Platform:** Identical experience on iOS and Android
5. **Save System:** Reliable local persistence with multiple save slots

---

## 2. Target Audience & Market

### Primary Audience

#### Core Player (70% of users)
- **Age:** 25-45 years old
- **Gender:** 60% male, 40% female
- **Gaming Experience:** Moderate to experienced gamers
- **Genre Preference:** RPGs, narrative games, strategy
- **Motivation:** Story, exploration, character development
- **Platform Habits:** Mobile gaming during commute/downtime
- **Geography:** Bulgaria, Eastern Europe, diaspora communities

#### Secondary Audience (30% of users)
- **Age:** 18-24 and 45+
- **Interest:** History buffs, folklore enthusiasts
- **Gaming Background:** May be less experienced with RPGs
- **Motivation:** Cultural interest, educational value

### Market Context

#### Comparable Games
- **The Witcher** (series) - Folklore-based fantasy, moral choices
- **Disco Elysium** - Deep narrative, skill-based dialogue
- **80 Days** - Text-based travel adventure
- **Choice of Games** titles - Choice-driven narratives
- **King of Dragon Pass** - Story-driven strategy RPG

#### Market Gap
- Lack of quality narrative RPGs set in Bulgarian/Balkan history
- Limited offline-first mobile RPGs with deep systems
- Underrepresented Eastern European folklore in gaming

---

## 3. Core Features & Game Systems

### 3.1 Narrative System

#### Main Quest Structure
- **Acts:** 5 major acts (20-25 scenarios each)
- **Prologue:** 4 introductory scenarios
- **Epilogue:** 4 variant endings based on player choices
- **Total Main Quest:** ~120 primary scenarios

#### Side Quest System
- **65+ Side Quests** across 7+ locations
- **Quest Types:**
  - Help (humanitarian assistance)
  - Combat (battles and challenges)
  - Mystery (investigation and puzzles)
  - Romance (relationship building)
  - Gathering (resource collection)
- **Regional Quest Sets:** Each location has 4-6 interconnected quests

#### DLC Expansion Content (4 Packs)
1. **Belintash Crack** - Engineering/rescue operations (3 quests)
2. **Next Guardians** - Town management/legacy (3 quests)
3. **Balkan Trail** - Expedition sandbox (3 quests)
4. **Laut Stronghold** - Tactical defense (3 quests)
- **Total DLC Content:** 12 additional quests

#### Choice & Consequence System
- **Branching Dialogues:** 3-4 options per major decision point
- **Persistent Consequences:** Choices affect later scenarios
- **Moral Alignment:** Karma system tracking player morality
- **Multiple Endings:** 4+ distinct epilogues based on accumulated choices
- **Relationship Tracking:** NPC affinity influences available options

### 3.2 Character Progression

#### Attribute System
- **Primary Stats:** Health, Mana, Stamina
- **Skills (8 Categories):**
  - Combat: Strength, Dexterity, Warfare
  - Social: Persuasion, Deception, Leadership
  - Knowledge: Lore, Investigation, Survival
  - Magic: Spirit, Arcana, Ritual
  - Physical: Athletics, Stealth, Endurance
  - Crafting: Engineering, Alchemy, Medicine

#### Leveling System
- **Experience Sources:** Quest completion, combat victories, discoveries
- **Level Cap:** 20
- **Skill Points:** Distributed on level-up
- **Specialization:** Players can build toward specific playstyles

#### Equipment System
- **Slots:** Weapon, Armor, Accessory, Amulet (special)
- **Weapon Types:** Swords, maces, bows, crossbows, knives
- **Armor Types:** Light only (leather, chain, scale)
- **Upgrades:** Crafting/purchasing improvements
- **Unique Items:** Quest rewards with special properties

### 3.3 Combat System

#### Turn-Based Combat
- **Initiative Order:** Based on Dexterity
- **Action Economy:** 1 major action + 1 minor action per turn
- **Actions:**
  - Attack (weapon-based damage)
  - Cast spell (magic abilities)
  - Use item (potions, tools)
  - Defend (reduce incoming damage)
  - Flee (escape from combat)

#### Enemy Types (20+ Variants)
- **Animals:** Wolves, bears, boars
- **Humans:** Bandits, cultists, guards, mercenaries
- **Magical Creatures:** Samodivi, spirits, enchanted beasts
- **Bosses:** Unique encounters with special mechanics

#### Combat Modifiers
- **Terrain:** Affects movement and tactics
- **Weather:** Impacts certain abilities
- **Companions:** Provide support actions
- **Equipment:** Buffs and special abilities

### 3.4 Magic System

#### Magic Schools (4 Types)
1. **Rhodope Folk Magic** - Bayania (chants), healing, protection
2. **Elemental Magic** - Fire, water, earth spells
3. **Sacred Magic** - Divine powers (from Holy Relic)
4. **Amulet Powers** - Spirit communication, magical sight

#### Mana System
- **Mana Pool:** 20-100 (based on level/equipment)
- **Regeneration:** Passive (5/3 turns) or active (rest, prayer)
- **Spell Costs:** 5-35 mana per spell
- **Exhaustion:** Penalties at high mana usage

#### Spell Acquisition
- **Teachers:** Specific NPCs teach spell schools
- **Costs:** Gold, reputation, or quest completion
- **Progression:** Basic → Advanced → Master spells

#### Spell Library (40+ Spells)
- **Healing:** 5 variations
- **Combat:** 12 offensive spells
- **Utility:** 8 exploration/detection spells
- **Protection:** 6 defensive buffs
- **Curses:** 4 debuff spells (karma cost)
- **Sacred:** 5 holy powers (relic-dependent)

### 3.5 Economy & Inventory

#### Currency System (Historical Accuracy)
- **Gold Perpera** = 12 Silver Trachea = 288 Copper Trachea
- **Barter System:** Trade goods instead of coins
- **Regional Variation:** Prices differ by location
- **Starting Capital:** 15 copper coins

#### Inventory Management
- **Weight Limit:** Based on Strength stat
- **Categories:**
  - Weapons (15+ types)
  - Armor (12+ pieces)
  - Consumables (potions, food, 30+ items)
  - Crafting Materials (20+ types)
  - Quest Items (story-specific)
  - Keys & Artifacts (7 moneta-keys + special items)

#### Trading System
- **Merchants:** Each location has 2-3 traders
- **Dynamic Prices:** Reputation affects costs
- **Crafting:** Combine materials for upgrades
- **Selling:** Convert loot to currency

### 3.6 Companion System

#### Companion Mechanics
- **Total Companions:** 10+ recruitable NPCs
- **Active Party:** 1-2 companions at a time
- **Affinity System:** Relationship levels affect:
  - Dialogue options
  - Combat support
  - Story branches
  - Romance possibilities

#### Key Companions
- **Stoyan the Blacksmith** - Combat/crafting support
- **Kalina the Herbalist** - Healing/alchemy
- **Elena the Scholar** - Lore/investigation (romance option)
- **Sharo the Dog** - Tracking/loyalty companion
- **Teofil the Alchemist** - Magic/potions
- **Brotherhood Members** - Tactical support

#### Companion Features
- **Personal Quests:** Unlock companion backstories
- **Combat Abilities:** Unique support actions
- **Dialogue Interactions:** Companions comment on choices
- **Loyalty Checks:** Can leave party if affinity drops

### 3.7 Reputation System

#### Faction Tracking (6+ Factions)
- **Bulgarian Royal Court** - Official authority
- **The Brotherhood** - Secret protector organization
- **Orthodox Church** - Religious institutions
- **Merchant Guilds** - Trade networks
- **Village Commons** - Local populations
- **Cult of Dragon Sons** - Antagonists

#### Reputation Effects
- **Prices:** Discounts/markups based on standing
- **Access:** Unlock locations and quests
- **Dialogue:** New conversation options
- **Support:** Aid during critical moments
- **Endings:** Reputation influences epilogue variants

### 3.8 Travel & Exploration

#### World Map
- **Regions:** 7+ major locations
  - Kamenitsa (starting village)
  - Mostovo & Gornoslav
  - Stanimaka (town)
  - Bachkovo Monastery
  - Philippopolis (major city)
  - Zabardo & Wondrous Bridges
  - Krustova Gora
  - Belintash (final location)

#### Travel Mechanics
- **Point-to-Point Navigation:** Select destinations from map
- **Travel Time:** Variable based on distance/terrain
- **Random Encounters:** Combat, NPCs, discoveries
- **Rest System:** Manage health/mana during travel
- **Weather Effects:** Seasonal impacts on travel

#### Exploration Features
- **Hidden Locations:** Discoverable through exploration
- **Lore Discoveries:** Historical/cultural information
- **Resource Gathering:** Find materials in wilderness
- **Secret Paths:** Shortcuts unlocked by quests/skills

### 3.9 Save & Persistence System

#### Save Features
- **Auto-Save:** After major decisions and scenarios
- **Manual Save:** Player-initiated saves
- **Multiple Slots:** 3 save files
- **Chapter Markers:** Return to specific story points
- **New Game+:** Replay with bonuses

#### Persistent Data
- **Character Progress:** Stats, skills, inventory
- **Quest States:** Completed/active/failed quests
- **World State:** NPC relationships, faction standings
- **Choices Record:** All major decisions tracked
- **Achievements:** Unlocked accomplishments

---

## 4. Functional Requirements

### 4.1 User Interface Requirements

#### Screen Components
1. **Main Menu**
   - New Game / Continue / Load Game
   - Settings / Credits / Quit
   - DLC Access (if purchased)

2. **Game Screen (Primary Interface)**
   - Narrative Text Display (scrollable)
   - Choice Buttons (3-4 options)
   - Character Portrait (emotional state)
   - Quick Stats Bar (HP/Mana/Gold)
   - Menu Access Button

3. **Character Sheet**
   - Stats & Skills Display
   - Equipment Slots
   - Spell List
   - Active Buffs/Debuffs

4. **Inventory Screen**
   - Grid/List View Toggle
   - Filtering by Category
   - Item Details Panel
   - Use/Equip/Drop Actions

5. **Map Screen**
   - World Map with Locations
   - Current Location Highlight
   - Travel Options
   - Quest Markers

6. **Journal**
   - Active Quests List
   - Completed Quests
   - Character Notes
   - Lore Entries

7. **Combat Screen**
   - Turn Order Display
   - Enemy Status
   - Action Menu
   - Combat Log

#### UI/UX Requirements
- **Accessibility:** High contrast text, adjustable font size
- **One-Handed Play:** Operable with single hand
- **Minimal Taps:** Efficient navigation
- **Loading States:** Clear progress indicators
- **Confirmation Dialogs:** For critical actions
- **Orientation:** Portrait mode primary (landscape optional)

#### UX Guardrails & Telemetry Systems
- **Occam Overlay Rule:** Във всеки момент са видими максимум два активни UI слоя (StoryTile + един контекстен панел). Всички допълнителни панели (Fact Spine, Consequences Telegraph, Celestial Dial, Journey Tracker) се появяват временно и автоматично се скриват.
- **Consequences Telegraph:** Micro-overlay със сигили, KPI gauge и storyteller copy, който показва кого докосва всяко решение. Изискване: ≥85% adoption до сцена 3; CTR телеметрията се изпраща към UX State Bus.
- **Manual Override Ritual:** При две пропуснати ритуални стъпки или два последователни провала битката активира CTA „Върни ритуала“. Системата трябва да предлага fail-soft сценарий или мини-пъзел рестарт, преди да позволи story-centric изход.
- **Journey Tracker & DLC Hooks:** Timeline панелът показва condensed recap + DLC сигили („Нов извор“) без да прекъсва основния текст. Трябва да поддържа KPI цели (Journey CTA ≥45%) и да синхронизира прогреса с telemetry state.
- **UX State Bus Telemetry:** Централизиран слой, който следи Witness Voice reminders, Manual Override статуси, Compact/Fast Chronicle режими и high-contrast/dry seal настройки. Разработката трябва да осигури събития за: `telemetry.gaugeLow`, `manualOverride.requested`, `journey.ctaTapped`, `occam.overlayViolation`.

### 4.2 Content Management

#### Scenario Engine
- **Scene Loading:** Dynamic scenario fetching
- **State Evaluation:** Check conditions for scene availability
- **Variable Substitution:** Insert player name, stats in text
- **Choice Processing:** Handle player selections
- **Branching Logic:** Navigate scenario tree

#### Data Structures
- **Scenario Files:** Markdown-based scene definitions
- **Quest Definitions:** JSON configuration files
- **Item Database:** Stats, descriptions, effects
- **NPC Records:** Dialogue trees, affinity tracking
- **World State:** Flags, counters, timers

### 4.3 Game Logic Requirements

#### Core Systems
1. **Stat Calculation**
   - Base stats + equipment bonuses
   - Skill check resolution (DC comparison)
   - Experience gain and leveling

2. **Combat Resolution**
   - Initiative calculation
   - Damage calculation (base + modifiers)
   - Status effect application
   - Victory/defeat conditions

3. **Magic System**
   - Mana cost verification
   - Spell effect application
   - School availability checking
   - Relic dependency handling

4. **Economy Management**
   - Currency conversion
   - Price calculation (base + reputation modifier)
   - Inventory weight checking
   - Barter value assessment

5. **Quest Tracking**
   - Objective completion checking
   - Reward distribution
   - Quest chain progression
   - Failure condition handling

6. **Reputation Calculation**
   - Action-based reputation changes
   - Faction relationship impacts
   - Threshold-based unlocks

### 4.4 Data Persistence Requirements

#### Save System
- **Save Operations:**
  - Create new save
  - Update existing save
  - Load save data
  - Delete save
  - Export save (backup)

- **Save Content:**
  - Player character (stats, inventory, position)
  - World state (flags, NPC states, quest progress)
  - Timestamp and playtime
  - Game version

#### Storage Technology
- **Primary:** AsyncStorage for simple data
- **Alternative:** SQLite for complex relational data
- **Backup:** Export to device storage

#### Data Integrity
- **Validation:** Check save file integrity on load
- **Migration:** Handle updates between game versions
- **Corruption Recovery:** Fallback to previous save

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

#### App Performance
- **Frame Rate:** 60 FPS target for UI animations
- **Scene Load Time:** < 0.5 seconds for scenario transitions
- **Battle Calculations:** < 0.1 seconds per turn resolution
- **Save/Load Time:** < 2 seconds for save operations
- **Cold Start:** < 3 seconds to main menu

#### Resource Usage
- **Memory:** < 250MB RAM usage during gameplay
- **Storage:** 
  - Base game: < 300MB
  - Per DLC: < 50MB
  - Save data: < 5MB per save slot
- **Battery:** < 10% drain per hour of play
- **CPU:** Efficient on mid-range devices (2018+)

### 5.2 Compatibility Requirements

#### Platform Support
- **iOS:** 14.0+ (supports iPhone 6s and newer)
- **Android:** API Level 23+ (Android 6.0 Marshmallow)
- **Screen Sizes:** 4.7" to 6.7" phones, 7" to 13" tablets
- **Orientations:** Portrait primary, landscape supported

#### Device Testing
- **iOS Devices:**
  - iPhone SE (2020)
  - iPhone 12/13/14/15
  - iPad (9th gen)
  - iPad Air/Pro

- **Android Devices:**
  - Samsung Galaxy S10+
  - Google Pixel 5/6/7
  - OnePlus 9
  - Budget devices (Xiaomi Redmi Note series)

### 5.3 Reliability Requirements

#### Stability
- **Crash Rate:** < 0.1% sessions
- **Data Loss:** Zero critical data loss events
- **Save Corruption:** < 0.01% save files
- **Error Recovery:** Graceful degradation on errors

#### Offline Functionality
- **Zero Network Dependency:** All features work offline
- **No Server Calls:** Purely local execution
- **Background Processing:** Pause/resume without data loss

### 5.4 Security & Privacy

#### Data Security
- **Local Storage:** No cloud sync, all data on device
- **No Analytics:** No user tracking or telemetry
- **No Ads:** Premium experience, no ad networks
- **No Personal Data:** No collection of user information

#### Content Security
- **Save Game Encryption:** Optional (basic obfuscation)
- **Cheat Prevention:** Limited (single-player game)

### 5.5 Localization Requirements

#### Language Support (Phase 1)
- **Primary:** Bulgarian (native language)
- **Secondary:** English (international audience)

#### Localization Strategy
- **Text Externalization:** All UI and narrative text in resource files
- **Font Support:** Cyrillic character set
- **Date/Time Formats:** Regional formatting
- **Currency Display:** Historical terms (not localized)

#### Future Languages (Phase 2+)
- Russian
- Serbian
- Romanian
- Greek

### 5.6 Accessibility Requirements

#### Visual Accessibility
- **Font Scaling:** Adjustable text size from 80% to 150%
- **High Contrast Mode:** Dedicated toggle with palette tuned for readability
- **Color Blindness Support:** Deuteranopia, Protanopia и Tritanopia режими
- **Alternate Fonts:** Dyslexia-friendly шрифт (OpenDyslexic)

#### Audio Accessibility
- **Text-to-Speech:** Поддръжка на iOS VoiceOver и Android TalkBack
- **Visual Indicators:** Всички критични аудио събития имат визуални подсказки
- **Subtitles:** Опция за надписи върху бъдещи озвучени сцени

#### Cognitive Accessibility
- **Skip/Reduce Effects:** Изключване на бойни анимации и намаляване на UI motion
- **Consistent UI:** Строга визуална йерархия и повторяеми модели на навигация
- **Clear Feedback:** Потвърждения за критични действия и съобщения за състояние

#### Interaction Accessibility
- **Large Touch Targets:** Минимум 44×44 pt
- **One-Handed Mode:** Важните бутони са достъпни в обсега на палеца
- **Configurable Buttons:** Настройки за размер на бутони и резервни жестове
- **Input Alternatives:** Всеки жест има еквивалентен бутон
- **Auto-Save:** Автоматично записване след ключови действия за избягване на загуба на прогрес

---

## 6. Content Scope & Architecture

### 6.1 Content Breakdown

#### Main Game Content
| Content Type | Quantity | Details |
|--------------|----------|---------|
| **Main Quest Scenarios** | ~120 | Prologue (4) + 5 Acts (~25 each) + Epilogue (4 variants) |
| **Side Quests** | 65+ | Distributed across 7+ locations |
| **Locations** | 15+ | Major cities, villages, landmarks |
| **NPCs** | 50+ | Named characters with dialogues |
| **Companions** | 10+ | Recruitable party members |
| **Items** | 100+ | Weapons, armor, consumables, quest items |
| **Enemies** | 20+ | Unique enemy types with variants |
| **Spells** | 40+ | Across 4 magic schools |
| **Achievements** | 30+ | Milestones and discoveries |

#### DLC Content (Per Pack)
| Content Type | Quantity |
|--------------|----------|
| **Quests** | 3 per DLC |
| **New NPCs** | 2-4 per DLC |
| **Unique Items** | 3-5 per DLC |
| **New Mechanics** | 1-2 per DLC |
| **Story Scenes** | 10-15 per DLC |

### 6.2 Technical Architecture

#### Application Structure
```
/src
  /components       # Reusable UI components
  /screens          # Main screen components
  /navigation       # React Navigation setup
  /game
    /engine         # Core game logic
    /data           # Game content (scenarios, items, etc.)
    /types          # TypeScript type definitions
  /store            # State management (Zustand/Redux)
  /services         # Storage, save/load services
  /utils            # Utility functions
  /assets           # Images, fonts
```

#### State Management Strategy
- **Global State:** Player character, world state, current scenario
- **Local State:** UI components, temporary data
- **Persistence Layer:** Save/load service abstraction
- **State Hydration:** Restore state on app launch

#### Data Storage Architecture
```
AsyncStorage (Simple Data)
├── player_stats
├── current_scenario_id
├── game_flags
└── user_preferences

SQLite (Complex Data)
├── inventory_items
├── quest_progress
├── npc_relationships
├── dialogue_history
└── achievement_records
```

#### DLC Architecture
- **Content Sets:** Modular DLC packages
- **Unlock System:** Purchase verification & content activation
- **State Namespacing:** Separate state for DLC features
- **Backwards Compatibility:** DLC-optional saves work in base game

### 6.3 Scenario Data Format

#### Scenario File Structure (Markdown)
```markdown
# Act I, Scene 5: "The Blacksmith's Secret"

## Setup
- Location: Kamenitsa
- Prerequisites: completed_prologue = true
- NPCs: Stoyan

## Narrative
[Descriptive text with embedded variables]

## Choices
A) Direct approach (Strength DC 12)
B) Persuasion (Persuasion DC 11)  
C) Investigate first (Investigation DC 10)

## Outcomes
- Choice A → next_scene: "confrontation"
- Choice B → relationship.stoyan += 5
- Choice C → unlock_secret_path = true
```

#### State Flag System
```typescript
interface GameState {
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  relationships: Record<string, number>;
  inventory: Item[];
  quests: QuestProgress[];
  player: PlayerCharacter;
  location: string;
  timestamp: number;
}
```

---

## 7. Success Metrics & KPIs

### 7.1 Engagement Metrics

#### User Retention
- **Day 1 Retention:** 60%+ (narrative hook)
- **Day 7 Retention:** 45%+ (core loop established)
- **Day 30 Retention:** 40%+ (long-term engagement)

#### Session Metrics
- **Average Session Length:** 25-35 minutes
- **Sessions Per Day:** 1.5-2.5
- **Completion Rate:** 35%+ players finish main quest
- **Side Quest Engagement:** 60%+ complete at least 10 side quests

#### Content Metrics
- **Average Playtime to Completion:** 15-20 hours
- **Replay Rate:** 25%+ start New Game+
- **DLC Adoption:** 30%+ of active users purchase at least 1 DLC
- **Choice Distribution:** No single choice > 60% (validates meaningful choices)

### 7.2 Quality Metrics

#### Technical Performance
- **Crash-Free Rate:** 99.5%+
- **Average Load Time:** < 2 seconds
- **Battery Efficiency:** > 5 hours gameplay on full charge
- **Save Success Rate:** 99.9%+

#### User Satisfaction
- **App Store Rating:** 4.5+ stars target
- **User Reviews Sentiment:** 80%+ positive
- **Bug Report Rate:** < 2% of active users
- **Support Tickets:** < 1% of downloads

### 7.3 Business Metrics

#### Revenue Goals
- **Year 1 Revenue:** $25K+ from base game + DLC
- **Average Revenue Per User:** $3.50-$5.00
- **DLC Conversion Rate:** 30%+ purchase at least 1 DLC
- **Refund Rate:** < 2%

#### Acquisition Metrics
- **Total Downloads:** 10K+ in first 6 months
- **Organic vs Paid:** 70% organic, 30% paid acquisition
- **Viral Coefficient:** 0.3+ (user recommendations)

---

## 8. Constraints & Dependencies

### 8.1 Technical Constraints

#### Platform Limitations
- **iOS Limitations:**
  - App Store review requirements (content rating)
  - Background processing restrictions
  - File system access limitations

- **Android Limitations:**
  - Device fragmentation (testing overhead)
  - Storage permission requirements
  - Background task killing on some devices

#### Technology Constraints
- **React Native:**
  - Performance ceiling for complex animations
  - Native module requirements for some features
  - Bundle size considerations

- **Expo Managed Workflow:**
  - Limited to Expo SDK APIs
  - Custom native code requires eject
  - Update limitations (EAS Update size)

### 8.2 Resource Constraints

#### Development Resources
- **Team Size:** Small team (1-3 developers)
- **Budget:** Limited budget for art assets
- **Timeline:** 6-9 months development target

#### Content Creation
- **Writing Volume:** 150+ scenarios (~300K words)
- **Asset Creation:** Limited custom illustrations
- **Localization:** Translation costs for additional languages

### 8.3 External Dependencies

#### Third-Party Services
- **Expo SDK:** Framework updates and compatibility
- **App Store / Google Play:** Distribution platform requirements
- **React Native Community:** Library maintenance and support

#### Legal & Compliance
- **Content Rating:** Appropriate age rating (ESRB/PEGI)
- **Historical Accuracy:** Cultural sensitivity requirements
- **Licensing:** Any third-party asset licenses

---

## 9. Risks & Mitigation

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Performance issues on older devices** | Medium | High | Early performance testing, optimization sprints |
| **Save data corruption** | Low | Critical | Robust validation, backup systems, version migration |
| **React Native breaking changes** | Medium | Medium | Version pinning, staged updates |
| **App store rejection** | Low | High | Early submission, compliance review |
| **Bundle size exceeds limits** | Medium | Medium | Asset optimization, code splitting |

### 9.2 Content Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Historical inaccuracies** | Medium | Medium | Expert review, documentation |
| **Cultural insensitivity** | Low | High | Cultural consultant, community feedback |
| **Narrative inconsistencies** | Medium | Medium | Traceability documentation, QA passes |
| **Quest bugs breaking progression** | High | High | Extensive testing, save checkpoints |

### 9.3 Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Low market interest** | Medium | High | Marketing campaign, beta testing, community building |
| **Poor user retention** | Medium | High | Onboarding optimization, engagement hooks |
| **Negative reviews** | Low | High | Quality assurance, early access feedback |
| **DLC low adoption** | Medium | Medium | Value proposition, teasers in base game |

---

## 10. Development Phases & Milestones

### Phase 1: Foundation (Months 1-2)
**Goal:** Core engine and basic gameplay loop

**Deliverables:**
- Project setup (React Native + Expo)
- Basic UI framework (navigation, screens)
- Scenario engine (load, display, process choices)
- Character system (stats, skills, leveling)
- Save/load system (basic implementation)
- Prologue content (4 scenarios)

**Success Criteria:**
- Player can start new game, make choices, see consequences
- Character progression works
- Save/load functionality reliable

### Phase 2: Core Systems (Months 3-4)
**Goal:** Implement all major game systems

**Deliverables:**
- Combat system (turn-based battles)
- Magic system (4 schools, 20+ spells)
- Inventory & economy (items, trading, crafting)
- Companion system (recruitment, affinity)
- Travel system (world map, navigation)
- Reputation system (faction tracking)
- Acts I-II content (~50 scenarios)

**Success Criteria:**
- All core systems functional and integrated
- Player can complete Acts I-II
- No major bugs blocking progression

### Phase 3: Content Creation (Months 5-6)
**Goal:** Complete main quest and side quests

**Deliverables:**
- Acts III-V content (~70 scenarios)
- Epilogue variants (4 endings)
- Side quests (65+ quests)
- All NPCs and companions
- Full item database
- Complete bestiary

**Success Criteria:**
- Main quest completable start-to-finish
- All side quests accessible and functional
- Multiple endings achievable

### Phase 4: Polish & Testing (Month 7)
**Goal:** Refinement and quality assurance

**Deliverables:**
- UI/UX polish and animations
- Performance optimization
- Bug fixes and balance adjustments
- Localization (Bulgarian + English)
- Achievement system
- Tutorial/onboarding

**Success Criteria:**
- < 5 critical bugs
- Smooth 60 FPS performance
- Positive playtester feedback

### Phase 5: DLC Development (Month 8-9)
**Goal:** Create expansion content

**Deliverables:**
- DLC-01: Belintash Crack (3 quests)
- DLC-02: Next Guardians (3 quests)
- DLC-03: Balkan Trail (3 quests)
- DLC-04: Laut Stronghold (3 quests)

**Success Criteria:**
- DLCs integrate seamlessly with base game
- New mechanics work correctly
- No progression blockers

### Phase 6: Launch Preparation (Month 9+)
**Goal:** Release and post-launch support

**Deliverables:**
- App Store / Google Play submission
- Marketing materials
- Press kit
- Community channels setup
- Post-launch support plan

**Success Criteria:**
- App approved and live on stores
- Initial user feedback positive
- Critical issues hotfixable

---

## 11. Open Questions & Future Considerations

### Questions Requiring Resolution

1. **Monetization Details:**
   - Exact pricing for base game and DLC?
   - Regional pricing strategy?
   - Family sharing / bundle options?

2. **Localization Priority:**
   - Which languages in Phase 2?
   - Budget for professional translation?
   - Community translation program?

3. **Post-Launch Content:**
   - Additional DLC beyond initial 4?
   - Seasonal events?
   - Community-created content?

4. **Platform Strategy:**
   - Desktop version (Windows/Mac)?
   - Web version?
   - Console ports (Switch)?

### Future Features (Post-Launch)

#### Potential Additions
- **Cloud Save Sync** (optional, via iCloud/Google Drive)
- **Achievements Platform Integration** (Game Center/Google Play Games)
- **Photo Mode** (capture story moments)
- **Character Customization** (appearance options)
- **Difficulty Modes** (story mode, hardcore)
- **Speedrun Mode** (timer, reduced dialogue)

#### Community Features
- **Modding Support** (custom scenarios)
- **Fan Translation Tools** (community localization)
- **Strategy Guide** (official/community wiki)
- **Discord Integration** (rich presence)

---

## 12. Appendices

### Appendix A: Glossary

**Terms and Definitions:**

- **Scenario** - A single narrative scene with choices
- **Act** - Major story chapter (5 acts total)
- **Side Quest** - Optional story content
- **DLC** - Downloadable Content (expansion pack)
- **Companion** - Recruitable NPC party member
- **Affinity** - Relationship level with NPC
- **Karma** - Moral alignment score
- **DC (Difficulty Class)** - Target number for skill checks
- **Moneta-Key** - Special quest item (7 total needed)
- **Belintash** - Final location, the sacred rock

### Appendix B: Reference Documents

**Game Bible Components:**
- WORLD-BIBLE.md - Setting and lore
- MAIN-QUEST-OUTLINE.md - Main story structure
- SIDE-QUESTS.md - All side quest definitions
- CHARACTERS.md - NPC profiles
- COMPANIONS.md - Companion system details
- LOCATIONS.md - World geography
- ITEMS.md - Item database
- BESTIARY.md - Enemy definitions
- MAGIC-SPELLS.md - Spell system
- CURRENCY-SYSTEM.md - Economy details
- TRAVEL-SYSTEM.md - Navigation mechanics
- ENDINGS.md - Epilogue variants
- FACTIONS-DETAILED.md - Reputation system
- DIALOGUES.md - Conversation mechanics
- HISTORICAL-FACTS.md - Historical accuracy guide
- CLARIFICATIONS.md - Design guidelines

**Technical Documents:**
- Architecture proposal (React Native + TypeScript)
- DLC architecture specs (4 content sets)
- Scenario writing plan and traceability

### Appendix C: Contact & Approval

**Document Owner:** Product Team  
**Technical Lead:** [To be assigned]  
**Narrative Lead:** [To be assigned]  
**Project Manager:** [To be assigned]

**Approval Required From:**
- [ ] Product Owner
- [ ] Technical Lead  
- [ ] Narrative Director
- [ ] BMAD Implementation Team

**Change Log:**
- v1.0 (2026-01-12) - Initial PRD draft for BMAD implementation

---

**END OF DOCUMENT**

---

## Next Steps (BMAD Process)

After PRD approval, proceed to:

1. **Architecture Document** - Technical design based on this PRD
2. **Epic Breakdown** - High-level feature epics (~20-30 epics)
3. **Story Creation** - Detailed user stories for each epic
4. **Sprint Planning** - Implementation roadmap with Windsurf + BMAD

**Total Estimated Story Count:** 120-150 stories  
**Recommended Track:** BMAD Enterprise  
**Target Timeline:** 6-9 months development
