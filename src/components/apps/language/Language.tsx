import { defineComponent, reactive, ref, inject } from 'vue'
import { LanguageItemProperties, LanguageProps } from './props'
import { useI18n } from 'vue-i18n'
import { $g } from '../../../utils/global'
import { $tools } from '../../../utils/tools'
import { $request } from '../../../utils/request'
import { type ResponseData } from '../../../utils/types'
import {
    ConfigProvider,
    message,
    Empty,
    Row,
    Col,
    Input,
    Button,
    Popconfirm,
    Table,
    Select,
    SelectOption,
    Form,
    type FormInstance,
    FormItem,
    RadioGroup,
    Tooltip,
    Textarea,
    Tag
} from 'ant-design-vue'
import {
    PlusOutlined,
    FormOutlined,
    GlobalOutlined,
    CheckOutlined,
    SearchOutlined,
    ReloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CloseCircleFilled,
    ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import md5 from 'md5'
import MiModal from '../../modal/Modal'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import applyTheme from '../../_utils/theme'
import styled from './style/language.module.less'

/**
 * @events 回调事件
 * @event afterCreate 创建某个语系内的内容配置成功后的回调
 */
const MiAppsLanguage = defineComponent({
    name: 'MiAppsLanguage',
    inheritAttrs: false,
    props: LanguageProps(),
    emits: [
        'afterCreate',
        'afterGetContent',
        'afterGetCategory',
        'afterCreateCategory',
        'afterUpdateCategory',
        'afterAutomaticTranslate'
    ],
    setup(props, { emit }) {
        const setLocale = inject('setLocale') as any
        const { messages, locale, t } = useI18n()
        const languages = reactive({
            builtin: [] as LanguageItemProperties[],
            customize: [] as LanguageItemProperties[]
        })
        const categoryFormRef = ref<FormInstance>()
        const contentFormRef = ref<FormInstance>()

        // 检验- 语系 key 值
        const checkCategoryKeyValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('language.error.key.empty'))
            if (!/^[a-zA-Z]{1}[a-zA-Z0-9\-\.\_]/gi.test(value)) {
                return Promise.reject(t('language.error.reg'))
            }
            if (props.checkCategoryExistAction) {
                const categoryParams = Object.assign(
                    {
                        id: params.form.category.id,
                        key: params.form.category.validate.key,
                        edit: params.form.category.edit ? 1 : 0
                    },
                    { ...props.checkCategoryExistParams }
                )
                if (typeof props.checkCategoryExistAction === 'string') {
                    return await $request[props.checkCategoryExistMethod](
                        $tools.replaceUrlParams(props.checkCategoryExistAction, {
                            id: params.form.category.id
                        }),
                        categoryParams
                    )
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                return Promise.resolve()
                            } else if (res?.ret?.message) {
                                return Promise.reject(res?.ret?.message)
                            }
                            return Promise.resolve()
                        })
                        .catch((err: any) => {
                            return Promise.reject(err?.message || err)
                        })
                } else if (typeof props.checkCategoryExistAction === 'function') {
                    const response = await props.checkCategoryExistAction(categoryParams)
                    if (typeof response === 'string') return Promise.reject(response)
                    return Promise.resolve()
                }
            } else return Promise.resolve()
        }

        const checkContentKeyValidate = async (_rule: any, value: string) => {
            if (!value) return Promise.reject(t('language.placeholder.config.key'))
            if (!/^[a-zA-Z]{1}[a-zA-Z0-9\-\.\_]/gi.test(value)) {
                return Promise.reject(t('language.error.reg'))
            }
            if (props.checkContentExistAction) {
                const contentParams = Object.assign(
                    {
                        id: params.form.content.id,
                        key: params.form.content.validate.key,
                        edit: params.form.content.edit ? 1 : 0
                    },
                    { ...props.checkContentExistParams }
                )
                if (typeof props.checkContentExistAction === 'string') {
                    return await $request[props.checkContentExistMethod](
                        props.checkContentExistAction,
                        contentParams
                    )
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                return Promise.resolve()
                            } else if (res?.ret?.message) {
                                return Promise.reject(res?.ret?.message)
                            }
                            return Promise.resolve()
                        })
                        .catch((err: any) => {
                            return Promise.reject(err?.message || err)
                        })
                } else if (typeof props.checkContentExistAction === 'function') {
                    const response = await props.checkContentExistAction(contentParams)
                    if (typeof response === 'string') return Promise.reject(response)
                    return Promise.resolve()
                }
            } else return Promise.resolve()
        }

        const params = reactive({
            loading: {
                languages: false,
                categories: false,
                createOrUpdate: false
            },
            total: {
                builtin: 0,
                customize: 0
            },
            category: {
                data: [] as LanguageItemProperties[],
                ids: {} as any,
                types: {} as any,
                current: 0,
                key: $g.locale,
                active: 'customize'
            },
            table: {
                customize: {
                    columns: [
                        {
                            title: t('global.key'),
                            key: 'key',
                            dataIndex: 'key',
                            align: 'left',
                            width: 320
                        },
                        {
                            key: 'language',
                            dataIndex: 'language',
                            align: 'left'
                        },
                        {
                            title: t('language.content.status'),
                            key: 'status',
                            dataIndex: 'status',
                            align: 'center',
                            width: 100,
                            customRender: ({ record }) => {
                                return (
                                    <Tag
                                        color={
                                            record?.status === 1
                                                ? 'success'
                                                : record.status === 0
                                                  ? 'error'
                                                  : 'default'
                                        }>
                                        {record?.status === 1
                                            ? t('global.enable')
                                            : t('global.disable')}
                                    </Tag>
                                )
                            }
                        },
                        {
                            title: t('global.action'),
                            key: 'action',
                            align: 'center',
                            width: 180,
                            customRender: (record: any) => {
                                return (
                                    <div class={styled.actionBtns}>
                                        <Button type="primary" icon={<FormOutlined />} class="edit">
                                            {t('global.edit')}
                                        </Button>
                                        <Popconfirm
                                            title={t('global.delete.confirm')}
                                            style={{ zIndex: Date.now() }}
                                            okText={t('global.ok')}
                                            cancelText={t('global.cancel')}
                                            okButtonProps={{
                                                onClick: () => {}
                                            }}
                                            key={record.record.key}>
                                            <Button
                                                type="primary"
                                                danger={true}
                                                icon={<DeleteOutlined />}>
                                                {t('global.delete.normal')}
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )
                            }
                        }
                    ] as any[],
                    data: [] as LanguageItemProperties[],
                    pagination: {
                        page: 1,
                        size: 10
                    }
                },
                builtin: {
                    columns: [] as any[],
                    pagination: {
                        page: 1,
                        size: 10
                    }
                }
            },
            search: { lang: 'zh-cn', key: '' },
            form: {
                category: {
                    id: 0,
                    edit: false,
                    /**
                     * @param key 语系关键词
                     * @param language 语系显示名称
                     * @param is_default 是否为默认语系
                     */
                    validate: {
                        key: '',
                        language: '',
                        is_default: 0
                    },
                    rules: {
                        key: [
                            {
                                required: true,
                                validator: checkCategoryKeyValidate,
                                trigger: 'blur'
                            }
                        ],
                        language: [{ required: true, message: t('language.error.language') }],
                        is_default: [{ required: true, message: t('language.error.default') }]
                    },
                    options: [
                        { label: t('global.yes'), value: 1 },
                        { label: t('global.no'), value: 0 }
                    ]
                },
                content: {
                    id: 0,
                    edit: false,
                    /**
                     * @param key 单个语系内的内容配置关键词
                     * @param language 单个语系内的内容配置关键词对应的语言内容
                     * @param status 内容状态 ( 0: 下架; 1: 上架 )
                     * @param sync 是否同步 Key 值 ( 0: 不同步; 1: 全部; 2: 指定 )
                     * @param langs 同步 Key 值时，指定要同步的语系 key
                     */
                    validate: { key: '', language: '', sync: 0, status: 1, langs: [] },
                    rules: {
                        key: [
                            {
                                required: true,
                                validator: checkContentKeyValidate,
                                trigger: 'blur'
                            }
                        ],
                        language: [
                            { required: true, message: t('language.placeholder.config.value') }
                        ],
                        status: [
                            {
                                required: true,
                                message: `${t('global.select')}${t('language.content.status')}`
                            }
                        ]
                    },
                    options: {
                        sync: [
                            { label: t('language.content.sync.all'), value: 1 },
                            { label: t('language.content.sync.specify'), value: 2 },
                            { label: t('language.content.sync.none'), value: 0 }
                        ],
                        status: [
                            { label: t('global.enable'), value: 1 },
                            { label: t('global.disable'), value: 0 }
                        ]
                    }
                }
            },
            translate: {
                languages: props?.translate?.languages || {
                    zh: t('language.list.zh'),
                    en: t('language.list.en'),
                    jp: t('language.list.jp'),
                    kor: t('language.list.kor'),
                    fra: t('language.list.fra'),
                    spa: t('language.list.spa'),
                    th: t('language.list.th'),
                    ara: t('language.list.ara'),
                    ru: t('language.list.ru'),
                    pt: t('language.list.pt'),
                    de: t('language.list.de'),
                    it: t('language.list.it'),
                    el: t('language.list.el'),
                    nl: t('language.list.nl'),
                    pl: t('language.list.pl'),
                    bul: t('language.list.bul'),
                    est: t('language.list.est'),
                    dan: t('language.list.dan'),
                    fin: t('language.list.fin'),
                    cs: t('language.list.cs'),
                    rom: t('language.list.rom'),
                    slo: t('language.list.slo'),
                    swe: t('language.list.swe'),
                    hu: t('language.list.hu'),
                    cht: t('language.list.cht'),
                    vie: t('language.list.vie')
                },
                form: {
                    translate: 1,
                    target: props?.translate?.defaultLanguage || 'zh'
                }
            },
            modal: {
                category: {
                    management: false,
                    create: false,
                    createDirect: false
                },
                content: false
            }
        })
        applyTheme(styled)

        // 初始化
        const initLanguages = () => {
            getBuiltinLanguages(messages.value?.[locale.value])
            setLanguages()
            setCategory()
        }

        // 获取自定义语言内容列表
        const getLanguages = async (keyword?: string, lang?: string) => {
            if (typeof props.getContentAction) {
                if (params.loading.languages) return
                params.loading.languages = true
                const condition = Object.assign(
                    { keyword },
                    { ...params.table.customize.pagination },
                    { lang },
                    props.getContentParams
                )
                if (typeof props.getContentAction === 'string') {
                    await $request[props.getContentMethod](props.getContentAction, condition)
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                languages.customize = res?.data || []
                                params.total.customize = res?.total || 0
                            } else if (res?.ret?.message) message.error(res?.ret?.message)
                            emit('afterGetContent', res)
                        })
                        .catch((err: any) => message.error(err?.message || err))
                        .finally(() => (params.loading.languages = false))
                } else if (typeof props.getContentAction === 'function') {
                    const response = await props.getContentAction(condition)
                    if (typeof response === 'string') message.error(response)
                    params.loading.languages = false
                } else params.loading.languages = false
            }
        }

        // 设置自定义语言内容
        const setLanguages = async (keyword?: string, lang?: string) => {
            languages.customize = []
            if (props.data && props.data.length > 0) {
                params.table.customize.data = props.data
            } else {
                await getLanguages(keyword, lang)
                params.table.customize.data = languages.customize
            }
        }

        // 获取系统内置语言内容
        const getBuiltinLanguages = (data: any, idx?: string) => {
            if (Object.keys(data).length > 0) {
                for (const i in data) {
                    const type = typeof data[i]
                    const key = (!$tools.isEmpty(idx) ? `${idx}.` : '') + i
                    if (['object', 'array'].includes(type)) {
                        getBuiltinLanguages(data[i], key)
                    } else {
                        const item = {
                            key,
                            language: data[i],
                            type: 'system'
                        } as LanguageItemProperties
                        if (data?.id) item.id = data.id
                        languages.builtin.push(item)
                    }
                }
            }
        }

        // 获取语系分类
        const getCategories = async () => {
            if (typeof props.getCategoryAction) {
                if (params.loading.categories) return
                params.loading.categories = true
                if (typeof props.getCategoryAction === 'string') {
                    await $request[props.getCategoryMethod](
                        props.getCategoryAction,
                        props.getCategoryParams
                    )
                        .then((res: ResponseData | any) => {
                            if (res?.ret?.code === 200) {
                                params.category.data = res?.data
                                for (let i = 0, l = res?.data?.length; i < l; i++) {
                                    const category = res?.data[i]
                                    params.category.types[category?.key] = category?.language
                                    params.category.ids[category?.key] = category?.id
                                    if (category?.is_default) params.category.current = category?.id
                                }
                            } else if (res?.ret?.message) message.error(res?.ret?.message)
                            emit('afterGetCategory', res)
                        })
                        .catch((err: any) => message.error(err?.message || err))
                        .finally(() => (params.loading.categories = false))
                } else if (typeof props.getCategoryAction === 'function') {
                    const response = await props.getCategoryAction()
                    params.loading.categories = false
                    if (typeof response === 'string') message.error(response)
                } else params.loading.categories = false
            }
        }

        // 设置语系分类
        const setCategory = () => {
            if (props.category && props.category.length > 0) params.category.data = props.category
            else getCategories()
        }

        const handleCustomizePageChange = () => {}

        // 新增语系配置内容 - Modal State
        const handleCreateCategoryModalState = () => {
            // 未打开语系列表, 直接弹出新增 Modal, 关闭时无需打开语系列表
            if (!params.modal.category.management) params.modal.category.createDirect = true
            params.form.category.id = 0
            params.form.category.edit = false
            params.modal.category.management = false
            params.modal.category.create = true
        }

        // 取消新增语系配置内容 ( 回到语系列表 Modal  ) - Modal State
        const handleCancelCategoryModalState = () => {
            params.modal.category.create = false
            if (params.modal.category.createDirect) params.modal.category.management = false
            else params.modal.category.management = true
            // 直接打开新增内容 Modal 状态, 重置回 false
            params.modal.category.createDirect = false
            params.form.category.id = 0
            params.form.category.edit = false
            params.form.category.validate = { key: '', language: '', is_default: 0 }
            if (categoryFormRef.value) categoryFormRef.value?.clearValidate()
        }

        // 编辑语系 - Modal State
        const handleUpdateCategoryModalState = (data?: any) => {
            params.modal.category.management = false
            params.modal.category.create = true
            params.form.category.edit = true
            if (data?.id) {
                params.form.category.id = data.id
                params.form.category.validate = {
                    key: data?.key,
                    language: data?.language,
                    is_default: data?.is_default
                }
            } else params.form.category.validate = { key: '', language: '', is_default: 0 }
        }

        // 新增 / 更新语系
        const handleCreateOrUpdateCategory = () => {
            if (categoryFormRef.value) {
                if (params.loading.createOrUpdate) return
                params.loading.createOrUpdate = true
                // 默认成功处理
                const handleDefaultAfterSucess = () => {
                    message.success(t('global.success'))
                    handleCancelCategoryModalState()
                    getCategories()
                    categoryFormRef.value?.resetFields()
                }
                // 自定义请求方式的处理
                const handleCustomAfterSuccess = (response: any) => {
                    if (typeof response === 'boolean' && response) {
                        params.form.category.edit = false
                        handleCancelCategoryModalState()
                        categoryFormRef.value?.resetFields()
                    } else if (typeof response === 'string') message.error(response)
                    params.loading.createOrUpdate = false
                }
                categoryFormRef.value?.validate().then(async () => {
                    if (params.form.category.edit) {
                        // 编辑
                        if (props.updateCategoryAction) {
                            const updateParams = Object.assign(
                                { ...params.form.category.validate },
                                { ...props.updateCategoryParams }
                            )
                            if (typeof props.updateCategoryAction === 'string') {
                                $request[props.updateCategoryMethod](
                                    $tools.replaceUrlParams(props.updateCategoryAction, {
                                        id: params.form.category.id
                                    }),
                                    updateParams
                                )
                                    .then((res: ResponseData | any) => {
                                        params.form.category.edit = false
                                        if (res?.ret?.code === 200) {
                                            handleDefaultAfterSucess()
                                        } else if (res?.ret?.message) {
                                            params.form.category.edit = true
                                            message.error(res?.ret?.message)
                                        }
                                        emit('afterUpdateCategory', res)
                                    })
                                    .catch((err: any) => message.error(err?.message || err))
                                    .finally(() => (params.loading.createOrUpdate = false))
                            } else if (typeof props.updateCategoryAction === 'function') {
                                const response = await props.updateCategoryAction(
                                    Object.assign(updateParams, { ...params.translate.form })
                                )
                                handleCustomAfterSuccess(response)
                            }
                        }
                    } else {
                        // 新增
                        if (props.createCategoryAction) {
                            const createParams = Object.assign(
                                { ...params.form.category.validate },
                                { ...props.createCategoryParams }
                            )
                            if (typeof props.createCategoryAction === 'string') {
                                $request[props.createCategoryMethod](
                                    props.createCategoryAction,
                                    createParams
                                )
                                    .then((res: ResponseData | any) => {
                                        if (res?.ret?.code === 200) {
                                            handleDefaultAfterSucess()
                                        } else if (res?.ret?.message)
                                            message.error(res?.ret?.message)
                                        if (params.translate.form.translate)
                                            handleAutomaticTranslate(res)
                                        emit('afterCreateCategory', res)
                                    })
                                    .catch((err: any) => message.error(err?.message || err))
                                    .finally(() => (params.loading.createOrUpdate = false))
                            } else if (typeof props.createCategoryAction === 'function') {
                                const response = await props.createCategoryAction(
                                    Object.assign(createParams, { ...params.translate.form })
                                )
                                handleCustomAfterSuccess(response)
                            }
                        }
                    }
                })
            }
        }

        // 新增单个语系内的配置内容 - Modal State
        const handleCreateContentModalState = () => {
            params.form.content.edit = false
            params.form.content.id = 0
            params.form.content.validate = { key: '', language: '', sync: 0, status: 1, langs: [] }
            params.modal.content = true
        }

        // 单个语系内的配置内容 - 关闭 Modal
        const handleCancelCreateContentModalState = () => {
            handleCreateContentModalState()
            params.modal.content = false
            if (contentFormRef.value) contentFormRef.value?.clearValidate()
        }

        // 新增单个语系内的配置内容 - action
        const handleCreateOrUpdateContent = () => {
            if (contentFormRef.value) {
                if (params.loading.createOrUpdate) return
                params.loading.createOrUpdate = true
                contentFormRef.value?.validate().then(async () => {
                    const afterCreateSuccess = () => {
                        message.success(t('global.success'))
                        handleCancelCreateContentModalState()
                        contentFormRef.value?.resetFields()
                        const newContent = {}
                        newContent[params.form.content.validate.key] =
                            params.form.content.validate.language
                        handleUpdateLocaleData(newContent)
                        setLanguages('', params.category.key)
                    }
                    if (params.form.content.edit) {
                        // 编辑
                    } else {
                        // 新增
                        if (props.createContentAction) {
                            const createParams = Object.assign(
                                { lang: params.category.key },
                                { ...params.form.content.validate },
                                { ...props.createContentParams }
                            )
                            if (typeof props.createContentAction === 'string') {
                                $request[props.createContentMethod](
                                    props.createContentAction,
                                    createParams
                                )
                                    .then((res: ResponseData | any) => {
                                        if (res?.ret?.code === 200) {
                                            afterCreateSuccess()
                                        } else if (res?.ret?.message)
                                            message.error(res?.ret?.message)
                                        emit('afterCreate', res)
                                    })
                                    .catch((err: any) => message.error(err?.message || err))
                                    .finally(() => (params.loading.createOrUpdate = false))
                            }
                        }
                    }
                })
            }
        }

        // 更新 i18n 数据
        const handleUpdateLocaleData = (message?: {}) => {
            if (locale.value === params.category.key) {
                if (message && Object.keys(message).length > 0) {
                    setLocale(locale.value, message)
                }
            }
        }

        // 自动翻译
        const handleAutomaticTranslate = async (res?: ResponseData | any) => {
            // 翻译类型
            const type = props.translate?.type
            /**
             * TODO: 默认调用百度翻译.
             * TODO: 默认翻译同时限定接口响应数据结构, 否则默认自动翻译无法使用.
             * 自定义翻译功能的话, 请自行配置 props.translate.translate 方法.
             * 默认翻译将调用 batchCreateAction 方法, 将翻译后的数据批量插入数据库.
             * {
             *     ret: { code: string, message: string }
             *     data: {
             *         id: number,
             *         translate: array
             *     }
             * }
             */
            if (type === 'baidu') {
                const data = res?.data || {}
                // 语系 ID
                const id = data?.id
                // 待翻译列表
                const list = data?.translate || []
                // 翻译配置
                const config = props.translate?.[type] || {}
                if (config?.appid && config?.url && config?.key && id && list.length > 0) {
                    const queries = [] as string[]
                    for (let i = 0, l = list.length; i < l; i++) {
                        queries.push(list[i]?.language)
                    }
                    const salt = $tools.uid()
                    const query = queries.join('\n')
                    const sign = md5(config.appid + query + salt + config.key)
                    $request
                        .get(config.url, {
                            q: query,
                            from: 'auto',
                            to: params.translate.form.target,
                            appid: config.appid,
                            salt,
                            sign
                        })
                        .then(async (res: any) => {
                            if (res?.trans_result && res.trans_result.length > 0) {
                                const items = [] as Partial<LanguageItemProperties>[]
                                const first = res.trans_result?.[0]
                                // 翻译目标语系与默认语系一致
                                if ((first ? first?.dst.indexOf('\n') : -1) !== -1) {
                                    for (let x = 0, y = list.length; x < y; x++) {
                                        items.push({
                                            cid: id,
                                            key: list[x].key,
                                            language: list[x].language
                                        })
                                    }
                                } else {
                                    // 翻译结果
                                    for (let n = 0, m = res.trans_result.length; n < m; n++) {
                                        const item = res.trans_result[n]
                                        const origin = list[n] as any
                                        items.push({
                                            cid: id,
                                            key: origin?.key,
                                            language: item?.dst
                                        })
                                    }
                                }
                                // 批量添加
                                if (props.batchCreateContentAction) {
                                    if (typeof props.batchCreateContentAction === 'string') {
                                        $request[props.batchCreateContentMethod](
                                            props.batchCreateContentAction,
                                            {
                                                data: items,
                                                ...props.batchCreateContentParams
                                            }
                                        )
                                            .then((res: ResponseData | any) => {
                                                if (res?.ret?.message)
                                                    message.error(res?.ret?.message)
                                                emit('afterAutomaticTranslate', res)
                                            })
                                            .catch((err: any) =>
                                                message.error(
                                                    err.message || t('global.error.unknown')
                                                )
                                            )
                                    } else if (
                                        typeof props.batchCreateContentAction === 'function'
                                    ) {
                                        const response = await props.batchCreateContentAction(items)
                                        if (typeof response === 'string') message.error(response)
                                    }
                                }
                            } else message.error(res?.error_msg || t('global.error.unknown'))
                        })
                }
            } else {
                if (typeof props.translate?.translate === 'function') {
                    // 自定义翻译功能
                    props.translate?.translate(res)
                }
            }
        }

        initLanguages()

        const renderEmpty = () => {
            return (
                <div class={styled.empty}>
                    <Empty description={t('global.no-data')} />
                </div>
            )
        }

        // 管理 tabs
        const renderTabs = () => {
            return (
                <Row class={styled.categories}>
                    <div
                        class={[
                            styled.categoriesItem,
                            styled.categoriesCustomize,
                            {
                                [styled.categoriesCustomizeActive]:
                                    params.category.active === 'customize'
                            }
                        ]}
                        onClick={() => (params.category.active = 'customize')}>
                        <PlusOutlined />
                        {t('global.customize')}
                        {params.category.active === 'customize' ? (
                            <div
                                class={[
                                    styled.categoriesItemCheck,
                                    styled.categoriesCustomizeCheck
                                ]}>
                                <CheckOutlined />
                            </div>
                        ) : null}
                    </div>
                    <div
                        class={[
                            styled.categoriesItem,
                            styled.categoriesBuiltin,
                            {
                                [styled.categoriesBuiltinActive]:
                                    params.category.active === 'built-in'
                            }
                        ]}
                        onClick={() => (params.category.active = 'built-in')}>
                        <FormOutlined />
                        {t('global.system') + t('global.builtin')}
                        {params.category.active === 'built-in' ? (
                            <div
                                class={[styled.categoriesItemCheck, styled.categoriesBuiltinCheck]}>
                                <CheckOutlined />
                            </div>
                        ) : null}
                    </div>
                    <div
                        class={[
                            styled.categoriesItem,
                            styled.categoriesManagement,
                            {
                                [styled.categoriesManagementActive]:
                                    params.category.active === 'management'
                            }
                        ]}
                        onClick={() =>
                            (params.modal.category.management = !params.modal.category.management)
                        }>
                        <GlobalOutlined />
                        {t('language.management')}
                        {params.category.active === 'management' ? (
                            <div
                                class={[
                                    styled.categoriesItemCheck,
                                    styled.categoriesManagementCheck
                                ]}>
                                <CheckOutlined />
                            </div>
                        ) : null}
                    </div>
                </Row>
            )
        }

        // 操作区域 ( 搜索等 )
        const renderAction = () => {
            const searchBtn = (
                <Col xs={24} md={params.category.active === 'customize' ? 14 : 24}>
                    <div class={styled.searchLeft}>
                        <div class={styled.searchItem}>
                            <div class={styled.searchItemInput}>
                                <span innerHTML={`${t('global.key')}${t('global.colon')}`}></span>
                                <Input placeholder={t('language.placeholder.search')} />
                            </div>
                            <div class={styled.searchItemBtns}>
                                <Button
                                    type="primary"
                                    v-slots={{
                                        icon: () => {
                                            return <SearchOutlined />
                                        }
                                    }}>
                                    {t('global.seek')}
                                </Button>
                                <Button
                                    type="primary"
                                    v-slots={{
                                        icon: () => {
                                            return <ReloadOutlined />
                                        }
                                    }}>
                                    {t('global.reset')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Col>
            )
            const actionBtn =
                params.category.active === 'customize' ? (
                    <Col xs={24} md={10}>
                        <div class={styled.searchRight}>
                            <ConfigProvider theme={{ token: { colorPrimary: '#d89614' } }}>
                                <Popconfirm
                                    overlayStyle={{ zIndex: Date.now() }}
                                    v-slots={{
                                        title: () => {
                                            return (
                                                <div style={{ maxWidth: $tools.convert2rem(285) }}>
                                                    <div
                                                        innerHTML={t('language.default.tip')}></div>
                                                    <div
                                                        style={{
                                                            marginTop: $tools.convert2rem(8)
                                                        }}>
                                                        <span>
                                                            {t('language.current')}
                                                            {t('global.colon')}
                                                        </span>
                                                        {params.category.types?.[
                                                            params.category.key
                                                        ] ? (
                                                            <Button type="primary">
                                                                {
                                                                    params.category.types?.[
                                                                        params.category.key
                                                                    ]
                                                                }
                                                            </Button>
                                                        ) : (
                                                            <a
                                                                innerHTML={t(
                                                                    'language.default.none'
                                                                )}></a>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }}>
                                    <Button type="primary" icon={<CheckOutlined />}>
                                        {t('language.default.set')}
                                    </Button>
                                </Popconfirm>
                            </ConfigProvider>
                            <ConfigProvider theme={{ token: { colorPrimary: '#dc4446' } }}>
                                <Popconfirm
                                    overlayStyle={{ zIndex: Date.now() }}
                                    v-slots={{
                                        title: () => {
                                            return (
                                                <div style={{ minWidth: $tools.convert2rem(180) }}>
                                                    <div
                                                        innerHTML={t(
                                                            'global.delete.confirm'
                                                        )}></div>
                                                </div>
                                            )
                                        }
                                    }}>
                                    <Button type="primary" icon={<DeleteOutlined />} danger>
                                        {t('global.delete.batch')}
                                    </Button>
                                </Popconfirm>
                            </ConfigProvider>
                            <ConfigProvider theme={{ token: { colorPrimary: '#07928f' } }}>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleCreateContentModalState}>
                                    {t('language.add')}
                                </Button>
                            </ConfigProvider>
                        </div>
                    </Col>
                ) : null
            return (
                <Row class={styled.search}>
                    {searchBtn}
                    {actionBtn}
                </Row>
            )
        }

        // Table - 语系下拉选择列表
        const renderCategorySelection = () => {
            return params.category.data.length > 0 ? (
                <Select
                    v-model:value={params.category.key}
                    placeholder={t('language.placeholder.select')}
                    style={{ minWidth: $tools.convert2rem(220) }}
                    dropdownStyle={{ zIndex: Date.now() }}>
                    {renderCategorySelectionOptions()}
                </Select>
            ) : (
                <div class={styled.selectAdd}>
                    <span innerHTML={t('language.default.none')}></span>
                    <Button type="primary" onClick={handleCreateCategoryModalState}>
                        {t('global.create')}
                    </Button>
                </div>
            )
        }

        const renderCategorySelectionOptions = () => {
            const options = [] as any[]
            for (let i = 0, l = params.category.data.length; i < l; i++) {
                const cur = params.category.data[i] as LanguageItemProperties
                const elem = cur.is_default ? (
                    <>
                        <span innerHTML={cur.language} />
                        <span> - </span>
                        <a>{t('language.default.name')}</a>
                    </>
                ) : (
                    cur.language
                )
                options.push(<SelectOption value={cur.key}>{elem}</SelectOption>)
            }
            return options
        }

        // 翻译目标语言
        const renderTargetLanguageOptions = () => {
            const options = [] as any[]
            for (const i in params.translate.languages) {
                const cur = params.translate.languages[i]
                options.push(<SelectOption value={i}>{cur}</SelectOption>)
            }
            return options
        }

        // 新增语言内容时, 可选的同步语系分类
        const renderContentSyncCategorySelectionOptions = () => {
            const options = [] as any[]
            for (let i = 0, l = params.category.data.length; i < l; i++) {
                const cur = params.category.data[i] as LanguageItemProperties
                if (cur?.key !== params.category.key) {
                    options.push(<SelectOption value={cur.key}>{cur?.language}</SelectOption>)
                }
            }
            return options
        }

        // 表格
        const renderTable = () => {
            return params.category.active === 'customize' ? (
                <Table
                    columns={params.table.customize.columns}
                    dataSource={params.table.customize.data}
                    rowKey={(record: any) => record?.id}
                    rowSelection={{
                        columnWidth: 60,
                        onChange: (keys: any[], rows: any[]) => {
                            console.log(keys, rows)
                        }
                    }}
                    pagination={{
                        showLessItems: true,
                        showQuickJumper: true,
                        onChange: handleCustomizePageChange,
                        responsive: true,
                        total: params.total.customize,
                        current: params.table.customize.pagination.page,
                        pageSize: params.table.customize.pagination.size
                    }}
                    bordered={true}
                    loading={params.loading.languages}
                    v-slots={{
                        headerCell: (record: any) => {
                            if (record?.column?.key === 'language') {
                                return renderCategorySelection()
                            }
                        }
                    }}
                    scroll={{ x: 768 }}></Table>
            ) : params.category.active === 'built-in' ? (
                <Table></Table>
            ) : null
        }

        // 语系列表
        const renderCategories = () => {
            if (params.category.data.length <= 0) {
                return renderEmpty()
            } else {
                const langs = [] as any[]
                for (let i = 0, l = params.category.data.length; i < l; i++) {
                    const cur = params.category.data[i] as LanguageItemProperties
                    langs.push(
                        <div
                            class={[styled.listItem, { [styled.listItemActive]: cur?.is_default }]}>
                            <span class={styled.listItemName} innerHTML={cur?.language} />
                            <div
                                class={styled.listItemEdit}
                                onClick={() => handleUpdateCategoryModalState(cur)}>
                                <EditOutlined />
                            </div>
                            <Popconfirm
                                title={t('global.delete.confirm')}
                                overlayStyle={{ zIndex: Date.now() }}
                                okText={t('global.ok')}
                                onConfirm={() => {}}
                                cancelText={t('global.cancel')}>
                                <span class={styled.listItemClose}>
                                    <CloseCircleFilled />
                                </span>
                            </Popconfirm>
                        </div>
                    )
                }
                return <div class={styled.list}>{langs}</div>
            }
        }

        // 语系列表 - Modal
        const renderCategoriesModal = () => {
            return (
                <MiModal
                    v-model:open={params.modal.category.management}
                    maskClosable={false}
                    width={640}
                    footer={false}
                    animation="flip"
                    title={renderCategoriesTitle()}
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}>
                    {renderCategories()}
                </MiModal>
            )
        }

        // 语系 Modal Title
        const renderCategoriesTitle = () => {
            return (
                <>
                    <span
                        innerHTML={t('language.management')}
                        style={{
                            marginRight: $tools.convert2rem(16),
                            marginTop: $tools.convert2rem(2)
                        }}
                    />
                    <Button type="primary" onClick={handleCreateCategoryModalState}>
                        {t('language.create')}
                    </Button>
                </>
            )
        }

        // 新增语系种类 - Form Modal
        const renderCreateOrUpdateCategoryFormModal = () => {
            return (
                <MiModal
                    v-model:open={params.modal.category.create}
                    title={params.form.category.edit ? t('language.update') : t('language.create')}
                    maskClosable={false}
                    animation="flip"
                    footerBtnPosition="center"
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}
                    onCancel={handleCancelCategoryModalState}
                    onOk={handleCreateOrUpdateCategory}
                    destroyOnClose={true}>
                    <Form
                        ref={categoryFormRef}
                        labelCol={{ style: { width: $tools.convert2rem(146) } }}
                        model={params.form.category.validate}
                        rules={params.form.category.rules}>
                        <FormItem label={t('language.default.setting')} name="is_default">
                            <RadioGroup
                                options={params.form.category.options}
                                v-model:value={params.form.category.validate.is_default}
                            />
                        </FormItem>
                        <FormItem
                            name="key"
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.key')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.key-tip'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <Input
                                name="key"
                                v-model:value={params.form.category.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.language.key')}
                            />
                        </FormItem>
                        <FormItem label={t('language.display')} name="language">
                            <Input
                                name="language"
                                v-model:value={params.form.category.validate.language}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.language.display')}
                            />
                        </FormItem>
                        <FormItem
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.translate.auto')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.translate.tip'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <RadioGroup
                                options={params.form.category.options}
                                v-model:value={params.translate.form.translate}
                            />
                        </FormItem>
                        <FormItem
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.translate.target')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.translate.explain'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <Select
                                v-model:value={params.translate.form.target}
                                placeholder={t('language.placeholder.language.active')}
                                style={{ width: '100%' }}
                                dropdownStyle={{ zIndex: Date.now() }}>
                                {renderTargetLanguageOptions()}
                            </Select>
                        </FormItem>
                    </Form>
                </MiModal>
            )
        }

        // 新增单个语系的配置内容 - Form Modal
        const renderCreateOrUpdateContentFormModal = () => {
            return (
                <MiModal
                    v-model:open={params.modal.content}
                    title={
                        params.form.content.edit
                            ? t('language.content.update')
                            : t('language.content.create')
                    }
                    maskClosable={false}
                    footerBtnPosition="center"
                    maskStyle={{ backdropFilter: `blur(0.5rem)` }}
                    onCancel={handleCancelCreateContentModalState}
                    onOk={handleCreateOrUpdateContent}
                    destroyOnClose={true}>
                    <Form
                        ref={contentFormRef}
                        labelCol={{ style: { width: $tools.convert2rem(124) } }}
                        model={params.form.content.validate}
                        rules={params.form.content.rules}>
                        <FormItem label={t('language.current')}>
                            {params.category.types?.[params.category.key] ? (
                                <a innerHTML={params.category.types?.[params.category.key]}></a>
                            ) : (
                                <div class={styled.selectAdd}>
                                    <span innerHTML={t('language.default.none')}></span>
                                    <Button type="primary" onClick={handleCreateCategoryModalState}>
                                        {t('global.create')}
                                    </Button>
                                </div>
                            )}
                        </FormItem>
                        <FormItem
                            name="key"
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.content.key')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.key-tip'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <Input
                                v-model:value={params.form.content.validate.key}
                                maxlength={64}
                                autocomplete="off"
                                placeholder={t('language.placeholder.config.key')}
                                disabled={!params.category.types?.[params.category.key]}
                            />
                        </FormItem>
                        <FormItem label={t('language.content.content')} name="language">
                            <Textarea
                                v-model:value={params.form.content.validate.language}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                placeholder={t('language.placeholder.config.value')}
                                disabled={!params.category.types?.[params.category.key]}
                            />
                        </FormItem>
                        <FormItem label={t('language.content.status')} name="status">
                            <RadioGroup
                                options={params.form.content.options.status}
                                v-model:value={params.form.content.validate.status}
                            />
                        </FormItem>
                        <FormItem
                            name="sync"
                            v-slots={{
                                label: () => {
                                    return (
                                        <>
                                            <span style={{ marginRight: $tools.convert2rem(4) }}>
                                                {t('language.content.sync.label')}
                                            </span>
                                            <Tooltip
                                                overlayStyle={{ zIndex: Date.now() }}
                                                v-slots={{
                                                    title: () => {
                                                        return (
                                                            <div
                                                                innerHTML={t(
                                                                    'language.content.sync.tip'
                                                                )}></div>
                                                        )
                                                    }
                                                }}>
                                                <span class={styled.formTip}>
                                                    <ExclamationCircleOutlined />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            }}>
                            <RadioGroup
                                options={params.form.content.options.sync}
                                v-model:value={params.form.content.validate.sync}
                            />
                        </FormItem>
                        {params.form.content.validate.sync === 2 ? (
                            <FormItem label={t('language.content.sync.select')} name="langs">
                                {params.category.data.length > 0 ? (
                                    <Select
                                        v-model:value={params.form.content.validate.langs}
                                        mode="multiple"
                                        placeholder={t('language.placeholder.select')}
                                        style={{ minWidth: $tools.convert2rem(220) }}
                                        dropdownStyle={{ zIndex: Date.now() }}>
                                        {renderContentSyncCategorySelectionOptions()}
                                    </Select>
                                ) : (
                                    <div class={styled.selectAdd}>
                                        <span innerHTML={t('language.default.none')}></span>
                                        <Button
                                            type="primary"
                                            onClick={handleCreateCategoryModalState}>
                                            {t('global.create')}
                                        </Button>
                                    </div>
                                )}
                            </FormItem>
                        ) : null}
                    </Form>
                </MiModal>
            )
        }

        return () => (
            <div class={styled.container}>
                <ConfigProvider
                    locale={props.paginationLocale ?? zhCN}
                    renderEmpty={() => renderEmpty()}>
                    {renderTabs()}
                    {renderAction()}
                    {renderTable()}
                    {renderCategoriesModal()}
                    {renderCreateOrUpdateCategoryFormModal()}
                    {renderCreateOrUpdateContentFormModal()}
                </ConfigProvider>
            </div>
        )
    }
})

export default MiAppsLanguage