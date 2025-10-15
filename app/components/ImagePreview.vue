<script setup lang="ts">
const { t } = useI18n()

interface Props {
  previewUrl: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2">
    <h2 class="font-medium">
      {{ $t('exif.preview.title') }}
    </h2>
    <img
      :src="previewUrl"
      :alt="$t('exif.preview.alt')"
      class="max-h-72 rounded-xl border m-auto"
      style="image-orientation: from-image;"
    >
  </div>
</template>
