<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// Liste des images codée en dur
const images = [
  '/exemples/DSCN0010.jpg',
  '/exemples/DSCN0012.jpg',
  '/exemples/DSCN0021.jpg',
  '/exemples/DSCN0025.jpg',
  '/exemples/DSCN0027.jpg',
  '/exemples/DSCN0029.jpg',
  '/exemples/DSCN0038.jpg',
  '/exemples/DSCN0040.jpg',
  '/exemples/DSCN0042.jpg',
]

// Fonction pour naviguer vers la page d'accueil avec l'URL de l'image
function viewImage(imageUrl: string) {
  navigateTo(localePath(`/?url=${encodeURIComponent(imageUrl)}`))
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">
          {{ t('exemples.title') }}
        </h1>
        
        <p v-if="!images || images.length === 0" class="text-gray-500">
          {{ t('exemples.noImages') }}
        </p>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="imageUrl in images"
            :key="imageUrl"
            class="cursor-pointer group"
            @click="viewImage(imageUrl)"
          >
            <div class="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-primary transition-colors">
              <img
                :src="imageUrl"
                :alt="imageUrl.split('/').pop()"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              >
            </div>
            <p class="text-sm text-gray-600 mt-2 text-center truncate">
              {{ imageUrl.split('/').pop() }}
            </p>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>
