<template>
    <el-card
        body-style="border-radius:5px;
                    padding:10px;
                    border:solid black 1px;
                    position: fixed;
                    background-color:white ;
                    position: fixed;top:10px;
                    left:calc(100vw - 250px);
                    width:200px;
                    height:200x;
                    max-height:90%;
                    max-width:200px;
                    z-index:252;
                    overflow:scroll;
                    resize:vertical
                    "
    >
                    <div>引用自id:</div>

        <el-input size="mini" v-model="当前卡片思源块id">
            <span class="el-icon-siyuan" slot="prepend"></span>
        </el-input>
        <el-divider></el-divider>

        <span
            style="font-size: xx-small"
            @click="定位至标记(标记数组[当前反向链接列表['index']])"
            v-if="当前反向链接列表['index'] > 0"
        >标签{{ 当前反向链接列表.index }}坐标:{{ 标记数组[当前反向链接列表['index']].left }}|{{ 标记数组[当前反向链接列表['index']].top }}</span>
        <cc-block-list
            :blocklist="当前反向链接列表['backlinks']"
            title="反向链接"
            :count="当前反向链接列表['linkRefsCount']"
        ></cc-block-list>
        <el-divider></el-divider>

        <cc-block-list
            :blocklist="当前反向链接列表['backmentions']"
            :count="当前反向链接列表['mentionsCount']"
            title="提及"
        ></cc-block-list>
        <cc-block-list 
        :blocklist="当前正向链接列表" 
        :count="当前正向链接列表.length" 
        title="正向链接">
        </cc-block-list>
    </el-card>
</template>
<script>
module.exports = {
    name: "cc-toolbar-infor",
    props: ["卡片数据id"],
    components: componentsList,
    data() {
        return {
            思源伺服ip:"",
            apitoken:"",
            当前卡片数据: "",
            当前正向链接列表: [],
            当前反向链接列表: [],
            当前卡片思源块id:"",
        }
    },
    mounted() {
        this.思源伺服ip=window.location.host
        console.log(this.思源伺服ip)
    },
    watch: {
        卡片数据id:{
            async handler(val){
                console.log(val)
                if(val){
                    this.当前卡片数据=await this.$数据库.tags.get(val)
                }
                else{
                    this.当前卡片数据=null
                }
            }
        },
        当前卡片数据: {
            handler(val, oldval) {
                if (val!=oldval ) {
                    this.当前卡片思源块id = val.def_block
                    
                }
            },
            deep:true
        },
        当前卡片思源块id:{
            async handler(val,oldval){
                if(val&&val!=oldval&&this.当前卡片数据){
                    this.当前卡片思源块id = val.replace("((", "").replace("))", "").slice(0,22);
                    id = this.当前卡片思源块id
                    console.log(id)
                    this.当前反向链接列表 =await this.以id获取反向链接(id)
                    this.当前正向链接列表 =await this.以id获取正向链接(id)

                    this.当前卡片数据["def_block"]=val
                    this.$数据库.tags.put(this.当前卡片数据)
                }
                else{
                    this.当前反向链接列表=[]
                    this.当前正向链接列表=[]
                }
            }
        }
    },
    methods: {
        以id获取反向链接: async function (id) {
            let that =this
            console.log("aaa",this.$思源伺服ip)
            if (id) {
                let 原始反向链接列表 = await 以id获取反向链接(
                    that.$思源伺服ip,
                    this.apitoken,
                    id
                );
                return 原始反向链接列表["data"];
            }
        },
        以id获取正向链接: async function (id) {
      
        let 思源伺服ip = window.location.host
        let obj = {}
        let sql = `select * from blocks where id in (select def_block_id from refs where block_id = '${id}')`
        obj = await 以sql向思源请求块数据(思源伺服ip, this.apitoken, sql)
        console.log(obj)
        return obj
        },
    }
}
</script>