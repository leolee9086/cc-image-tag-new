<template>
    <div id = "vditor-container" ref="vditorContainer"></div>
    
</template>
<script type="module">
    
    const ccVditorVue = {
        name:"cc-vditor-vue",
        props:["value","toolbarconfig"],
        model:{event:"change",data:"value"},
        mounted(){
            let that =this
            this.editordata=this.value
            this.Editor = new Vditor(
                this.$refs.vditorContainer,{
                toolbarConfig: this.toolbarconfig||{},
                cache: {
                    enable: false,
                },
                mode:"wysiwyg",
                input:(value=>{
                    that.editordata = value
                    }
                )	,
                after:(()=>
                    that.Editor.setValue(that.value)
                )
            },
            )
        },
        data(){
            return{
                editordata:"",
                Editor: '',
                
            }

        },
        watch:{
            value:{
            async handler(val){
                    if(val&&val!= this.editordata){
                      try{
                          this.editordata=val
                          this.Editor.setValue(val)}catch(e){console.log(e)}
                    }
                },
            },
            editordata:{
             handler(val,oldval){
                if(val!=oldval){
                    this.保存缓存内容(val)
                }
            }
            }
        },
        methods:{
            保存缓存内容: function (value){
                this.$emit("change",value)
                this.生成html(value)
            },
            生成html:async function(value){
                let html = await Vditor.md2html(value)
                this.$emit("htmlChange",html)
                console.log(html)
            }
        },
    }
    module.exports = ccVditorVue
  //  export default ccVditorVue
</script>
<style>
</style>