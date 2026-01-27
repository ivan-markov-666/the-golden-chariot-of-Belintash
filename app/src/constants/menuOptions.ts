export type MenuOptionId =
  | 'newGame'
  | 'continue'
  | 'load'
  | 'settings'
  | 'credits'
  | 'quit'
  | 'dlc';

export type MenuOptionMeta = {
  id: MenuOptionId;
  variant: 'primary' | 'secondary' | 'ghost' | 'dlc';
  analyticsId: string;
  requiresEntitlement?: string;
};

export const MENU_OPTIONS: MenuOptionMeta[] = [
  { id: 'newGame', variant: 'primary', analyticsId: 'menu.newGame' },
  { id: 'continue', variant: 'secondary', analyticsId: 'menu.continue' },
  { id: 'load', variant: 'secondary', analyticsId: 'menu.load' },
  { id: 'settings', variant: 'ghost', analyticsId: 'menu.settings' },
  { id: 'credits', variant: 'ghost', analyticsId: 'menu.credits' },
  { id: 'quit', variant: 'ghost', analyticsId: 'menu.quit' },
  {
    id: 'dlc',
    variant: 'dlc',
    analyticsId: 'menu.dlc',
    requiresEntitlement: 'dlc-occult-expansion',
  },
];
