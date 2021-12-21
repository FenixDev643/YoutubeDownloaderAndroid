/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View,
PermissionsAndroid, Platform, ActivityIndicator, Animated } from 'react-native';
import ytdl from 'react-native-ytdl'
import RNFetchBlob from 'rn-fetch-blob'
import colors from './components/Colors';
import VideoInfo from './components/VideoInfo';
import MessageModal from './components/MessageModal';

const App = () => {
  // video information //
  const [VideoURL, setVideoURL] = useState('');
  const [videoInfo, setVideoInfo] = useState();
                                    // url, format //
  const [url360, setUrl360] : any = useState([]);
  const [url720, setUrl720] : any = useState([]);
  const [url1080,setUrl1080] : any = useState([]);
  const [urlAudio,setUrlAudio] : any = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  // video information //

  // animations //
  const ScaleXanim : any = useRef(new Animated.Value(0)).current;
  const ScaleX = () => {
    Animated.spring(ScaleXanim,{
      toValue:1,
      friction:2,
      tension:15,
      useNativeDriver:true
    }).start();
  }
  const FadeAnim : any = useRef(new Animated.Value(0)).current;
  const FadeIn = () => {
    let config : any = {
      duration: 1000,
      toValue: 1,
    }
    Animated.timing(FadeAnim,config).start();
  }
  const LoadAnimations = () => {
    ScaleX();
    FadeIn();
  }
  LoadAnimations();
  // animations //

  // download buttons //
  const [downloadDisabled, setDownloadDisabled] = useState(true);
  const [showDownloadButtons, setShowDownloadButtons] = useState(false);
  const [LoadingCircle, setLoadingCircle] = useState(false);
  // download buttons //

  // Message Modal //
  const [messageModalVisible,setMessageModalVisible] = useState(false);
  const [messageModalSend, setMessageModalSend] = useState('');
  // Message Modal //

  // reset all information and buttons //
  const resetAll = () => {
    setUrl360([]);
    setUrl720([]);
    setUrl1080([]);
    setUrlAudio([]);
    setCurrentUrl('');
    setLoadingCircle(false);
    setDownloadDisabled(true);
    setVideoInfo(undefined);
  }
  // reset all information and buttons //

  // on change current url //
  useEffect(() => {
    if(currentUrl != ''){
      checkPermission();
    }
  }, [currentUrl])
  // on change current url //

  // on change video input //
  const onChangeVideoInput = async (text : any) => {
    setVideoURL(text);
    setLoadingCircle(true);
    if(ytdl.validateURL(text)){
      let info = await ytdl.getInfo(text);
      try {
        var url360 = await ytdl(text, { filter: (format:any) => format.itag === 18 });
        var format = 'mp4';
        setUrl360([url360[0].url,format]);
      } catch (error) {console.log('error on get 360p version: ', error);}
      try {
        var url720 = await ytdl(text, { filter: (format:any) => format.itag === 22 });
        var format = 'mp4';
        setUrl720([url720[0].url,format]);
      } catch (error) {console.log('error on get 720p version: ', error);}
      try {
        var url1080 = await ytdl(text, { filter: (format:any) => format.itag === 137 });
        var format = 'mp4';
        setUrl1080([url1080[0].url,format]);
      } catch (error) {console.log('error on get 1080p version: ', error);}
      try {
        var urlAudio = await ytdl(text, { filter: 'audioonly' });
        var format = 'mp3';
        setUrlAudio([urlAudio[0].url,format]);
      } catch (error) {console.log('error on get audio version: ', error);}
      setLoadingCircle(false);
      setDownloadDisabled(false);
      setVideoInfo(info.videoDetails);
    }else{
      resetAll();
    }
  }
  // on change video input //

  // download functions //
  const checkPermission = async () => {
    if(Platform.OS === 'ios'){
      Download();
    } else{
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          Download();
        }else{
          setMessageModalSend('se necesitan permisos de almacenamiento para descargar videos');
          setMessageModalVisible(true);
        }
      } catch (error){
        console.warn(error);
      }
    }
  }

  const Download = async () => {
    if(!ytdl.validateURL(VideoURL)){
      setMessageModalSend('no se pudo encontrar ningun video con la url que pusiste');
      setMessageModalVisible(true);
      return;
    }
    setLoadingCircle(true);

    let info : any = videoInfo;
    let VideoName = info.title;
    let videoResolution;
    if(currentUrl == url360){
      videoResolution = '360p';
    }else if(currentUrl == url720){
      videoResolution = '(720p HD)';
    }else if(currentUrl == url1080){
      videoResolution = '(1080p HD)';
    }else if(currentUrl == urlAudio){
      videoResolution = '(Audio 160k)';
    }
    let format = currentUrl[1];
    
    const {config, fs} = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${DownloadDir}/${VideoName} ${videoResolution}.${format}`,
        description: 'descargando el video'
      }
    }
    config(options).fetch('GET', currentUrl[0]).then(res => {
      resetAll();

      setMessageModalSend('video descargado correctamente');
      setMessageModalVisible(true);
    })
  }
  // download functions //

  return (
    <View style={styles.container}>
      <MessageModal setModalVisible={setMessageModalVisible} 
      modalVisible={messageModalVisible} message={messageModalSend}/>

      {/* Content */}
      <View style={[styles.content,{flex: showDownloadButtons ? 2 : 10}]}>

        {/* Title */}
        <View style={styles.titleBox}>
          <Animated.Image
          style={[styles.logo,{transform: [{scaleX: ScaleXanim}]}]}
          source={require('./images/YTlogo.png')}/>
          <Animated.Text 
          style={[styles.text,styles.title,{ opacity: FadeAnim }]}>Youtube Downloader</Animated.Text>
        </View>
        {/* Title */}

        {/* submit */}
        <TextInput
        style={styles.textInput}
        placeholder='url de tu video'
        onChangeText={onChangeVideoInput}/>

        {LoadingCircle ? <ActivityIndicator size="large" color={colors.second} /> : null}
        {videoInfo ? <VideoInfo info={videoInfo}/> : null}
        {/* submit */}

      </View>
      {/* Content */}

        {/* Download Buttons list */}
        <Animated.ScrollView 
        style={[styles.downloadList,
        {backgroundColor: downloadDisabled ? colors.mainLight : colors.main},
        {transform: [{scaleX: ScaleXanim}]}]}>
          <TouchableOpacity
            style={styles.button}
            disabled={downloadDisabled}
            onPress={() => {setShowDownloadButtons(!showDownloadButtons);}}>
              <Animated.Text
              style={[styles.text,{fontSize:18, opacity: FadeAnim}]}>Descargar</Animated.Text>
          </TouchableOpacity>
          {downloadDisabled == false ? 
          <>
            {showDownloadButtons == true ? 
            <>
            {url360[0] ? 
            <TouchableOpacity
            style={styles.button}
            disabled={false}
            onPress={() => setCurrentUrl(url360)}>
              <Text 
              style={[styles.text,{fontSize:18}]}>360p</Text>
            </TouchableOpacity> : null}
            {url720[0] ? 
            <TouchableOpacity
            style={styles.button}
            disabled={false}
            onPress={() => setCurrentUrl(url720)}>
              <Text 
              style={[styles.text,{fontSize:18}]}>720p HD</Text>
            </TouchableOpacity>
            : null}
            {url1080[0] ? 
            <TouchableOpacity
            style={styles.button}
            disabled={false}
            onPress={() => setCurrentUrl(url1080)}>
              <Text 
              style={[styles.text,{fontSize:18}]}>1080p HD</Text>
            </TouchableOpacity>
              : null}
            {urlAudio[0] ? 
            <TouchableOpacity
            style={styles.button}
            disabled={false}
            onPress={() => setCurrentUrl(urlAudio)}>
              <Text 
              style={[styles.text,{fontSize:18}]}>Audio 160k</Text>
            </TouchableOpacity>
              : null}
            </> 
            : null}
          </>
          : null}
        </Animated.ScrollView>
        {/* Download Buttons list */}
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
    height: '100%',
    paddingVertical: 20
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

  downloadList: {
    flex: 1,
    width: '90%',
    borderRadius: 10,
    marginTop: 10,
  },

  // Defaults //
  text: {fontFamily: 'youtube_font'},
  textInput: {backgroundColor: colors.second, width: '90%', 
  paddingLeft: 10, borderRadius: 8, fontFamily: 'youtube_font', fontSize: 18},
  button: {padding: 15,
    alignItems: 'center',}
  // Defaults //
})

export default App;