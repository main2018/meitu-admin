import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/album',
    method: 'get'

    // params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/album/add',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/album/update',
    method: 'post',
    data
  })
}

export function fetchTest() {
  return request({
    url: '/article/articlePage',
    method: 'post',
    params: { pageSize: 10, pageNum: 1 }
  })
}
