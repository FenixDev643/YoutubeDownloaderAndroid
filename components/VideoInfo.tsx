import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import colors from './Colors';

function VideoInfo(props : any) {
    const info = props.info;
    let Image_Http_URL ={ uri: info.thumbnails[0].url};

    return (
        <View style={styles.container}>
            <Text style={styles.author}>{info.ownerChannelName}</Text>
            <Text style={styles.title}>{info.title}</Text>
            <Image
            style={styles.thumbnail}
            source={Image_Http_URL}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 15,
        backgroundColor: colors.second,
    },
    author:{
        fontSize: 25
    },
    title: {
        fontSize: 15
    },
    thumbnail: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        borderRadius: 2
    }
});

export default VideoInfo;