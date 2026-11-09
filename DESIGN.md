# DESIGN.md: Memoir by FACEZ (Redesign Handoff)

## Identity & System
- **Product**: Memoir by FACEZ — social photo-sharing app for one intimate wedding celebration.
- **Visual System**: Clean, white background (`#FFFFFF`), near-black text (`#151515`), supporting text (`#666666`), subtle dividers (`#ECECEC`), and signature dusty rose (`#A6475B`) for active rings, selected states and reactions.
- **Typography**: Clean Inter-like sans serif with distinctive script Memoir wordmark.
- **Design Read**: Reading this as: social-style wedding memoir for participants and hosts, in an Instagram-like clean white aesthetic, dial `ENERGY 2 / RHYTHM 2 / MOTION 1`.

## 12 Implemented Screens
1. **Screen 01 / Join the wedding**: Full-width couple cover photo, Memoir wordmark, couple names (Farah & Daniyal), 14 November 2026, nickname input, demo PIN, black Join button, instant demo entry.
2. **Screen 02 / Feed**: Compact 54px header with Memoir wordmark and Activity heart. Stories tray with Your story (+) and guest story circles. Edge-to-edge photo posts, swipeable carousels, like counter, caption with More/Less, comments sheet, and music credit chip.
3. **Screen 03 / Highlights and album**: "Our memories" title, 2-column album grid (Nikah, Reception, Family, Friends) with local item counts. Clean 3-column photo grid inside each collection with fullscreen photo viewing.
4. **Screen 04 / Profile**: Avatar, nickname, contributions count ("4 photos • 1 wishes"), event role ("Guest" or "Wedding Host"), bio, Edit profile, tabs (Photos, Saved), demo role switcher.
5. **Screen 05 / Select photos**: Header (✕, New memory, Next), main large preview above thumbnail grid, real "Choose from device" file input, numbered order badges on up to 10 photos, Post/Story toggle.
6. **Screen 06 / Edit memory**: Large preview with working tools (Crop with presets, Adjust brightness/warmth sliders, Music attachment chip, Text overlay on photo).
7. **Screen 07 / Music picker**: Real synthesized instrumental acoustic wedding tracks (Golden Hour, Always With You, Softly, Our Beginning), search bar, For you / Saved tabs, 5s/10s/15s clip duration selector, truthful timeline scrubber.
8. **Screen 08 / Story viewer**: Near-black fullscreen canvas, thin progress segments, song credit, sound toggle, pause/resume, left/right tap navigation, Leave a wish reply input and heart reaction.
9. **Screen 09 / Wishes**: "Wedding wishes" / "A little love, kept forever", wish cards with initial circles, timestamp, dusty rose "Leave a wish" button opening 500-char bottom sheet.
10. **Screen 10 / Activity**: Opened from header heart. Today & Earlier groups, real demo actions (likes, approvals, story notifications), "Mark all read".
11. **Screen 11 / Host Studio**: "Wedding studio", Farah & Daniyal, cover banner with "Preview wedding", tabs (Overview, Content, Settings), accurate metrics, 2-column pending photos grid with multi-select and "Approve selected".
12. **Screen 12 / Wedding settings**: Wedding cover thumbnail, couple names, date ("14 November 2026"), toggles (Approval required, Wedding PIN, Allow guest downloads, Event music), Reset demo data button.

## Architecture
- **IndexedDB**: Persistent local storage for user photo uploads and audio blobs.
- **localStorage**: Session settings, active demo identity, and wedding configuration.
- **Audio Service**: Singleton Web Audio synthesizer generating authentic acoustic chord progressions with zero external dependencies.
