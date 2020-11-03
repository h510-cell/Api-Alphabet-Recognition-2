import React from 'react';
import {Button,Image,View,Platform} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
export default class PickImage extends React.Component{
state = {
image = null,
}
render(){
let {image} = this.state;
return(
<View style = {{flex:1,justifyContent:"center",alignItems:"center"}}>
<Button
title = "Pick An Image From The Camera Roll"
onPress={this._pickImage}
/>
</View>
);
}
componentDidMount(){
this.getPermissionAsync();
}
getPermissionAsync = async () => {
if(Platform.OS !== "web") {
const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
if(status !== "granter") {
alert("Sorry , We Need Camera Roll Permissions To Make This Work!")
}
}
};
uploadImage = async (uri) => {
const Data = new FormData();
let FileName = uri.split("/")[uri.split("/").length - 1]
let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
const fileToUpload = {
uri : uri,
name : FileName,
type : type
}
Data.append("digit",fileToUpload) ;
fetch("https://f292a3137990.ngrok.io/predict-digit", {
method : "Post",
body : Data,
headers : {
 "content-type" : "multipart/form-data"
},
})
.then((response) => response.json())
.then((result) => {
console.log("Success",result);
})
.catch((error)=>{
console.error("Error",error);
})
}
_pickImage = async() =>{
try{
let result = await ImagePicker.launchImageLibraryAsync({
mediaTypes : ImagePicker.MediaTypeOptions.All,
allowsEditing : true,
aspect : [4,3],
quality : 1
})
if(!result.cancelled){
this.setState({ image : result.Data});
console.log(result.uri)
this.uploadImage(result.uri)
}
} catch (E) {
console.log(E);
}
}
}