<template>
  <div ref="homeEl" class="home-container">
    <VirtualList
      v-slot="{ virtualItem }"
      :dataList="dataList"
      :itemHeight="240"
      @onVirtualItemClick="onVirtualItemClick"
    >
      <VirtualItem :items="virtualItem" />
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VirtualList from '@/components/VirtualList/VirtualList.vue'
import VirtualItem from '@/components/VirtualList/VirtualItem/VirtualItem.vue'

type ListItemProps = { index: number; value: string }

const text =
  '当你更改响应式状态后，DOM 会自动更新。然而，你得注意 DOM 的更新并不是同步的。相反，Vue 将缓冲它们直到更新周期的 “下个时机” 以确保无论你进行了多少次状态更改，每个组件都只更新一次，history 在修改 url 后，虽然页面并不会刷新，但我们在手动刷新，或通过 url 直接进入应用的时候， 服务端是无法识别这个 url 的'
const list = new Array(100).fill(0)

const homeEl = ref<HTMLDivElement>()

const dataList = ref<ListItemProps[]>([])

const onVirtualItemClick = (event: MouseEvent, item: { id: number; item: any }) => {
  console.log(event)
  console.log(item.id)
  console.log(item.item)
}

onMounted(() => {
  dataList.value = list.map((item, index) => ({
    index,
    value: `${index}.${text.slice(Math.floor(Math.random() * text.length + 1))}`,
    text: `${index}.${text}`
  }))
})
</script>

<style scoped lang="less">
.home-container {
  max-width: 840px;
  min-width: 320px;
  height: calc(100% - 48px);
}
</style>
