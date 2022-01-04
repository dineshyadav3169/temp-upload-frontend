function _(gddyf){
	return document.getElementById(gddyf)
}

var resData = [];
var resDataMessage = [];
var refreshResData = [];
var updaterLength = [];
var messageUpdaterLength = [];
messageUpdaterLength[0] = 0;
updaterLength[0] = 0;

var resUploadData = [];
var okRes = [];

/*#######################
# Main UI Script
########################*/
_('createRoom').addEventListener("click", ()=> {
	console.log("creating room")
	_('mainUI').style.display = "none";
	_('loadingSVG').style.display = 'block';
	fetch('https://temp-upload.vercel.app/q')
		.then(response => response.json())
		.then(data => {
			if(data['status']=='error'){
				_('indicate').innerText = "Error Code Not Generated Try Again!"
				_('loadingSVG').style.display = 'none';
			}else{
				_('roomUI').style.display = "block";
				_('loadingSVG').style.display = 'none';
				_('roomid').innerText = data['idCode'] ;
				resData.push(data);
				
				createRefreshData();
			}
		});
});

_('joinRoom').addEventListener("click", ()=> {
	_('mainUI').style.display = "none";
	_('joinUI').style.display = 'inline-grid';
	
});

/*#######################
# Join UI Script
########################*/



function tick() {
	canvasElement.height = video.videoHeight;
	canvasElement.width = video.videoWidth;
	canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

	scanning && requestAnimationFrame(tick);
}


function scan() {
	try {
		qrcode.decode();
	} catch (e) {
		setTimeout(scan, 300);
	}
}
const video = document.createElement("video");
const canvasElement = _("qr-canvas");
const canvas = canvasElement.getContext("2d");

const outputData = _("joinInput");
const btnScanQR = _("btn-scan-qr");

let scanning = false;

qrcode.callback = (res) => {
	if (res) {
	outputData.value = res;
	_('joinBtn').click()
	scanning = false;

	video.srcObject.getTracks().forEach(track => {
		track.stop();
	});

	btnScanQR.hidden = false;
	canvasElement.hidden = true;
	}
};

btnScanQR.onclick = () =>
	navigator.mediaDevices
	.getUserMedia({ video: { facingMode: "environment" } })
	.then(function(stream) {
		scanning = true;
		btnScanQR.hidden = true;
		canvasElement.hidden = false;
		video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
		video.srcObject = stream;
		video.play();
		tick();
		scan();
	});


/*#######################
# Reload Script
########################*/
var counterI0 = 1;
function refreshData(){//for Join Script
	setTimeout(function(){
		fetch(`https://temp-upload.vercel.app/w?roomCode=${_('joinInput').value}`)
		.then(response => response.json())
		.then(data => {
			if(data['status']=='error'){
				_('indicate').innerText = "Error Invalid Code!";
			}else{
				refreshResData[0] = data;
				if(refreshResData[0]["roomData"]["allFile"] != undefined){
					var updater = refreshResData[0]["roomData"]["allFile"];
					if(updater.length > updaterLength[0]){
						updateFilesOnUI(updater);
					}
				}
				if(refreshResData[0]["roomData"]["message"] != undefined){
					var updater1 = refreshResData[0]["roomData"]["message"];
					if(updater1.length > messageUpdaterLength[0]){
						updaterChatOnUI(updater1);
					}
				}
			}
		});
		counterI0++;
		if (counterI0 < 10000) {
			refreshData();
		}  
	}, 3000);
}
function createRefreshData(){//for Create Room Script
	setTimeout(function(){
		fetch(`https://temp-upload.vercel.app/w?roomCode=${_('roomid').innerText}`)
		.then(response => response.json())
		.then(data => {
			if(data['status']=='error'){
				_('indicate').innerText = "Error Invalid Code!";
			}else{
				refreshResData[0] = data;
				if(refreshResData[0]["roomData"]["allFile"] != undefined){
					var updater = refreshResData[0]["roomData"]["allFile"];
					if(updater.length > updaterLength[0]){
						updateFilesOnUI(updater);
					}
				}
				if(refreshResData[0]["roomData"]["message"] != undefined){
					var updater1 = refreshResData[0]["roomData"]["message"];
					if(updater1.length > messageUpdaterLength[0]){
						updaterChatOnUI(updater1);
					}
				}
			}
		});
		counterI0++;
		if (counterI0 < 10000) {
			createRefreshData();
		}  
	}, 3000);
}


