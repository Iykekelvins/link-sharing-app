'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Link {
	id?: string;
	_id?: string;
	userClerkId?: string;
	platform: string;
	url: string;
}

interface LinkStore {
	links: Link[];
	setLinks: (links: Link[]) => void;
	addLink: (link: Link) => void;
	updateLink: (id: string, updates: Partial<Omit<Link, 'id'>>) => void;
	reorderLinks: (activeId: string, overId: string) => void;
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

			reorderLinks: (activeId, overId) =>
				set((state) => {
					const oldIndex = state.links.findIndex((link) => link.id === activeId);
					const newIndex = state.links.findIndex((link) => link.id === overId);

					if (oldIndex === -1 || newIndex === -1) return state;

					const newLinks = [...state.links];
					const [movedLink] = newLinks.splice(oldIndex, 1);
					newLinks.splice(newIndex, 0, movedLink);

					// Update order property
					const reorderedLinks = newLinks.map((link, index) => ({
						...link,
						order: index,
					}));

					return { links: reorderedLinks };
				}),

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
