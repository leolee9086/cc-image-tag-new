<template>
    <div>
        <el-row>
            <el-select 
            @focus="getAssets()"
            v-model="filepath"
            filterable
            size=mini>
                <el-option
                v-for="(item,i) in filesArry"
                :key="i"
                :label="item.name.replace(/<mark>/g,'').replace(/<\/mark>/g,'')"
                :value="item.path"
                >
                </el-option>
            </el-select>
        </el-row>
    </div>
</template>
<script>
module.exports = {
    props:["k",'value','apitoken','思源伺服ip'],
    model:{
        props:"value",
        event:"change"
    },
    mounted() {
        this.getAssets()
        
    },
    data() {
        return {
            filesArry:[],
            filepath:"",
        }
    },
    watch:{
        k:{
            handler(val,oldval){
                this.getAssets(val)
            }
        },
        filepath:{
            
            handler(val,oldval){
                this.$emit("change",'http://'+this.思源伺服ip+'/'+val)
            }
        }
    },
    methods: {

        getAssets:  function(){
            let that = this
            let jsondatas = {"k":that.k}
             axios({
                        method:'POST',
                        url:'http://'+that.思源伺服ip + '/api/search/searchAsset',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result =>{
                        that.filesArry =  result.data["data"]
                        })
            }
        
    },
    
}

</script>
 
<style>

</style>