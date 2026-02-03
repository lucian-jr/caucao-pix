import axios from 'axios'
import * as FileSystem from 'expo-file-system/legacy'

export type ReadFileResponse = {
  base64: string
  type: string
  name: string
  uri: string
}

export async function readFile(uri: string): Promise<ReadFileResponse> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri)

    if (!fileInfo.exists) {
      throw new Error('Arquivo não existe');
    }
  
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })

    const last7 = uri.substring(uri.length - 7).toLocaleLowerCase()

    let ext = ''

    if (last7.includes('.png'))  ext = 'png'
    if (last7.includes('.jpg'))  ext = 'jpg'
    if (last7.includes('.jpeg')) ext = 'jpeg'

    return {
      uri,
      base64,
      type: 'image/' + ext,
      name: 'image.' + ext,
    }
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error)

    throw error
  }
}

export const downloadImage = async (url: string, filename: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(url, { responseType: 'blob' })
      const blob = response.data
  
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string
          const base64String = base64data.split(',')[1]
  
          const path = FileSystem.documentDirectory + filename;
          await FileSystem.writeAsStringAsync(path, base64String, { encoding: FileSystem.EncodingType.Base64 })

          resolve(path)
        } catch(error) {
          reject(`Error in saving file: ${error}`)
        }
      }
    } catch (error) {
      reject(`Error in downloading image: ${error}`)
    }
  })
}