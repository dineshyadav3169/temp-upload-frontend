//////////////////////////////////////////////////
// Global Data and function
//////////////////////////////////////////////////
var ldb = {
    serverValue: 0,
    state: 1,
    files: new Set()
};







//////////////////////////////////////////////////
// Init Call Api
//////////////////////////////////////////////////
const db = firebase.firestore();
async function initApp() {
    console.log('api called');
    try{
        var response = await fetch('/api/token')
        if(response.status==200){
            var resData = await response.json()
            ldb.serverValue = await resData;
            var folderId = await resData.folderId;
            var accessToken = await resData.token;
            var contentExplorer = new Box.ContentExplorer();
            contentExplorer.clearCache();
            contentExplorer.show(folderId, accessToken, {
                container: ".container",
                canCreateNewFolder: false,
                //autoFocus: true,
                canDelete: true,
                canDownload: true,
                canShare: false,
                requestInterceptor: addExtraHeaders,
                responseInterceptor: responseIntercept
            });

            document.getElementsByTagName('body')[0].classList.add('loaded');

            setTimeout(fireStoreListner,3000)
            _('.sessionID').innerText = resData.sessionID;
        }else{
            showErrorMessage("Failed to Load, Try Again!",true)
        }
    }catch{
        showErrorMessage("Failed to connect, Try Again!",true)
    }
}
initApp()

