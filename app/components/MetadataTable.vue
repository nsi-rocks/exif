<script setup lang="ts">
interface Props {
  meta: Record<string, any>
  titre?: string
}

defineProps<Props>()
</script>

<template>
  <section v-if="meta" class="space-y-2">
    <UTable :data="Object.entries(meta).map(([key, value]) => ({ [$t('exif.metadata.key')]: key, [$t('exif.metadata.value')]: value }))" />
    <!-- <div class="overflow-x-auto rounded-lg border">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="bg-muted/30">
            <th class="text-left p-2">
              {{ $t('exif.metadata.key') }}
            </th>
            <th class="text-left p-2">
              {{ $t('exif.metadata.value') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[k, v] in Object.entries(meta).sort((a, b) => a[0].localeCompare(b[0]))"
            :key="k"
            class="border-t"
          >
            <td class="align-top p-2 font-mono">
              {{ k }}
            </td>
            <td class="align-top p-2">
              <pre class="whitespace-pre-wrap break-words">
{{ typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v) }}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <!-- <p class="text-xs text-muted">
      {{ $t('exif.metadata.tip') }} <code>Orientation</code>, <code>DateTimeOriginal</code>, <code>Make/Model</code>, <code>LensModel</code>, <code>ExposureTime</code>, <code>FNumber</code>, etc.
    </p> -->
  </section>
</template>
