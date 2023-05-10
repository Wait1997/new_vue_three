<template>
  <div class="about-wrap">
    <van-space direction="vertical" :size="20" fill>
      <div class="vant-upload">
        <p class="cutom-upload-title">Vant文件上传</p>
        <van-uploader :multiple="true" :before-read="beforeRoad" :after-read="afterRead" />
      </div>
      <div class="cutom-upload">
        <p class="cutom-upload-title">自定义文件上传</p>
        <UploadFile
          classname="customIcon"
          :disabled="disabled"
          :file="file"
          :current-file-list="currentFileList"
          :before-upload="beforeUpload"
          @on-choose-file="onChooseFile"
        >
          <template v-slot:icon><van-icon name="photograph" :size="24" color="#dcdee0" /></template>
        </UploadFile>
      </div>
    </van-space>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FileChooseProps, ImageItemProps } from '@/components/Upload/Upload/FileType'
import ImageCompressor, { type ImageCompressorOptions } from '@/utils/ImageCompressor'
import UploadFile from '@/components/Upload/UploadCompressor.vue'
import type { UploaderFileListItem } from 'vant'

const file = reactive<FileChooseProps>({
  fileType: 'image',
  // fileType: 'pdf',
  multiple: false,
  accept: 'image/jpeg,image/jpg,image/png'
  // accept: 'application/pdf'
})

const disabled = ref<boolean>(false)
const currentFileList = ref<ImageItemProps[]>([])

const beforeRoad = (files: File | File[]) => {
  console.log(files)
  return false
}
const afterRead = (fileList: UploaderFileListItem | UploaderFileListItem[]) => {
  // 此时可以自行将文件上传至服务器
  console.log(fileList)
}

const beforeUpload = (files: File | File[]) => {
  return new Promise<File | File[]>((resolve, reject) => {
    if (Array.isArray(files)) {
      resolve(files)
      return
    }

    const options: ImageCompressorOptions = {
      file: files,
      quality: 0.6,
      mimeType: 'image/jpeg',
      isToFile: true,
      beforeCompress: (file) => {
        console.log(file)
      },
      success: (data) => {
        data instanceof File && resolve(data)
      },
      error: (message) => {
        reject(message)
      }
    }
    new ImageCompressor(options)
  })
}

const onChooseFile = (res: any) => {
  console.log(res)
}
</script>

<style scoped lang="less">
.about-wrap {
  height: calc(100% - 48px);
  .vant-upload {
    padding: 0 15px;
  }
  .cutom-upload {
    padding: 0 15px;
    .customIcon {
      background-color: #f7f8fa;
    }
  }
  .cutom-upload-title {
    color: #333;
    font-size: 14px;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
    line-height: 28px;
  }
}
</style>
