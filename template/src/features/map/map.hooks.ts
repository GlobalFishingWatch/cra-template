import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { ViewportProps } from 'react-map-gl'
import { selectViewport } from 'routes/routes.selectors'
import { updateQueryParams } from 'routes/routes.actions'
import useDebounce from 'hooks/debounce.hooks'
import {
  selectGeneratorsConfig,
  updateGenerator,
  MapCoordinates,
  UpdateGeneratorPayload,
} from './map.slice'

export const useGeneratorsConnect = () => {
  const dispatch = useDispatch()
  return {
    globalConfig: useSelector(selectViewport),
    generatorsConfig: useSelector(selectGeneratorsConfig),
    updateGenerator: (payload: UpdateGeneratorPayload) => dispatch(updateGenerator(payload)),
  }
}

type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (viewport: ViewportProps) => void
  setMapCoordinates: (viewport: ViewportProps) => void
}
export function useDebouncedViewport(
  urlViewport: MapCoordinates,
  callback: (viewport: MapCoordinates) => void
): UseViewport {
  const [viewport, setViewport] = useState<MapCoordinates>(urlViewport)
  const debouncedViewport = useDebounce<MapCoordinates>(viewport, 400)

  const setMapCoordinates = useCallback((viewport: ViewportProps) => {
    setViewport({ ...viewport })
  }, [])

  const onViewportChange = useCallback((viewport: ViewportProps) => {
    const { latitude, longitude, zoom } = viewport
    setViewport({ latitude, longitude, zoom })
  }, [])

  // Updates local state when url changes
  useEffect(() => {
    const { latitude, longitude, zoom } = viewport
    if (
      urlViewport &&
      (urlViewport?.latitude !== latitude ||
        urlViewport?.longitude !== longitude ||
        urlViewport?.zoom !== zoom)
    ) {
      setViewport({ ...urlViewport })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlViewport])

  // Sync the url with the local state debounced
  useEffect(() => {
    if (debouncedViewport && callback) {
      callback(debouncedViewport)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedViewport])

  return { viewport, onViewportChange, setMapCoordinates }
}

export function useViewport(): UseViewport {
  const dispatch = useDispatch()
  const urlViewport = useSelector(selectViewport)
  const callback = useCallback((viewport) => dispatch(updateQueryParams(viewport)), [dispatch])
  return useDebouncedViewport(urlViewport, callback)
}
