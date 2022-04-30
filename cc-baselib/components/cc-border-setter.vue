<template>
    <div id ="cc-border-setter" 
        
        class="outline" 
        >
        <div class="container" 
        cssattr="margin"
        v-on:mouseover="高亮($event)"
        v-on:mouseout="去除高亮($event)"
        v-on:mousedown="隐藏弹窗($event)"
        v-on:mouseup="显示弹窗($event)"
        :style="`background-image=${当前样式对象['backgroundImage']}`"
        >
        <span
        class="box-name outline"
        cssattr="outline"
        v-on:mouseover="高亮($event)"
        v-on:mouseout="去除高亮($event)"
        >轮廓</span>
            <div class="margin-box"
            cssattr="border"
            
            >
                <span class="box-name" cssattr="margin">外边距</span>
                <span class="top-label label el-icon-caret-bottom" cssattr="marginTop"></span>
                <span class="bottom-label label el-icon-caret-top" cssattr="marginBottom"></span>
                <span class="left-label label el-icon-caret-right" cssattr="marginLeft"></span>
                <span class="right-label label el-icon-caret-left" cssattr="marginRight"></span>
                <div class="border-box"
                cssattr="padding"
                >
                    <span class="box-name" cssattr="border">
                        边框
                        <span  class="el-icon-picture-outline" cssattr="borderImage"></span>
                        <span  class="el-icon-full-screen" cssattr="borderRadius" csstype="length"></span>
                    </span>
                    <span class="top-label label el-icon-caret-bottom" cssattr="borderTop"></span>
                    <span class="bottom-label label el-icon-caret-top" cssattr="borderBottom"></span>
                    <span class="left-label label el-icon-caret-right" cssattr="borderLeft"></span>
                    <span class="right-label label el-icon-caret-left" cssattr="borderRight"></span>
                    <span class="radius-label top left label el-icon-top-left" cssattr="borderTopLeftRadius"></span>
                    <span class="radius-label top right label el-icon-top-right" cssattr="borderTopRightRadius"></span>
                    <span class="radius-label bottom left label el-icon-bottom-left" cssattr="borderBottomLeftRadius"></span>
                    <span class="radius-label bottom right label el-icon-bottom-right" cssattr="borderBottomRightRadius"></span>

                    <div class="padding-box"
                    cssattr="background"
                    >
                        <span class="box-name" cssattr="padding">内边距</span>
                        <span class="top-label label el-icon-caret-bottom" cssattr="paddingTop"></span>
                        <span class="bottom-label label el-icon-caret-top" cssattr="paddingBottom"></span>
                        <span class="left-label label el-icon-caret-right" cssattr="paddingLeft"></span>
                        <span class="right-label label el-icon-caret-left" cssattr="paddingLight"></span>
                        <span class="el-icon-picture-outline content" cssattr="backgroundImage"></span>
                        <span class="el-icon-sort content" cssattr="backgroundAttachment"></span>
                        <span class="el-icon-color content" cssattr="backgroundColor"></span>
                    </div>
                </div>
            </div>
        </div>
           
        <div 
        class="pophandler" 
        ref="pophandler"
        v-popover:编辑弹窗
        ></div>
        <el-popover
        ref="编辑弹窗"
        trigger="manual"
        v-model="对话框可见"
        width="300"
        :before-close="设置(当前属性名)"
        placement="right">
                <div >{{属性名对照[当前属性名]}}|{{当前属性名}}</div>
                  <el-button 
                    @click="对话框可见 = false"
                    size=mini>关闭</el-button>
                <el-row v-if="当前为宽度属性||当前为线型属性">
                  
                    <el-col  :span="10">
                        <el-input type="number" v-model="当前数值" size=mini>
                            <span slot="prepend">宽度</span>
                        </el-input>
                    </el-col>
                    <el-col  :span="10">
                        <el-select 
                        size=mini
                        v-model="当前宽度单位">
                            <el-option
                            v-for="item in 宽度单位对照"
                            :value="item.value" 
                            :label="item.value"
                            >
                                <el-tooltip 
                                    :content="item.label"
                                    placement="right"
                                    >
                                        <div>{{item.value}}</div>
                                </el-tooltip>
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col  :span="10">
                    <el-select 
                        size=mini
                        v-model="当前线型"
                        v-if="当前为线型属性"
                        >
                        <el-option
                        v-for="item in 线型对照"
                        :value="item.value" 
                        :label="item.label"
                        >
                            <el-tooltip 
                                    :content="item.label"
                                    placement="right"
                                    >
                                    <div style="margin:3px;height:28px">
                                        <div :style="`border:${item.value} 3px grey;margin:0px;height:60%;text-align:center;padding-bottom:6px;color:var(--b3-font-color)`">{{item.value}}</div>
                                    </div>
                            </el-tooltip>
                        </el-option>
                    </el-select>
                    </el-col>
                    <el-col :span="10">
                        <el-popover
                        trigger="click"
                        :width="400"
                        >
                            <div slot="reference" style="height:26px">
                            <el-card   v-if="当前为线型属性" :style="`height:100%;background-color:${当前颜色}`" size="mini"></el-card>
                            <el-card    v-if="当前属性名=='backgroundColor'" :style="`height:100%;background-color:${当前样式对象[当前属性名]}`" size="mini"></el-card>
                            </div>
                            <cc-color-pane
                                v-if="当前为线型属性"
                                v-model="当前颜色"
                               
                                :自定义颜色数组="自定义颜色数组"
                                ></cc-color-pane>
                                <cc-color-pane
                                v-if="当前属性名=='backgroundColor'"
                                v-model="当前样式对象[当前属性名]"
                                :自定义颜色数组="自定义颜色数组"
                                ></cc-color-pane>
                        </el-popover>
                    </el-col>
                </el-row>
                <cc-cssimage
                        v-model="当前样式对象.backgroundImage"
                        v-if="当前属性名=='backgroundImage'&&!当前样式对象['使用背景渐变']"
                        :思源伺服ip="思源伺服ip"
                        :apitoken="apitoken"
                        :filetypes="['jpg','png','jpeg','svg']"
                ></cc-cssimage>
                <el-checkbox v-if="当前属性名=='backgroundImage'" v-model="当前样式对象.使用背景渐变">使用渐变</el-checkbox>
                <el-checkbox v-if="当前属性名=='backgroundImage'" v-model="当前样式对象.使用文字遮罩">使用文字遮罩</el-checkbox>
                <el-input
                        v-model="当前样式对象.borderImage"
                        v-if="当前属性名=='borderImage'"
                ></el-input>
               
                        
        </el-popover>
    </div>
