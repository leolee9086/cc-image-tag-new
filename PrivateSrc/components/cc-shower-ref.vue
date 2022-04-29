<template>
  <div>
    <cc-block-list
      title="反向链接"
      :blocklist="当前反向链接列表['backlinks']"
      :count="当前反向链接列表['linkRefsCount']"
      buttonicon="el-icon-plus"
      :clickcallback="
        (data) => {
          思源链接上图(data.id, '链接', true);
        }
      "
      buttontip="上图"
    >
    </cc-block-list>

    <cc-block-list
      :blocklist="当前反向链接列表['backmentions']"
      :count="当前反向链接列表['mentionsCount']"
      title="提及"
      buttonicon="el-icon-plus"
      :clickcallback="
        (data) => {
          思源链接上图(data.id, '链接', true);
        }
      "
      buttontip="上图"
    >
    </cc-block-list>
    <cc-block-list
      :blocklist="当前正向链接列表"
      :count="当前正向链接列表.length"
      title="正向链接"
      buttonicon="el-icon-plus"
      :clickcallback="
        (data) => {
          思源链接上图(data.id, '链接', true);
        }
      "
      buttontip="上图"
    >
    </cc-block-list>
    <cc-block-list
      :blocklist="当前子块列表"
      :count="当前子块列表.length"
      title="子块"
      buttonicon="el-icon-plus"
      :clickcallback="
        (data) => {
          思源链接上图(data.id, '链接', true);
        }
      "
      buttontip="上图"
    >
    </cc-block-list>
    <cc-block-list
      :blocklist="当前子文档列表"
      :count="当前子文档列表.length"
      title="子文档"
      buttonicon="el-icon-plus"
      :clickcallback="
        (data) => {
          思源链接上图(data.id, '链接', true);
        }
      "
      buttontip="上图"
    >
    </cc-block-list>
  </div>
</template>
<script>
module.exports = {
  name: "cc-toolbar-history",
  props: ["显示", "value"],
  data() {
    return {
      当前反向链接列表: [],
      当前正向链接列表: [],
      当前子块列表: [],
      当前子文档列表: [],
      当前思源块id: "",
      当前对象数据: {},
      思源伺服ip: "",
    };
  },
  mounted() {
    this.当前对象数据 = this.value;
  },
  methods: {
    以id获取子块: async function (id) {
      this.思源伺服ip = window.location.host;

      if (id) {
        let sql = `select * from blocks where parent_id='${id}'`;
        let obj = await 以sql向思源请求块数据(this.思源伺服ip, this.apitoken, sql);
        return obj;
      }
      if (obj && obj[0]) {
        for (let i = 0; i < obj.length; i++) {
          let el = obj[i];
          if (el) {
            el.children = await this.以id获取子块(el.id);
          }
        }
      }
    },
    以id获取子文档: async function (id) {
      this.思源伺服ip = window.location.host;
      let obj = [];
      if (id) {
        let sql = `select * from blocks where path like '%${id}/%' and type = 'd'`;
        obj = await 以sql向思源请求块数据(this.思源伺服ip, this.apitoken, sql);
      }
      if (obj && obj[0]) {
        for (let i = 0; i < obj.length; i++) {
          let el = obj[i];
          if (el) {
            el.children = await this.以id获取子文档(el.id);
          }
        }
      }
      return obj;
    },
    思源链接上图(id, 类型, 反向) {
      let that = this;
      let 属性对象 = this.当前对象数据.attrs;
      let 待发送数据 = this.$根据属性生成卡片({
        top: 属性对象.top,
        left: 属性对象.left + 属性对象.width + 200,
      });
      // //console.log(待发送数据);

      待发送数据.attrs.def_block = id;
      let 卡片数组 = [];
      // //console.log(this.当前对象数据);
      if (!反向) {
        卡片数组 = [this.当前对象数据, 待发送数据];
      } else {
        卡片数组 = [待发送数据, this.当前对象数据];
      }
      this.$数据库.cards
        .put(待发送数据)
        .then(() => {
          this.$事件总线.$emit("添加卡片", 待发送数据);
        })
        .then(() => {
          //  //console.log("链接", 卡片数组);
          this.$事件总线.$emit("连接卡片", 卡片数组, 类型.replace("正向", ""));
        });
    },
    以id获取正向链接: async function (id) {
      this.思源伺服ip = window.location.host;
      let obj = [];

      let sql = `
      select * from
      blocks where id in (
        select def_block_id
        from refs
        where block_id = '${id}' or root_id='${id}'
        or block_id in (select id from blocks where parent_id='${id}')
        )`;
      obj = await 以sql向思源请求块数据(this.思源伺服ip, this.apitoken, sql);
      return obj || {};
    },
    以id获取反向链接: async function (id) {
      this.思源伺服ip = window.location.host;

      let that = this;
      // //console.log("aaa", this.$思源伺服ip);
      if (id) {
        let 原始反向链接列表 = await 以id获取反向链接(that.思源伺服ip, this.apitoken, id);
        return 原始反向链接列表["data"];
      }
    },
  },
  computed: {},
  watch: {
    当前对象数据: {
      async handler(val) {
        if (val && val.attrs) {
          this.当前思源块id = val.attrs.def_block;
        }
      },
    },
    当前思源块id: {
      async handler(val, oldval) {
        if (val) {
          id = this.当前思源块id;
          this.当前反向链接列表 = await this.以id获取反向链接(id);
          this.当前正向链接列表 = await this.以id获取正向链接(id);
          this.当前子块列表 = await this.以id获取子块(id);
          this.当前子文档列表 = await this.以id获取子文档(id);
        } else {
          this.当前反向链接列表 = [];
          this.当前正向链接列表 = [];
        }
        //  //console.log(this.当前反向链接列表, this.当前正向链接列表);
      },
    },
  },
};
</script>
