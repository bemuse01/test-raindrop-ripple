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
        this.#createRipple()
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
        
        const geometry = new THREE.PlaneGeometry(this.width, this.height, wSeg, hSeg)

        this.attr = {opacity: new Float32Array(geometry.attributes.position.count)}

        for(let i = 0; i < this.attr.opacity.length; i++) this.attr.opacity[i] = 0.0

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
    #createRipple(){
        const ratio = this.height / this.width
        const wSeg = this.param.seg + 1
        const hSeg = Math.floor(this.param.seg * ratio) + 1

        this.current = []
        this.previous = []

        for(let i = 0; i < hSeg; i++){
            this.current[i] = []
            this.previous[i] = []
            for(let j = 0; j < wSeg; j++){
                this.current[i][j] = 0.0
                this.previous[i][j] = 0.0
            }
        }

        // this.previous[Math.floor(hSeg / 2)][Math.floor(wSeg / 2)] = 1.0
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
        const opacity = this.mesh.geometry.attributes.opacity

        if(Math.random() > 0.8) {
            const ratio = this.height / this.width
            const wSeg = this.param.seg + 1
            const hSeg = Math.floor(this.param.seg * ratio) + 1

            const row = Math.floor(Math.random() * hSeg)
            const col = Math.floor(Math.random() * wSeg)
            this.current[row][col] = 1.0
        }

        for(let i = 1; i < this.current.length - 1; i++){
            for(let j = 1; j < this.current[0].length - 1; j++){
                this.current[i][j] = (
                    this.previous[i - 1][j] + 
                    this.previous[i + 1][j] + 
                    this.previous[i][j - 1] +
                    this.previous[i][j + 1]) / 2 - 
                    this.current[i][j]
                
                this.current[i][j] = this.current[i][j] * this.param.damping

                const index = i * this.current[0].length + j
                this.attr.opacity[index] = this.current[i][j]
            }
        }

        opacity.needsUpdate = true

        const temp = this.previous
        this.previous = this.current
        this.current = temp
    }
}