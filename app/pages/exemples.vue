<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// Importer la liste des images au build time avec Vite
const imageModules = import.meta.glob('/public/exemples/*.{jpg,jpeg,png,gif,webp,bmp}', { 
  eager: true,
  query: '?url',
  import: 'default'
})

// Extraire les URLs des images
const images = Object.keys(imageModules).map(path => {
  // Convertir /public/exemples/image.jpg en /exemples/image.jpg
  return path.replace('/public', '')
})

// Fonction pour naviguer vers la page d'accueil avec l'URL de l'image
function viewImage(imageUrl: string) {
  navigateTo(localePath(`/?url=${encodeURIComponent(imageUrl)}`))
}
</script>

<template>1 container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">
          {{ t('exemples.title') }}
        </h1>
        
        <p v-if="error" class="text-red-500 mb-4">
          {{ t('exemples.error') }}
        </p>
        
        <p v-else-if="!images || images.length === 0" class="text-gray-500">
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
