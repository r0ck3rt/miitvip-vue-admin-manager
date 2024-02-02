import { computed, defineComponent, type Plugin } from 'vue'
import { MenuItemProps } from './props'
import { Menu } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { useMenuStore } from '../../stores/menu'
import { useLayoutStore } from '../../stores/layout'
import MiLink from '../link'
import MiMenuItemTitle from './Title'
import applyTheme from '../_utils/theme'
import styled from './style/item.module.less'

const MiMenuItem = defineComponent({
    name: 'MiMenuItem',
    inheritAttrs: false,
    props: MenuItemProps(),
    setup(props) {
        const layoutStore = useLayoutStore()
        const menuStore = useMenuStore()
        const collapsed = computed(() => layoutStore.collapsed)
        const activeKeys = computed(() => menuStore.activeKeys)
        applyTheme(styled)

        const key = $g.prefix + props?.item?.name
        const classes = computed(() => {
            return [
                styled.container,
                { [styled.collapsed]: collapsed.value },
                { [styled.active]: activeKeys.value.includes(key) }
            ]
        })
        const linkProps = {
            path: props?.item?.path,
            query: props?.item?.query || {}
        }

        return () => (
            <Menu.Item class={classes.value} key={key}>
                <MiLink class={styled.link} {...linkProps}>
                    <MiMenuItemTitle item={props.item} key={key} />
                </MiLink>
            </Menu.Item>
        )
    }
})

MiMenuItem.Title = MiMenuItemTitle

export default MiMenuItem as typeof MiMenuItem &
    Plugin & {
        readonly Title: typeof MiMenuItemTitle
    }
