const app = getApp()
const QQMap = require('../../utils/qqmap.js')

Page({

    data: {
        latitude: '',
        longitude: '',
        list: []
    },

    onLoad: function (options) {
        this.get_location()
    },

    onShareAppMessage: function () {

    },

    get_location: function () {
        wx.showNavigationBarLoading()
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                this.get_data()
            },
            fail: (err) => {

            }
        })
    },

    tap_item: function (event) {
        let id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/store-detail/store-detail?id=${id}`
        })
    },

    get_data: function () {
        app.http_get('Getshangjia', (ret) => {
            if (ret.result && ret.result.length != 0) {
                let list = ret.result
                let arr = []
                let new_list = []
                list.forEach((value, index, array) => {
                    let distance = ''
                    let distance_count = this.get_distance(this.data.latitude, this.data.longitude, value.latitude, value.longitude)
                    if (distance_count < 1000) {
                        distance = distance_count + '米'
                    } else if (distance_count >= 1000 && distance_count <= 100000) {
                        distance = (distance_count / 1000).toFixed(1) + '公里'
                    } else if (distance_count > 100000) {
                        distance = '>100公里'
                    }
                    wx.downloadFile({
                        url: value.s_img,
                        success: (res) => {
                            value.distance = distance
                            value.distance_count = distance_count
                            arr.push('0')
                            new_list.push(value)
                            if (arr.length == list.length) {
                                let new_arr = new_list.sort(this.compare("distance_count"))
                                let last_distance = 0
                                if (new_arr.length < 4) {
                                    last_distance = new_list[new_list.length - 1].distance_count
                                } else {
                                    last_distance = new_list[2].distance_count
                                }
                                this.setData({
                                    list: new_arr
                                })
                                wx.hideNavigationBarLoading()
                            }
                        }
                    })
                })
            } 
        })
    },

    compare: function (prop) {
        return (obj1, obj2) => {
            let val1 = obj1[prop]
            let val2 = obj2[prop]
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1)
                val2 = Number(val2)
            }
            if (val1 < val2) {
                return -1
            } else if (val1 > val2) {
                return 1
            } else {
                return 0
            }
        }
    },

    get_distance: function (lat1, lng1, lat2, lng2) {
        lat1 = lat1 || 0
        lng1 = lng1 || 0
        lat2 = lat2 || 0
        lng2 = lng2 || 0

        let rad1 = lat1 * Math.PI / 180.0
        let rad2 = lat2 * Math.PI / 180.0
        let a = rad1 - rad2
        let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0

        let r = 6378137
        return Math.round(r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2))))
    }
    
})