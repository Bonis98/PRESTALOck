<template>
  <div>
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="text-center mb-3 text-2xl">
        Upload la foto del prodotto
      </div>
      <div class="mt-3">
        Carica la foto
      </div>
      <div class="m-3">
        <div><Input class="mb-3" v-model="file" type="file" /></div>
      <div><Button class="mb-3" text="Carica" @click="load()" /></div>
        <div>Foto caricata:</div>
        <!-- Image -->
        <div class="mb-3">
          <img class="max-w-full m-auto" :src="product.imageUrl">
        </div>
        <Button text="Salva" @click="save()" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      photo: '',
      product: ''
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
    }
    }
  }
  </script>
  