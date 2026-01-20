'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Link {
	platform: string;
	url: string;
}

interface LinkStore {
	links: Link[];
	addLink: (link: Link) => void;
	removeLink: (platform: string) => void;
	reset: () => void;
}

export const useLinkStore = create<LinkStore>()(
	persist(
		(set) => ({
			links: [],

			addLink: (link) =>
				set((state) => ({
					links: [...state.links, link],
				})),

			removeLink: (platform) =>
				set((state) => ({
					links: state.links.filter((link) => link.platform !== platform),
				})),

			reset: () => set({ links: [] }),
		}),
		{
			name: 'devlinks-storage',
			storage: createJSONStorage(() => localStorage),
		},
	),
);
