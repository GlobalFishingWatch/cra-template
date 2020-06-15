export type WorkspaceParam = 'zoom' | 'latitude' | 'longitude'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
}
