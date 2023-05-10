import fileTransformSets from './FileTransform'

export type ImageMimeType = 'image/jpeg' | 'image/jpg' | 'image/png'
export interface ImageCompressorOptions {
  file: File
  quality?: number
  mimeType?: ImageMimeType
  width?: number
  height?: number
  minSize?: number
  convertSize?: number
  isToFile?: boolean
  beforeCompress?: (file: File) => void
  success?: (data: Blob | File) => void
  error?: (message: string) => void
}

const REGEXP_IMAGE_TYPE = /^image\//

// 1M
const convertSize = 1 * 1024 * 1024

const isImageType = (type?: string) => {
  if (type) {
    return REGEXP_IMAGE_TYPE.test(type)
  }
  return false
}

class ImageCompressor {
  options: ImageCompressorOptions
  file: File
  fileName: string

  constructor(options: ImageCompressorOptions) {
    const defaultOptions = {
      file: null,
      quality: 0.8,
      convertSize: convertSize
    }
    this.options = { ...defaultOptions, ...options }
    this.file = options.file
    this.fileName = this.file.name
    this.init()
  }

  init() {
    if (!this.file || !isImageType(this.file.type)) {
      this.error('请确认是否上传文件或者是否是图片类型')
      return
    }
    if (!isImageType(this.options.mimeType)) {
      this.options.mimeType = this.file.type as ImageMimeType
    }
    if (
      this.options.mimeType === 'image/png' &&
      this.file.size > (this.options.convertSize as number)
    ) {
      this.options.mimeType = 'image/jpeg'
    }

    fileTransformSets.fileToImage(
      this.file,
      (image) => {
        const width = this.options.width
        const height = this.options.height
        // 压缩前的钩子函数
        this.beforeCompress(this.file)
        // 等比缩放图片的宽高
        const [destWidth, destHeight] = this.transformRatioToExpectedSize(image, width, height)
        // 转换image画在canvas画布上
        const canvas = fileTransformSets.imageToCanvas(image, destWidth, destHeight)

        // canvas转换为blob同时得到压缩后的blob
        fileTransformSets.canvasToBlob(
          canvas,
          (blob) => {
            if (blob) {
              this.success(blob, this.options.isToFile)
            } else {
              this.error('获取当前blob数据为空')
            }
          },
          this.options.quality,
          this.options.mimeType
        )
      },
      (message) => {
        this.error(message)
      }
    )
  }

  transformRatioToExpectedSize(
    image: HTMLImageElement,
    width?: number,
    height?: number
  ): [number, number] {
    const naturalWidth = image.naturalWidth
    const naturalHeight = image.naturalHeight
    // 图片文件的真实比例
    const aspectRatio = naturalWidth / naturalHeight

    this.options.width = this.options.width ?? 0
    this.options.height = this.options.height ?? 0

    width = this.options.width || naturalWidth
    height = this.options.height || naturalHeight

    if (height * aspectRatio > width) {
      height = width / aspectRatio
    } else {
      width = height * aspectRatio
    }

    return [width, height]
  }

  // 压缩之前，读取图片之后钩子函数
  beforeCompress(file: File) {
    if (typeof this.options.beforeCompress === 'function') {
      this.options.beforeCompress(file)
    }
  }

  // 图片压缩成功
  success(blob: Blob, isToFile?: boolean) {
    isToFile = isToFile || false
    if (isToFile) {
      const file = new File([blob], this.fileName, { type: blob.type })
      this.options.success && this.options.success(file)
      return
    }
    this.options.success && this.options.success(blob)
  }

  // 图片压缩失败
  error(message: string) {
    if (typeof this.options.error === 'function') {
      this.options.error(message)
    }
  }
}

export default ImageCompressor
