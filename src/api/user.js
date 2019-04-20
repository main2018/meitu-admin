import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/user/login',
    url: '/user/signin',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/findUserByToken',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

