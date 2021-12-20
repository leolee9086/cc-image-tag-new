<template>
    <div 
    :style="` 
        position:absolute;
        top:0px;
        left:0px;
        width: ${窗口大小.width/$当前窗口状态.缩放倍数}px; 
        height: ${窗口大小.height/$当前窗口状态.缩放倍数}px;
        transform:scale(${$当前窗口状态.缩放倍数});
        transform-origin:0% 0%;
        z-index:100`
        "
    >
        
            <cc-dragable-block-card
                v-for="(item,i) in 卡片数组"
                v-if="item && !item.hide"
                :key="卡片数组[i]['id']"
                v-model="卡片数组[i]"
                :index="i"
                @activated="当前激活标签id = i"
                :窗口缩放倍数="窗口缩放倍数"
            ></cc-dragable-block-card>
    </div>
</template>
<script>
module.exports = {
    name: "cc-layers-cards",
    props:["窗口大小"],
    components: {
        "cc-dragable-block-card": "url:../components/cc-dragable-block-card.vue"
    },
    data() {
        return {
            卡片数组: [],
            当前激活标签id: "",
            窗口缩放倍数: 1,
            数组订阅器:{},
            数组获取器:{},
        }
    },
     mounted() {
        this.数组获取器 = liveQuery(
            () => this.$数据库.tags
                .toArray()
        )
        this.数组订阅器 = this.数组获取器.subscribe(
            { next: result => 
            this.卡片数组 = result 
            }
        )
        
    },
    watch:{
        当前激活标签id:{
            handler:function(val,oldval){
                this.$事件总线.$emit("激活卡片",val)
            }
        }
    },
    computed:{
        
    },
    methods: {
  
    },

}
</script>