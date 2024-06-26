import { PropTypes, type DeviceSize, Position } from '../../utils/types'
import { object } from 'vue-types'

/**
 * +====================+
 * |       Title        |
 * +====================+
 * @param title 标题
 * @param center 居中
 * @param size 大小
 * @param color 颜色
 * @param margin 间距
 */
export interface TitleProperties {
    title: string
    center: boolean
    size: string | number | DeviceSize
    color: string
    margin: Position
}
export const TitleProps = () => ({
    title: PropTypes.string.isRequired,
    center: PropTypes.bool.def(false),
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(24),
    color: PropTypes.string,
    margin: PropTypes.object.def({})
})