_('joinBtn').addEventListener("click", ()=> {
	_('joinUI').style.display = 'none';
	if(_('joinInput').value.length == 12){
		_('loadingSVG').style.display = 'block';
		fetch(`https://temp-upload.vercel.app/w?roomCode=${_('joinInput').value.toUpperCase()}`)
		.then(response => response.json())
		.then(data => {
			if(data['status']=='error'){
				_('indicate').innerText = "Error Invalid Code!";
				okRes.push(0);
			}else{
				_('loadingSVG').style.display = 'none';
				_('roomUI').style.display = "block";
				_('roomid').innerText = _('joinInput').value ;
				resData.push(data);
				if(resData[0]["roomData"]["allFile"] != undefined){
					var updater = resData[0]["roomData"]["allFile"];
					if(resData[0]['status'] === 'ok'){
						updateFilesOnUI(updater);
					}
				}
				if(resData[0]["roomData"]["message"] != undefined){
					var updater1 = resData[0]["roomData"]["message"];
					if(updater1.length > messageUpdaterLength[0]){
						updaterChatOnUI(updater1);
					}
				}
				refreshData();
			}
		});
	}else{
		_('indicate').innerText = "Error Code not Complete!"
	}
});

_('qrCode').addEventListener('click', ()=>{
	_('qrcodeImage').style.display = 'block';
	if(document.getElementsByClassName('popModal-header')[0].childElementCount==2){
		var img = document.createElement('img');
		img.src = `http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=${resData[0]['idCode']}&chld=H|0`;
		img.alt = 'QR Code';
		document.getElementsByClassName('popModal-header')[0].append(img)
	}
});

/*_('downloadBtns').addEventListener('click', ()=>{
	console.log('downloading...')
	_('uploader').style.width = '100%';
});*/

function updateFilesOnUI(updater){
	_('noFileFound').style.display = 'none';
	updaterLength[0] = updater.length;
	
	if(updater == undefined) return;
	var totalRowFiles = document.getElementsByClassName('row').length || 0;
	if(updater.length>totalRowFiles){
		var diff = updater.length - totalRowFiles;
		var diffr = diff;
		for(i=0;i<diff;i++){
		
			var selectedFile = updater[updater.length-diffr];
			
			var row = document.createElement('div')
			row.className = 'row';
			var leftcolumn = document.createElement('div')
			leftcolumn.className = 'leftcolumn';
			var filesFile = document.createElement('div')
			filesFile.className = 'filesFile';
			var rightcolumn = document.createElement('div')
			rightcolumn.className = 'rightcolumn';
			var i = document.createElement('i');
			i.className = 'material-icons icon';
			i.innerText = getFileIcon(selectedFile['ogname']);
			var div = document.createElement('div')
			div.style.display = 'grid';
			var fileNames = document.createElement('label');
			fileNames.className = 'fileNames';
			fileNames.innerText = shortFileName(selectedFile['ogname']);
			var filesizeDisplay = document.createElement('label');
			filesizeDisplay.className = 'filesizeDisplay';
			filesizeDisplay.innerText = 'SIZE: '+selectedFile['size'];
			var img = document.createElement('img');
			img.src = 'file_download_black.svg';
			img.className = 'downloadBtn';
			img.id = 'downloadBtns';
			img.height = '40';
			img.width = '40';
			
			var aLink = document.createElement('span');
			aLink.addEventListener( 'click', function(){
				var a = document.createElement('a');
				a.href = `https://crongoingtocloud.herokuapp.com/t?enfile=${selectedFile['enfile']}&ogname=${selectedFile['ogname']}`;
				a.click();
			});
			
			
			
			div.append(fileNames);
			div.append(filesizeDisplay);
			filesFile.append(i);
			filesFile.append(div);
			leftcolumn.append(filesFile);
			aLink.append(img);
			rightcolumn.append(aLink);
			row.append(leftcolumn);
			row.append(rightcolumn);
			
			document.getElementsByClassName('files')[0].append(row);
			
			diffr = diffr - 1;
		}
	}
}

