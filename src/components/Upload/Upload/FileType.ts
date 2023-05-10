export type FileType = 'image' | 'pdf'

export type BeforeUpload = (file: File | File[]) => boolean | Promise<File | File[]>
export interface FileChooseProps {
  size?: number
  fileType?: FileType
  multiple?: boolean
  accept?: string
  capture?: 'user' | 'environment' | undefined
}

export interface ImageItemProps {
  key: string
  url: string
  size: number
  status: string
}
