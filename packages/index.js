import PdfPreview from './pdf'
import WordPreview from './word'

const install = Vue => {
  Vue.component(PdfPreview.name, PdfPreview)
  Vue.component(WordPreview.name, WordPreview)
}

export default {
  install,
  PdfPreview,
  WordPreview
}
