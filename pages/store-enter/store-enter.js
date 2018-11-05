const app = getApp()
const QQMap = require('../../utils/qqmap.js')

Page({

    data: {
        company: '',
        shop: '',
        sshop: '',
        people: '',
        tel: '',
        start: '',
        end: '',
        address: '',
        latitude: '',
        longitude: '',
        img_0: '',
        img_1: '',
        img_2: '',
        img_3: '',
        area_data: [],
        area_state: 99,
        grade_data: ['总公司','分公司','门店'],
        grade_state: 99,
        ver: '获取验证码',
        code: '',
        ccode: '',
        checked: true
    },

    onLoad: function (options) {
        this.get_type()
    },

    change: function (event) {
        this.setData({
            checked: !this.data.checked
        })
    },

    get_type: function (event) {
        app.http_get('Getrange', (ret) => {
            if (ret.status == 1) {
                this.setData({
                    area_data: ret.data 
                })
            }
        })
    },

    tap_load: function (event) {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                wx.uploadFile({
                    url: `${app.data.url}Postuploadimg`,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    success: (res) => {
                        let name = `img_${event.currentTarget.dataset.id}`
                        this.setData({
                            [name]: JSON.parse(res.data).data.imgpath
                        })
                    },
                    fail: (err) => {
                        console.log(err)
                    }
                })
            }
        })
    },

    tap_btn: function (event) {
        let company = this.data.company
        let shop = this.data.shop
        let sshop = this.data.sshop
        let people = this.data.people
        let tel = this.data.tel
        let address = this.data.address
        let img_0 = this.data.img_0
        let img_1 = this.data.img_1
        let img_2 = this.data.img_2
        let img_3 = this.data.img_3
        let latitude = this.data.latitude
        let longitude = this.data.longitude
        let start = this.data.start
        let end = this.data.end
        let area_data = this.data.area_data
        let area_state = this.data.area_state
        let grade_data = this.data.grade_data
        let grade_state = this.data.grade_state
        let code = this.data.code
        let ccode = this.data.ccode
        let checked = this.data.checked
        if (!company || !shop || !sshop || !people || !tel || !address || !img_0 || !img_1 || !img_2 || !img_3 || !latitude || !longitude || !start || !end || area_state == 99 || grade_state == 99) {
            wx.showToast({
                title: '请把信息填写完整',
                icon: 'none'
            })
        } else if (code != ccode) {
            wx.showToast({
                title: '手机验证码不正确',
                icon: 'none'
            })
        } else if (!checked) {
            wx.showToast({
                title: '同意协议才能申请',
                icon: 'none'
            })
        } else {
            wx.showLoading({
                title: '正在申请',
                mask: true
            })
            app.http_post('Postshenqing', {
                s_name: shop,
                s_compername: company,
                s_desc: sshop,
                s_headname: people,
                s_headphone: tel,
                s_address: address,
                latitude: latitude,
                longitude: longitude,
                s_img: img_0,
                yingyeimg: img_1,
                mengimg: img_2,
                travelallowimg: img_3,
                starttime: start,
                endtime: end,
                allrange: area_data[area_state].fname,
                grade: grade_state
            }, (ret) => {
                wx.hideLoading()
                if (ret.status == 1) {
                    wx.showToast({
                        title: '申请成功',
                        mask: true
                    })
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1000)
                } else {
                    wx.showToast({
                        title: '申请失败',
                        icon: 'none'
                    })
                }
            })
        }
    },

    choose_location: function (event) {
        wx.chooseLocation({
            success: (res) => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                this.set_address()
            }
        })
    },

    set_address: function () {
        let qqmap = new QQMap({
            key: 'L46BZ-4MW6F-UCFJU-NUWQC-KT27E-IEBKO'
        })
        qqmap.reverseGeocoder({
            location: {
                latitude: this.data.latitude,
                longitude: this.data.longitude
            },
            success: (res) => {
                this.setData({
                    address: res.result.address
                })
            }
        })
    },

    change_picker: function (event) {
        let name = ''
        switch (Number(event.currentTarget.dataset.id)) {
            case 0:
                name = 'area_state'
                break
            case 1:
                name = 'start'
                break
            case 2:
                name = 'end'
                break
            case 3:
                name = 'grade_state'
                break
        }
        this.setData({
            [name]: event.detail.value
        })
    },

    input_value: function (event) {
        let name = ''
        switch (Number(event.currentTarget.dataset.id)) {
            case 0:
                name = 'company'
                break
            case 1:
                name = 'shop'
                break
            case 2:
                name = 'sshop'
                break
            case 3:
                name = 'people'
                break
            case 4:
                name = 'tel'
                break
            case 5:
                name = 'address'
                break
            case 6:
                name = 'code'
                break
        }
        this.setData({
            [name]: event.detail.value
        })
    },

    tap_ver: function (event) {
        let tel = this.data.tel
        let ver = this.data.ver
        let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
        if (!reg.test(tel)) {
            wx.showToast({
                title: '请输入有效的手机号',
                icon: 'none'
            })
            return
        } else if (ver == '获取验证码' || ver == '重新获取') {
            wx.showToast({
                title: '验证码已发送',
                icon: 'none'
            })
            this.setData({
                ver: '30s'
            })
            let i = 30
            let time = setInterval(() => {
                if (i > 1) {
                    i--
                    this.setData({
                        ver: i < 10 ? '0' + i + 's' : i + 's' 
                    })
                } else {
                    this.setData({
                        ver: '重新获取'
                    })
                    clearInterval(time)
                }
            }, 1000)
            app.http_post('SendSms', {
                tel: tel
            }, (ret) => {
                if (ret.errno == 0) {
                    this.setData({
                        ccode: ret.data.code
                    })
                }
            })
        }
    },

    tap_agree: function (event) {
        wx.navigateTo({
            url: '/pages/agree/agree'
        })
    }

})