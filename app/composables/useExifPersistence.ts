// Composable pour persister les données EXIF dans le localStorage
export const useExifPersistence = () => {
  const STORAGE_KEY = 'exif-app-data'

  // Interface pour les données persistées
  interface PersistedExifData {
    fileName?: string
    fileSize?: number
    fileType?: string
    fileLastModified?: number
    imageData?: string // Base64 de l'image
    gps?: { latitude?: number, longitude?: number } | null
    groups?: ExifGroups | null
    tabIndex?: string
    errorMsg?: string | null
  }

  // Sauvegarder les données
  const saveExifData = (data: PersistedExifData) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
      catch (error) {
        console.warn('Impossible de sauvegarder dans localStorage:', error)
      }
    }
  }

  // Charger les données
  const loadExifData = (): PersistedExifData | null => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
      }
      catch (error) {
        console.warn('Impossible de charger depuis localStorage:', error)
        return null
      }
    }
    return null
  }

  // Supprimer les données
  const clearExifData = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      }
      catch (error) {
        console.warn('Impossible de supprimer localStorage:', error)
      }
    }
  }

  // Convertir un File en base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Recréer un File depuis les données persistées
  const createFileFromData = (fileName: string, fileType: string, fileSize: number, lastModified: number, imageData: string): File => {
    // Convertir base64 en Blob
    const base64Data = imageData.split(',')[1]
    if (!base64Data) {
      throw new Error('Invalid base64 data')
    }
    const byteCharacters = atob(base64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: fileType })
    return new File([blob], fileName, {
      type: fileType,
      lastModified,
    })
  }

  return {
    saveExifData,
    loadExifData,
    clearExifData,
    fileToBase64,
    createFileFromData,
  }
}