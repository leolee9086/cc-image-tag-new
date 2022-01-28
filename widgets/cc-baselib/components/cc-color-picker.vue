<template>
    <el-row width="100%">            
    <el-col :span=2>
    <el-color-picker 
    @active-change="setcolor($event)" 
    :value="color"
    size="mini"
    :show-alpha="showalpha"
    ></el-color-picker>
    </el-col>

    <el-col :span="6">
    <el-checkbox 
    size="mini"
    v-model= "showalpha"
    >显示透明度</el-checkbox>
    </el-col>

    <el-col :span=10>
    <el-input 
    @input="setcolor($event)" 
    :value="color"
    size="mini"></el-input>
    </el-col>
    </el-row>
</template>
<script>
module.exports = {
    name:"cc-color-picker",
    props:['outputcolor'],
    model:{
        props:"outputcolor",
        event:"change"
    },
    data() {
        return {
            showalpha:true,
            color:this.outputcolor,
        }
    },
    watch:{
        outputcolor:{
            handler(val,oldval){
                this.color=val
            },
            
        }
    },
    methods: {
        setcolor:  function(val){
            this.color = val
            this.$emit("change",val)
            }
              
    },
    
}

</script>
 
<style>
 el-color-picker{
     display: inline-block;
 }

</style>
