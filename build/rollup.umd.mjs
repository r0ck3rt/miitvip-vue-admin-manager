import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import gzip from 'rollup-plugin-gzip'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import path from 'path'
import filesize from 'rollup-plugin-filesize'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { visualizer } from 'rollup-plugin-visualizer'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import { externalPackages, externalGlobals } from './rollup.external.mjs'
import { rimraf } from 'rimraf'
import strip from '@rollup/plugin-strip'

const fileName = 'makeit-admin-pro'
rimraf(`../dist/${fileName}.min.js`)

const babelOptions = {
    presets: [['@babel/preset-env', { modules: false }]],
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    plugins: [
        ['@babel/plugin-transform-runtime', { corejs: 3 }],
        ['@vue/babel-plugin-jsx', { isCustomElement: (tag) => tag.startsWith('swiper-') }],
        '@babel/plugin-transform-object-assign'
    ],
    exclude: /[\\/]node_modules[\\/]/,
    babelHelpers: 'runtime'
}

const plugins = [
    typescript({ tsconfig: path.resolve(process.cwd(), './tsconfig.umd.json') }),
    nodeResolve({ browser: true, jsnext: true }),
    json(),
    strip(),
    babel(babelOptions),
    commonjs(),
    postcss({
        modules: { generateScopedName: 'mi-[name]-[hash:base64:8]', localsConvention: 'camelCase' },
        plugins: [autoprefixer()],
        minimize: true
    }),
    gzip(),
    visualizer(),
    filesize()
]

const config = defineConfig([
    {
        input: path.resolve(process.cwd(), './src/index.ts'),
        output: [
            {
                name: fileName,
                file: `dist/${fileName}.js`,
                format: 'umd',
                exports: 'named',
                sourcemap: true,
                globals: externalGlobals
            },
            {
                name: fileName,
                file: `dist/${fileName}.min.js`,
                format: 'umd',
                exports: 'named',
                sourcemap: true,
                globals: externalGlobals,
                plugins: [terser()]
            }
        ],
        external: externalPackages,
        plugins,
        onwarn(warning) {
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.exporter === 'vue') return
        }
    }
])

export default config
