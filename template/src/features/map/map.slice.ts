import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  AnyGeneratorConfig,
  ContextGeneratorConfig,
  BasemapGeneratorConfig,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { RootState } from 'store'
import { selectMapZoomQuery, selectTimerange } from 'routes/routes.selectors'

export interface MapState {
  generatorsConfig: AnyGeneratorConfig[]
}

const initialState: MapState = {
  // This is the configuration eventually provided to GFW's Layer Composer in Map.tsx
  generatorsConfig: [
    { id: 'basemap', type: Generators.Type.Basemap, visible: true } as BasemapGeneratorConfig,
    {
      id: 'MPA',
      type: Generators.Type.Context,
      visible: true,
      layer: 'mpa',
      // This tilesUrl could change if the dataset changes, but is a good example of api tiles
      tilesUrl:
        'https://gateway.api.dev.globalfishingwatch.org/v1/datasets/marine-protected-areas/user-context-layer-v1/{z}/{x}/{y}',
    } as ContextGeneratorConfig,
  ],
}

export type UpdateGeneratorPayload = {
  id: string
  config: Partial<AnyGeneratorConfig>
}
// This slice is the part of the store that handles preparing generators configs, that then get passed
// to Layer Composer, which generates a style object that can be used by Mapbox GL (https://docs.mapbox.com/mapbox-gl-js/style-spec/)
export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updateGenerator: (state, action: PayloadAction<UpdateGeneratorPayload>) => {
      const { id, config } = action.payload
      const index = state.generatorsConfig.findIndex((generator) => generator.id === id)
      if (index !== -1) {
        Object.assign(state.generatorsConfig[index], config)
      }
    },
  },
})

// createSlice generates for us actions that we can use to modify the store by calling dispatch, or using the useDispatch hook
export const { updateGenerator } = mapSlice.actions

// This is a simple selector that just picks a portion of the stor for consumption by either a component,
// or a more complex memoized selector. Memoized selectors and/or that need to access several slices,
// should go into a distiinct [feature].selectors.ts file (use createSelector from RTK)
export const selectGeneratorsConfig = (state: RootState) => state.map.generatorsConfig
export const selectGlobalGeneratorsConfig = createSelector(
  [selectMapZoomQuery, selectTimerange],
  (zoom, { start, end }) => ({
    zoom,
    start,
    end,
  })
)

export default mapSlice.reducer
