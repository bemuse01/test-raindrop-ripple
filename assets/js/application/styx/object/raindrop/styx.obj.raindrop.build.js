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

        this.fase = (this.fase + 5) % 360

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

            const x = position.array[i * 3]
            const y = position.array[i * 3 + 1]

            const dist = Math.sqrt(x ** 2 + y ** 2)
            const angle = (360 * (dist / this.param.radius)) - this.fase
            const sin = Math.sin(angle * RADIAN)

            const amp = (-this.param.amp / this.param.radius * dist) + this.param.amp

            const red = (this.param.radius + 0.001) - dist
            const anulator = Math.floor(Math.sqrt(red / Math.abs(red) + 1))

            const z = sin * amp * anulator * -1

            // const opacity = METHOD.normalize(Math.max(z, 0), 0, 1, 0, this.param.amp)
            const opacity = METHOD.normalize(z, 0, 1, -this.param.amp, this.param.amp)

            position.array[i * 3 + 2] = z
            this.attr.opacity[i] = opacity
        }

        position.needsUpdate = true
        opacity.needsUpdate = true
    }
}