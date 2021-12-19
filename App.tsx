/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View,
PermissionsAndroid, Platform } from 'react-native';
import ytdl from 'react-native-ytdl'
import RNFetchBlob from 'rn-fetch-blob'

const colors = {
  main: '#D92825',
  second: '#25D95E',
  bg: '#555454',
  bgDark: '#4b4b4b',
  title: '#282828'
}

const App = () => {
  const [VideoURL, setVideoURL] = useState('');

  const checkPermission = async () => {
    if(Platform.OS === 'ios'){
      Download();
    } else{
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          Download();
        }else{
          Alert.alert('permisos necesarios','se necesitan permisos de almacenamiento para descargar videos')
        }
      } catch (error){
        console.warn(error);
      }
    }
  }

  const Download = async () => {
    if(!ytdl.validateURL(VideoURL)){
      Alert.alert(
        'video no encontrado',
        'no se pudo encontrar ningun video con la url que pusiste');
    }
    const url = await ytdl(VideoURL, { filter: (format:any) => format.itag === 18 });
    let info = await ytdl.getInfo(VideoURL);
    let VideoName = info.videoDetails.title;
    let realURL = url[0].url;
    let ext = getExtention(realURL);
    ext = '.' + ext[0];
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
      Alert.alert('video descargado','video descargado correctamente');
    })
  }

  const getExtention : any = (filename: string) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined
  }

  return (
    <View style={styles.container}>

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
        onChangeText={text => setVideoURL(text)}/>

        <TouchableOpacity
        style={styles.button}
        onPress={checkPermission}>
          <Text 
          style={[styles.text,{fontSize:18}]}>Descargar</Text>
        </TouchableOpacity>
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

  // Defaults //
  text: {fontFamily: 'youtube_font'},
  textInput: {backgroundColor: colors.second, width: '90%', 
  paddingLeft: 10, borderRadius: 8, fontFamily: 'youtube_font', fontSize: 18},
  button: {backgroundColor: colors.main, padding: 15, borderRadius: 10, 
    width: '50%', alignItems: 'center'}
  // Defaults //
})

export default App;
