<template>
  <div
    aria-label="双击或者黏贴内容新建卡片"
    class="cardscontainer layer"
    :style="` 
        position:absolute;
        top:0px;
        left:0px;
        width: ${窗口大小.width}px; 
        height: ${窗口大小.height}px;
        transform-origin:0% 0%;
        z-index:200`"
  >
    <div
      class="cardscontainer layer"
      @dblclick="双击画板($event)"
      @drop="拖放($event)"
      @paste="黏贴内容($event)"
      @click="点击画板($event)"
      @mousedown="按下鼠标($event)"
      :style="` 
        position:absolute;
        top:0px;
        left:0px;
        width: ${窗口大小.width}px; 
        height: ${窗口大小.height}px;
        transform-origin:0% 0%;`"
    >
      <cc-dragable-block-card
        :data-node-id="item.id"
        :ref="item.id"
        v-for="(item, i) in 卡片数组"
        v-if="item && !item.hide && item.attrs"
        :key="卡片数组[i]['id']"
        v-model="卡片数组[i]"
        :index="i"
        数据类型="card"
        @activated="当前激活标签id = i"
        :窗口缩放倍数="$当前窗口状态.缩放倍数"
      ></cc-dragable-block-card>
      <cc-dragable-block-card
        :ref="item.id"
        :data-node-id="item.id"
        v-for="(item, i) in 链接数组"
        :key="链接数组[i]['id'] + 'label'"
        v-model="链接数组[i]"
        :index="i"
        @activated="当前激活链接id = i"
        style="z-index: 202"
        数据类型="link"
        :窗口缩放倍数="$当前窗口状态.缩放倍数"
      ></cc-dragable-block-card>
      <cc-dragable-block-combo
        :窗口缩放倍数="$当前窗口状态.缩放倍数"
        style="z-index: 600"
        :blockList="当前卡片集合数据"
        :collection="true"
        :选集主id="当前选集主id"
      >
      </cc-dragable-block-combo>
      <cc-dragable-block-combo
        :窗口缩放倍数="$当前窗口状态.缩放倍数"
        style="z-index: 600"
        :blockList="当前选集数据"
      >
      </cc-dragable-block-combo>
    </div>
    <cc-draw
      :style="` 
        position:fixed;
        top:0px;
        left:0px;
        z-index:${$当前窗口状态.is_drawing ? 0 : -1}
        `"
      v-model="画板绘制数据"
      :宽度="窗口大小.width"
      :高度="窗口大小.height"
      :窗口缩放倍数="$当前窗口状态.缩放倍数"
      :画布原点="画布原点"
      :当前鼠标坐标="当前鼠标坐标"
    >
    </cc-draw>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-cards",
  props: ["窗口大小", "画布原点", "当前鼠标坐标", "卡片数组", "链接数组"],

  data() {
    return {
      当前激活标签id: "",
      当前激活链接id: "",
      窗口缩放倍数: 1,
      updated: 0,
      当前选集数据: [],
      当前选集主id: "",
      当前卡片集合数据: [],
      当前激活数据: [],
      画板绘制数据: [],
    };
  },
  async mounted() {
    this.$事件总线.$on("选集增加", ($event) => this.增加数据($event));
    this.$事件总线.$on("清理选择", this.清理选择);
    this.$事件总线.$on("清理选集", this.清理选集);
    this.$事件总线.$on("激活数据", ($event) => this.判定归属($event));

    await this.$数据库.metadata.get("draw").then((data) => {
      //console.log("全局绘制", data);

      if (data) {
        //console.log(data);
        this.画板绘制数据 = JSON.parse(data.value || "[]");
        //console.log(this.画板绘制数据);
      }
    });
    this.$数据共享总线.addEventListener("message", (massage) =>
      this.获取消息数据(massage)
    );
  },
  watch: {
    当前激活标签id: {
      handler: function (val, oldval) {
        this.$事件总线.$emit("激活卡片", val);
      },
    },
    画板绘制数据: {
      handler(val) {
        this.$数据库.metadata.put({
          key: "draw",
          value: JSON.stringify(val),
        });
        this.updated = this.$生成毫秒时间戳();

        let 数据 = { data: val, updated: this.updated };
        this.$事件总线.$emit("绘制数据改变", 数据);
      },
      deep: true,
    },
  },

  methods: {
    拖放($event) {
      console.log($event);
    },
    获取消息数据(massage) {
      if (
        massage &&
        massage.data &&
        massage.data.id == this.$baseid &&
        parseInt(massage.data.updated) > parseInt(this.updated)
      ) {
        //console.log(massage.data.updated, this.updated);

        if (massage.data["画板绘制数据"]) {
          let 消息数据 = massage.data.画板绘制数据;
          if (消息数据 && JSON.stringify(消息数据) != JSON.stringify(this.画板绘制数据)) {
            this.画板绘制数据 = 消息数据;
            this.updated = this.$生成毫秒时间戳();
          }
        }
      }
    },
    判定归属(数据) {
      if ((数据 && 数据.attrs && 数据.parent_id) || 数据.attrs.collection) {
        if (!数据.attrs.collection) {
          this.当前选集主id = 数据.parent_id;
        } else {
          this.当前选集主id = 数据.id;
        }
        this.$数据库[数据.type + "s"]
          .filter((data) => {
            return data
              ? data.parent_id == 数据.parent_id ||
                  data.id == 数据.parent_id ||
                  data.parent_id == 数据.id
              : null;
          })
          .toArray((array) => {
            this.当前卡片集合数据 = array || [];
            this.$事件总线.$emit("选中数据集合", this.当前卡片集合数据);
          });
        this.当前选集数据 = [];
      }
    },
    清理选择: function () {
      //console.log("清理");
      this.当前选集数据 = [];
      this.当前卡片集合数据 = [];
    },
    清理选集: function () {
      this.当前选集数据 = [];
    },
    增加数据: function ($event) {
      this.当前选集数据.push($event);
    },
    点击画板: function ($event) {
      //  //console.log($event.target);
      $event.target.getAttribute("class") == "cardscontainer layer"
        ? this.$事件总线.$emit("点击画板空白处", $event)
        : null;
      $event.target.getAttribute("data-type") == "block-ref"
        ? this.$窗口内打开思源块($event.target.getAttribute("data-id"))
        : null;
    },
    黏贴内容: function ($event) {
      console.log(this.$当前窗口状态.当前元素类);
      if (this.$当前窗口状态.当前元素类 == "cardscontainer layer") {
        let clipboardData = $event.clipboardData;

        if (!(clipboardData && clipboardData.items)) {
          return;
        }
        for (var i = 0, len = clipboardData.items.length; i < len; i++) {
          var item = clipboardData.items[i];
          this.解析图片(item);
          if (item.kind === "string" && item.type == "text/plain") {
            item.getAsString((str) => {
              // //console.log(str);
              this.解析剪贴板内容(str + "");
            });
          }
        }
      }
    },
    解析图片(item) {
      if (item && item.kind === "file" && item.type.match(/^image\//i)) {
        // 读取该图片
        //console.log(item.webkitGetAsEntry());
      }
    },

    解析剪贴板内容: async function (剪贴板数据) {
      let 当前鼠标坐标 = this.当前鼠标坐标;
      let 思源伺服ip = window.location.host;
      let apitoken = "";
      let 空标签 = this.$根据属性生成卡片({
        top: (window.pageYOffset + 当前鼠标坐标.y) / this.$当前窗口状态.缩放倍数,
        left: (window.pageXOffset + 当前鼠标坐标.x) / this.$当前窗口状态.缩放倍数,
      });
      let id = 剪贴板数据.replace("((", "").replace("))", "").slice(0, 22);
      // //console.log(id);
      let 思源块属性 = await 以id获取思源块信息(思源伺服ip, apitoken, id);
      //  //console.log(思源块属性);

      if (思源块属性 && 思源块属性["id"]) {
        空标签["attrs"]["def_block"] = 思源块属性["id"];
        空标签["attrs"]["def_block_name"] = 思源块属性["name"];
      } else {
        空标签.markdown = 剪贴板数据;
      }

      console.log(空标签);
      await this.$数据库.cards.put(空标签);
      this.$事件总线.$emit("保存数据", 空标签);
    },
    双击画板: function ($event) {
      //console.log($event.target);

      this.$事件总线.$emit("双击画板", $event);
    },
    按下鼠标: function ($event) {
      this.$事件总线.$emit("按下鼠标", $event);
    },
  },
};
</script>
