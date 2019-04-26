import request from '@/utils/request'

export function getTypes() {
  return request({
    url: '/category/findAll',
    method: 'get'
  })
}

export function delType(_id) {
  return request({
    url: '/category/del',
    method: 'post',
    data: { _id }
  })
}

export function addType(data) {
  return request({
    url: '/category/add',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data
  })
}

export function addSubcategory(data) {
  return request({
    url: '/subcategory/add',
    method: 'post',
    data
  })
}
export function delSubcategory(data) {
  return request({
    url: '/subcategory/del',
    method: 'post',
    data
  })
}
