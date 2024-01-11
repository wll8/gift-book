import config from "@/config/index.js";
import * as utils from "@/utils/index.js";
console.log(`utils`, utils)

const Http = (config) => {
  config = {
    baseURL: ``,
    ...config,
  }
  const instance = [
    `options`,
    `get`,
    `head`,
    `post`,
    `patch`,
    `put`,
    `delete`,
    `trace`,
    `connect`,
    `upload`,
  ].reduce((acc, method) => {
    acc[method] = (url, data, options = {}) => new Promise((resolve) => {
      let fn = () => {}
      const obj = {
        method,
        url: url.match(`://`) ? url : `${config.baseURL}${url}`.replace(/([^:]\/)\/+/g, `$1`),
        data,
        header: {
          'content-type': 'application/json',
        },
        success (res) { // http 状态码非 200 也会走这里
          if(res.statusCode === 403) {
            instance.stack = (instance.stack || []).concat(fn)
            instance.login()
          } else {
            resolve([undefined, (
              res.data = typeof(res.data) === `string` ? JSON.parse(res.data) : res.data,
              res.data.data ? res.data.data : res.data
            )])
          }
        },
        fail (err) {
          resolve([err])
        },
        ...( // 如果是 upload 时，则把 data 中的 tmp url 设置到 options.filePath 中
          method === `upload` 
            ? (options.formData = Object.entries(data).reduce((acc, [key, val]) => {
              String(val).match(/\/\/tmp\//) ? (options.filePath = val, options.name = key) : acc[key] = val
              return acc
            }, {}), options) 
            : options
        ),
      }
      fn = () => {
        obj.header.token = wx.getStorageSync(`token`)
        console.log(`obj`, obj)
        return method === `upload` ? wx.uploadFile(obj) : wx.request(obj)
      }
      if(instance.stack && !obj.url.match(instance.api)) {
        instance.stack.push(fn)
      } else {
        fn()
      }
    })
    return acc
  }, {})
  // 实现自动登录逻辑
  Object.assign(instance, {
    // 使用 await ok 等待登录
    ok: () => new Promise((resolve, reject) => {
      instance.stack ? instance.stack.push(resolve) : resolve()
    }),
    // 登录接口白名单
    api: `/login`,
    stack: [],
    next() {
      ;(instance.stack || []).forEach((fn) => fn())
      instance.stack = undefined
    },
    // 自定义登录逻辑，登录逻辑完成后使用 next 方法
    login() {},
  })
  return instance
}

const http =  Http({
  baseURL: config.baseURL,
})

export default http
