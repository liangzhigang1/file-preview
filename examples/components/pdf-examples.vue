<template>
  <div>
    <div class="main-container">
      <input type="file" ref="fielinput" @change="uploadFile" />
    </div>
    <pdf-preview
      :data="data"
      :isSupportWatermark="true"
      watermark="lzg"
    >
    </pdf-preview>
  </div>
</template>

<script>
export default {
  name: 'pdf-examples',
  components: {
  },
  data() {
    return {
      data: null
    }
  },
  methods: {
    uploadFile() {
      let inputDom = this.$refs.fielinput;
      let file = inputDom.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = atob(
          reader.result.substring(reader.result.indexOf(",") + 1)
        );
        this.data = data;
      };
    },
  }
}
</script>

<style>

</style>
