import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { logger } from '../lib/logger';

interface ShortcutConfig {
  key: string;
  description: string;
  action: () => void;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  global?: boolean;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const darkMode = useStore(state => state.darkMode);
  const toggleDarkMode = useStore(state => state.toggleDarkMode);

  const shortcuts: ShortcutConfig[] = [
    {
      key: '/',
      description: 'Focus search',
      action: () => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus(),
      global: true
    },
    {
      key: 'd',
      description: 'Toggle dark mode',
      action: toggleDarkMode,
      ctrlKey: true,
      global: true
    },
    {
      key: 'h',
      description: 'Go home',
      action: () => navigate('/'),
      altKey: true
    },
    {
      key: 'i',
      description: 'Go to insights',
      action: () => navigate('/insights'),
      altKey: true
    },
    {
      key: 'm',
      description: 'Go to menu planner',
      action: () => navigate('/menu-planner'),
      altKey: true
    },
    {
      key: 'l',
      description: 'Go to learning',
      action: () => navigate('/learning'),
      altKey: true
    },
    {
      key: 's',
      description: 'Go to settings',
      action: () => navigate('/settings'),
      altKey: true
    },
    {
      key: 'Escape',
      description: 'Close modal/panel',
      action: () => document.querySelector<HTMLButtonElement>('[aria-label="Close"]')?.click(),
      global: true
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const altMatches = !!shortcut.altKey === event.altKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      return keyMatches && ctrlMatches && altMatches && shiftMatches;
    });

    if (matchingShortcut) {
      event.preventDefault();
      try {
        matchingShortcut.action();
        logger.debug(`Keyboard shortcut executed: ${matchingShortcut.description}`);
      } catch (error) {
        logger.error('Error executing keyboard shortcut:', error as Error);
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: shortcuts.map(({ key, description, ctrlKey, altKey, shiftKey }) => ({
      key: [
        ctrlKey && 'Ctrl',
        altKey && 'Alt',
        shiftKey && 'Shift',
        key.toUpperCase()
      ].filter(Boolean).join('+'),
      description
    }))
  };
}