import { defineStore } from 'pinia'
import { api } from '../utils/api'
import { $request } from '../utils/request'
import type {
    LoginParams,
    LoginResponseData,
    ResponseData,
    LoginAuth,
    RegisterParams
} from '../utils/types'
import { $storage } from '../utils/storage'
import { $g } from '../utils/global'
import { $cookie } from '../utils/cookie'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: ($storage.get($g.caches?.storages?.user) ?? {}) as Record<string, any>,
        token: {
            access: ($cookie.get($g.caches?.cookies?.token?.access) ?? null) as string | null,
            refresh: ($cookie.get($g.caches?.cookies?.token?.refresh) ?? null) as string | null
        },
        autoLogin: $cookie.get($g.caches?.cookies?.autoLogin) ?? false
    }),
    actions: {
        setData(data: LoginResponseData) {
            const user = data?.user || {}
            this.user = Object.keys(user).length > 0 ? user : {}
            $storage.set($g.caches?.storages?.user, JSON.stringify(this.user))
            const access = data?.tokens?.access_token ?? null
            const autoLogin = this.autoLogin
            if (access) {
                this.token.access = access
                $cookie.set($g.caches?.cookies?.token?.access, access, autoLogin ? 7 : null)
            }
            const refresh = data?.tokens?.refresh_token
            if (refresh) {
                this.token.refresh = refresh
                $cookie.set($g.caches?.cookies?.token?.refresh, refresh, autoLogin ? 7 : null)
            }
        },
        async login(data: LoginParams): Promise<any> {
            const url = data.url || api.login
            const method = data.method ?? 'post'
            const params = { ...data }
            if (params.url) delete params.url
            if (params.method) delete params.method
            return new Promise(async (resolve, reject) => {
                return await $request[method.toLowerCase()](url, params)
                    .then((res: ResponseData | any) => {
                        if (res?.ret?.code === 200) {
                            const autoLogin = data?.remember ?? false
                            this.autoLogin = autoLogin
                            $cookie.set($g.caches?.cookies?.autoLogin, autoLogin, 7)
                            this.setData((res?.data || {}) as LoginResponseData)
                        }
                        resolve(res)
                    })
                    .catch((err: any) => reject(err))
            })
        },
        async register(data: RegisterParams): Promise<any> {
            const url = data?.url || api.register
            const method = data.method ?? 'post'
            const params = { ...data }
            if (params.url) delete params.url
            if (params.method) delete params.method
            return new Promise(async (resolve, reject) => {
                return await $request[method.toLowerCase()](url, params)
                    .then((res: ResponseData | any) => resolve(res))
                    .catch((err: any) => reject(err))
            })
        },
        authorize(data: LoginAuth): Promise<any> {
            return new Promise(async (resolve, reject) => {
                return await $request
                    .post(data?.url, { token: data?.token })
                    .then((res: ResponseData | any) => {
                        if (res?.ret?.code === 200) {
                            this.autoLogin = true
                            $cookie.set($g.caches?.cookies?.autoLogin, true, 7)
                            this.setData(res?.data)
                        }
                        resolve(res)
                    })
                    .catch((err: any) => reject(err))
            })
        },
        refresh(url: string, token: string): Promise<any> {
            return new Promise(async (resolve, reject) => {
                return await $request
                    ?.post(url, { refresh_token: token })
                    .then((res: ResponseData | any) => {
                        if (res?.ret?.code === 200) {
                            const autoLogin = this.autoLogin
                            const access = res?.data?.access_token ?? null
                            if (access) {
                                this.token.access = access
                                $cookie.set(
                                    $g.caches?.cookies?.token?.access,
                                    access,
                                    autoLogin ? 7 : null
                                )
                            }
                            const refresh = res?.data?.refresh_token
                            if (refresh) {
                                this.token.refresh = refresh
                                $cookie.set(
                                    $g.caches?.cookies?.token?.refresh,
                                    refresh,
                                    autoLogin ? 7 : null
                                )
                            }
                        }
                        resolve(res)
                    })
                    .catch((err?: any) => reject(err))
            })
        },
        logout() {
            this.user = {}
            this.token.access = null
            this.token.refresh = null
            this.autoLogin = false
            $cookie.del([
                $g.caches?.cookies?.token?.access,
                $g.caches?.cookies?.token?.refresh,
                $g.caches?.cookies?.autoLogin
            ])
            $storage.del([$g.caches?.storages?.user])
        }
    }
})

export default useAuthStore
