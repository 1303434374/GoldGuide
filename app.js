App({

    data: {
        url: 'https://pj.dede1.com/app/index.php?i=117&c=entry&a=wxapp&m=jindao_travel&do='
    },

    http_get: function (method, callback) {
        wx.request({
            url: `${this.data.url}${method}`,
            method: 'GET',
            header: {
                'content-type': 'json'
            },
            success: (ret) => {
                callback(ret.data)
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },

    http_post: function (method, params, callback) {
        let basic = {
            i: '117',
            c: 'entry',
            a: 'wxapp',
            m: 'jindao_travel',
            do: method
        }
        wx.request({
            url: this.data.url.substr(0, this.data.url.indexOf('?')),
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: this.merge(basic, params),
            success: (ret) => {
                callback(ret.data)
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },

    merge: function (target, source) {
        for (var obj in source) {
            target[obj] = source[obj]
        }
        return target
    }

})