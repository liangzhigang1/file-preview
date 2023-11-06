<template>
  <div class="docx-container">
    <div ref="file"></div>
  </div>
</template>

<script>
// doc	doc 格式
// docx	docx 格式
// xls	xls 格式
// xlsx	xlsx 格式
// ppt	ppt 格式
// pptx	pptx 格式
// pdf	pdf 格式

import { renderAsync } from 'docx-preview';
export default {
  name: 'WordPreview',
  props: {
    // 文件url
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
    /**
     * 预览word
     * @param {*} url 
     */
    previewWord(url) {
      let $this = this;
      window
        .fetch(url)
        .then(res => res.blob())
        .then(blob => {
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            let base64data = reader.result;
            let blob = $this.dataURLtoBlob(base64data);
            let childRef = $this.$refs.file;
            renderAsync(blob, childRef, null, {
              inWrapper: true, // 启用围绕文档内容渲染包装器
              ignoreWidth: false, // 禁止页面渲染宽度
              ignoreHeight: false, // 禁止页面渲染高度
              ignoreFonts: false, // 禁止字体渲染
              breakPages: true, // 在分页符上启用分页
              ignoreLastRenderedPageBreak: true, //禁用lastRenderedPageBreak元素的分页
              experimental: false, //启用实验性功能（制表符停止计算）
              trimXmlDeclaration: true, //如果为真，xml声明将在解析之前从xml文档中删除
              debug: false,
            })
            //渲染
          };
        });
    },
    /**
     * base64data 转 blob
     * @param {*} dataUrl 
     */
    dataURLtoBlob(dataUrl) {
      let arr = dataUrl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bStr = atob(arr[1]);
      let n = bStr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    }
  },
  mounted() {
    this.previewWord(this.url)
  }
}
</script>

<style scoped>

.docx-container ::v-deep .docx-wrapper > section.docx {
  /* width: 55vw !important; */
  /* padding: 0rem !important; */
  /* min-height: auto !important; */
  /* box-shadow: none; */
  /* margin-bottom: 0; */
  /* overflow-y: scroll; */
  /* height: 100vh; */
}

.docx-container ::v-deep .docx-wrapper {
  /* display:block !important;
  background-color: #fff;
  padding: 0px !important;
  width: 400px; */
}

/* .docx-container{
  width: 400px;
  overflow-x: auto;
}
.docx-container ::v-deep .docx-wrapper {
  background-color: #fff;
  padding: 20px 20px;
}
.docx-container ::v-deep .docx-wrapper > section.docx {

} */

/* .docx-container ::v-deep .docx-wrapper {
  background-color: #fff;
  padding: 20px 20px;
}
.docx-container ::v-deep .docx-wrapper > section.docx {
  width: 55vw !important;
  padding: 0rem !important;
  min-height: auto !important;
  box-shadow: none;
  margin-bottom: 0;
  overflow-y: scroll;
  height: 100vh;
}

.docx-container ::v-deep .docx-wrapper > section.docx::-webkit-scrollbar {
  display: none;
} */
</style>