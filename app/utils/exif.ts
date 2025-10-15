// utils/exif.ts
export type ExifGroups = {
  File?: Record<string, any>
  Image?: Record<string, any>
  EXIF?: Record<string, any>
  GPS?: Record<string, any>
  Interop?: Record<string, any>
  Thumbnail?: Record<string, any>
  IPTC?: Record<string, any>
  XMP?: Record<string, any>
  MakerNotes?: Record<string, any>
}

export async function parseWithGroups(file: File, dims?: { width: number; height: number }): Promise<ExifGroups> {
  const exifr = (await import('exifr')).default

  // On demande les blocs, non fusionnés
  const out = await exifr.parse(file, {
    // Segments
    tiff: { exif: true, gps: true, ifd1: true, interop: true },
    xmp: true,
    iptc: true,
    // Formatters
    translateKeys: true,
    translateValues: true,
    reviveValues: true,
    // Structure
    mergeOutput: false,
    // makerNote à false (très gros)
    makerNote: false
  })


  // Construit la section "File" à partir de l'objet File + dimensions calculées côté client
  const FileGroup = {
    Filename: file.name,
    'File Size': `${Math.round(file.size / 1024)} KiB`,
    'File Type': file.type?.split('/')[1]?.toUpperCase() || '—',
    'MIME Type': file.type || '—',
    ...(dims ? { 'Image Width': dims.width, 'Image Height': dims.height } : {})
  }

  // Mappe les clés d’exifr (quand mergeOutput:false)
  const groups: ExifGroups = {
    File: FileGroup,
    Image: out?.ifd0 || undefined,
    EXIF: out?.exif || undefined,
    GPS: out?.gps || undefined,
    Interop: out?.interop || undefined,
    Thumbnail: out?.ifd1 || undefined,
    IPTC: out?.iptc || undefined,
    XMP: out?.xmp || undefined
  }

  // Nettoie les sections vides
  for (const k of Object.keys(groups) as (keyof ExifGroups)[]) {
    if (!groups[k] || !Object.keys(groups[k] as object).length) delete groups[k]
  }
  return groups
}

export async function getDims(file: File) {
  return new Promise<{width:number;height:number}|undefined>((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url) }
    img.onerror = () => { resolve(undefined); URL.revokeObjectURL(url) }
    img.src = url
  })
}