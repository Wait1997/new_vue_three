<template>
  <div class="upload-wrap">
    <UploadWrap
      :disabled="props.disabled"
      :file="props.file"
      :classname="props.classname"
      :before-upload="props.beforeUpload"
      @on-choose-file="onChooseFile"
    >
      <template v-slot:icon>
        <slot name="icon"></slot>
      </template>
    </UploadWrap>
    <slot name="preview"><ImageList :imageList="imageList" /></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { FileChooseProps, ImageItemProps, BeforeUpload } from './Upload/FileType'
import UploadWrap from './Upload/UploadWrap.vue'
import ImageList from './Upload/ImageList.vue'

interface UploadFileProps {
  disabled?: boolean
  file?: FileChooseProps
  classname?: string
  beforeUpload?: BeforeUpload
  currentFileList: ImageItemProps[]
}

const props = withDefaults(defineProps<UploadFileProps>(), {
  currentFileList: () => []
})

const emits = defineEmits(['onChooseFile'])

const imageList = ref<ImageItemProps[]>([])

watchEffect(() => {
  imageList.value = [...props.currentFileList, ...imageList.value]
})

const onChooseFile = (options: any) => {
  const { fileData, fileType } = options

  if (fileType === 'image') {
    if (!Array.isArray(fileData)) {
      imageList.value = [
        ...imageList.value,
        { key: fileData.name, url: fileData.url, size: fileData.size, status: fileData.status }
      ]
      emits('onChooseFile', options)
      return
    }
    const fileUploadList = fileData.map((current: any) => {
      return {
        key: current.name,
        url: current.url,
        size: current.size,
        status: current.status
      }
    })
    imageList.value = [...imageList.value, ...fileUploadList]
    emits('onChooseFile', options)
  } else {
    // 处理其他类型
  }
}
</script>

<style scoped lang="less">
.upload-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
