class Node {
    constructor(NodeDefine){
    this.初始化()
      for (属性名 in NodeDefine){
          this[属性名] =  NodeDefine[属性名]
      }
    }
  }
  Object.assign(Node.prototype, {
    初始化(){
        

    },
  });
  