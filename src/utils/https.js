import request from './request'

const http = {
  get(url, data) {
    const config = {
      method: 'get',
      url
    }
    // if (params) config.params = params;
    if (data) config.data = data
    return request(config)
  },
  post(url, data) {
    const config = {
      method: 'post',
      url
    }
    // console.log(url)
    if (data) config.data = data
    return request(config)
  },
  put(url, data) {
    const config = {
      method: 'put',
      url
    }
    if (data) config.data = data
    return request(config)
  },
  delete(url, data) {
    const config = {
      method: 'delete',
      url
    }
    if (data) config.data = data
    return request(config)
  }
}
export default http
