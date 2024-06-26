import { createRequire } from 'module'
import builtins from 'builtin-modules'

const requireRes = createRequire(import.meta.url)
const pkg = requireRes('../package.json')

const dependencies = Object.keys(pkg.dependencies || {})
const globalDependencies = {}
Object.entries(dependencies).forEach(([_key, value]) => globalDependencies[value] = value)

export const externalPackages = [
    ...dependencies,
    ...builtins,
    /swiper/,
    /prismjs/,
    /vue3-colorpicker/,
    /nprogress/,
    /@babel\/runtime/,
    /@babel\/runtime-corejs3/,
    /style-inject/
]

export const externalGlobals = Object.assign(globalDependencies, { 'style-inject': 'styleInject' })