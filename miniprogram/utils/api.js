import config from "@/config/index.js";

const Http = (config) => {
  config = {
    baseURL: ``,
    ...config,
  }
  return [
    `options`,
    `get`,
    `head`,
    `post`,
    `put`,
    `delete`,
    `trace`,
    `connect`,
  ].reduce((acc, method) => {
    acc[method] = (url, data, options) => new Promise((resolve) => {
      const obj = {
        method,
        url: url.match(`://`) ? url : `${config.baseURL}${url}`.replace(/([^:]\/)\/+/g, `$1`),
        data,
        header: {
          'content-type': 'application/json',
        },
        success (res) { // http 状态码非 200 也会走这里
          resolve([undefined, res.data.data])
        },
        fail (err) {
          resolve([err])
        },
        ...options,
      }
      const fn = () => {
        obj.header.token = wx.getStorageSync(`token`)
        wx.request(obj)
      }
      if(wx.$awaitList && !obj.url.match(`/login`)) {
        wx.$awaitList.push(fn)
      } else {
        fn()
      }
    })
    return acc
  }, {})
}

const http =  Http({
  baseURL: config.baseURL,
})

export default http
