export default function useWebStorage<T>(
  store: string,
  initialValue?: T,
) {
  const storeData = ref<T>()

  const isClient = typeof window != 'undefined'
  const storage = isClient ? window.localStorage : undefined

  // Initialize from storage or use initialValue
  const initialize = (): T => {
    if (storage && store) {
      try {
        const previousStore = storage.getItem(store)
        if (previousStore) {
          return JSON.parse(previousStore) as T
        }
      } catch (_error) {
        // If parsing fails, fall through to initialValue
      }
    }
    // Return initialValue or a default value if T is not nullable
    return initialValue ?? (({} as unknown) as T)
  }

  // Set initial value
  storeData.value = initialize()

  function set(value: Partial<T>): T {
    if (storage && store) {
      try {
        const currentStore = JSON.parse(storage.getItem(store) || '{}') as T
        const newStore = { ...currentStore, ...value } as T

        storage.setItem(store, JSON.stringify(newStore))
        storeData.value = newStore

        return newStore
      } catch (_error) {
        // If there's an error, return the current storeData.value or fallback
        return storeData.value ?? (({} as unknown) as T)
      }
    }

    return storeData.value ?? (({} as unknown) as T)
  }

  function get<K extends keyof T>(key: K): T[K] | null {
    if (storage && store) {
      try {
        const currentStore = JSON.parse(storage.getItem(store) || '{}') as T
        return currentStore[key] ?? null
      } catch (_error) {
        return null
      }
    }

    return null
  }

  return {
    store: storeData,
    set,
    get,
  }
}
