import { App, Plugin } from 'vue'
import MiNotice from './notice'
import MiNoticeTab from './tab'
import MiNoticeItem from './item'
import './style'

MiNotice.Tab = MiNoticeTab
MiNotice.Item = MiNoticeItem
MiNotice.install = (app: App) => {
    app.component(MiNotice.name, MiNotice)
    app.component(MiNoticeTab.name, MiNoticeTab)
    app.component(MiNoticeItem.name, MiNoticeItem)
    return app
}

export default MiNotice as typeof MiNotice &
    Plugin & {
        readonly Tab: typeof MiNoticeTab
        readonly Item: typeof MiNoticeItem
    }
