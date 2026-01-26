'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
	clerkId: string;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	profilePicture: string | null;
	updatedAt: string;
}

interface UserStore {
	user: User | null;
	setUser: (user: User) => void;
	updateUser: (updates: Partial<User>) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: null,

			setUser: (user) => set({ user }),

			updateUser: (updates) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...updates } : state.user,
				})),

			clearUser: () => set({ user: null }),
		}),
		{
			name: 'devlinks-user',
			storage: createJSONStorage(() => localStorage),
		},
	),
);
