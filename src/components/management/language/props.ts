import { PropType } from 'vue'
import PropTypes from '../../_utils/props-types'

export interface CommonRequestProps {
    url?: String
    method?: String
    params?: Object
    callback?: Function
}

export const languageProps = () => ({
    prefixCls: PropTypes.string,
    dataSource: PropTypes.array,
    data: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'GET',
                params: {}
            }
        }
    },
    categorySource: PropTypes.array,
    category: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'GET',
                params: {}
            }
        }
    },
    addCategory: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {}
            }
        }
    },
    deleteCategory: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {}
            }
        }
    },
    addLanguage: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {},
                callback: null
            }
        }
    },
    updateLanguage: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {}
            }
        }
    },
    deleteLanguage: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {}
            }
        }
    },
    checkLanguageKeyExist: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {}
            }
        }
    },
    paginationLocale: PropTypes.any
})