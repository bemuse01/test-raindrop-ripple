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

        this.fase = 0
        this.timer = 1
    }


    // add
    #add(group){
        group.add(this.mesh)
    }


    // create
    #create(){
        this.#createMesh()
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

        this.attr = {
            opacity: new Float32Array(geometry.attributes.position.count)
        }
        this.random = Math.floor(Math.random() * geometry.attributes.position.count)

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

        if(this.timer === 0) {
            this.random = Math.floor(Math.random() * position.count)
            this.timer = 1
            // this.fase = 90
            this.fase = 270
        }

        for(let i = 0; i < position.count; i++){
            // var px = x + offsetX
            // var py = y - offsetY

            // var d = Math.sqrt((px * px) + (py * py));
            // var angle = ((360 * (d / radius)) * frecuency) - faseAngle;
            // var fCos = Math.cos(angle * Math.PI / 180) * timer;

            // var fAmplitude = (-amplitude / radius * d) + amplitude;  
            
            // var red = (radius + 0.001) - d
            // var anulator = Math.floor( Math.sqrt((red / Math.abs(red)) + 1))
            
            // var z = fCos * fAmplitude * anulator * -1

            const x = position.array[i * 3] - position.array[this.random * 3]
            const y = position.array[i * 3 + 1] - position.array[this.random * 3 + 1]

            const dist = Math.sqrt(x ** 2 + y ** 2)
            // const angle = (180 * (dist / this.param.radius)) - this.fase
            const angle = (360 * (dist / this.param.radius)) - this.fase
            const cos = Math.cos(angle * RADIAN) * this.timer

            const amp = (-this.param.amp / this.param.radius * dist) + this.param.amp

            const red = (this.param.radius + 0.001) - dist
            const anulator = Math.floor(Math.sqrt(red / Math.abs(red) + 1))

            const z = cos * amp * anulator * -1

            const opacity = METHOD.normalize(Math.max(z, 0), 0, 1, 0, this.param.amp)
            // const opacity = METHOD.normalize(z, 0, 1, -this.param.amp, this.param.amp)

            position.array[i * 3 + 2] = z
            this.attr.opacity[i] = opacity
        }

        this.fase += 5
        this.timer -= 0.0075

        this.timer = Math.max(this.timer, 0)

        position.needsUpdate = true
        opacity.needsUpdate = true
    }
}