<template>
  <div
    class="wrap"
    ref="wrapEl"
    :style="{ height: height && `${height}px` }"
    @scroll="scrollVirtualList"
  >
    <div class="wrap_hold" ref="holdEl" :style="{ height: wrapHoldHeight }"></div>
    <div class="content" ref="contentEl">
      <div
        class="vitual_item"
        ref="nodesEl"
        v-for="item in renderList"
        :key="item.id"
        :id="`${item.id}`"
        :style="{ height: itemHeight && `${itemHeight}px` }"
        @click.stop="(event) => onHandleVirtualItem(event, item)"
      >
        <slot :virtualItem="item">
          <p class="default_item">{{ item.item.text }}</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs, onMounted, onUpdated, type Ref } from 'vue'
import {
  useWrapList,
  useInitPositions,
  type RealitListType,
  type PositionsItemType
} from './Hooks/VirtualListHooks'

interface VirtualListProps {
  dataList: any[]
  height?: number
  itemHeight?: number
  estimateHeight?: number
  aboveBuffScale?: number
  belowBuffScale?: number
}

const props = withDefaults(defineProps<VirtualListProps>(), {
  aboveBuffScale: 1,
  belowBuffScale: 1,
  dataList: () => []
})

const { itemHeight, estimateHeight, dataList, height, aboveBuffScale, belowBuffScale } =
  toRefs(props)

const emits = defineEmits(['onVirtualItemClick'])

// 预估高度位置信息
let positions: PositionsItemType[] = []

// 获取wrap元素
const wrapEl = ref<HTMLDivElement>()
const contentEl = ref<HTMLDivElement>()
const holdEl = ref<HTMLDivElement>()
const nodesEl = ref<HTMLDivElement[]>()

// 初始化开始索引
const startIndex = ref(0)
// 初始化结束索引
const endIndex = ref(0)
const visibleCount = ref(0)
// 初始化渲染数组
const renderList = ref<{ id: number; item: any }[]>([])

const { realityDataList } = useWrapList(dataList)

// 上缓存区数量
const aboveBuffCount = computed(() => {
  return Math.min(startIndex.value, aboveBuffScale.value * visibleCount.value)
})

// 下缓存区数量
const belowbuffCount = computed(() => {
  return Math.min(
    realityDataList.value.length - endIndex.value,
    belowBuffScale.value * visibleCount.value
  )
})

const wrapHoldHeight = computed(() => {
  if (itemHeight?.value) {
    const totalLength = dataList.value.length
    return `${totalLength * itemHeight.value}px`
  }
  return undefined
})

watch(
  () => realityDataList.value.length,
  () => {
    if (estimateHeight?.value) {
      // 初始化位置信息
      positions = useInitPositions(realityDataList, estimateHeight.value)
    }
    renderListToWrap(realityDataList)
  }
)

// 点击回调函数
const onHandleVirtualItem = (event: MouseEvent, item: { id: number; item: any }) => {
  emits('onVirtualItemClick', event, item)
}

const getSliceList = (start: number, end: number) => {
  const originStart = start - aboveBuffCount.value
  const originEnd = end + belowbuffCount.value

  return realityDataList.value.slice(originStart, originEnd)
}

const setCurrentOffset = (scrollTop?: number) => {
  if (itemHeight?.value && scrollTop) {
    // 滚动出去的整数个rowHeight的高度 去掉缓存区是为了计算真实偏移量
    const currentOffset = scrollTop - (scrollTop % itemHeight.value) - aboveBuffCount.value
    if (contentEl.value) {
      // 设置偏移量
      contentEl.value.style.transform = `translate3d(0, ${currentOffset}px, 0)`
    }
  }
  if (estimateHeight?.value) {
    // 获取偏移量
    const currentOffset =
      startIndex.value >= 1 ? positions[startIndex.value - aboveBuffCount.value].top : 0
    if (contentEl.value) {
      contentEl.value.style.transform = `translate3d(0, ${currentOffset}px, 0)`
    }
  }
}

const getStartIndex = (scrollTop: number) => {
  if (itemHeight?.value) {
    const start = Math.floor(scrollTop / itemHeight.value)
    return start
  }
  const positionsItem = positions.find((item) => item && item.bottom > scrollTop)
  return positionsItem?.index!
}

const scrollVirtualList = () => {
  if (wrapEl.value) {
    const { scrollTop } = wrapEl.value
    const start = getStartIndex(scrollTop)
    // 为了保证结束索引不超出realityDataList的长度
    const end =
      start + visibleCount.value <= realityDataList.value.length
        ? start + visibleCount.value
        : realityDataList.value.length
    if (start !== startIndex.value || end !== endIndex.value) {
      startIndex.value = start
      endIndex.value = end
      renderList.value = getSliceList(start, end)
    }
    setCurrentOffset(scrollTop)
  }
}

// 获取截取的列表渲染到ui
const renderListToWrap = (realityDataList: Ref<RealitListType>) => {
  if (realityDataList.value.length && wrapEl.value) {
    const virtualListWrapHeight = wrapEl.value.clientHeight

    const getRealAndEstimate = (height: number) => {
      // 显示的个数
      const renderCount = Math.ceil(virtualListWrapHeight / height)
      visibleCount.value = renderCount
      endIndex.value = startIndex.value + renderCount
      renderList.value = getSliceList(startIndex.value, endIndex.value)
    }

    if (virtualListWrapHeight) {
      // 定高
      if (itemHeight?.value) {
        getRealAndEstimate(itemHeight.value)
      }
      // 不定高
      if (estimateHeight?.value) {
        getRealAndEstimate(estimateHeight.value)
      }
    }
  }
}

onMounted(() => {
  if (estimateHeight?.value) {
    // 初始化位置信息
    positions = useInitPositions(realityDataList, estimateHeight.value)
  }
  renderListToWrap(realityDataList)
})

onUpdated(() => {
  if (estimateHeight?.value && nodesEl.value) {
    const nodes = nodesEl.value
    for (const node of nodes) {
      const rect = node.getBoundingClientRect()
      const newHeight = rect.height
      // 绑定id是为了确定每一个原始的dataList每个对应positions的编号
      const index = Number(node.id)
      const oldHeight = positions[index].height
      const dValue = oldHeight - newHeight
      if (dValue) {
        positions[index].bottom -= dValue
        positions[index].height = newHeight
        if (index < positions.length - 1) {
          positions[index + 1].top = positions[index].bottom
        }
      }
    }
    // 更新hold总高度
    if (holdEl.value) {
      holdEl.value.style.height = `${positions[positions.length - 1].bottom}px`
    }
    // 更新偏移量
    setCurrentOffset()
  }
})
</script>

<style scoped lang="less">
.wrap {
  position: relative;
  height: 100%;
  overflow-y: scroll;
  .wrap_hold {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }
  .vitual_item {
    display: flex;
    padding: 20px 15px;
    box-sizing: border-box;
    cursor: pointer;
    .default_item {
      color: #333;
      font-size: 16px;
      line-height: 24px;
      background-color: #fff;
    }
  }
}
</style>
