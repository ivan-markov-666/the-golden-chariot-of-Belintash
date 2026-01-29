import { tsave, type SaveCopyKey } from '../save';

describe('tsave localization helper', () => {
  it('връща коректни български низове за ключовете', () => {
    expect(tsave('bg', 'title')).toBe('Избор на хроника');
    expect(tsave('bg', 'overlay.ngPlusTitle')).toBe('New Game+');
    expect(tsave('bg', 'drySeal.fallback')).toContain('Dry Seal fallback активен');
  });

  it('покрива всички ключове за EN и връща непразен низ', () => {
    const keys: SaveCopyKey[] = [
      'title',
      'subtitle',
      'overlay.detailsTitle',
      'overlay.ngPlusTitle',
      'field.timestamp',
      'field.playtime',
      'field.dlc',
      'field.lastSave',
      'field.status',
      'status.corrupted',
      'status.clean',
      'label.manual',
      'label.auto',
      'button.select',
      'button.delete',
      'button.recover',
      'button.newGamePlus',
      'drySeal.fallback',
      'emptySlot',
      'reachZone.hint',
    ];

    keys.forEach((key) => {
      const value = tsave('en', key);
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('има симетрични стойности за manual/auto и select/delete бутони', () => {
    expect(tsave('en', 'label.manual')).toBe('Manual');
    expect(tsave('en', 'label.auto')).toBe('Auto');
    expect(tsave('bg', 'button.select')).toBe('Select');
    expect(tsave('bg', 'button.delete')).toBe('Delete');
  });
});
