<script setup lang="ts">
const { t } = useI18n()

interface Props {
  gps: {
    latitude?: number
    longitude?: number
  }
}

const props = defineProps<Props>()

function openInOSM() {
  if (!props.gps?.latitude || !props.gps?.longitude) return
  const { latitude, longitude } = props.gps
  const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
  window.open(url, '_blank')
}

function copyCoordinates() {
  if (!props.gps?.latitude || !props.gps?.longitude) return
  navigator.clipboard.writeText(`${props.gps.latitude}, ${props.gps.longitude}`)
}
</script>

<template>
  <div v-if="gps?.latitude !== undefined && gps?.longitude !== undefined" class="space-y-2">
    <h2 class="font-medium">
      {{ $t('exif.gps.title') }}
    </h2>
    <div class="rounded-lg border p-3 text-sm space-y-2">
      <div>{{ $t('exif.gps.latitude') }} : <strong>{{ gps.latitude }}</strong></div>
      <div>{{ $t('exif.gps.longitude') }} : <strong>{{ gps.longitude }}</strong></div>
      <div class="flex gap-2">
        <UButton size="xs" variant="outline" color="neutral"
                 icon="i-lucide-map-pin"
                 :label="$t('exif.gps.openInOSM')"
                 @click="openInOSM" />
        <UButton size="xs" variant="ghost" color="neutral"
                 icon="i-lucide-clipboard"
                 :label="$t('exif.gps.copy')"
                 @click="copyCoordinates" />
      </div>
    </div>
  </div>
</template>
