import { array, object } from 'vue-types'
import { PropTypes } from '../../../utils/types'

/**
 * +=========================+
 * |       百度翻译属性       |
 * +=========================+
 * @param url 翻译接口地址
 * @param key 翻译接口 key 值
 * @param appid 翻译接口 appid
 */
export interface BaiduTranslateProperties {
    url: string
    key: string | number
    appid: string | number
}

/**
 * +=====================+
 * |       翻译属性       |
 * +=====================+
 * @param type 翻译类型 ( 默认百度 )
 * @param baidu 百度翻译配置
 * @param languages 自定义翻译语言列表
 * @param defaultLanguage 自定义翻译语言列表默认选中值
 * @param translate 自定义翻译功能
 */
export interface TranslateProperties {
    [key: string]: any
    type: string
    baidu: Partial<BaiduTranslateProperties>
    languages: Record<string, string>
    defaultLanguage: string
    translate: Function
}

/**
 * +=======================+
 * |       语言项属性       |
 * +=======================+
 * @param id 语言项 id
 * @param cid 语言项 cid
 * @param key 语言项 key
 * @param language 语言
 * @param is_default 是否默认
 * @param type 语言类型
 */
export interface LanguageItemProperties {
    id: string | number
    cid: string | number
    key: string
    language: string
    is_default: number
    type: string
}

/**
 * +=========================+
 * |       语言配置属性       |
 * +=========================+
 * @param translate 翻译配置
 * @param data 语言项数据
 * @param category 语言分类数据
 * @param getCategoryAction 获取语言分类接口地址或自定义方法
 * @param getCategoryMethod 获取语言分类接口的请求方式 ( string 时有效 )
 * @param getCategoryParams 获取语言分类接口参数
 * @param createCategoryAction 创建语言分类接口地址或自定义方法
 * @param createCategoryMethod 创建语言分类接口的请求方式 ( string 时有效 )
 * @param createCategoryParams 创建语言分类接口参数
 * @param updateCategoryAction 更新语言分类接口地址或自定义方法
 * @param updateCategoryMethod 更新语言分类接口的请求方式 ( string 时有效 )
 * @param updateCategoryParams 更新语言分类接口参数
 * @param deleteCategoryAction 删除语言分类接口地址或自定义方法
 * @param deleteCategoryMethod 删除语言分类接口的请求方式 ( string 时有效 )
 * @param deleteCategoryParams 删除语言分类接口参数
 * @param setDefaultCategoryAction 设置默认语言分类接口地址或自定义方法
 * @param setDefaultCategoryMethod 设置默认语言分类接口的请求方式 ( string 时有效 )
 * @param setDefaultCategoryParams 设置默认语言分类接口参数
 * @param checkCategoryExistAction 检测语言分类是否存在接口地址或自定义方法
 * @param checkCategoryExistMethod 检测语言分类是否存在接口的请求方式 ( string 时有效 )
 * @param checkCategoryExistParams 检测语言分类是否存在接口参数
 * @param createContentAction 创建语言项接口地址或自定义方法
 * @param createContentMethod 创建语言项接口的请求方式 ( string 时有效 )
 * @param createContentParams 创建语言项接口参数
 * @param batchCreateContentAction 批量创建语言项接口地址或自定义方法
 * @param batchCreateContentMethod 批量创建语言项接口的请求方式 ( string 时有效 )
 * @param batchCreateContentParams 批量创建语言项接口参数
 * @param updateContentAction 更新语言项接口地址或自定义方法
 * @param updateContentMethod 更新语言项接口的请求方式 ( string 时有效 )
 * @param updateContentParams 更新语言项接口参数
 * @param updateContentStatusAction 更新语言项状态接口地址或自定义方法
 * @param updateContentStatusMethod 更新语言项状态接口的请求方式 ( string 时有效 )
 * @param updateContentStatusParams 更新语言项状态接口参数
 * @param deleteContentAction 删除语言项接口地址或自定义方法
 * @param deleteContentMethod 删除语言项接口的请求方式 ( string 时有效 )
 * @param deleteContentParams 删除语言项接口参数
 * @param searchContentAction 搜索语言项接口地址或自定义方法
 * @param searchContentMethod 搜索语言项接口的请求方式 ( string 时有效 )
 * @param searchContentParams 搜索语言项接口参数
 * @param getContentAction 获取语言项接口地址或自定义方法
 * @param getContentMethod 获取语言项接口的请求方式 ( string 时有效 )
 * @param getContentParams 获取语言项接口参数
 * @param checkContentExistAction 检测语言项是否存在接口地址或自定义方法
 * @param checkContentExistMethod 检测语言项是否存在接口的请求方式 ( string 时有效 )
 * @param checkContentExistParams 检测语言项是否存在接口参数
 * @param paginationLocale 分页组件语言包
 */