</template>
<script>
module.exports={
    name:"cc-border-setter",
    components:componentsList,
    props:["思源伺服ip","apitoken","样式对象","自定义颜色数组"],
    model:{event:"change",prop:"样式对象"},
    mounted(){
            this.当前样式对象=JSON.parse(JSON.stringify(this.样式对象))
            for (prop in this.样式对象){
                this.当前样式对象[prop] = this.样式对象[prop]
                if(!this.当前样式对象[prop]){this.$set(this.当前样式对象,prop,"")}
            }
        },
    data(){
        return{
            当前颜色:"",
            对话框可见:false,
            当前样式对象:"",
            属性字符串:"",
            当前属性名:"",
            属性名对照:{
                        "border":"边框",
                        "margin":"外边距",
                        "padding":"内边距",
                        "borderLeft":"左边框",
                        },
            当前数值:1,

            当前宽度单位:"",
            宽度单位对照:[
                    {"value":"em","label":"相对当前元素"},
                    {"value":"ex","label":"相对小写x"},
                    {"value":"ch","label":"指定数字0宽度"},
                    {"value":"rem","label":"相对根元素"},
                    {"value":"vw","label":"相对窗口宽度"},
                    {"value":"vh","label":"相对窗口高度"},
                    {"value":"vmin","label":"相对窗口高宽中较小值"},
                    {"value":"vmax","label":"相对窗口高度中较大值"},
                    {"value":"%","label":"百分比"},
                    {"value":"cm","label":"厘米"},
                    {"value":"mm","label":"毫米"},
                    {"value":"in","label":"英寸"},
                    {"value":"px","label":"像素"},
                    {"value":"pt","label":"磅"},
                    {"value":"pc","label":"派卡"},
                ],
            
            当前线型:"",
            线型对照:[
                    {value:"none",label:"无"},
                    {value:"hidden",label:"隐藏"},
                    {value:"solid",label:"实线"},
                    {value:"double",label:"双线"},
                    {value:"dashed",label:"虚线"},
                    {value:"dotted",label:"点线"},
                    {value:"groove",label:"线雕"},
                    {value:"ridge",label:"浮雕"},
                    {value:"inset",label:"陷入"},
                    {value:"outset",label:"突起"},
            ],
            当前为线型属性:false,
            当前为宽度属性:false,
            使用背景渐变:false,
            锁定:false,
            背景图像:"",
            线型属性数组:["border","borderLeft","borderRight","borderTop","borderBottom","outline",]
        }
    },
    watch:{
        背景图像(val){
                if(!val==this.当前样式对象["backgroundImage"]){
                    this.当前样式对象["backgroundImage"]=val
                }
            },
        当前属性名(){
            let  属性名=this.当前属性名
            if(this.线型属性数组.indexOf(属性名)>=0){
                this.当前为线型属性=true
            }
            else{this.当前为线型属性=false}
        
            if(属性名.indexOf("margin")>=0||属性名.indexOf("padding")>=0||属性名.indexOf("Radius")>=0){
                this.当前为宽度属性=true
            }
            else{this.当前为宽度属性=false}
            
            
        },
        当前属性值(val){
            this.当前属性对象[this.当前属性名]=val
        },
        样式对象:{
                handler(val){
                    for (prop in val){
                        if(this.当前样式对象[prop]!=undefined){
                        this.当前样式对象[prop]=val[prop]}
                    }
                    this.backgroundImage=val['backgroundImage']

                },
                deep:true
        },
        当前样式对象:{
                handler(val){
                    this.$emit("change",JSON.parse(JSON.stringify(val)))
                },
                deep:true
            },
        当前数值(){
             this.设定属性()
        },
        当前宽度单位(){
            this.设定属性()
        },
        当前线型(){
            this.设定属性()
        },
        当前颜色(val){
            console.log(this.当前样式对象[this.当前属性名+'Color'])
            this.设定属性()
        }
    },
    computed:{
        
    },
    methods:{
        设定属性(){
            let that =this
            if(this.锁定){return null}
            if (that.当前为线型属性){
           // console.log(that.当前属性名)
            let 当前字符串 =`${that.当前线型} ${that.当前数值+that.当前宽度单位} ${that.当前颜色}`
         //   console.log (当前字符串)
            that.当前样式对象[that.当前属性名]=当前字符串
          //  console.log(that.当前数值)
            this.当前样式对象[this.当前属性名+'Color']=that.当前颜色
            this.当前样式对象[this.当前属性名+'Style']=that.当前线型
            
            }
            if(that.当前为宽度属性){
              //  console.log(that.当前属性名)
               // console.log(that.当前数值)
                            let 当前字符串 =`${that.当前数值+that.当前宽度单位}`

                that.当前样式对象[that.当前属性名]=当前字符串
               // console.log(that.样式对象[that.当前属性名])
            }
        },
        设置(){},
        高亮($event){
            $event.target.className=$event.target.className.replace(" hilight","")+" hilight"
            
        },
        去除高亮($event){
            $event.target.className=$event.target.className.replace(" hilight","")
        },
        显示弹窗($event){
                this.$refs.pophandler.style.left = $event.clientX-5+"px"
                this.$refs.pophandler.style.top = $event.clientY-5+"px"
                 if ($event.target.getAttribute("cssattr")){
                this.当前属性名= $event.target.getAttribute("cssattr")
                }
                console.log($event.target.innerText)
                console.log(this.当前属性名)
                this.提取属性(this.当前属性名)
        },
        隐藏弹窗($event){
            this.$refs.编辑弹窗.doClose()
        },
        提取属性(当前属性名){
            this.锁定=true
         //   console.log(当前属性名)
            let 当前属性值 =""+  this.当前样式对象[当前属性名]
         //   console.log(this.当前样式对象[当前属性名])
         //   console.log(this.当前为线型属性)
            if(this.当前为线型属性){
                for(i in this.线型对照){
                    let 线型 = this.线型对照[i]
                    if(当前属性值.indexOf(线型["value"])>=0){
                       // console.log("提取")
                        this.当前线型=线型["value"]
                        
                    }
                
                }
                for(i in this.宽度单位对照){
                    let 单位 = this.宽度单位对照[i]
                    if(当前属性值.indexOf(单位["value"])>=0){
                       // console.log("提取")
                        this.当前宽度单位=单位["value"]
                        当前属性值=当前属性值.replace(this.当前宽度单位,"")
                    }
                }
                if (this.当前样式对象[当前属性名]){
                    当前属性值=当前属性值.replace(this.当前线型,"")
                    当前属性值=当前属性值.replace(this.当前宽度单位,"")
                    console.log(当前属性值)
                    let 字符值 =当前属性值.replace(this.当前颜色,"")
                    
                    let 临时数值 = parseFloat(字符值)
                    console.log("数值",临时数值)
                    if(临时数值){
                    this.当前数值= Math.round(临时数值*100)/100;}
                }
                this.当前颜色 = this.当前样式对象[当前属性名+"Color"]
            }
            if(this.当前为宽度属性){
                 for(i in this.线型对照){
                    let 线型 = this.线型对照[i]
                    if(当前属性值.indexOf(线型["value"])>=0){
                       // console.log("提取")
                        this.当前线型=线型["value"]
                        当前属性值=当前属性值.replace(this.当前线型,"")
                    }
                
                }
                for(i in this.宽度单位对照){
                    let 单位 = this.宽度单位对照[i]
                    if(当前属性值.indexOf(单位["value"])>=0){
                       // console.log("提取")
                        this.当前宽度单位=单位["value"]
                        当前属性值=当前属性值.replace(this.当前宽度单位,"")
                    }
                }
                if (this.当前样式对象[当前属性名]){
                //    console.log(this.当前样式对象[当前属性名])
                    let 字符值 =当前属性值.replace(this.当前宽度单位,"")

                    let 临时数值 = parseFloat(字符值)
                //    console.log("字符值",字符值,"数值",临时数值)
                    this.当前数值= Math.round(临时数值*100)/100;
                }
            }

            this.锁定=false 
            this.$refs.编辑弹窗.doShow()
            //console.log(this.当前样式对象['backgroundImage'])
        }
    },
}
</script>
<style scoped>

