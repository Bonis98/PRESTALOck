<template>
  <div>
    <TopBar />
    <div class="flex flex-wrap w-11/12 m-auto mt-4 justify-around gap-24">
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
      <ListingCard />
    </div>
  </div>

</template>

<script>

export default {
  name: "IndexPage",
  data() {
    return {
      lista: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  }

}

</script>