export interface LanguageProperties {
    translate: Partial<TranslateProperties>
    data: Partial<LanguageItemProperties>[]
    category: Partial<LanguageItemProperties>[]
    getCategoryAction: string | Function
    getCategoryMethod: string
    getCategoryParams: Record<any, any>
    createCategoryAction: string | Function
    createCategoryMethod: string
    createCategoryParams: Record<any, any>
    updateCategoryAction: string | Function
    updateCategoryMethod: string
    updateCategoryParams: Record<any, any>
    deleteCategoryAction: string | Function
    deleteCategoryMethod: string
    deleteCategoryParams: Record<any, any>
    setDefaultCategoryAction: string | Function
    setDefaultCategoryMethod: string
    setDefaultCategoryParams: Record<any, any>
    checkCategoryExistAction: string | Function
    checkCategoryExistMethod: string
    checkCategoryExistParams: Record<any, any>
    createContentAction: string | Function
    createContentMethod: string
    createContentParams: Record<any, any>
    batchCreateContentAction: string | Function
    batchCreateContentMethod: string
    batchCreateContentParams: Record<any, any>
    updateContentAction: string | Function
    updateContentMethod: string
    updateContentParams: Record<any, any>
    updateContentStatusAction: string | Function
    updateContentStatusMethod: string
    updateContentStatusParams: Record<any, any>
    deleteContentAction: string | Function
    deleteContentMethod: string
    deleteContentParams: Record<any, any>
    searchContentAction: string | Function
    searchContentMethod: string
    searchContentParams: Record<any, any>
    getContentAction: string | Function
    getContentMethod: string
    getContentParams: Record<any, any>
    checkContentExistAction: string | Function
    checkContentExistMethod: string
    checkContentExistParams: Record<any, any>
    paginationLocale: any
}

export const LanguageProps = () => ({
    translate: object<Partial<TranslateProperties>>().def({ type: 'baidu' }),
    data: array<LanguageItemProperties>().def([]),
    category: array<LanguageItemProperties>().def([]),
    getCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    getCategoryMethod: PropTypes.string.def('get'),
    getCategoryParams: PropTypes.object.def({}),
    createCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createCategoryMethod: PropTypes.string.def('post'),
    createCategoryParams: PropTypes.object.def({}),
    updateCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateCategoryMethod: PropTypes.string.def('put'),
    updateCategoryParams: PropTypes.object.def({}),
    deleteCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteCategoryMethod: PropTypes.string.def('delete'),
    deleteCategoryParams: PropTypes.object.def({}),
    setDefaultCategoryAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    setDefaultCategoryMethod: PropTypes.string.def('put'),
    setDefaultCategoryParams: PropTypes.object.def({}),
    checkCategoryExistAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkCategoryExistMethod: PropTypes.string.def('get'),
    checkCategoryExistParams: PropTypes.object.def({}),
    createContentAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createContentMethod: PropTypes.string.def('post'),
    createContentParams: PropTypes.object.def({}),
    batchCreateContentAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    batchCreateContentMethod: PropTypes.string.def('post'),
    batchCreateContentParams: PropTypes.object.def({}),
    updateContentAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateContentMethod: PropTypes.string.def('put'),
    updateContentParams: PropTypes.object.def({}),
    updateContentStatusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateContentStatusMethod: PropTypes.string.def('put'),
    updateContentStatusParams: PropTypes.object.def({}),
    deleteContentAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteContentMethod: PropTypes.string.def('delete'),
    deleteContentParams: PropTypes.object.def({}),
    searchContentAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    searchContentMethod: PropTypes.string.def('get'),
    searchContentParams: PropTypes.object.def({}),
    getContentAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    getContentMethod: PropTypes.string.def('get'),
    getContentParams: PropTypes.object.def({}),
    checkContentExistAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    checkContentExistMethod: PropTypes.string.def('get'),
    checkContentExistParams: PropTypes.object.def({}),
    paginationLocale: PropTypes.any
})
