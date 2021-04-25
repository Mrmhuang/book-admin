import request from '@/utils/request'

//获取电子书内容
export function postEpub(data) {
  return request({
    url: '/book/postEpub',
    method: 'post',
    data:data
  })
}

//查询电子书内容
export function postEdit(data) {
  return request({
    url: `/book/postEdit`,
    method: 'get',
    params:{
      data
    }
  })
}

//编辑提交电子书内容
export function editEpub(data) {
  return request({
    url: '/book/EditEpub',
    method: 'post',
    data:data
  })
}

//获取图书目录
export function postCategory(data) {
  return request({
    url: '/book/Category',
    method: 'get',

  })
}

//获取图书列表
export function postBookList(data) {
  return request({
    url: '/book/bookList',
    method: 'get',
    params:{
      data
    }
  })
}

export function deleteBook(filename) {
  return request({
    url: '/book/deleteBook',
    method: 'get',
    params:{
      filename
    }
  })
}

