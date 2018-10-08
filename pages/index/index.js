const app = getApp()
const QQMap = require('../../utils/qqmap.js')

Page({

    data: {
        headerimg: '/images/default.png',
        map_scale: 16,
        latitude: '',
        longitude: '',
        latitude_o: '',
        longitude_o: '',
        list: [],
        map_list: [],
        near_count: 0,
        ad: true,
        open: false,
        bottom: 30,
        lastX: 0,
        lastY: 0,
        currentGesture: 0
    },

    onLoad: function (options) {
        if (options.lat) {
            this.setData({
                latitude: options.lat,
                longitude: options.lng
            })
            this.get_data()
        } else {
            this.get_location()
        }
    },

    onShow: function (event) {
        if (wx.getStorageSync('headerimg')) {
            this.setData({
                headerimg: wx.getStorageSync('headerimg')
            })
        }
    },

    onShareAppMessage: function () {

    },

    handletouchmove: function(event) {
        if (this.data.currentGesture != 0){
            return
        }
        let currentX = event.touches[0].pageX
        let currentY = event.touches[0].pageY
        let tx = currentX - this.data.lastX
        let ty = currentY - this.data.lastY
        if (Math.abs(tx) > Math.abs(ty)) {
            if (tx < 0) {
                //向左滑动
                this.data.currentGesture = 1
            } else if (tx > 0) {
                //向右滑动
                this.data.currentGesture = 2
            }
        } else {
            if (ty < 0){
                //向上滑动
                this.data.currentGesture = 3
                if (this.data.open) {
                    return
                }
                this.tap_open()
            } else if (ty > 30) {
                //向下滑动
                this.data.currentGesture = 4
                if (this.data.open) {
                    this.tap_open()
                }
            }
        }
        this.data.lastX = currentX
        this.data.lastY = currentY
    },

    handletouchtart:function(event) { 
        this.data.lastX = event.touches[0].pageX
        this.data.lastY = event.touches[0].pageY
    },

    handletouchend:function(event) {
        this.data.currentGesture = 0
    },

    get_location: function () {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    latitude_o: res.latitude,
                    longitude_o: res.longitude
                })
                this.get_data()
            },
            fail: (err) => {

            }
        })
    },

    set_location: function (event) {
        if (this.data.latitude_o == 0) {
            this.get_location()
        } else {
            this.setData({
                latitude: this.data.latitude_o,
                longitude: this.data.longitude_o
            })
            this.get_data()
        }
    },

    choose_location: function (event) {
        wx.chooseLocation({
            success: (res) => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                this.get_data()
            }
        })
    },

    tap_list: function (event) {
        // wx.navigateTo({
        //     url: '/pages/store-list/store-list'
        // })
        wx.navigateTo({
            url: '/pages/city-list/city-list'
        })
    },

    tap_open: function (event) {
        this.setData({
            open: !this.data.open
        })
    },

    tap_map: function (event) {
        let map_list = this.data.map_list
        map_list.forEach((value, index, array) => {
            value.width = 50
            value.height = 50
        })
        this.setData({
            list: [],
            map_list: map_list
        })
        // let open = this.data.open
        // if (open) {
        //     this.setData({
        //         open: false
        //     })
        // }   
    },

    tap_item: function (event) {
        let id = 0
        if (event.markerId) {
            id = event.markerId
            let map_list = this.data.map_list
            map_list.forEach((value, index, array) => {
                if (value.id == id) {
                    this.get_data(id,value.latitude,value.longitude)
                } 
            })
        } else {
            id = event.currentTarget.dataset.id
            wx.navigateTo({
                url: `/pages/store-detail/store-detail?id=${id}`
            })
        }
    },

    tap_close: function (event) {
        this.setData({
            ad: false 
        })
    },

    tap_my: function (event) {
        if (wx.getStorageSync('headerimg')) {
            wx.navigateTo({
                url: '/pages/my/my'
            })
        } else {
            wx.navigateTo({
                url: '/pages/login/login'
            })
        }
    },

    tap_problem: function (event) {
        wx.navigateTo({
            url: '/pages/problem/problem'
        })
    },

    get_data: function (id,lat,lng) {
        wx.showNavigationBarLoading()
        app.http_get('Getshangjia', (ret) => {
            if (ret.result && ret.result.length != 0) {
                let list = ret.result
                let arr = []
                let new_list = []
                let near_count = 0
                let bottom = 30
                list.forEach((value, index, array) => {
                    let distance = ''
                    let dis_lat = this.data.latitude
                    let dis_lng = this.data.longitude
                    if (id) {
                        dis_lat = lat
                        dis_lng = lng
                    }
                    let distance_count = this.get_distance(dis_lat, dis_lng, value.latitude, value.longitude)
                    if (distance_count < 1000) {
                        distance = distance_count + '米'
                    } else if (distance_count >= 1000 && distance_count <= 100000) {
                        distance = (distance_count / 1000).toFixed(1) + '公里'
                    } else if (distance_count > 100000) {
                        distance = '>100公里'
                    }
                    if (distance != '>100公里') {
                        near_count += 1
                    }

                    // wx.downloadFile({
                    //     url: value.s_img,
                    //     success: (res) => {
                            value.distance = distance
                            value.distance_count = distance_count
                            value.iconPath = `/images/marker_${value.grade}.png`

                            if (id) {
                                if (value.id == id) {
                                    value.width = 70
                                    value.height = 70
                                } else {
                                    value.width = 50
                                    value.height = 50
                                }
                            } else {
                                value.width = 50
                                value.height = 50
                            }
      
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
                                switch (new_arr.length) {
                                    case 1:
                                        bottom = 30
                                        break
                                    case 2:
                                        bottom = 200
                                        break
                                    case 3:
                                        bottom = 400
                                        break
                                    case 4:
                                        bottom = 600
                                        break
                                    default:
                                        bottom = 600
                                        break
                                }
                                this.setData({
                                    list: new_arr,
                                    map_list: new_arr,
                                    near_count: near_count,
                                    bottom: bottom,
                                    map_scale: this.get_scale(last_distance)
                                })
                                wx.hideNavigationBarLoading()
                            }
                    //     }
                    // })
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
    },

    get_scale: function (distance) {
        let n = 500
        for (let i=18;i>=5;i--) {
            if (distance < n) {
                return i                
            } else {
                if (i == 5) {
                    return i
                } else {
                    n = n * 2 
                }
            }
        }
    }

})