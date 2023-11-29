import config from "@/config/index.js";
import api from "@/utils/api.js";
import * as utils from "@/utils/index.js";

wx.$config = config
wx.$userInfo = undefined
wx.$api = api
wx.$api.login = () => {
  wx.login({
    success: async (e) => {
      const [, user] = await wx.$api.get(`/login`, {code: e.code})
      wx.$userInfo = user
      wx.setStorageSync(`token`, user.token)
      wx.setStorageSync(`id`, user.id)
      wx.$api.next()
    }
  })
}
wx.$utils = utils
wx.$app = {
  //挂载到app上
  colorUI: config.colorUI,
  giftTotal: {
    receive: 0,
    out: 0,
  },
  async onLaunch() {
    wx.$api.login()
  },
}

App(wx.$app);
