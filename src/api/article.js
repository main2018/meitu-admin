import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/album/all',
    method: 'get'

    // params: query
  })
}

export function delArticle(id) {
  return request({
    url: '/album/del',
    method: 'post',
    data: { id }
    // params: query
  })
}

export function fetchShowList() {
  return request({
    url: '/album',
    method: 'get'
    // params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: `/album/${id}`,
    method: 'get'
    // params: { id }
  })
}

export function getArticleByCategory(category) {
  return request({
    url: 'album/findByCategory',
    method: 'post',
    data: {
      category,
      status: 0
    }
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
