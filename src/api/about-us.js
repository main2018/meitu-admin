import request from '@/utils/request'

export function getAboutUs() {
  return request({
    url: '/about',
    method: 'get'
  })
}

export function updateAboutUs(data) {
  return request({
    url: '/about/set',
    method: 'post',
    data
  })
}
