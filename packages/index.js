import PdfPreview from './pdf'

const install = Vue => {
  Vue.component(PdfPreview.name, PdfPreview)
}

export default {
  install,
  PdfPreview
}
