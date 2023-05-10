<template>
  <UploadIcon :classname="props.classname" :disabled="props.disabled" @onClick="handleClick">
    <template v-slot:upload>
      <UploadImage
        ref="uploadChildExpose"
        :file="file"
        :disabled="props.disabled"
        :beforeUpload="props.beforeUpload"
        @onChooseFile="onChooseFile"
      />
    </template>
    <template v-slot:icon>
      <slot name="icon"></slot>
    </template>
  </UploadIcon>
</template>

<script setup lang="ts">
import { toRef, ref } from 'vue'
import type { FileChooseProps, BeforeUpload } from './FileType'
import UploadImage from './UploadImage.vue'
import UploadIcon from './UploadIcon.vue'

interface UploadWrapProps {
  disabled?: boolean
  classname?: string
  file?: FileChooseProps
  beforeUpload?: BeforeUpload
}

const props = withDefaults(defineProps<UploadWrapProps>(), {})

const file = toRef(props, 'file')

const emits = defineEmits(['onChooseFile', 'onClick'])

// 获取子组件暴露的属性与方法
const uploadChildExpose = ref()

const onChooseFile = (options: any) => {
  emits('onChooseFile', options)
}

const handleClick = (event: Event) => {
  if (props.disabled) {
    return
  }

  const fileDom = uploadChildExpose.value.getFileDom()
  if (fileDom) {
    // 触发input的change事件
    fileDom.click()
  }
  emits('onClick', event)
}
</script>

<style scoped lang="less"></style>
