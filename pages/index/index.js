const app = getApp()

Page({

    data: {
        headerimg: '/images/default.png',
        map_scale: 15,//地图缩放等级
        marker_small: 35,//地图标记默认大小
        marker_big: 60,//地图标记点击后大小
        map_range: 1000,//地图附近网点范围
        latitude: '',//地图中心纬度
        longitude: '',//地图中心经度
        list: [],//门店列表
        map_list: [],//地图标记
        near_count: 0,//附近门店数
        ad: true,
        ad_img: '',
        ad_url: '',
        open: 1,//0:列表打开 1:显示最近 2:显示点击
        bottom: 30,//列表置顶的第一个离底部的距离
        lastX: 0,
        lastY: 0,
        currentGesture: 0,
    },

    onLoad: function (options) {
        this.get_location()
        this.get_ad()
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
                if (this.data.open == 1) {
                    this.tap_open()
                } else {
                    return
                }
                
            } else if (ty > 30) {
                //向下滑动
                this.data.currentGesture = 4
                if (this.data.open == 0) {
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
    
    get_ad: function (event) {
         app.http_get('Getad', (ret) => {
            if (ret.status == 1) {
                this.setData({
                    ad_img: ret.result[0].adimg,
                    ad_url: ret.result[0].adurl 
                })
            }
         })
    },

    tap_ad: function (event) {
        let url = this.data.ad_url
        if (url) {
            wx.navigateTo({
                url: url
            })
        }
    },

    get_location: function () {
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

    set_location: function (event) {
        //移动到当前定位点
        wx.createMapContext('map').moveToLocation()
        this.get_data()
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
        wx.navigateTo({
            url: '/pages/city-list/city-list'
        })
    },

    tap_open: function (event) {
        let open = this.data.open
        if (open == 0) {
            open = 1
        } else {
            open = 0
        }
        this.setData({
            open: open
        })
    },

    tap_map: function (event) {
        //关闭列表，全部标记大小恢复
        let map_list = this.data.map_list
        let marker_size = this.data.marker_small        
        map_list.forEach((value, index, array) => {
            value.width = marker_size
            value.height = marker_size
        })
        this.setData({
            list: [],
            map_list: map_list
        })
    },

    tap_item: function (event) {
        let id = 0
        let list = this.data.list
        let map_list = this.data.map_list
        let marker_small = this.data.marker_small
        let marker_big = this.data.marker_big
        if (event.markerId) {
            //点击标记
            id = event.markerId
            map_list.forEach((value, index, array) => {
                if (value.id == id) {
                    value.width = marker_big
                    value.height = marker_big
                    list[0] = value
                } else {
                    value.width = marker_small
                    value.height = marker_small
                }
            })
            this.setData({
                open: 2,
                list: list,
                map_list: map_list
            })
        } else {
            //点击列表
            id = event.currentTarget.dataset.id
            wx.navigateTo({
                url: `/pages/store-detail/store-detail?id=${id}`
            })
        }
    },

    map_change: function (event) {
        if (event.type == 'end') {
            wx.createMapContext('map').getCenterLocation({
                success: (res) => {
                    this.get_data(res.latitude,res.longitude)
                }
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

    get_data: function (lat,lng) {
        wx.showNavigationBarLoading()
        app.http_get('Getshangjia', (ret) => {
            if (ret.result && ret.result.length != 0) {
                let dis_lat = this.data.latitude
                let dis_lng = this.data.longitude
                let map_range = this.data.map_range
                let marker_size = this.data.marker_small
                let list = ret.result
                let new_list = []
                let near_count = 0
                let bottom = 30
                list.forEach((value, index, array) => {
                    //计算距离
                    let distance = ''
                    if (lat && lng) {
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
                    value.distance = distance
                    value.distance_count = distance_count
                    if (distance_count <= map_range) {
                        near_count += 1
                    }
                    //设置标记
                    value.width = marker_size
                    value.height = marker_size
                    value.iconPath = `/images/marker_${value.grade}.png`
                    //重新赋值
                    new_list.push(value)
                })
                //距离排序
                let new_arr = new_list.sort(this.compare("distance_count"))
                //调整列表
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
                //列表与标记分开，避免清空列表时清除标记
                this.setData({
                    open: 1,
                    bottom: bottom,
                    list: new_arr,
                    map_list: new_arr,
                    near_count: near_count
                })
                wx.hideNavigationBarLoading()
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