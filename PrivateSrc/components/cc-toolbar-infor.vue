<template>
    <vue-draggable-resizable
        :x="工具栏左侧位置"
        :y="0"
        :w="工具栏宽度"
        :h="工具栏高度"
        :z="700"
        :draggable="true"
        @resizing="resizing"
        class-name-handle="resizer"
        class-name="toolbar toolbar-infor "
    >
        <div
            :style="`
            position:absolute;
            background-color:var(--b3-theme-background-light)
            overflow:hidden;
            max-height:${工具栏高度 - 10}px;
            height:${工具栏高度 - 10}px;
            max-height:100%;
            width:${工具栏宽度 - 10}px;
            border-radius:5px;
            padding:5px;
            `"
        >
            <div class="toolbar-body">
                <span
                    style="font-size: xx-small"
                    @click="定位至标记(标记数组[当前反向链接列表['index']])"
                    v-if="当前反向链接列表['index'] > 0"
                >标签{{ 当前反向链接列表.index }}坐标:{{ 标记数组[当前反向链接列表['index']].left }}|{{ 标记数组[当前反向链接列表['index']].top }}</span>
                <el-row>
                    <el-collapse>
                        <el-collapse-item>
                            <strong slot="title">思源连接属性</strong>
                            <el-input size="mini" v-model="当前卡片思源块id">
                                <span slot="prepend">
                                    <span class="el-icon-siyuan"></span>
                                    <span>id:</span>
                                </span>
                            </el-input>

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
                                title="正向链接"
                            ></cc-block-list>
                        </el-collapse-item>
                        <el-collapse-item>
                            <strong slot="title">图上连接</strong>

                            <el-collapse-item title="出链">
                                <el-collapse-item v-for="(outgoinglink,i) in 当前图上正向链接列表">
                                    <el-row slot="title">
                                        <el-select
                                            v-model="outgoinglink.type"
                                            @change="设定链接(outgoinglink)"
                                        >
                                            <el-option
                                                v-for="item in 链接类型列表"
                                                :label="item"
                                                :value="item"
                                            ></el-option>
                                        </el-select>
                                    </el-row>
                                    <el-input v-model="outgoinglink.markdown" size="mini">
                                        <div slot="prepend">标记</div>
                                    </el-input>
                                    <span>{{ outgoinglink.markdown }}</span>
                                </el-collapse-item>
                            </el-collapse-item>
                            <el-collapse-item title="入链">
                                <el-collapse-item v-for="(backlink,i) in 当前图上反向链接列表">
                                    <span>{{ backlink.markdown }}</span>
                                </el-collapse-item>
                            </el-collapse-item>
                        </el-collapse-item>
                    </el-collapse>
                </el-row>
            </div>
        </div>
    </vue-draggable-resizable>
</template>
<script>
module.exports = {
    name: "cc-toolbar-infor",
    props: ["卡片数据id"],
    components: componentsList,
    data() {
        return {
            思源伺服ip: "",
            apitoken: "",
            当前卡片数据: "",
            当前正向链接列表: [],
            当前反向链接列表: [],
            当前卡片思源块id: "",
            当前图上反向链接列表: [],
            当前图上正向链接列表: [],
            链接类型列表: ["属于", "不属于"],
            工具栏宽度: 600,
            工具栏高度: 700,
        }
    },
    mounted() {
        this.思源伺服ip = window.location.host
        console.log(this.思源伺服ip)
    },
    computed: {
        工具栏左侧位置() {

            return window.innerWidth - this.工具栏宽度
        }
    },
    watch: {
        卡片数据id: {
            async handler(val) {
                console.log(val)
                if (val) {
                    this.当前卡片数据 = await this.$数据库.tags.get(val)
                    this.当前图上正向链接列表 = await this.$数据库.links
                        .filter(value=>
                        {
                            if(value.attrs.from_id==val){
                            return true
                        }
                        }
                        ).toArray()
                    this.当前图上反向链接列表 = await this.$数据库.links
                        .filter(value=>
                        {
                            if(value.attrs.to_id==val){
                            return true
                        }
                        }
                        ).toArray()
                }
                else {
                    this.当前卡片数据 = null
                }
            }
        },
        当前卡片数据: {
            handler(val, oldval) {
                if (val != oldval) {
                    this.当前卡片思源块id = val.def_block
                }
            },
            deep: true
        },
        当前卡片思源块id: {
            async handler(val, oldval) {
                if (val && val != oldval && this.当前卡片数据) {
                    this.当前卡片思源块id = val.replace("((", "").replace("))", "").slice(0, 22);
                    id = this.当前卡片思源块id
                    console.log(id)
                    this.当前反向链接列表 = await this.以id获取反向链接(id)
                    this.当前正向链接列表 = await this.以id获取正向链接(id)
                    this.当前卡片数据["def_block"] = val
                    this.$数据库.tags.put(this.当前卡片数据)
                }
                else {
                    this.当前反向链接列表 = []
                    this.当前正向链接列表 = []
                }
            }
        }

    },

    methods: {
        resizing: function (x, y, w, h) {
            this.工具栏高度 = h
            this.工具栏宽度 = w

        },
        设定链接(link) {
            this.$数据库.links.put(link)
        },
        以id获取反向链接: async function (id) {
            let that = this
            console.log("aaa", this.$思源伺服ip)
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
<style scoped>
</style>
