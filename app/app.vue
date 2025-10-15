<script setup lang="ts">
const { t, locale, locales } = useI18n()
const route = useRoute()

const siteUrl = 'https://exif.nsi.rocks'

const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const title = computed(() => t('seo.home.title'))
const description = computed(() => t('seo.home.description'))

const canonical = computed(() => siteUrl + localePath(route.fullPath))

const ogLocale = computed(() => (locale.value === 'fr' ? 'fr_FR' : 'en_US'))

const ogImage = computed(() =>
  locale.value === 'fr' ? '/banniere-x.png' : '/banniere-x.png',
)

useHead({
  htmlAttrs: { lang: () => locale.value },
})

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  robots: 'index, follow',
  ogUrl: () => canonical.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogImage: () => ogImage.value,
  ogType: 'website',
  ogLocale: () => ogLocale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
  twitterImage: () => ogImage.value,
  themeColor: '#6A0DAD',
  colorScheme: 'light dark',
})

useHead(() => ({
  link: [
    { rel: 'canonical', href: canonical.value },
    ...locales.value.map((l: any) => ({
      rel: 'alternate',
      hreflang: l.code, // ex: "fr", "en"
      href: siteUrl + switchLocalePath(l.code), // URL équivalente dans chaque langue
    })),
    { rel: 'alternate', hreflang: 'x-default', href: siteUrl + switchLocalePath('en') },
  ],
}))
</script>

<template>
  <UApp>
    <Header what="EXIF" />
    <UMain>
      <UContainer>
        <UPage>
          <NuxtPage />
        </UPage>
      </UContainer>
    </UMain>
    <Footer />
  </UApp>
</template>
