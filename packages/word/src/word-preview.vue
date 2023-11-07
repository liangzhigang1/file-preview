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
// mammoth 技术方案

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
              className: "docx", //默认和文档样式类的类名/前缀
              inWrapper: true, //启用围绕文档内容呈现包装器
              ignoreWidth: false, //禁用页面的渲染宽度
              ignoreHeight: false, //禁用页面的渲染高度
              ignoreFonts: false, //禁用字体渲染
              breakPages: true, //在分页符上启用分页
              ignoreLastRenderedPageBreak: true, //在lastRenderedPageBreak元素上禁用分页
              experimental: false, //启用实验功能（制表符停止计算）
              trimXmlDeclaration: true, //如果为true，则在解析之前将从xml文档中删除xml声明
              useBase64URL: false, //如果为true，图像、字体等将转换为base 64 URL，否则使用URL.createObjectURL
              useMathMLPolyfill: false, //包括用于铬、边等的MathML多填充。
              showChanges: false, //启用文档更改的实验渲染（插入/删除）
              debug: false, //启用额外的日志记录
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
.docx-container {
  min-width: 810px !important;
}
/* .docx-container ::v-deep .docx-wrapper > section.docx {
  padding: 0rem !important;
}

.docx-container ::v-deep .docx-wrapper {
  display:block !important;
  background-color: #fff;
  padding: 0px !important;
} */
</style>