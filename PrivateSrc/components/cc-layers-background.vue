<template>
    <div class = "background fixed fullscreen">
        <image
        class = "fullscreen"
        :src="填充图像路径"
        >
        </image>
    </div>
</template>
<script>
    module.exports={
        name:"cc-layers-background",
        props:["填充图像路径"],
        async mounted(){
            this.$事件总线.$on("改变填充图像",this.获取图像)            
        }
    }
</script>
<style scoped>

</style>