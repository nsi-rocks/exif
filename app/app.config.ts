export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'cursor-pointer'
      },
    },
    pageHero: {
      slots: {
        root: 'mt-12',
        container: "ring ring-default rounded-lg bg-muted py-8 sm:py-12 lg:py-16 animate-wiggle"
      }
    },
    pageSection: {
      slots: {
        root: 'mt-12',
        container: "py-8 sm:py-12 lg:py-16"
      }
    },
    pageCard: {
      variants: {
        variant: {
          subtle: {
            root: 'bg-muted'
          }
        }
      },
      compoundVariants: [
        {
          variant: 'subtle',
          to: true,
          class: {
            root: 'hover:bg-elevated transition duration-500'
          }
        },
      ]
    }
  }
})
  