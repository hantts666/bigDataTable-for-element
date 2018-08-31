class BigDataTable {
	constructor(vm,options) {
		//以下为私有变量
		this._options = options
		this._flag = true
		this.$options = {}
		this.$vm = vm
		
		//data
		this.$scource_data = []
		this.$fill_data = []
		this.$fill_data_length = 25
		this.$fill_data_height = 0
		this.$table_item_height = 32
		
		//指针
		this.$vm_p={
			topspan:"",
			bottomspan:"",
			filldata:"",
		}
		
		//dom
		this.$scroller_ref = null

		//index
		this.$scroll_top = 0
		this.$span = {
			topspan: 0,
			bottomspan: 0
		}
		this.$Nodes = {
			topNode: 0,
			topUpdataNode: 0,
			bottomUpdataNode: 0,
			bottomNode: 0,
		}
		this.$view_pointer = 0
		this.$cache_pointer = 0
		this.init()
	}
	init() {
		let options = this._options
		let _this = this
		this.$options = options
		this.$scource_data = this.$vm[this.$options.data]
		this.$scroller_ref = this.$options.scrollerRef
		this.$vm_p.topspan = options.top_span
		this.$vm_p.bottomspan = options.bottom_span
		this.$vm_p.filldata = options.fill_data
		if(options.filldata_length) this.$fill_data_length = options.filldata_length
		if(options.table_item_height) this.$table_item_height = options.table_item_height
		
		
		let handler = this.scrollerHandler.bind(_this)
		this.$scroller_ref && this.on("scroll", this.$scroller_ref, handler)
		this.updataNode('ref')

	}

	getFillData() {
		return this.$fill_data
	}
	scrollerHandler() {
		let _this = this
		let _scroll_top = this.$scroller_ref.scrollTop
		this.$scroll_top = _scroll_top
		let _pointer = Math.floor(_scroll_top / this.$table_item_height)
		//console.log(this.$view_pointer)
		//if(this.$view_pointer != _pointer){
			this.$view_pointer = _pointer
			this.pointerHandler()
		//}
	}
	
	pointerHandler() {
		let Node = this.$Nodes
		let pointer = this.$view_pointer
		if(pointer < Node.topNode || pointer > Node.bottomNode){
			this.updataNode("ref")
			return
		}
		
		if(pointer < Node.topUpdataNode && pointer != 0){
			this.updataNode("top")
			return
		}
		
		if(pointer > Node.bottomUpdataNode && pointer != this.$scource_data.length){
			this.updataNode("bottom")
			return
		}
		
	}
	
	setInfoNode({topNode,topUpdataNode,bottomUpdataNode,bottomNode}){
		this.$Nodes.topNode = topNode
		this.$Nodes.topUpdataNode = topUpdataNode
		this.$Nodes.bottomUpdataNode = bottomUpdataNode
		this.$Nodes.bottomNode = bottomNode
	}
	
	updataNode(side){
		
		
		let pointer = this.$view_pointer
		let cache_pointer = this.$cache_pointer
		let oldNode = this.$Nodes
		let _length = this.$fill_data_length
		let totle_length = this.$scource_data.length
		let item_height = this.$table_item_height
		let _newNode = {
			topNode:0,
			topUpdataNode:0,
			bottomUpdataNode:0,
			bottomNode:0
		}
		let span = {
			topSpan:0,
			bottomSpan:0
		}
		if(side == 'top'){
			let _top = oldNode.topNode
			_newNode = {
				topNode:Math.max(0,_top-_length),
				topUpdataNode:Math.max(0,_top),
				bottomUpdataNode:Math.min(totle_length,_top+_length*2),
				bottomNode:Math.min(totle_length,_top+_length*3)
			}
		}else if(side == 'bottom'){
			let _bottom = oldNode.bottomNode
			_newNode = {
				topNode:Math.max(0,_bottom-_length*3),
				topUpdataNode:Math.max(0,_bottom-_length*2),
				bottomUpdataNode:Math.min(totle_length,_bottom),
				bottomNode:Math.min(totle_length,_bottom+_length)
			}
			
		}else if(side == "ref"){
			_newNode = {
				topNode:Math.max(0,pointer-_length*2),
				topUpdataNode:Math.max(0,pointer-_length),
				bottomUpdataNode:Math.min(totle_length,pointer+_length),
				bottomNode:Math.min(totle_length,pointer+_length*2)
			}
		}
		
		span = {
			topSpan:_newNode.topNode * item_height,
			bottomSpan:(totle_length - _newNode.bottomNode)  * item_height 
		}
		this.$cache_pointer = pointer
			
		
		this.setInfoNode(_newNode)
		
		this.getFillData(_newNode)

		
		this.setSpan(span)
		
		
		
	}
	setSpan({topSpan,bottomSpan}){
		this.$span.topspan = topSpan
		this.$span.bottomspan = bottomSpan
		this.$vm[this.$vm_p.bottomspan] = bottomSpan
		this.$vm[this.$vm_p.topspan] = topSpan
		this.$vm.$nextTick(()=>{
			
			this.$scroller_ref.scrollTop = this.$cache_pointer * this.$table_item_height
		})
	}
	//api:getFillData获取渲染数据
	getFillData(node){
		let _data = []
		_data = this.$scource_data.slice(node.topNode,node.bottomNode)
		this.$fill_data = _data
		this.$vm[this.$vm_p.filldata] = _data
	}
	//api:refresh
	refresh(){
		this.$scource_data = this.$vm[this.$options.data]
		this.updataNode("ref")
	}
	//util
	on(evt, element, fnc) {
		return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc);
	}

	off(evt, element, fnc) {
		return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt,
			fnc);
	}

	isArray(arr) {
		return Object.prototype.toString.call(arr) === '[object Array]';
	}

	getStyle(prop, elem) {
		return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop];
	}

}




export default BigDataTable
