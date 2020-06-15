import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { RootState } from 'store'

export interface MapCoordinates {
  latitude: number
  longitude: number
  zoom: number
}

export interface MapState {
  generatorsConfig: AnyGeneratorConfig[]
}

const initialState: MapState = {
  // This is the configuration eventually provided to GFW's Layer Composer in Map.tsx
  generatorsConfig: [
    { id: 'background', type: Generators.Type.Background, color: '#ff00ff' },
    { id: 'satellite', type: Generators.Type.Basemap, visible: true },
  ],
}

export type UpdateGeneratorPayload = { id: string; config: Partial<AnyGeneratorConfig> }

// This slice is the part of the store that handles preparing generators configs, that then get passed
// to Layer Composer, which generates a style object that can be used by Mapbox GL (https://docs.mapbox.com/mapbox-gl-js/style-spec/)
export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updateGenerator: (state, action: PayloadAction<UpdateGeneratorPayload>) => {
      const { id, config } = action.payload
      state.generatorsConfig = state.generatorsConfig.map((generator) => {
        if (generator.id !== id) return generator

        return { ...generator, ...config }
      })
    },
  },
})

// createSlice generates for us actions that we can use to modify the store by calling dispatch, or using the useDispatch hook
export const { updateGenerator } = mapSlice.actions

// This is a simple selector that just picks a portion of the stor for consumption by either a component,
// or a more complex memoized selector. Memoized selectors and/or that need to access several slices,
// should go into a distiinct [feature].selectors.ts file (use createSelector from RTK)
export const selectGeneratorsConfig = (state: RootState) => state.map.generatorsConfig

export default mapSlice.reducer
