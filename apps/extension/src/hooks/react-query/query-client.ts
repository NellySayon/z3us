import { QueryClient } from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'

const newQueryClient = (localStorage: Storage) => {
	const client = new QueryClient({
		defaultOptions: {
			queries: {
				cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
				staleTime: 60 * 1000, // cache for 1 minute
				refetchInterval: 60 * 1000, // automatically refetch every minute
				refetchIntervalInBackground: true,
			},
		},
	})

	const cacheKey = 'z3us-cache'

	const localStoragePersistor = createWebStoragePersistor({
		key: cacheKey,
		throttleTime: 1 * 1000, // To avoid localStorage spamming, pass a time in ms to throttle saving the cache to disk
		storage: localStorage,
	})

	persistQueryClient({
		queryClient: client,
		persistor: localStoragePersistor,
	})

	return client
}

export default newQueryClient
