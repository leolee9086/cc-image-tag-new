<template>
    <el-button
    onclick="转换html为canvas"
    >
    </el-button>
</template>
<script
src="././static/html2canvas.min.js"
></script>
<script>
    module.exports = {
        props:["source","target"],
        model:{
            
        },
        data(){
            canvas:{}
        },
        methods:{
            转换html为canvas(dom元素对象){
                let that = this
                目标元素 =  this.target
                html2canvas(dom元素对象).then(canvas=>{
                    that.canvas = canvas
                })
            }  
        }
    }
</script>

