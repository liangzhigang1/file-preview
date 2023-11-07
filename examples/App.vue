<template>
  <div id="app">
    <WordExamples></WordExamples>
    <!-- <PdfExamples></PdfExamples> -->
  </div>
</template>

<script>
import PdfExamples from "../examples/components/pdf-examples"
import WordExamples from "../examples/components/word-examples"
export default {
  name: 'App',
  components: {
    PdfExamples,
    WordExamples
  },
  data() {
    return {
      data: null
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
