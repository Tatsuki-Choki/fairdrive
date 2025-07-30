import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type MemberFromDB = Database['public']['Tables']['members']['Row'];

interface Group {
  id: string;
  name: string;
  share_id: string;
  members: MemberFromDB[];
  created_at: string;
}

interface GroupStore {
  groups: Group[];
  currentGroupId: string | null;
  selectedGroupId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGroups: () => Promise<void>;
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
    (set, get) => ({
      groups: [],
      currentGroupId: null,
      selectedGroupId: null,
      isLoading: false,
      error: null,

      fetchGroups: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // グループ一覧を取得
          const { data: groupsData, error: groupsError } = await supabase
            .from('groups')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (groupsError) throw groupsError;
          
          if (!groupsData || groupsData.length === 0) {
            set({ groups: [], isLoading: false });
            return;
          }
          
          // 各グループのメンバーを取得
          const groupsWithMembers: Group[] = await Promise.all(
            groupsData.map(async (group) => {
              const { data: members, error: membersError } = await supabase
                .from('members')
                .select('*')
                .eq('group_id', group.id)
                .order('joined_at', { ascending: true });
              
              if (membersError) {
                console.error('Error fetching members:', membersError);
                return {
                  ...group,
                  members: []
                };
              }
              
              return {
                ...group,
                members: members || []
              };
            })
          );
          
          set({ groups: groupsWithMembers });
          
          // 選択中のグループIDが無効な場合、最初のグループを選択
          const { selectedGroupId } = get();
          const isSelectedGroupValid = groupsWithMembers.some(g => g.id === selectedGroupId);
          if (groupsWithMembers.length > 0 && (!selectedGroupId || !isSelectedGroupValid)) {
            set({ selectedGroupId: groupsWithMembers[0].id });
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
          set({ error: 'グループの取得に失敗しました' });
        } finally {
          set({ isLoading: false });
        }
      },

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
      partialize: (state) => ({ 
        groups: state.groups,
        selectedGroupId: state.selectedGroupId 
      }),
    }
  )
);