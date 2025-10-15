<script lang="ts" setup>
const lp = useLocalePath()
defineProps({
  what: {
    type: String,
    default: 'NSI',
  },
})
</script>

<template>
  <UHeader :toggle="false">
    <template #title>
      <Logo class="block w-auto h-10" :what="what" />
    </template>
    <template #right>
      <!-- <UContentSearchButton label="" /> -->
      <ClientOnly>
        <UColorModeButton />
        <I18nSwitch />
      </ClientOnly>
    </template>
  </UHeader>
</template>

<style scoped>

</style>
