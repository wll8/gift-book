const app = getApp();

/**
 * 获取用户信息
 * 如果没有会自动创建用户
 *
 * @author chadwuo
 */
exports.getUserInfo = async (id) => {
  return await wx.$api.get(`/users/${id}`)
};

/**
 * 更新用户数据
 *
 * @author chadwuo
 */
exports.updateUserInfo = async (id, parameter) => {
  return wx.$api.patch(`/users/${id}`, parameter)
};

/**
 * 开启/关闭广告
 *
 * @author chadwuo
 */
exports.toggleADSet = async (parameter) => {
  wx.$api.get(`/todo/toggleADSet`, parameter)
  return [undefined, {
    success: true,
    data: "",
  }];
};