.outline,.container,.margin-box,.border-box,.padding-box{
   /* padding:28px;*/
    border:solid 1px;
    margin:28px;
    position:relative;
    background-color: var(--b3-theme-background)  !important;
 }
.outline{
    border:none !important;
    position:relative;
}
 span.box-name{
    position:absolute;
    top:-28px;
    left:28px
 }
 span.box-name.outline{
    left:0;
    top:-56px;
 }
.hilight{
    background-color: yellow !important;
}
span.hilight{
    background-color: rgb(211, 211, 174);
}
.top-label{
    text-align: center;
    position:absolute;
    top:-28px;
    left: calc(50% - 0.5em) ;
}
.bottom-label{
    text-align: center;
    position:absolute;
    top:calc(100% + 1em) ;
    left: calc(50% - 0.5em) ;
}
.left-label{
    text-align: center;
    position:absolute;
    left:-28px;
    top:calc(50% - 0.5em) ;
}
.right-label{
    text-align: center;
    position:absolute;
    left:calc(100% + 0.5em );
    top:calc(50% - 0.5em) ;
}
span:focus{
    border:none !important;
}
.radius-label {
    text-align: center;
    position:absolute;
    
}
.radius-label.left{
    left:-28px;
}
.radius-label.top{
    top:-28px ;
}
.radius-label.bottom{
    top:calc(100% + 1em) ;
}
.radius-label.right{
    left:calc(100% + 0.5em );
}
.pophandler{
    position:fixed;
    width:10px;
    height:10px;
   /* border:solid;*/
}
</style>