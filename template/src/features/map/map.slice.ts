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
  generatorsConfig: [
    { id: 'background', type: Generators.Type.Background },
    { id: 'satellite', type: Generators.Type.Basemap, visible: true },
  ],
}

export type UpdateGeneratorPayload = { id: string; config: Partial<AnyGeneratorConfig> }
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

export const { updateGenerator } = mapSlice.actions

export const selectGeneratorsConfig = (state: RootState) => state.map.generatorsConfig

export default mapSlice.reducer
