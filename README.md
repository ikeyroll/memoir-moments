# Memoir by FACEZ (Redesign)

Visual redesign and fully functional demo application for **Memoir by FACEZ**, matching the 12 companion design screens from the handoff specification.

Built with **Next.js 15, TypeScript, and Tailwind CSS**. Runs completely in the browser with **IndexedDB** for uploaded photos/audio and **localStorage** for preferences and wedding sessions.

---

## 12 Implemented Screens

1. **Screen 01 / Join the wedding**:
   - Full-width couple photo banner filling the upper screen.
   - Distinctive Memoir by FACEZ branding, couple names (*Farah & Daniyal*), configured date (*14 November 2026*), and greeting.
   - Nickname input, demo PIN field, black **Join the wedding** button, and 1-click **Instant Demo Access**.
   - Clear disclosure explaining local browser storage.

2. **Screen 02 / Feed**:
   - Compact 54px header with Memoir wordmark and heart-shaped Activity button.
   - Compact wedding name dropdown opening the wedding information sheet.
   - Horizontal stories tray with **Your story (+)** and guest story circles (dusty rose ring `#A6475B` for recent stories; grey for seen).
   - Chronological posts with guest avatar, nickname, timestamp, edge-to-edge photo preview, quiet `1/3` carousel badge, heart, comment, share, bookmark, like count, expandable caption, comments link, and attached music credit chip.

3. **Screen 03 / Highlights and album**:
   - Title: **Our memories** with compact wedding label (*Farah & Daniyal • 14 November 2026*).
   - 2-column album grid: **Nikah**, **Reception**, **Family**, **Friends**, plus host collection creation.
   - Opening an album reveals a clean 3-column photo grid with lightbox modal.

4. **Screen 04 / Profile**:
   - Guest profile with avatar, nickname, contribution stats (*4 photos • 1 wishes*), role (*Guest* or *Wedding Host*), bio, and **Edit profile**.
   - Tabs: **Photos** and **Saved** (Saved visible only to current user).
   - Demo role switcher (*Switch to Host* / *As Guest*).

5. **Screen 05 / Select photos**:
   - Creation header with `✕`, **New memory**, and **Next** button.
   - Large photo preview above device thumbnail strip.
   - Real **Choose from device** file picker.
   - Numbered order badges on up to 10 photos.
   - Bottom selector: **Post** vs **Story**.

6. **Screen 06 / Edit memory**:
   - Working tool row: **Crop** (Original, Square, 4:5 presets), **Adjust** (Brightness and Warmth sliders applied in real-time), **Music** (opens Screen 07), and **Text** (celebration overlay on photo).
   - Attached music bar displaying selected song chip.

7. **Screen 07 / Music picker**:
   - Search bar, **For you** and **Saved** tabs.
   - Real bundled soothing instrumental acoustic tracks: *Golden Hour*, *Always With You*, *Softly*, and *Our Beginning*.
   - Clip length selector: `5 sec`, `10 sec`, `15 sec`.
   - Truthful timeline scrubber with play/pause auditioning.

8. **Screen 08 / Fullscreen story viewer**:
   - Near-black canvas, thin top progress segments, avatar, nickname, relative time, and music credit.
   - Sound toggle, pause/resume, left/right tap navigation.
   - Bottom **Leave a wish** input and heart reaction.

9. **Screen 09 / Wishes**:
   - Clean white page: **Wedding wishes** / *A little love, kept forever*.
   - Blessing cards with guest initial circles, connection, message, and heart likes.
   - Dusty rose `#A6475B` **Leave a wish** button opening a 500-character counter bottom sheet.

10. **Screen 10 / Activity**:
    - Grouped into **Today** and **Earlier**.
    - Shows real local actions: likes, approvals, story notifications, and **Mark all read** action.

11. **Screen 11 / Host Studio**:
    - Photo moderation surface with couple banner and **Preview wedding** action.
    - Overview, Content (active rose pill), and Settings tabs.
    - Accurate counts: Photos, Pending, Wishes.
    - 2-column media grid with multi-selection and **Approve selected** bulk action.

12. **Screen 12 / Wedding settings**:
    - Wedding cover thumbnail with **Change cover**.
    - Couple names and wedding date (*14 November 2026*).
    - Toggles: **Approval required**, **Wedding PIN**, **Allow guest downloads**, and **Event music**.
    - **Reset demo data** button to restore sample fixtures.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your mobile browser or responsive viewport (390px recommended).
- **Default Guest Access**: `Aisyah` (or enter any nickname)
- **Demo Wedding PIN**: `2026`
- **Host Role**: Tap *Profile* -> *Demo: Switch to Host* to test moderation and settings.
