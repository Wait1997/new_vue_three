function fileTransform() {
  // file转换为dataUrl
  function fileToDataUrl(
    file: File,
    success: (res: string | ArrayBuffer | null) => void,
    error: (err: string) => void
  ) {
    const reader = new FileReader()

    reader.onload = function () {
      success(reader.result)
    }
    reader.onerror = function () {
      error('读取文件失败！')
    }

    reader.readAsDataURL(file)
  }

  // file转换为image
  function fileToImage(
    file: File,
    success: (dom: HTMLImageElement) => void,
    error?: (err: string) => void
  ) {
    const image = new Image()
    const url = URL.createObjectURL(file)

    image.onload = function () {
      success(image)
      URL.revokeObjectURL(url)
    }
    image.onerror = function () {
      error && error('图片加载失败')
    }

    image.src = url
  }

  function imageToCanvas(image: HTMLImageElement, destWidth?: number, destHeight?: number) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    canvas.width = destWidth || image.naturalWidth
    canvas.height = destHeight || image.naturalHeight

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    return canvas
  }

  // canvas转换为dataUrl
  function canvasToDataUrl(canvas: HTMLCanvasElement, quality: number, type: string) {
    return canvas.toDataURL(type || 'image/jpeg', quality)
  }

  // canvas转换为blob
  function canvasToBlob(
    canvas: HTMLCanvasElement,
    success: (blob: Blob | null) => void,
    quality?: number,
    type?: string
  ) {
    canvas.toBlob(
      function (blob) {
        success(blob)
      },
      type || 'image/jpeg',
      quality || 0.8
    )
  }

  function urlToImage(
    url: string,
    success: (image: HTMLImageElement) => void,
    error: (err: string) => void
  ) {
    const image = new Image()
    image.onload = function () {
      success && success(image)
    }
    image.onerror = function () {
      error && error('加载失败')
    }

    image.src = url
  }

  function dataUrl2Blob(dataUrl: string, type?: string) {
    const data = dataUrl.split(',')[1]
    const mimePattern = /^data:(.*?)(;base64)?,/
    const mime = dataUrl.match(mimePattern)?.[1]
    const binStr = atob(data)
    const len = data.length
    const arr = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i)
    }
    return new Blob([arr], { type: type || mime })
  }

  return {
    fileToDataUrl,
    fileToImage,
    imageToCanvas,
    canvasToDataUrl,
    canvasToBlob,
    urlToImage,
    dataUrl2Blob
  }
}

export default fileTransform()
