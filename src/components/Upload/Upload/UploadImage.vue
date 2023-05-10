<template>
  <input
    class="button-file"
    ref="uploadEl"
    type="file"
    :disabled="props.disabled"
    :multiple="file.multiple"
    :accept="file.accept"
    :capture="file.capture"
    @change.stop="(event) => handleFileChange(event)"
  />
</template>

<script setup lang="ts">
import { toRef, ref, type Ref } from 'vue'
import type { FileChooseProps, BeforeUpload } from './FileType'

interface UploadImageProps {
  disabled?: boolean
  file: FileChooseProps
  beforeUpload?: BeforeUpload
}

const props = withDefaults(defineProps<UploadImageProps>(), {
  disabled: false,
  file: () => {
    return {
      fileType: 'image',
      multiple: false,
      accept: 'image/*',
      capture: undefined,
      size: 20 * 1024 * 1024
    }
  }
})

const file = toRef(props, 'file')

const emits = defineEmits(['onChooseFile'])

// 获取file元素
const uploadEl = ref<HTMLInputElement>()

const transformFile = (fileData: File | File[], file: Ref<FileChooseProps>) => {
  if (!Array.isArray(fileData)) {
    // 大小的限制
    if (fileData.size > (file.value.size as number)) {
      console.error(`文件(${fileData.name})大小超过了20M`)
      return
    }
    return {
      url: URL.createObjectURL(fileData),
      name: fileData.name,
      size: fileData.size,
      file: fileData,
      status: 'normal'
    }
  }
  if (fileData.length === 1) {
    const singleFile = fileData[0]
    // 大小的限制
    if (singleFile.size > (file.value.size as number)) {
      console.error(`文件(${singleFile.name})大小超过了20M`)
      return
    }
    // 单个文件
    return {
      url: URL.createObjectURL(singleFile),
      name: singleFile.name,
      size: singleFile.size,
      file: singleFile,
      status: 'normal'
    }
  }

  const newFileData = []
  for (const fileItem of fileData) {
    // 大小的限制
    if (fileItem.size > (file.value.size as number)) {
      console.error(`文件(${fileItem.name})大小超过了20M`)
      return
    }

    newFileData.push({
      url: URL.createObjectURL(fileItem),
      name: fileItem.name,
      size: fileItem.size,
      file: fileItem,
      progress: 1,
      status: 'normal'
    })
  }
  return newFileData
}

const handleFileChange = async (event: Event) => {
  // 判断event.target对象为HTMLInputElement元素
  if (event.target instanceof HTMLInputElement && event.target.files) {
    // input文件上传到file文件列表
    const fileArray: File[] = Array.prototype.slice.call(event.target.files)
    const fileData = fileArray.length === 1 ? fileArray[0] : fileArray

    if (typeof props.beforeUpload === 'function') {
      const allowUploadOrAsyncFile = props.beforeUpload(fileData)

      if (typeof allowUploadOrAsyncFile === 'boolean') {
        if (allowUploadOrAsyncFile === false) {
          return
        }
        // 处理文件
        const files = transformFile(fileData, file)
        if (!files) {
          return
        }
        emits('onChooseFile', {
          fileData: files,
          fileType: file.value.fileType
        })
      } else {
        try {
          const allowFile = await allowUploadOrAsyncFile
          const files = transformFile(allowFile, file)
          if (!files) {
            return
          }
          emits('onChooseFile', {
            fileData: files,
            fileType: file.value.fileType
          })
        } catch (error) {
          console.log(error)
          return
        }
      }
    }
    // 置空file的value值，否则导致同一张图片不能再次获取值
    event.target.value = ''
  }
}

// 暴露uploadEl
defineExpose({
  getFileDom() {
    return uploadEl.value
  }
})
</script>

<style scoped lang="less">
.button-file {
  position: absolute;
  left: 0;
  opacity: 0;
  display: none;
}
</style>
