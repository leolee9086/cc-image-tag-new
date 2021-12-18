 
<template>
<div
      v-if="链接.labelPalcement"
      :style="`
      position:absolute;
      top:${链接.labelPalcement['y']}px;
      left:${链接.labelPalcement['x']}px;
      height:50px;
      width:100px;
      `"
    >
      <el-row style="z-index: 100;">
        <el-input v-model="链接.label" @change="保存链接修改(链接)" size="mini" >
          <el-popover slot="prepend" trigger="hover" width="300">
            <cc-color-pane v-model="链接.color" @change="保存链接修改(链接)"></cc-color-pane>
            <span slot="reference" class="el-icon-edit"></span>
          </el-popover>
        </el-input>
      </el-row>
    </div>
</template>
<script>
module.exports={
    name: "cc-graph-link-label",
    props: ["link"],
      components: {
        "cc-color-pane":"url:/widgets/cc-baselib/components/cc-color-pane.vue",
    },
    async mounted() {
        this.链接 = this.link
        this.链接 = await this.$数据库.links.get(this.link.id)
        this.代理起始标记 = await this.$数据库.tags.get(this.链接.from_id)
        this.代理结束标记 = await this.$数据库.tags.get(this.链接.to_id)
        console.log(this.代理起始标记, this.代理结束标记)
    },
    data() {
        return {
            链接: "",
            路径: "",
            width: 0,
            代理起始标记: {},
            代理结束标记: {},
            timer: ""
        }
    },
    watch: {
        link:{
            handler(val,oldval){
                if(val!=oldval){
                    this.链接=val
                }
            },
            deep:true

        },
    },
    methods: {
    保存链接修改: async function (链接) { await this.$数据库.links.put(链接) }

       
    } 
}
</script>