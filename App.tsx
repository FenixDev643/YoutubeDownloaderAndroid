/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View,
PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import ytdl from 'react-native-ytdl'
import RNFetchBlob from 'rn-fetch-blob'
import colors from './components/Colors';
import VideoInfo from './components/VideoInfo';
import MessageModal from './components/MessageModal';

const App = () => {
  // video information //
  const [VideoURL, setVideoURL] = useState('');
  const [videoInfo, setVideoInfo] = useState();
  var url360:any;
  var url720:any;
  var url1080:any;

  // download Button //
  const [DownloadDisabled,setDownloadDisabled] = useState([false,true,true]);
  const [DownloadColor,setDownloadColor] = useState([colors.mainLight,colors.mainLight,colors.mainLight]);
  const [DownloadBorderColor,setDownloadBorderColor] = useState([colors.mainLightBorder,colors.mainLightBorder,colors.mainLightBorder]);
  const [LoadingCircle, setLoadingCircle] = useState(false);

  useEffect(() => {
    DownloadDisabled.map((disabledObject : boolean, disabledIndex :number) => {
      if(disabledObject){
        setDownloadColor(DownloadColor.map((object,index: number) => {
          if(index === disabledIndex){
            object = colors.mainLight;
          }
          return object;
        }));
        setDownloadBorderColor(DownloadBorderColor.map((object,index: number) => {
          if(index === disabledIndex){
            object = colors.mainLightBorder;
          }
          return object;
        }));
      }
      else{
        setDownloadColor(DownloadColor.map((object,index: number) => {
          if(index === disabledIndex){
            object = colors.main;
          }
          return object;
        }));
        setDownloadBorderColor(DownloadBorderColor.map((object,index: number) => {
          if(index === disabledIndex){
            object = colors.mainBorder;
          }
          return object;
        }));
      }
    })
  }, [DownloadDisabled])

  // Message Modal //
  const [messageModalVisible,setMessageModalVisible] = useState(false);
  const [messageModalSend, setMessageModalSend] = useState('');

  // on change video input //
  const onChangeVideoInput = async (text : any) => {
    setVideoURL(text);
    setLoadingCircle(true);
    if(ytdl.validateURL(text)){
      let info = await ytdl.getInfo(text);
      try {
        url360 = await ytdl(VideoURL, { filter: (format:any) => format.itag === 18 });
      } catch (error) {}
      try {
        url720 = await ytdl(VideoURL, { filter: (format:any) => format.itag === 22 });
      } catch (error) {}
      try {
        url1080 = await ytdl(VideoURL, { filter: (format:any) => format.itag === 37 });
      } catch (error) {}
      setDownloadDisabled([false,true,true]);
      setLoadingCircle(false);
      setVideoInfo(info.videoDetails);
    }else{
      setLoadingCircle(false);
      setVideoInfo(undefined);
      setDownloadDisabled([true,true,true]);
    }
    console.log("Download Disabled: ",DownloadDisabled);
  }

  // download functions //
  const checkPermission = async (videoQuality: string) => {
    if(Platform.OS === 'ios'){
      Download(videoQuality);
    } else{
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          Download(videoQuality);
        }else{
          setMessageModalSend('se necesitan permisos de almacenamiento para descargar videos');
          setMessageModalVisible(true);
        }
      } catch (error){
        console.warn(error);
      }
    }
  }

  const Download = async (videoQuality: string) => {
    if(!ytdl.validateURL(VideoURL)){
      setMessageModalSend('no se pudo encontrar ningun video con la url que pusiste');
      setMessageModalVisible(true);
      return;
    }
    setLoadingCircle(true);

    let info : any = videoInfo;
    let VideoName = info.title;
    let realURL;
    if(videoQuality === '360p'){
      realURL = url360[0].url;
    }
    else if(videoQuality === '720p'){
      realURL = url720[0].url;
    }
    else if(videoQuality === '1080p'){
      realURL = url1080[0].url;
    }
    const {config, fs} = RNFetchBlob;
    let DownloadDir = fs.dirs.MovieDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: DownloadDir + '/' + VideoName + '.mp4',
        description: 'descargando el video'
      }
    }
    config(options).fetch('GET', realURL).then(res => {
      setLoadingCircle(false);

      setDownloadDisabled([true,true,true]);
      setMessageModalSend('video descargado correctamente');
      setMessageModalVisible(true);
    })
  }

  return (
    <View style={styles.container}>
      <MessageModal setModalVisible={setMessageModalVisible} 
      modalVisible={messageModalVisible} message={messageModalSend}/>

      {/* Content */}
      <View style={styles.content}>

        {/* Title */}
        <View style={styles.titleBox}>
          <Image
          style={styles.logo}
          source={require('./images/YTlogo.png')}/>
          <Text 
          style={[styles.text,styles.title]}>Youtube Downloader</Text>
        </View>
        {/* Title */}

        {/* submit */}
        <TextInput
        style={styles.textInput}
        placeholder='url de tu video'
        onChangeText={onChangeVideoInput}/>

        {LoadingCircle ? <ActivityIndicator size="large" color={colors.second} /> : null}
        {videoInfo ? <VideoInfo info={videoInfo}/> : null}

        {/* Download Buttons list */}
        <View style={styles.downloadList}>
          <TouchableOpacity
          style={[styles.button,{borderColor: DownloadBorderColor[0], backgroundColor: DownloadColor[0]}]}
          disabled={DownloadDisabled[0]}
          onPress={() => {checkPermission('360p')}}>
            <Text 
            style={[styles.text,{fontSize:18}]}>Descargar 360p</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={[styles.button,{borderColor: DownloadBorderColor[1], backgroundColor: DownloadColor[1]}]}
          disabled={DownloadDisabled[1]}
          onPress={() => {checkPermission('720p')}}>
            <Text 
            style={[styles.text,{fontSize:18}]}>Descargar 720p</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={[styles.button,{borderColor: DownloadBorderColor[2], backgroundColor: DownloadColor[2]}]}
          disabled={DownloadDisabled[2]}
          onPress={() => {checkPermission('1080p')}}>
            <Text 
            style={[styles.text,{fontSize:18}]}>Descargar 1080p</Text>
          </TouchableOpacity>
        </View>
        {/* Download Buttons list */}

        {/* submit */}

      </View>
      {/* Content */}

    </View>
  );
};

const styles = StyleSheet.create({
  // content //
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  content : {
    backgroundColor: colors.bgDark,
    width: '90%',
    height: '95%',
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  // content //

  // title //
  titleBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color:colors.title,
  },
  logo: {
    width: 100,
    height: 80,
    resizeMode: 'contain'
  },
  // title //

  // download list //
  downloadList : {
    width: '50%',
    height: '25%',
    borderRadius: 8,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  // download list //

  // Defaults //
  text: {fontFamily: 'youtube_font'},
  textInput: {backgroundColor: colors.second, width: '90%', 
  paddingLeft: 10, borderRadius: 8, fontFamily: 'youtube_font', fontSize: 18},
  button: {padding: 15, borderRadius: 8, borderWidth: 3, alignItems: 'center'}
  // Defaults //
})

export default App;
