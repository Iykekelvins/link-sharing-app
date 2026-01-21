'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Link {
	id: string;
	platform: string;
	url: string;
}

interface LinkStore {
	links: Link[];
	setLinks: (links: Link[]) => void;
	addLink: (link: Link) => void;
	updateLink: (id: string, updates: Partial<Omit<Link, 'id'>>) => void;
	removeLink: (id: string) => void;
}

export const useLinkStore = create<LinkStore>()(
	persist(
		(set) => ({
			links: [],

			setLinks: (links) => set({ links }),

			addLink: (link) =>
				set((state) => ({
					links: [...state.links, link],
				})),

			updateLink: (id, updates) =>
				set((state) => ({
					links: state.links.map((link) =>
						link.id === id ? { ...link, ...updates } : link,
					),
				})),

			removeLink: (id) =>
				set((state) => ({
					links: state.links.filter((link) => link.id !== id),
				})),
		}),
		{
			name: 'devlinks-storage',
			storage: createJSONStorage(() => localStorage),
		},
	),
);
