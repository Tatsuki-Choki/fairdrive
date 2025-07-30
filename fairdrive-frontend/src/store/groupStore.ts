import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
}

interface GroupStore {
  groups: Group[];
  currentGroupId: string | null;
  selectedGroupId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addGroup: (group: Group) => void;
  setCurrentGroup: (groupId: string) => void;
  setSelectedGroupId: (groupId: string) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  setGroups: (groups: Group[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set) => ({
      groups: [],
      currentGroupId: null,
      selectedGroupId: null,
      isLoading: false,
      error: null,

      addGroup: (group) =>
        set((state) => ({
          groups: [group, ...state.groups],
          currentGroupId: group.id,
        })),

      setCurrentGroup: (groupId) =>
        set(() => ({
          currentGroupId: groupId,
        })),

      setSelectedGroupId: (groupId) =>
        set(() => ({
          selectedGroupId: groupId,
        })),

      removeGroup: (groupId) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
          currentGroupId: state.currentGroupId === groupId ? null : state.currentGroupId,
        })),

      updateGroup: (groupId, updates) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, ...updates } : g
          ),
        })),

      setGroups: (groups) =>
        set(() => ({
          groups,
        })),

      setLoading: (loading) =>
        set(() => ({
          isLoading: loading,
        })),

      setError: (error) =>
        set(() => ({
          error,
        })),

      clearError: () =>
        set(() => ({
          error: null,
        })),
    }),
    {
      name: 'group-storage',
      partialize: (state) => ({ selectedGroupId: state.selectedGroupId }),
    }
  )
);