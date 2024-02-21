import { object } from 'vue-types'
import { PropTypes, DeviceSize } from '../../utils/types'
import { animations, tuple, methods } from '../_utils/props'

/**
 * +=====================+
 * |       Search        |
 * +=====================+
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角弧度
 * @param value v-model
 * @param placeholder 占位文案
 * @param suffix 后缀<Slot />
 * @param searchAction 搜索接口或自定义搜索动作
 * @param searchParams 搜索参数
 * @param searchMethod 读取搜索接口方法 ( 默认: post )
 * @param searchDelay 搜索延迟
 * @param listWidth 列表宽度
 * @param listHeight 列表高度
 * @param listRadius 列表圆角弧度
 * @param listAnimation 列表显示动画
 * @param listNoDataText 空数据提示语
 * @param pagination 搜索列表是否分页
 * @param pageSize 每一页的条数
 * @param data 所有数据
 * @param zIndex 层级
 */
export interface SearchProperties {
    width: number | string | DeviceSize
    height: number | string | DeviceSize
    radius: number | string | DeviceSize
    value: string | number
    placeholder: string
    suffix: any
    searchAction: string | Function
    searchParams: object
    searchMethod: string
    searchKey: string
    searchDelay: string | number
    listWidth: number | string | DeviceSize
    listHeight: number | string | DeviceSize
    listRadius: number | string | DeviceSize
    listAnimation: string
    listNoDataText: string
    pagination: boolean
    pageSize: number | string | DeviceSize
    data: Array<any>
    zIndex: number
}
export const SearchProps = () => ({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(48),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    suffix: PropTypes.any,
    searchAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    searchParams: PropTypes.object.def({}),
    searchMethod: PropTypes.oneOf(tuple(...methods)).def('post'),
    searchKey: PropTypes.string.isRequired,
    searchDelay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    listWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    listHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    listRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(
        8
    ),
    listAnimation: PropTypes.oneOf(tuple(...animations)).def('scale'),
    listNoDataText: PropTypes.string,
    pagination: PropTypes.bool.def(true),
    pageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(
        10
    ),
    data: PropTypes.array.def([]),
    zIndex: PropTypes.number
})