function getFileIcon(filename){
	var fileArray = filename.split('.');
	var fileExtension = fileArray[fileArray.length-1].toUpperCase();
	
	switch (fileExtension) {
		case 'JPG':
			return 'image';
			break;
		case 'PNG':
			return 'image';
			break;
		case 'JPEG':
			return 'image';
			break;
		case 'GIF':
			return 'gif';
			break;
		case 'PDF':
			return 'picture_as_pdf';
			break;
		case 'TXT':
			return 'text_snippet';
			break;
		case 'png':
			return 'image';
			break;
		default:
			return 'insert_drive_file';
	}
}

function makeHash(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
function getFileName(fileName){
	var hash = makeHash(10);
	var timeDate = new Date().getTime();
	var newS = '';
	for(i=0;i<=9;i++){
		newS = newS + timeDate.toString()[i]+hash[i]
	}
	return newS +'.'+ fileName.split('.')[fileName.split('.').length-1]
}

function shortFileName(filename){
	var fileArray = filename.split('.');
	var fileExtension = fileArray[fileArray.length-1]
	
	var shortName = '';
	if(filename.length>11){
		shortName = shortName + filename.slice(0,6) + '-.' + fileExtension;
	}else{
		shortName = filename;
	}
	return shortName;
}


function FileSizeKM(fileSizeLength, fileSize){
	switch(fileSizeLength){
		case 2:
			return String(fileSize).split('.')[0] + 'K';
			break;
		case 3:
			return String(fileSize).split('.')[0] + 'K';
			break;
		case 4:
			return String(fileSize/1024).split('.')[0] + 'MB';
			break;
		default:
			return String(fileSize).split('.')[0] + 'K';
	}
}

function updaterChatOnUI(updater){
	
	messageUpdaterLength[0] = updater.length;

	if(updater == undefined) return;
	var totalRowFiles = document.getElementsByClassName('messageChatUi').length;
	if(updater.length>totalRowFiles){
		var diff = updater.length - totalRowFiles;
		var diffr = diff;
		for(i=0;i<diff;i++){
			
			var div = document.createElement('div');
			div.style.display = 'flex';
			div.style.background = '#b4e0ff';
			div.style.overflow = 'hidden';
			div.className = 'messageChatUi';
			div.style.marginBottom = '1px'
			var label = document.createElement('label');
			label.className = 'fileNames';
			label.style.top = '0';
			label.style.position = 'initial';
			
			label.innerText = updater[updater.length-diffr]['chatMessage'];
			
			div.append(label);
			document.getElementsByClassName('files')[0].append(div);
			
			diffr = diffr - 1;
		}
	}
}

_('text-input').addEventListener('click', function(){
	_('text-input').style.width = '85%';
})
_('text-input').addEventListener('focusout', function(){
	_('text-input').style.width = '9%';
})
_('text-input').addEventListener('keypress', function(event){
	if (event.keyCode == 13) {
	event.preventDefault();
	console.log('message')
	if(_('text-input').value.length>0){
		
		fetch(`https://temp-upload.vercel.app/y?idCode=${_('roomid').innerText}&message=${_('text-input').value}`)
		.then(response => response.json())
		.then(data => {
			if(data['status']=='ok'){
				resDataMessage[0] = data;
				var updater = resDataMessage[0]["roomData"]["message"];
				if(updater.length > messageUpdaterLength[0]){
					updaterChatOnUI(updater);
				}
			}
		});
		_('text-input').value = '';
	}
	}
})

_('file-input').addEventListener('change', function(e){
	var file = e.target.files[0];
	var upload_file_name = getFileName(file.name)
	console.log(upload_file_name)
	var fileSize = file.size/1024;
	var fileSizeLength = String(fileSize).split('.')[0].length
	var finalFileSIze  = FileSizeKM(fileSizeLength, fileSize)
	fetch(`https://temp-upload.vercel.app/e?idCode=${_('roomid').innerText}&size=${finalFileSIze}&enfile=${upload_file_name}&ogfile=${file.name}`)
		.then(response => response.json())
		.then(data => {
			if(data['status']=='ok'){
				resUploadData.push(data);
			}
		});
	var storageRef =  firebase.storage().ref(upload_file_name);
	var task = storageRef.put(file);
	uploader.style.width = '20%';

	task.on('state_change',
		function progress(snapshot){
			var percentage = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
			uploader.style.width = percentage+'%';
			
			if(uploader.style.width=='100%'){
				uploader.style.width = '0%';
				//updateFilesOnUI(resUploadData);
			}
			
			
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
			}
		},
		function error(err){

		},
		function complete(){
			
		
		}

	
	)
})