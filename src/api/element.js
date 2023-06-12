import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItem,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElCol,
  ElTableColumn,
  ElTable,
  ElSwitch
} from 'element-plus'

import { Location, Menu as IconMenu, Search } from '@element-plus/icons'

import { ArrowRight } from '@element-plus/icons-vue'

export default app => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElRow)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMain)
  app.use(ElMenu)
  app.use(ElSubmenu)
  app.use(ElMenuItem)
  app.use(ElIcon)
  app.use(ElBreadcrumb)
  app.use(ElBreadcrumbItem)
  app.use(ElCard)
  app.use(ElCol)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElSwitch)
  app.component('location', Location)
  app.component('iconMenu', IconMenu)
  app.component('arrowRight', ArrowRight)
  app.component('search', Search)
  app.config.globalProperties.$message = ElMessage
}
