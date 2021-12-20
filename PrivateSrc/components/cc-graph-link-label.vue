 
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
          <el-popover slot="prepend" trigger="hover" width="300">
            <cc-color-pane v-model="链接.color" @change="保存链接修改()"></cc-color-pane>
            <span slot="reference" class="el-icon-edit"></span>
          </el-popover>
          <el-card :body-style="`padding:0px;content-align:center`">
            <el-popover  trigger="hover" width="300">
            <div slot="reference">{{链接.type}}</div>
            <div  v-html="html形式memo"></div>
            </el-popover>
          </el-card>
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
        this.代理起始标记 = await this.$数据库.tags.get(this.链接.attrs.from_id)
        this.代理结束标记 = await this.$数据库.tags.get(this.链接.attrs.to_id)
        console.log(this.代理起始标记, this.代理结束标记)
    },
    data() {
        return {
            链接:{},
            路径: "",
            width: 0,
            代理起始标记: {},
            代理结束标记: {},
            timer: "",
            html形式memo:""
        }
    },
    watch: {
        link:{
            handler(val,oldval){
                if(val!=oldval){
                    this.链接=val
                    if(!val.type){
                      this.链接.type="包含"
                    }
                }
            },
            deep:true

        },
        链接:{
             handler(val,oldval){
                if(val!=oldval){
                    this.生成html()
                    this.保存链接修改()
                }
                 if(!val.type){
                      this.链接.type="包含"
                    }
            },
            deep:true

        }
    },
    methods: {
    保存链接修改: async function () { this.$事件总线.$emit("保存链接",this.链接) },
    生成html:async  function(){
      if(this.链接.memo){
      this.html形式memo= await Vditor.md2html(this.链接.memo) }
      else this.html形式memo= "有关"
      }   
       
    } 
}
</script>