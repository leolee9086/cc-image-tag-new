<template>
  <el-drawer :modal="false" title="全局设置" size="100%" :visible="显示">
    <el-row>
      <el-col :span="12">
        <strong>当前工作空间:{{ 工作空间名 }}</strong>
      </el-col>
      <el-col :span="12">
        <cc-loader-file @filechange="设定工作空间($event)"></cc-loader-file>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-timeline v-if="画板列表">
      <el-timeline-item
        v-for="(画板, 序号) in 画板列表"
        :key="画板.id"
        v-if="!画板列表[序号].hide"
        :timestamp="`${画板.id.slice(0, 4)}年${画板.id.slice(4, 6)}月${画板.id.slice(
          6,
          8
        )}日${画板.id.slice(8, 10)}时${画板.id.slice(10, 12)}分${画板.id.slice(
          12,
          14
        )}秒 `"
        placement="top"
      >
        <cc-shower-board
          @隐藏="隐藏画板(序号)"
          @删除="刷新画板列表()"
          :画板="画板"
        ></cc-shower-board>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-boards",
  props: ["显示"],
  data() {
    return {
      画板列表: [],
      工作空间名: "",
      开发模式: false,
    };
  },
  async mounted() {
    await this.获取数据();
    await this.获取画板列表();
    await this.修复画板列表();
    this.$事件总线.$on("设定工作空间", ($event) => (this.工作空间名 = $event.name));
  },
  watch: {
    当前画板命名(val) {
      if (val) {
        this.$数据库.metadata.put({ key: "name", value: val });
      }
    },
  },
  methods: {
    设定工作空间: async function ($event) {
      let obj = {
        id: 00000,
        name: $event.name,
        value: $event,
      };
      await this.$画板元数据库.workspace.put(obj);
      this.工作空间名 = $event.name;
      this.$事件总线.$emit("设定工作空间", $event, false);
      //console.log($event);
      this.工作空间句柄 = $event;
      this.批量保存卡片文件();
    },
    async 批量保存卡片文件() {
      let 画板命名 = (await this.$数据库.metadata.get("name")).value;
      this.$当前窗口状态.画板命名 = 画板命名;
      let 卡片数组 = await this.$数据库.cards.toArray();
      let 链接数组 = await this.$数据库.links.toArray();
      let 完全数组 = 卡片数组.concat(链接数组);
      for (let i = 0, len = 完全数组.length; i < len; i++) {
        this.$事件总线.$emit("保存数据", 完全数组[i]);
      }
    },
    隐藏画板: function (序号) {
      //console.log(序号);
      this.画板列表[序号].hide = true;
      this.画板列表 = JSON.parse(JSON.stringify(this.画板列表));
    },
    获取数据: async function () {
      this.当前画板id = this.$baseid;
      this.当前画板名称 = await this.$数据库.metadata.get("name").then((data) => {
        return data ? data.value : "未命名";
      });
    },
    获取画板列表: function () {
      this.$获取画板列表().then((data) => {
        //console.log(data);
        this.画板列表 = data;
      });
    },
    刷新画板列表: async function () {
      await this.获取数据();
      await this.获取画板列表();
    },
    修复画板列表: async function () {
      let databases = await Dexie.getDatabaseNames();
      for (let i = 0, len = databases.length; i < len; i++) {
        let element = databases[i];
        let db = new Dexie(element);
        try {
          db.version(3).stores({
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
          await db.open();
          let name = await db.metadata.get("name");

          name ? this.$画板元数据库.boards.put({ id: element, name: name.value }) : null;
        } catch (e) {}
      }
      //console.log(databases);
    },
  },
};
</script>
