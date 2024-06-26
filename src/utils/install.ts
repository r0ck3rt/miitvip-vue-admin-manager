import type { App, Plugin } from 'vue'
import Mixins from './mixins'

/**
 * 通用组件安装方法
 * @desc common installation function
 * @param component 组件
 * @param alias 别名
 * @returns
 */
export const install = <T>(component: T, alias?: string) => {
    const comp = component as any
    comp.install = (app: App) => {
        Mixins(app)
        if (typeof app.component(comp.name) === 'undefined') {
            app.component(comp.name, component)
        }
        if (alias) app.config.globalProperties[alias] = comp
    }
    return comp as T & Plugin
}

export const installs = <T>(component: T, subs?: any[], alias?: string) => {
    const comp = component as any
    comp.install = (app: App) => {
        Mixins(app)
        if (typeof app.component(comp.name) === 'undefined') {
            app.component(comp.name, component)
            if (subs && subs.length > 0) {
                subs.forEach((sub: any) => {
                    if (typeof app.component(sub?.name) === 'undefined') {
                        app.component(sub?.name, sub)
                    }
                })
            }
        }
        if (alias) app.config.globalProperties[alias] = comp
    }
    return comp as T & Plugin
}
