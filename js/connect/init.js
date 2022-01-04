//////////////////////////////////////////////////
// Global Data and function
//////////////////////////////////////////////////
var ldb = {
    serverValue: 0,
    state: 3,
    files: new Set()
};







//////////////////////////////////////////////////
// Init Call Api
//////////////////////////////////////////////////
const db = firebase.firestore();
async function initApp(roomID) {
    try{    
        var response = await fetch(`/api/connect?roomID=${roomID}`)
        if(response.status==200){
            var resData = await response.json()
            _('#inputRoomKey').style.display = 'none';
            ldb.serverValue = await resData;
            var folderId = await resData.folderId;
            var accessToken = await resData.token;
            var contentExplorer = new Box.ContentExplorer();
            contentExplorer.clearCache();
            contentExplorer.show(folderId, accessToken, {
                container: ".container01",
                canCreateNewFolder: false,
                //autoFocus: true,
                canDelete: true,
                canDownload: true,
                canShare: false,
                requestInterceptor: addExtraHeaders,
                responseInterceptor: responseIntercept
            });


            setTimeout(fireStoreListner,500)
            
            _('.sessionID').innerText = resData.sessionID; //set id on ui
        }else{
            console.log("Invalid room ID");
            showErrorMessage("Invalid Room ID",false);
            
            document.location.reload()
            const connectBtn = _("#connectRoom01")
            connectBtn.classList.remove("is-disabled");
            connectBtn.disabled = false;
        
        }
    }catch(err){
        console.log(err);
        showErrorMessage("Error !");

        document.location.reload()
        const connectBtn = _("#connectRoom01")
        connectBtn.classList.remove("is-disabled");
        connectBtn.disabled = false;
        
    }
}






_("#connectRoom01").addEventListener('click', function(event){
    event.preventDefault();

    if(fixInputID()){
        document.getElementById("connectRoom01").innerHTML = '<svg class="motion-reduce:hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="gray" stroke-width="4"></circle><path class="opacity-75" fill="#38bdf8" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        const roomID = _("#roomId").value;
        initApp(roomID)
    }
})




_('#roomId').addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        
        if(fixInputID()){
            document.getElementById("connectRoom01").innerHTML = '<svg class="motion-reduce:hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="gray" stroke-width="4"></circle><path class="opacity-75" fill="#38bdf8" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
            const roomID = _("#roomId").value;
            initApp(roomID)
        }
    }
});
