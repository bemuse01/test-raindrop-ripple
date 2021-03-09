new Vue({
    el: '#wrap',
    data(){
        return{

        }
    },
    mounted(){
        this.init()
    },
    methods: {
        // init
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            COMP.app = new APP.build()

            this.createObject(COMP.app)
        },
        resizeThree(){
            COMP.app.resize()
            COMP.styx.resize()
            // for(let i in COMP) COMP[i].resize()
        },
        renderThree(){
            COMP.app.animate()
            COMP.styx.animate(COMP.app)
            // for(let i in COMP) COMP[i].animate()
        },
        createObject(app){
            this.createStyx()
        },
        createStyx(){
            COMP.styx = new STYX.object.build()
        },


        // event
        onWindowResize(){
            WIDTH = window.innerWidth
            HEIGHT = window.innerHeight

            this.resizeThree()
        },


        // render
        render(){
            this.renderThree()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})