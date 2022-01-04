/* polyfill */
(function(undefined) {Object.defineProperty(Array.prototype,"values",{value:Array.prototype[Symbol.iterator],enumerable:!1,writable:!1});var Iterator=function(){var e=function(){return this.length=0,this},t=function(e){if("function"!=typeof e)throw new TypeError(e+" is not a function");return e},_=function(e,n){if(!(this instanceof _))return new _(e,n);Object.defineProperties(this,{__list__:{writable:!0,value:e},__context__:{writable:!0,value:n},__nextIndex__:{writable:!0,value:0}}),n&&(t(n.on),n.on("_add",this._onAdd.bind(this)),n.on("_delete",this._onDelete.bind(this)),n.on("_clear",this._onClear.bind(this)))};return Object.defineProperties(_.prototype,Object.assign({constructor:{value:_,configurable:!0,enumerable:!1,writable:!0},_next:{value:function(){var e;if(this.__list__)return this.__redo__&&(e=this.__redo__.shift())!==undefined?e:this.__nextIndex__<this.__list__.length?this.__nextIndex__++:void this._unBind()},configurable:!0,enumerable:!1,writable:!0},next:{value:function(){return this._createResult(this._next())},configurable:!0,enumerable:!1,writable:!0},_createResult:{value:function(e){return e===undefined?{done:!0,value:undefined}:{done:!1,value:this._resolve(e)}},configurable:!0,enumerable:!1,writable:!0},_resolve:{value:function(e){return this.__list__[e]},configurable:!0,enumerable:!1,writable:!0},_unBind:{value:function(){this.__list__=null,delete this.__redo__,this.__context__&&(this.__context__.off("_add",this._onAdd.bind(this)),this.__context__.off("_delete",this._onDelete.bind(this)),this.__context__.off("_clear",this._onClear.bind(this)),this.__context__=null)},configurable:!0,enumerable:!1,writable:!0},toString:{value:function(){return"[object Iterator]"},configurable:!0,enumerable:!1,writable:!0}},{_onAdd:{value:function(e){if(!(e>=this.__nextIndex__)){if(++this.__nextIndex__,!this.__redo__)return void Object.defineProperty(this,"__redo__",{value:[e],configurable:!0,enumerable:!1,writable:!1});this.__redo__.forEach(function(t,_){t>=e&&(this.__redo__[_]=++t)},this),this.__redo__.push(e)}},configurable:!0,enumerable:!1,writable:!0},_onDelete:{value:function(e){var t;e>=this.__nextIndex__||(--this.__nextIndex__,this.__redo__&&(t=this.__redo__.indexOf(e),-1!==t&&this.__redo__.splice(t,1),this.__redo__.forEach(function(t,_){t>e&&(this.__redo__[_]=--t)},this)))},configurable:!0,enumerable:!1,writable:!0},_onClear:{value:function(){this.__redo__&&e.call(this.__redo__),this.__nextIndex__=0},configurable:!0,enumerable:!1,writable:!0}})),Object.defineProperty(_.prototype,Symbol.iterator,{value:function(){return this},configurable:!0,enumerable:!1,writable:!0}),Object.defineProperty(_.prototype,Symbol.toStringTag,{value:"Iterator",configurable:!1,enumerable:!1,writable:!0}),_}();String.prototype.contains=String.prototype.includes;var ArrayIterator=function(){var e=function(t,r){if(!(this instanceof e))return new e(t,r);Iterator.call(this,t),r=r?String.prototype.contains.call(r,"key+value")?"key+value":String.prototype.contains.call(r,"key")?"key":"value":"value",Object.defineProperty(this,"__kind__",{value:r,configurable:!1,enumerable:!1,writable:!1})};return Object.setPrototypeOf&&Object.setPrototypeOf(e,Iterator.prototype),e.prototype=Object.create(Iterator.prototype,{constructor:{value:e,configurable:!0,enumerable:!1,writable:!0},_resolve:{value:function(e){return"value"===this.__kind__?this.__list__[e]:"key+value"===this.__kind__?[e,this.__list__[e]]:e},configurable:!0,enumerable:!1,writable:!0},toString:{value:function(){return"[object Array Iterator]"},configurable:!0,enumerable:!1,writable:!0}}),e}();}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

//////////////////////////////////////////////////////////
//  Global Selector
////////////////////////////////////////////////////////
function _(qurey){
	return document.querySelector(qurey)
}




var fireStoreListner = async () => {
    try{
        await db.collection(ldb.serverValue.collection).where("created","==",true)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    var fileChange = change.doc.data();
                    ldb.state = fileChange.files;
                    if(document.getElementsByTagName('button')[1]!=undefined){
                        document.getElementsByTagName('button')[1].click();
                    }
                });
            });
    }catch(err){
        console.log(`Error in FireStore Listner ${err}`)
    }
}









