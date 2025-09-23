import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      theme: null,
      // toggleTheme: () => set({ theme: !get().theme }),
      setTheme: (value) => set({ theme: value }),

      debug: false,
      toggleDebug: () => set({ debug: !get().debug }),
      setDebug: (value) => set({ debug: value }),
      
      musicVolume: 0.5,
      setMusicVolume: (value) => set({ musicVolume: value }),

    }),
    {
      name: 'assassin-game-store', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)