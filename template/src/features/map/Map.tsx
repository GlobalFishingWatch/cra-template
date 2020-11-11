import React from 'react'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { useGeneratorsConnect, useViewport } from './map.hooks'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const transformRequest: (...args: any[]) => MapRequest = (url: string, resourceType: string) => {
  const response: MapRequest = { url }
  if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.getToken(),
    }
  }
  return response
}

const handleError = ({ error }: any) => {
  if (error?.status === 401 && error?.url.includes('globalfishingwatch')) {
    GFWAPI.refreshAPIToken()
  }
}

const mapOptions = {
  customAttribution: '© Copyright Global Fishing Watch 2020',
}

const Map = (): React.ReactElement => {
  const { viewport, onViewportChange } = useViewport()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          width="100%"
          height="100%"
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          transformRequest={transformRequest}
          onError={handleError}
          mapOptions={mapOptions}
        ></InteractiveMap>
      )}
    </div>
  )
}

export default Map
