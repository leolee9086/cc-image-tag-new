<template>
  <el-card>
    <el-link :href="`/widgets/cc-image-tag-new/?baseid=${画板.id}`">{{
      画板.name
    }}</el-link>
    <div>
      卡片数量:{{ 卡片总数 }} 链接数量:{{ 链接总数 }} 历史版本数量:{{ 历史版本数量 }}
      <span
        aria-label="删除这个画板(仅删除浏览器数据)"
        class="el-icon-delete"
        @click="删除画板数据(画板)"
      ></span>
    </div>
  </el-card>
</template>
<script>
module.exports = {
  name: "cc-shower-board",
  props: ["画板"],
  data() {
    return {
      画板id: this.画板.id,
      画板数据库: {},
      卡片总数: "",
      链接总数: "",
      历史版本数量: "",
    };
  },
  mounted() {
    this.画板数据库 = new Dexie(this.画板.id);
    this.画板数据库.version(3).stores({
      cards:
        "id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
      links:
        "id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
      states: "++id,current_cardid,current_linkid,viewcenter",
      metadata: "key,value",
      history: "++id,data",
      cardpresets:
        "id,parent_id,root_id,hash,box,path,&name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
      linkpresets:
        "id,parent_id,root_id,hash,box,path,&name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
    });

    this.画板数据库.open().then(this.获取画板数据());
  },
  methods: {
    async 获取画板数据() {
      try {
        this.卡片总数 = await this.画板数据库.cards.count();
        this.链接总数 = await this.画板数据库.links.count();
        this.历史版本数量 = await this.画板数据库.history.count();
      } catch (e) {
        this.$emit("隐藏");
      }
    },
    async 删除画板数据() {
      await this.$画板元数据库.boards.delete(this.画板.id);
      await this.画板数据库.delete().then(this.$emit("删除"));
      await Dexie.delete(this.画板.id);
    },
  },
};
</script>
