import request from '@/utils/request'

export function updateSite(data) {
  return request({
    url: '/site/set',
    method: 'post',
    data
  })
  // {
  //   name: '',
  //   logo: '',
  //   address: '',
  //   tel: '',
  //   email: ''
  // }
}

export function getSite() {
  return request({
    url: '/site',
    method: 'get'
  })
}
