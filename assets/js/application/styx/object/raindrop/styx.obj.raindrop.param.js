STYX.object.raindrop.param = class{
    constructor(param = {}){
        this.seg = param.seg || 200
        // this.color = param.color || 0x323232
        this.color = param.color || 0xffffff
        this.opacity = param.opacity || 1.0
        this.radius = param.radius || 300
        this.amp = param.amp || 40
        this.count = param.count || 3
        this.timer = param.timer || 0.0075 / 2
    }
}