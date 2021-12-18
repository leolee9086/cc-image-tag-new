<template>
  <el-card
    body-style="border:solid 1px;
        border-radius:5px;
        position: fixed;
        top:calc(100vh - 100px);
        left:calc(50vw - 300px);
        background-color:white ;
        z-index:251;
        padding:5px;
        width:600px"
  >
   <el-row>
      <el-col :span="6">
        <el-popover trigger="click">
          <el-input v-model="背景图片路径" size="mini"></el-input>
          <cc-assets-selector v-model="图片源" :apitoken="apitoken" :思源伺服ip="思源伺服ip" :k="图片格式"></cc-assets-selector>
          <el-select v-model="图片格式" size="mini" allow-create filterable>
            <el-option v-for="格式 in 格式列表" :label="格式" :value="格式"></el-option>
          </el-select>
          <div slot="reference" class="el-icon-picture"></div>
          <div slot="reference" class="el-icon-picture"></div>
        </el-popover>
        <div class="el-icon-plus" @click="定点添加 = true"></div>
        <span
          v-if="定点添加"
          :style="`position:absolute;left:${当前鼠标坐标.x + 30}px;top: ${当前鼠标坐标.y + 30}px;z-index:251`"
        >点击添加标签</span>
        <el-popover trigger="hover">
          <div slot="reference" class="el-icon-zoom-in"></div>
          <el-input-number
            size="mini"
            type="number"
            v-model="图片缩放倍数"
            :min="0.1"
            :max="100"
            :step="0.1"
          ></el-input-number>
          <el-switch v-model="协同缩放" active-text="同时缩放标签坐标"></el-switch>
        </el-popover>
        <el-popover trigger="hover">
          <div slot="reference" class="el-icon-help"></div>
          <div
            v-for="(不可见标记,i) in 标记数组"
            v-if="不可见标记.hide"
            @click="定位至标记(不可见标记)"
          >标签{{ 不可见标记.anchor || i }}坐标:{{ 不可见标记.left }}|{{ 不可见标记.top }}</div>
        </el-popover>
        <el-popover trigger="hover">
          <div slot="reference" class="el-icon-browser" @click="打开新窗口()"></div>
          <el-input v-model="数据源id" :disabled="$挂件模式()">
            <span slot="prepend">数据源id:</span>
          </el-input>
        </el-popover>
      </el-col>
      <el-col :span="6"></el-col>
      <el-col :span="2">
        <el-popover trigger="click" width="350">
          <div
            slot="reference"
            :style="`
            color:${当前文字色};
            font-weight:bolder;
            text-decoration:underline 4px;
            text-align:center;
            `"
          >A</div>
          <h3>文字</h3>

          <cc-color-pane v-model="当前文字色" @change="设定当前标记()" :自定义颜色数组="自定义颜色数组"></cc-color-pane>
        </el-popover>
      </el-col>
      <el-col :span="2">
        <el-popover trigger="click" width="350">
          <div
            slot="reference"
            :style="`background-color:${当前背景色};
            width:24px;
            height:24px;
            border:solid 1px;
            margin:2px`"
          ></div>
          <h3>背景</h3>

          <cc-color-pane v-model="当前样式对象.backgroundColor" @change="设定当前标记()" :自定义颜色数组="自定义颜色数组"></cc-color-pane>
        </el-popover>
      </el-col>
      <el-col :span="2">
        <el-popover trigger="click" width="350">
          <div
            slot="reference"
            :style="`background-color:'';width:24px;height:24px;outline:solid 3px ${当前边框色};margin:2px`"
          ></div>
          <h3>边框</h3>
          <cc-color-pane v-model="当前样式对象.borderColor" @change="设定当前标记()" :自定义颜色数组="自定义颜色数组"></cc-color-pane>
        </el-popover>
      </el-col>
      <span
        style="font-size:xx-small"
        v-if="当前激活标签序号"
      >标签{{ 当前激活标签序号 }}坐标:{{ 标记数组[当前激活标签序号].left }}|{{ 标记数组[当前激活标签序号].top }}</span>
    </el-row>-->
  </el-card>
</template>
<script>
    module.exports={
        name:"cc-toolbar-bottom",
        props:[
          "卡片数据id"
          "链接数据id"
          ],
        components:componentsList,
        data(){
            return{
                
            }
        },
        async mounted(){
        
        },
        watch:{
        
        }
    }
</script>