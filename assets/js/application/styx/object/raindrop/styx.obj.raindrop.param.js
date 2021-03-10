STYX.object.raindrop.param = class{
    constructor(param = {}){
        this.seg = param.seg || 128
        this.color = param.color || 0x1e1e1e
        this.opacity = param.opacity || 1.0
        this.radius = param.radius || 500
        this.amp = param.amp || 40
    }
}