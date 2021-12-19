const 事件总线 =  new Vue()

localStorage.clear();
console.log(数据库)
console.log(url参数);
let 数据源id = url参数.baseid
Vue.prototype.$数据源id =  数据源id
Vue.prototype.$数据库 =  数据库

Vue.prototype.$思源伺服ip =  window.location.host
Vue.prototype.$主界面 =  window.parent.document||document

const 事务列表 ={
    数据库:数据库,
    解析剪贴板内容: async function (str) {
      let 锚文本 = await 获取思源块链接锚文本(
        this.思源伺服ip,
        this.apitokn,
        str
      );
      if (锚文本 != "解析错误") {
        let 空标签对象 = {
          def_block: str,
          anchor: "",
          top: window.pageYOffset + this.当前鼠标坐标.y,
          left: window.pageXOffset + this.当前鼠标坐标.x,
          width: 100,
          height: 100,
          backgroundColor: "yellow",
          borderColor: "red",
          showhandler: false,
          color: "balck",
          folded: false,
          id: Lute.NewNodeID(),

        };
        this.标记数组.push(空标签对象);
      } else {
        let 空标签对象 = {
          def_block: "",
          anchor: str,
          top: window.pageYOffset + this.当前鼠标坐标.y,
          left: window.pageXOffset + this.当前鼠标坐标.x,
          width: 100,
          height: 100,
          backgroundColor: "yellow",
          borderColor: "red",
          showhandler: false,
          color: "balck",
          folded: false,
          id: Lute.NewNodeID(),

        };
        this.标记数组.push(空标签对象);
      }
    },
    上传数据到思源:async function(){
        let that = this
        let 文件数据 = {}
        let url参数 = this.$解析url(window.location.href);
        console.log(url参数);
        let 数据源id = url参数.baseid
        await that.$数据库.tags.toArray(array=>文件数据.tagarray=array)
        await that.$数据库.links.toArray(array=>文件数据.links=array)

            console.log(文件数据)
        let 数据blob = new Blob([JSON.stringify(文件数据)], { type: 'application/json' })
        let 文件 = new File([数据blob], `dataof${数据源id}.cctag`, { lastModified: Date.now() })
        let data = new FormData
        data.append('assetsDirPath', '/assets/')
        data.append('file[]', 文件)
        let url = 'http://' + that.$思源伺服ip + '/api/asset/upload'
        let filepath = ""
        fetch(url, {
          body: data,
          method: 'POST',
          headers: { 'Authorization': 'Token ' + that.apitoken },
        }).then(
          function (response) {
            console.log(response)
            return response.json()
          }
        ).then(function (resData) {
          console.log(resData)
          let succMap = resData['data']['succMap']
          console.log(succMap)
          for (let item in succMap) {
            filepath = filepath + succMap[item]
            console.log(filepath)
            设置思源块属性(that.$思源伺服ip, that.apitoken, that.数据源id, 'data-assets', filepath)
            try { that.挂件自身元素.setAttribute('data-assets', filepath) }
            catch (e) { }
          }
          //that.挂件自身元素.setAttribute('custom-data-assets',filepath)
        })
  
          },
    
    添加卡片:async function(卡片数据){
        await this.$数据库.tags.put(卡片数据)
        await self.上传数据到思源
    },
    保存卡片:async function(传入数据){
      console.log(传入数据)
      if(传入数据.styles){
        let 原始数据 =await this.$数据库.tags.get(传入数据.id)
        for(item in 传入数据.styles){
          原始数据[item] = 传入数据.styles[item]
          console.log(原始数据)
        }
        await this.$数据库.tags.put(原始数据)
        await self.上传数据到思源
      }
      else  if(传入数据.id){
        await this.$数据库.tags.put(传入数据)
        await self.上传数据到思源}
        
    },
    删除卡片:async function(卡片数据){
        let id =  卡片数据.id||卡片数据
        await this.$数据库.tags.delete(id)
        this.$数据库.links
        .where("from_id")
        .equals(id)
        .delete()
        this.$数据库.links
        .where("to_id")
        .equals(id)
        .delete()
    },
    定位至卡片:async function(卡片数据){
        let id = 卡片数据.id||卡片数据
        let 目标卡片数据 = await this.$数据库.tags.get(id)
        window.scrollTo(
            目标卡片数据.left+ 目标卡片数据.width/2- window.innerWidth / 2,
            目标卡片数据.top+目标卡片数据.width/2 - window.innerHeight / 2
          );
    },
    激活卡片:async function(id){
      console.log("开始链接")

      this.$当前窗口状态.currentCardid=id
      if(this.$当前窗口状态.等待连接卡片id){
        console.log(this.$当前窗口状态.等待连接卡片id)
        this.$数据库.links.put({
          "id":Lute.NewNodeID(),
          "type":"",
          "from_id":this.$当前窗口状态.等待连接卡片id,
          "to_id":id,
          "subtype":"",
          "labels":""
        })
        this.$当前窗口状态.等待连接卡片id=null
      }
      await  this.$数据库.states.put(this.$当前窗口状态)
    },
    开始连接: function(data){
      console.log("开始链接")
      this.$当前窗口状态.等待连接卡片id=data.id
    },
    显示提示: function(提示内容){
      
    }
    
}

const 窗口状态对象 = {
  currentLinkid : "",
  editMode : "",
  currentCardid:"",
  lastviewcentter:"",
  等待连接卡片id:""
}

for (let item in 事务列表){
    if(item!= "数据库"){
        事件总线.$on(item,事务列表[item])
    }
}
Vue.prototype.$当前窗口状态= 窗口状态对象
Vue.prototype.$事件总线 = 事件总线
