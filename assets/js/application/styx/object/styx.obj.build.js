STYX.object.build = class{
    constructor(app){
        this.#init(app)
        this.#create()
        this.#add()
    }


    // init
    #init(app){
        this.param = new STYX.object.param()

        this.#initGroup()
        this.#initRenderObject()
    }
    #initGroup(){
        this.group = {
            raindrop: new THREE.Group()
        }

        this.build = new THREE.Group
    }
    #initRenderObject(){
        this.element = document.querySelector('.scene-styx-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(this.param.fov, width / height, this.param.near, this.param.far)
        this.camera.position.z = this.param.pos
        
        this.width = METHOD.getVisibleWidth(this.camera, 0)
        this.height = METHOD.getVisibleHeight(this.camera, 0)
    }


    // add
    #add(){
        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // create
    #create(){
        this.#createRaindrop()
    }
    #createRaindrop(){
        this.raindrop = new STYX.object.raindrop.build(this.group.raindrop, this.width, this.height)
    }


    // animate
    animate(app){
        this.#render(app)
        this.#animateObject()
    }
    #render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = app.renderer.domElement.clientHeight - rect.bottom

        app.renderer.setViewport(left, bottom, width, height)
        app.renderer.setScissor(left, bottom, width, height)

        this.camera.lookAt(this.scene.position)
        app.renderer.render(this.scene, this.camera)
    }
    #animateObject(){
    }


    // resize
    resize(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.width = METHOD.getVisibleWidth(this.camera, 0)
        this.height = METHOD.getVisibleHeight(this.camera, 0)

        this.raindrop.resize(this.width, this.height)
    }
}