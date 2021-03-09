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
        
        return new THREE.PlaneGeometry(this.width, this.height, wSeg, hSeg)
    }
    #createMaterial(){
        return new THREE.MeshBasicMaterial({
            color: this.param.color,
            transparent: true,
            opacity: this.param.opacity,
            wireframe: true
        })
    }

    
    // resize
    resize(width, height){
        this.width = width
        this.height = height

        this.mesh.geometry.dispose() 
        this.mesh.geometry = this.#createGeometry()
    }
}