 
<template>
<div
      v-if="属性对象.labelPalcement"
      :style="`
      position:absolute;
      top:${属性对象.labelPalcement['y']}px;
      left:${属性对象.labelPalcement['x']}px;
      height:50px;
      width:100px;
      `"
    >
      
          <el-tooltip  trigger="hover" width="300" content="测试">
            <cc-color-pane v-model="属性对象.color" @change="保存链接数据修改()"></cc-color-pane>
            <span slot="reference" class="el-icon-edit"></span>
          </el-tooltip>
          <div :style="`padding:0px;content-align:center`">
            <div slot="reference">{{链接数据.type}}</div>
            <div class="content" v-html="预览HTML"></div>
          </div>
     
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
        this.链接数据 = this.link
        this.链接数据 = await this.$数据库.links.get(this.link.id)
        this.代理起始标记 = await this.$数据库.tags.get(this.链接数据.attrs.from_id)
        this.代理结束标记 = await this.$数据库.tags.get(this.链接数据.attrs.to_id)
        this.生成html()
        console.log(this.代理起始标记, this.代理结束标记)
    },
    data() {
        return {
            属性对象:{},
            链接数据:{},
            路径: "",
            width: 0,
            代理起始标记: {},
            代理结束标记: {},
            timer: "",
            html:""
        }
    },
    watch: {
        link:{
            handler(val,oldval){
                if(val!=oldval){
                    this.链接数据=val
                    if(!val.type){
                      this.链接数据.type="包含"
                    }
                }
            },
            deep:true

        },
        链接数据:{
             handler(val,oldval){
                                   this.生成html()

                if(val!=oldval){
                    this.属性对象=val.attrs
                    this.保存链接数据修改()
                }
                 if(!val.type){
                      this.链接数据.type="包含"
                    }
            },
            deep:true
        }
    },
    methods: {
    保存链接数据修改: async function () { this.$事件总线.$emit("保存链接数据",this.链接数据) },
    生成html:async  function(){
      if(this.链接数据.markdown){
      console.log*(this.链接数据.markdown)
      this.预览HTML= await Vditor.md2html(this.链接数据.markdown) }
      else this.预览HTML= "有关"
      }   
       
    } 
}
</script>