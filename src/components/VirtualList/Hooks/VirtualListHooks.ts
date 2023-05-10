import { ref, watchEffect, type Ref } from 'vue'

export type RealitListType = Array<{ id: number; item: any }>
export type PositionsItemType = { index: number; top: number; bottom: number; height: number }

export function useWrapList(dataList: Ref<any[]>) {
  const realityDataList = ref<RealitListType>([])

  watchEffect(() => {
    // 给dataList添加id
    realityDataList.value = dataList.value.map((item, index) => ({ id: index, item }))
  })

  return { realityDataList }
}

export function useInitPositions(transformList: Ref<RealitListType>, estimateHeight: number) {
  let positions: PositionsItemType[] = []

  if (estimateHeight) {
    positions = transformList.value.map((current) => {
      return {
        index: current.id,
        top: estimateHeight * current.id,
        bottom: estimateHeight * (current.id + 1),
        height: estimateHeight
      }
    })
  }

  return positions
}
