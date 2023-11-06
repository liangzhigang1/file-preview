<template>
  <div class="main-container">
    <div ref="canvasCont" id="canvas-container"></div>
  </div>
</template>

<script>

const pdfJS = require("pdfjs-dist"); // 引入pdfjs-dist 负责API解析
pdfJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry"); // 引入pdf.worker.entry 负责API解析
export default {
  name: 'PdfPreview',
  props: {
    // 是否支持水印
    isSupportWatermark: {
      type: Boolean,
      default: false
    },
    // 是否支持分页
    isSupportPage: {
      type: Boolean,
      default: false
    },
    // 水印名称
    watermark: {
      type: String,
      default: "水印文字水印文字水印文字",
    },
    // 文件url
    url: {
      type: String,
      default: ''
    },
    // data是一个ArrayBuffer格式，也是一个buffer流的数据
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pageNo: null,         // 正在渲染第几页
      pdfPageNumber: null,  // pdf总页数
      pdfData: null,        // PDF的base64
      scale: 1,             // 缩放值
      width: "",            // 宽度
      height: "",           // 高度
    };
  },
  methods: {
    /**
     * 开始加载pdf内容
     * @param {*} url 
     */
    loadPdfData(url, type) {
      try {
        // let CMAP_URL = 'https://unpkg.com/pdfjs-dist@2.0.943/cmaps/'  // 引入pdf.js的字体 https://unpkg.com/pdfjs-dist@2.0.943/cmaps/
        if (type == 'url') {
          this.pdfData = pdfJS.getDocument(url);
        } else {
          this.pdfData = pdfJS.getDocument({            // 读取url的pdf流文件
            data: url,                                  // PDF url
            // cMapUrl: CMAP_URL,
            cMapUrl: "../../../node_modules/pdfjs-dist/cmaps/",// 必须引入字体文件
            cMapPacked: true,
          });
        }
        this.$nextTick(() => {
          this.renderPage(1);
        });
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * 根据页码渲染相应的PDF
     * @param {*} num 页码
     */
    renderPage(num) {
      try {
        this.pdfData.promise.then((pdf) => {
          this.pdfPageNumber = pdf.numPages;          // 得到pdf的总页数
          pdf.getPage(num).then((page) => {           // 得到某一个pdf
            let canvasContainer = document.getElementById('canvas-container'); // 获取canvas容器
            let canvas = document.createElement('canvas') // 创建canvas
            let renderContext = {}
            if (window.innerWidth > 500) {
              let ctx = canvas.getContext('2d')
              let ratio = this.getRatio(ctx); // 获取页面比率
              let dialogWidth = this.$refs["canvasCont"].offsetWidth; // 页面宽度
              let pageWidth = page.view[2] * ratio;       // 视口宽度
              let scale = dialogWidth / pageWidth;        // 根据页面宽度和视口宽度的比率就是内容区的放大比率
              let viewport = page.getViewport({ scale }); // 获取viewport
              this.width = viewport.width * ratio;        // 记录内容区宽，后期添加水印时需要
              this.height = viewport.height * ratio;      // 记录内容区高，后期添加水印时需要
              canvas.width = this.width;                  // 设置canvas的宽度
              canvas.height = this.height;                // 设置canvas的高度
              canvasContainer.appendChild(canvas);        // 往canvas容器加入canvas
              ctx.setTransform(ratio, 0, 0, ratio, 0, 0); // // 缩放比率
              renderContext = {
                canvasContext: ctx,
                viewport: viewport,
              }; // 渲染内容
            } else {
              let viewport = page.getViewport({ scale: 1 })
              let canvas = document.createElement('canvas')
              let ctx = canvas.getContext('2d')
              canvasContainer.appendChild(canvas)
              canvas.height = viewport.height
              canvas.width = viewport.width
              canvas.style.width = '100%'
              canvas.style.aspectRatio = 'auto'
              renderContext = {
                canvasContext: ctx,
                viewport: viewport,
              };
            }
            // svg
            // page.getOperatorList().then((opList) => {
            //   var svgFx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
            //   return svgFx.getSVG(opList, viewport).then(function (svg) {
            //     pageContainer.appendChild(svg);
            //   });
            // });
            page.render(renderContext).promise.then(() => { // 开始渲染
              this.pageNo = num;
              // 添加水印
              if (this.isSupportWatermark) {
                this.renderWatermark(canvas);
              }
            });
            // 循环渲染
            if (num < this.pdfPageNumber) {
              setTimeout(() => {
                this.renderPage(num + 1);
              }, 300);
            }
          });
        });
       } catch (error) {
        console.error(error)
      }
    },
    /**
     * 计算角度
     * @param {*} ctx 
     */
    getRatio(ctx) {
      let dpr = window.devicePixelRatio || 1;
      let bsr =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
      return dpr / bsr;
    },
    /**
     * 在画布上渲染水印
     * @param {*} canvas 指定在哪个画布上使用水印
     */
    renderWatermark(canvas) {
      let ctx = canvas.getContext("2d");
      let pattern = ctx.createPattern(this.initWatermark(), "repeat"); // 平铺水印
      ctx.rect(0, 0, this.width, this.height);
      ctx.fillStyle = pattern;
      ctx.fill();
    },
    /**
     * 生成水印图片
     */
    initWatermark() {
      let canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      let ctx = canvas.getContext("2d");
      ctx.rotate((-18 * Math.PI) / 180);
      ctx.font = "10px Vedana";
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(this.watermark, 10, 100);
      return canvas;
    }
  },
  mounted() {
    if (this.url) {
      this.loadPdfData(this.url, 'url')
    } else if(this.data) {
      this.loadPdfData(this.data)
    }
  },
  watch: {
    url(val) {
      if (val) {
        this.loadPdfData(this.url, 'url')
      }
    },
    data(val) {
      if (val) {
        this.loadPdfData(this.data)
      }
    }
  }
};
</script>

<style scoped>
.main-container {
  width: 100%;
  height: 100%;
}
#canvas-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
