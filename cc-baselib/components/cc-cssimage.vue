<template>
    <div>
    <cc-assets-selector
    v-model="rawurl"
    :k="type"
    :apitoken="apitoken"
    :思源伺服ip="思源伺服ip"
    >

    </cc-assets-selector> 
    <el-select 
    v-model="type"
    size="mini">
        <el-option
         v-for="item in filetypes"
         :key='item'
         :label='item'
         :value='item'
        ></el-option>
    </el-select>
    <el-row>
    <el-image 
    :src="rawurl"
    style="width: 150px; height: 150px"
    v-if="rawurl!=''"
    :fit="'scale-down'"
    :preview-src-list="[rawurl]"
    ></el-image>
    </el-row>
    </div>
</template>
<script>
module.exports = {
   components:componentsList,
    props:["filetypes",'思源伺服ip','value','apitoken'],
    model:{
        props:"value",
        event:"change"
    },
    mounted(){
        
    },
    data(){
        return{
            rawurl:"",
            type:".png",
            hosturl:this.思源伺服ip
        }
    },
    computed:{
        realurl(){
            return 'url('+this.rawurl+')'
        }
    },
    watch:{
        value(val){
            let string =  val+""
                     //   console.log("get", val)

            if(val){
            this.rawurl= string.slice(4).slice(0,-1)

            }
        },
        rawurl:{
         handler(val,oldval){
             this.$emit("change",'url('+val+')')
             console.log("set", this.rawurl)
         },
        }

    }
    }
</script>
