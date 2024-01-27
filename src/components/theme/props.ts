import { object } from 'vue-types'
import { ThemeTokens } from './tokens'

/**
 * 主题属性
 * @param theme 主题配置
 *  - `Record<string, any>`
 *
 * e.g.
 * ```
 * <mi-theme :theme="{ theme: '#f0c26f', components: { layout: { content: { background: '#333' } } } }">
 *     <mi-layout>
 *         // ...
 *     </mi-layout>
 * </mi-theme>
 * ```
 * @see ThemeTokens
 */
export interface ThemeProperties {
    theme: Partial<ThemeTokens>
}
export const ThemeProps = () => ({
    theme: object<Partial<ThemeTokens>>()
})