import type { InjectionKey } from 'vue'

export const dropdownMenuCloseKey: InjectionKey<() => void> = Symbol('dropdownMenuClose')