//////////////////////////////////////////////////////////
//  Box request Interceptor
/////////////////////////////////////////////////////////
var addExtraHeaders = (config) => {
    if(config.url=='https://api.box.com/2.0/files/content'){
        if(ldb.files.has(config.data.name)){
            console.log('conflit found!')
            return null;
        }
        if(config.data.size>98000000){
            console.log(`File ${config.data.name} is not Allowed!`)
        }else{
            return config;
        }
    }else{
        return config;
    }
};
var responseIntercept = (response) => {
    //file list set
    if(response.config.url==`https://api.box.com/2.0/folders/${ldb.serverValue.folderId}`){
        response.data.item_collection.entries.forEach(file => {
            ldb.files.add(file.name)
        })
    }
    
    if(response.status==201){
        ldb.state += 1;
        db.collection(ldb.serverValue.collection).doc(ldb.serverValue.sessionID).update({files: ldb.state});
    }
    
    return response;
}














//////////////////////////////////////////////////////////
// Change content('text') of UI
//////////////////////////////////////////////////////////
function headerListner(){
    try{
        _('.be-sub-header').removeEventListener('DOMNodeInserted',headerListner)  
        document.getElementsByTagName('button')[1].innerText = "Session Expire in -- Min";
        
        var ticker = setInterval(function() {
            var current = new Date().toISOString();
            var diff = new Date(ldb.serverValue.expire)- new Date(current)
            var currentTime = Math.round(diff/(1000*60));

            document.getElementsByTagName('button')[1].innerText = `Session Expire in ${currentTime} Min`;
            ticker
            if (currentTime<=0) {
                document.getElementsByTagName('button')[1].innerText = "EXPIRED";
                window.location = 'https://temp-upload.web.app?restart';
            }
        },1000)
    }catch(err){
        console.log(`Error in Context Handler ${err}`)
    } 
}
function containerListner(){
    _('.container01').removeEventListener('DOMNodeInserted',containerListner)
    _('.be-sub-header').addEventListener('DOMNodeInserted',headerListner)
    _('.be-search').innerHTML = ''
    var span = document.createElement('span');
    var code = document.createElement('code');
    span.className = 'sessionWrap';
    span.innerText = 'ID: ';
    code.className = 'sessionID';
    code.innerText = '@@@-@@@@-@@@';
    span.appendChild(code);
    _('.be-search').appendChild(span);

    _('.be-logo').innerHTML = '<a href=\"https://temp-upload.web.app\"><span class=\"be-logo-placeholder\">Home</span></a>'
}
_('.container01').addEventListener('DOMNodeInserted',containerListner)












let id = "2213 dfsd";

function sanitizeInput(roomId){
    let ch = ""
    let num = ""
    
    let stringMatch = roomId.split(/[^a-zA-Z]/)
    let numberMatch = roomId.split(/[^0-9]/)
    if(stringMatch[0].length > 0){
        ch = stringMatch[0]
    }else{
        ch = stringMatch[stringMatch.length-1]
    }
    if(numberMatch[0].length > 0){
        num = numberMatch[0]
    }else{
        num = numberMatch[numberMatch.length-1]
    }
    if(ch.length == 3 && num.length == 4){
        return `${ch.toUpperCase()}-${num}`
    }
    if(ch.length == 4 && num.length == 3){
        return `${num}-${ch.toUpperCase()}`
    }
    return false
}


function fixInputID(){
    const connectBtn = _("#connectRoom01")
    connectBtn.classList.add("is-disabled");
    connectBtn.disabled = true;

    const roomID = _("#roomId").value;

    if(sanitizeInput(roomID)!=false){
        document.getElementById("roomId").value = sanitizeInput(roomID);
    
        let connectBtn = _("#connectRoom01");
        connectBtn.classList.add("is-disabled");
        connectBtn.disabled = true;
        
        return true;
    }
    else{
        showErrorMessage("Incorrect format",false);
        return false;
    }
}













function showErrorMessage(message,reload){
	_('#errorText').innerText = message;
	_('#errorMessage').style.display = 'block';
    if(!reload){
        setTimeout(function(){ _('#errorMessage').style.display = 'none'; }, 4000);
    }
}