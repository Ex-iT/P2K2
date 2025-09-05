const storeData: Ref<UserSettings | Record<string, never>> = ref({})

export default function useWebStorage<T>(
  store: string,
  initialValue?: T,
) {
  const isClient = typeof window != 'undefined'
  const storage = isClient ? window.localStorage : undefined

  if (storage && store) {
    try {
      const previousStore = storage.getItem(store)
      if (previousStore) {
        storeData.value = JSON.parse(previousStore)
      } else {
        storage.setItem(store, JSON.stringify(initialValue))
        storeData.value = JSON.parse(storage.getItem(store) || '{}')
      }
    } catch (_error) {
      storeData.value = {}
    }
  }

  function set<T>(value: UserSettings & { [K in keyof T]?: T[K] }): T | Record<string, never> {
    if (storage && store) {
      try {
        const currentStore = JSON.parse(storage.getItem(store) || '{}')
        const newStore = Object.assign({}, currentStore, value)

        storage.setItem(store, JSON.stringify(newStore))
        storeData.value = newStore

        return newStore
      } catch (_error) {
        return {}
      }
    }

    return {}
  }

  function get<T>(key: keyof T) {
    if (storage && store) {
      try {
        const currentStore: T = JSON.parse(storage.getItem(store) || '{}')

        return currentStore[key]
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
