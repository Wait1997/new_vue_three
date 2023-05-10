<template>
  <div
    class="image-list-wrap"
    v-for="item in imageList"
    :key="item.key"
    @click.stop="
      (event) => {
        onHandleImage(event, item)
      }
    "
  >
    <img class="image-content" :src="item.url" :alt="item.key" />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import type { ImageItemProps } from './FileType'

interface ImageListProps {
  imageList?: Array<ImageItemProps>
}

const props = withDefaults(defineProps<ImageListProps>(), {
  imageList: () => [] as Array<ImageItemProps>
})
const { imageList } = toRefs(props)

const emits = defineEmits(['onHandleImage'])

const onHandleImage = (event: Event, item: any) => {
  emits('onHandleImage', event, item)
}
</script>

<style scoped lang="less">
.image-list-wrap {
  width: 80px;
  height: 80px;
  margin-left: 15px;
  background-color: #f7f8fa;
  overflow: hidden;
  cursor: pointer;
  .image-content {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
