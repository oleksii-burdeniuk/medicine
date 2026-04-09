'use client';

import { useEffect, useState } from 'react';

export interface SavedUser {
  login: string;
  password: string;
}

export type ViewMode = 'savedCodes' | 'savedUsers';

export function useScannerStorage(noFoundMessage: string) {
  const [password, setPassword] = useState('');
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);

  useEffect(() => {
    const storedCodes = localStorage.getItem('savedCodes');
    const storedUsers = localStorage.getItem('savedUsers');

    try {
      if (storedCodes) setSavedCodes(JSON.parse(storedCodes));
    } catch {
      localStorage.removeItem('savedCodes');
    }

    try {
      if (storedUsers) setSavedUsers(JSON.parse(storedUsers));
    } catch {
      localStorage.removeItem('savedUsers');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  useEffect(() => {
    localStorage.setItem('savedUsers', JSON.stringify(savedUsers));
  }, [savedUsers]);

  const saveEntry = (inputText: string, viewMode: ViewMode) => {
    const trimmed = inputText.trim();
    if (!trimmed || trimmed === noFoundMessage) return;

    if (viewMode === 'savedCodes') {
      if (!savedCodes.includes(trimmed)) {
        setSavedCodes((prev) => [trimmed, ...prev]);
      }
      return;
    }

    if (password.trim() === '') {
      alert('Please enter a password');
      return;
    }

    if (!savedUsers.find((user) => user.login === trimmed)) {
      setSavedUsers((prev) => [
        { login: trimmed, password: password.trim() },
        ...prev,
      ]);
      setPassword('');
    }
  };

  const deleteCode = (code: string) => {
    setSavedCodes((prev) => prev.filter((item) => item !== code));
  };

  const clearCodes = () => {
    setSavedCodes([]);
  };

  const deleteUser = (login: string) => {
    setSavedUsers((prev) => prev.filter((user) => user.login !== login));
  };

  const clearUsers = () => {
    setSavedUsers([]);
  };

  return {
    password,
    setPassword,
    savedCodes,
    savedUsers,
    saveEntry,
    deleteCode,
    clearCodes,
    deleteUser,
    clearUsers,
    setSavedCodes,
  };
}
