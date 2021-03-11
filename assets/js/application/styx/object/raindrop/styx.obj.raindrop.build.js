STYX.object.raindrop.build = class{
    constructor(group, width, height){
        this.#init(width, height)
        this.#create()
        this.#add(group)
    }


    // init
    #init(width, height){
        this.param = new STYX.object.raindrop.param()
        
        this.width = width
        this.height = height
    }


    // add
    #add(group){
        group.add(this.mesh)
    }


    // create
    #create(){
        this.#createMesh()
        this.#createRaindrop()
    }
    #createMesh(){
        const geometry = this.#createGeometry()
        const material = this.#createMaterial()
        this.mesh = new THREE.Mesh(geometry, material)
    }
    #createGeometry(){
        const ratio = this.height / this.width
        const wSeg = this.param.seg
        const hSeg = Math.floor(this.param.seg * ratio)
        
        const geometry = new THREE.PlaneBufferGeometry(this.width, this.height, wSeg, hSeg)

        this.attr = {opacity: new Float32Array(geometry.attributes.position.count)}

        for(let i = 0; i < this.attr.opacity.length; i++) this.attr.opacity[i] = 1.0

        geometry.setAttribute('opacity', new THREE.BufferAttribute(this.attr.opacity, 1))

        return geometry
    }
    #createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: STYX.object.raindrop.shader.vertex,
            fragmentShader: STYX.object.raindrop.shader.fragment,
            transparent: true,
            uniforms: {
                color: {value: new THREE.Color(this.param.color)}
            },
            blending: THREE.AdditiveBlending,
            wireframe: false
        })
    }
    #createRaindrop(){
        this.raindrop = []
        
        for(let i = 0; i < this.param.count; i++){
            this.raindrop[i] = {
                index: Math.floor(Math.random() * this.attr.opacity.length),
                fase: 0,
                timer: 1,
                rd: {
                    fase: Math.floor(Math.random() * 3 + 3),
                    timer: Math.random() * this.param.timer + this.param.timer
                }
            }
        }
    }

    
    // resize
    resize(width, height){
        this.width = width
        this.height = height

        this.mesh.geometry.dispose() 
        this.mesh.geometry = this.#createGeometry()
    }


    // animate
    animate(){
        const position = this.mesh.geometry.attributes.position
        const opacity = this.mesh.geometry.attributes.opacity

        for(let i = 0; i < position.count; i++){
            let avg = 0

            this.raindrop.forEach(e => {
                const x = position.array[i * 3] - position.array[e.index * 3]
                const y = position.array[i * 3 + 1] - position.array[e.index * 3 + 1]

                const dist = Math.sqrt(x ** 2 + y ** 2)
                const angle = (360 * (dist / this.param.radius)) - e.fase
                // const angle = (180 * (dist / this.param.radius)) - e.fase
                const cos = Math.cos(angle * RADIAN) * e.timer

                const amp = (-this.param.amp / this.param.radius * dist) + this.param.amp

                const red = (this.param.radius + 0.001) - dist
                const anulator = Math.floor(Math.sqrt(red / Math.abs(red) + 1))

                const z = cos * amp * anulator * -1

                avg += z
            })

            const z = avg / this.raindrop.length

            position.array[i * 3 + 2] = z

            const opacity = METHOD.normalize(Math.max(z, 0), 0, 1, 0, this.param.amp)

            this.attr.opacity[i] = opacity
        }

        this.raindrop.forEach(e => {
            e.fase += e.rd.fase
            e.timer -= e.rd.timer

            e.timer = Math.max(e.timer, 0)

            if(e.timer === 0) {
                e.index = Math.floor(Math.random() * position.count)
                e.timer = 1
                // e.fase = 90
                e.fase = 270
            }
        })

        position.needsUpdate = true
        opacity.needsUpdate = true
    }
}