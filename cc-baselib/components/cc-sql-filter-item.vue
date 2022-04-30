<template>
    <el-select
    :size="size"
    :value="当前属性名"
    >
        <el-option
        v-for="item in 内部属性列表"
        :lable="item.label"
        :value="内部属性列表[item]"
        >
        </el-option>
    </el-select>
</template>
<script>
    module.exports = {
        name:"el-sql-filter",
        prop:["属性列表","value"],
        data(){
            return{
                内部属性列表:[
                    {"value":"name","label":"命名","type":"string"},
                    {"value":"alias","label":"别名","type":"string"},
                    {"value":"memo","label":"备注","type":"string"},
                    {"value":"updated","label":"别名","type":"string"},

                    ],
                当前属性名:"name"
                
            }
        },
        watch:{
            当前属性名(){
                if(val){
                    console.log(this.当前属性名)
                }
            }
        }
        }
</script>