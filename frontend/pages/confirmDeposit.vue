<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="max-w-screen-md m-auto p-4 pt-12">
      <!-- Title -->
      <div class="text-center mb-3 text-2xl">
        Conferma il deposito nel locker di: <div>{{ product.title }}</div>
      </div>
      <!-- Image -->
      <div class="mb-3">
        <img class="max-w-full m-auto" :src="product.imageUrl">
      </div>
      <div class="text-left flex justify-between mb-3">
        <!-- Owner -->
        <div class="truncate whitespace-nowrap w-2/4">
          {{ product.owner }}
        </div>
        <!-- Date -->
        <div class="text-right truncate whitespace-nowrap w-2/4">
          {{ product.insertionDate }}
        </div>
      </div>
      <!-- Description -->
      <div class="mb-12">
        {{ product.description }}
      </div>
      <div class="flex flex-wrap items-center justify-end gap-4 mb-3">
        <!-- Locker Selected -->
        <div>
          <div class="mb-12">
            <div class="font-bold">
              Locker selezionato:
            </div>
            <div class="italic">
              {{ product.locker?.address }},
            </div>
            <div class="italic">
              {{ product.locker?.name }}
            </div>
          </div>
        </div>
        <!-- Button -->
        <div>
          <Button text="Conferma" @click="confirm()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loading: false,
      product: {}
    }
  },
  mounted () {
    this.getProduct()
  },
  methods: {
    getProduct () {
      // finta chiamata alle api
      this.product = {
        id: 1,
        title: 'oggetto di prova',
        owner: 'Mario Rossi',
        description: 'descrizione oggetto di prova',
        maxLoanDays: 10,
        insertionDate: '10/11/2022',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
        locker:
        {
          id: 1,
          name: 'locker 1',
          province: 'Milano',
          address: 'Piazza Duomo, Milano'
        }
      }
    },
    confirm () {
      alert('Prodotto confermato')
    }
  }
}
</script>
