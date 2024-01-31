import { computed, defineComponent, ref } from 'vue'
import { MenuItemProps } from './props'
import { Menu } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { useLayoutStore } from '../../stores/layout'
import MiLink from '../link'
import MiMenuTitle from './Title'
import applyTheme from '../_utils/theme'
import styled from './style/item.module.less'

const MiMenuItem = defineComponent({
    name: 'MiMenuItem',
    inheritAttrs: false,
    props: MenuItemProps(),
    setup(props) {
        const layoutStore = useLayoutStore()
        const collapsed = computed(() => layoutStore.collapsed)
        applyTheme(styled)

        const key = ref<string>(($g.prefix || 'mi-') + (props?.item?.name || $tools.uid()))

        return () => (
            <Menu.Item
                class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}`}
                key={key.value}>
                <MiLink class={styled.link} path={props?.item?.path} query={props?.item?.query}>
                    <MiMenuTitle {...props} />
                </MiLink>
            </Menu.Item>
        )
    }
})

export default MiMenuItem