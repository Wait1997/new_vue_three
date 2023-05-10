import type { ImageItemProps } from './FileType'

export function useFilterList(previousList: ImageItemProps[], currentList: ImageItemProps[]) {
  const hasRepeat = (previousList: ImageItemProps[], current: ImageItemProps) => {
    if (previousList.length === 0) {
      return undefined
    }
    return previousList.find((previous) => previous.key === current.key)
  }

  return currentList.filter((current) => !hasRepeat(previousList, current))
}
