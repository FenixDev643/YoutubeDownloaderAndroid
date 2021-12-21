import React, { useRef } from 'react'
import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import colors from './Colors';

function VideoInfo(props : any) {
    const info = props.info;
    let Image_Http_URL ={ uri: info.thumbnails[3].url};

    const ScaleXanim : any = useRef(new Animated.Value(0.5)).current;
    const ScaleX = () => {
      Animated.spring(ScaleXanim,{
        toValue:1,
        friction:4,
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

    return (
        <View style={styles.container}>
            <Animated.Text 
            style={[styles.author,{opacity: FadeAnim}]}>{info.ownerChannelName}</Animated.Text>
            <Animated.Text 
            style={[styles.title,{opacity: FadeAnim}]}>{info.title}</Animated.Text>
            <Animated.Image
            style={[styles.thumbnail,{transform: [{scaleX: ScaleXanim}]}]}
            source={Image_Http_URL}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '90%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        borderRadius: 15,
        backgroundColor: colors.second,
    },
    author:{
        fontSize: 20
    },
    title: {
        fontSize: 20,
        fontWeight: '600'
    },
    thumbnail: {
        width: '90%',
        height: '60%',
        resizeMode: 'contain',
        borderRadius: 3
    }
});

export default VideoInfo;