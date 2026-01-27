import { Locale } from '../theme/guardianShell';

export type MenuCopyKey =
  | 'titleLine1'
  | 'titleLine2'
  | 'subtitle'
  | 'button.newGame'
  | 'button.continue'
  | 'button.load'
  | 'button.settings'
  | 'button.credits'
  | 'button.quit'
  | 'button.dlc'
  | 'tooltips.newGame'
  | 'tooltips.continue'
  | 'tooltips.load'
  | 'tooltips.settings'
  | 'tooltips.credits'
  | 'tooltips.quit'
  | 'tooltips.dlcLocked'
  | 'dlc.lockedLabel'
  | 'dlc.unlockedLabel'
  | 'music.on'
  | 'music.off'
  | 'preview.emptyState';

const STRINGS: Record<Locale, Record<MenuCopyKey, string>> = {
  bg: {
    titleLine1: 'Златната колесница',
    titleLine2: 'на Белинташ',
    subtitle: 'Ритуалът започва тук',
    'button.newGame': 'New Game',
    'button.continue': 'Continue',
    'button.load': 'Load',
    'button.settings': 'Settings',
    'button.credits': 'Credits',
    'button.quit': 'Quit',
    'button.dlc': 'DLC',
    'tooltips.newGame': 'Започни нов ритуал и срещни Жреца.',
    'tooltips.continue': 'Продължи от последния dry seal.',
    'tooltips.load': 'Избери save слот или dry seal архив.',
    'tooltips.settings': 'Настрой висок контраст, език и Manual Override.',
    'tooltips.credits': 'Екипът зад хрониката.',
    'tooltips.quit': 'Затвори хрониката и пази печата.',
    'tooltips.dlcLocked': 'Нужен е Occult Expansion entitlement.',
    'dlc.lockedLabel': 'Заключен DLC ритуал',
    'dlc.unlockedLabel': 'DLC ритуал – Глава Occult Expansion',
    'music.on': 'Музика: Вкл',
    'music.off': 'Музика: Изкл',
    'preview.emptyState': 'Няма dry seal записи – започни нов ритуал',
  },
  en: {
    titleLine1: 'The Golden Chariot',
    titleLine2: 'of Belintash',
    subtitle: 'The ritual begins here',
    'button.newGame': 'New Game',
    'button.continue': 'Continue',
    'button.load': 'Load',
    'button.settings': 'Settings',
    'button.credits': 'Credits',
    'button.quit': 'Quit',
    'button.dlc': 'DLC',
    'tooltips.newGame': 'Start a new ritual and meet the Witness.',
    'tooltips.continue': 'Resume from your last dry seal.',
    'tooltips.load': 'Pick a save slot or dry seal archive.',
    'tooltips.settings': 'Adjust high contrast, language, Manual Override.',
    'tooltips.credits': 'Meet the team behind the chronicle.',
    'tooltips.quit': 'Close the chronicle and guard the seal.',
    'tooltips.dlcLocked': 'Occult Expansion entitlement required.',
    'dlc.lockedLabel': 'Locked DLC ritual',
    'dlc.unlockedLabel': 'DLC ritual – Occult Expansion arc',
    'music.on': 'Music: On',
    'music.off': 'Music: Off',
    'preview.emptyState': 'No dry seals yet – start a new ritual',
  },
};

export const t = (locale: Locale, key: MenuCopyKey): string => STRINGS[locale][key];
