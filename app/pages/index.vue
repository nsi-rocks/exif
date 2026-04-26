<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const route = useRoute()
const router = useRouter()
const { saveExifData, loadExifData, clearExifData, fileToBase64, createFileFromData } = useExifPersistence()

// Modèle de fichier unique contrôlé par UFileUpload
const file = ref<File | null>(null)
const groups = ref<ExifGroups | null>(null)
const isLoadingFromUrl = ref(false)

const previewUrl = computed<string | null>(() =>
  file.value ? URL.createObjectURL(file.value) : null,
)

const isParsing = ref(false)
const errorMsg = ref<string | null>(null)
const gps = ref<{ latitude?: number, longitude?: number } | null>(null)
const tabIndex = ref('0')

watch(file, async (f) => {
  if (f) {
    if (!f.type.startsWith('image/')) {
      errorMsg.value = t('exif.errors.invalidFileType')
      return
    }
    try {
      errorMsg.value = null
      gps.value = null
      isParsing.value = true

      const dims = await getDims(f)
      groups.value = await parseWithGroups(f, dims)

      // Sauvegarder automatiquement après traitement
      await nextTick()
      saveCurrentState()
    }
    catch (e) {
      console.error(e)
      errorMsg.value = t('exif.errors.parsingError')
    }
    finally {
      isParsing.value = false
    }
  }
  else {
    // reset
    errorMsg.value = null
    gps.value = null
    groups.value = null
    clearAll()
  }
})

// Sauvegarder quand l'onglet change
watch(tabIndex, () => {
  if (file.value) {
    saveCurrentState()
  }
})

// Restaurer l'état au montage du composant
onMounted(async () => {
  // console.log('Tentative de restauration de l\'état...')

  // Vérifier d'abord s'il y a un paramètre URL
  const urlParam = route.query.url as string
  if (urlParam) {
    console.log('Chargement d\'image depuis URL:', urlParam)
    await loadImageFromUrl(urlParam)
  }
  else {
    // Sinon, tenter de restaurer l'état depuis localStorage
    restoreState()
  }
})

function clearAll() {
  clearExifData()
  file.value = null
  router.push({ path: localePath('/') })
}

// Fonction pour charger une image depuis une URL
async function loadImageFromUrl(imageUrl: string) {
  if (!imageUrl) return

  isLoadingFromUrl.value = true
  errorMsg.value = null

  try {
    // Vérifier que l'URL semble valide
    const url = new URL(imageUrl)

    // Télécharger l'image (avec gestion CORS)
    let response: Response
    try {
      response = await fetch(imageUrl, {
        mode: 'cors',
        headers: {
          Accept: 'image/*',
        },
      })
    }
    catch (corsError) {
      // Fallback avec un service proxy CORS en cas d'erreur
      console.warn('Erreur CORS, tentative avec proxy:', corsError)
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`
      response = await fetch(proxyUrl)
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    // Vérifier que c'est bien une image
    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      throw new Error('L\'URL ne pointe pas vers une image valide')
    }

    // Convertir en Blob puis en File
    const blob = await response.blob()
    const fileName = url.pathname.split('/').pop() || 'image-from-url'
    const fileFromUrl = new File([blob], fileName, { type: blob.type })

    // Assigner le fichier (cela déclenchera le watcher)
    file.value = fileFromUrl
  }
  catch (error) {
    console.error('Erreur lors du chargement de l\'image:', error)
    errorMsg.value = error instanceof Error
      ? `Impossible de charger l'image : ${error.message}`
      : 'Impossible de charger l\'image depuis cette URL'
  }
  finally {
    isLoadingFromUrl.value = false
  }
}

// Fonction pour sauvegarder l'état actuel
async function saveCurrentState() {
  if (!file.value) return

  try {
    const imageData = await fileToBase64(file.value)
    const dataToSave = {
      fileName: file.value.name,
      fileSize: file.value.size,
      fileType: file.value.type,
      fileLastModified: file.value.lastModified,
      imageData,
      gps: gps.value,
      groups: groups.value,
      tabIndex: tabIndex.value,
      errorMsg: errorMsg.value,
    }
    saveExifData(dataToSave)
  }
  catch (error) {
    console.warn('Erreur lors de la sauvegarde:', error)
  }
}

// Fonction pour restaurer l'état sauvegardé
async function restoreState() {
  const savedData = loadExifData()
  if (!savedData || !savedData.imageData) return

  try {
    // Recréer le fichier depuis les données sauvegardées
    const restoredFile = createFileFromData(
      savedData.fileName || 'image.jpg',
      savedData.fileType || 'image/jpeg',
      savedData.fileSize || 0,
      savedData.fileLastModified || Date.now(),
      savedData.imageData,
    )

    // Restaurer tous les états
    file.value = restoredFile
    gps.value = savedData.gps || null
    groups.value = savedData.groups || null
    tabIndex.value = savedData.tabIndex || '0'
    errorMsg.value = savedData.errorMsg || null
  }
  catch (error) {
    console.warn('Erreur lors de la restauration:', error)
    clearExifData()
  }
}
</script>

<template>
  <div class="mx-auto p-6 space-y-6">
    <header class="space-y-1.5">
      <h1 class="text-2xl font-semibold">
        {{ $t('exif.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ $t('exif.description') }}
      </p>
      <p class="text-xs text-muted/70">
        {{ $t('exif.urlTip') }}
      </p>
    </header>

    <!-- Zone d'upload (Nuxt UI) -->
    <UFileUpload
      v-model="file"
      accept="image/*"
      icon="i-lucide-image"
      :label="$t('exif.upload.label')"
      :description="$t('exif.upload.description')"
      class="w-full min-h-48"
    >
    </UFileUpload>

    <div v-if="isLoadingFromUrl" class="text-sm">
      {{ $t('exif.loadingFromUrl') }}
    </div>
    <div v-if="isParsing" class="text-sm">
      {{ $t('exif.parsing') }}
    </div>
    <div v-if="errorMsg" class="text-sm text-error">
      {{ errorMsg }}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ImagePreview v-if="previewUrl" :preview-url="previewUrl" />
      <GpsLocation v-if="groups?.GPS?.latitude !== undefined && groups?.GPS?.longitude !== undefined" :gps="groups?.GPS" />
    </div>

    <!-- Tableau de métadonnées -->
    <template v-if="groups">
      <UTabs v-model="tabIndex" :items="Object.keys(groups).map(el => ({ label: el, key: el }))" class="w-full">
        <template #content>
          <MetadataTable
            :meta="groups[Object.keys(groups)[parseInt(tabIndex)] as keyof ExifGroups] || {}"
            :titre="Object.keys(groups)[parseInt(tabIndex)] || ''"
          />
        </template>
      </UTabs>
    </template>
  </div>
</template>
