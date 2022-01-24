<template>

</template>
<script>
module.exports = {
  name: "cc-toolbar-presets",
  data() {
    return {
      卡片预设列表: [],
      链接预设列表: [],
      当前预设: {},
      当前预设名: {},
      当前对象数据:{}
    };
  },
  async mounted(){
    this.卡片预设列表=await this.$数据库.cardpresets.toArray()
    this.链接预设列表=await this.$数据库.linkpresets.toArray()
    this.$事件总线.$on("激活卡片",$event=>this.当前对象数据=$event)
    this.$事件总线.$on("激活链接",$event=>this.当前对象数据=$event)
    this.$事件总线.$on("保存数据",$event=>this.$根据时间戳更新本地数据($event,this.当前对象数据))
  },
  methods:{
    
  },
  watch:{
    当前对象数据:{
      handler(val){
      this.当前预设名=val.subtype
    },
    deep:true
    }
  }

};
</script>
