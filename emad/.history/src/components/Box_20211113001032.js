import React from "react";
import { StyleSheet, Image, ImageBackground, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient';

const Box = (props) => {
    return(
        <TouchableOpacity activeOpacity={.6} style={{ padding: 15, paddingTop: 5,flexBasis: '50%' }} onPress={() => navigation.navigate('Client')}>
        <LinearGradient
              start={{x: 0.25, y: 1}} end={{x: 0.75, y: 0}}
              colors={['#20b4f2','#245cde']}
              style={[styles.userCard,{ padding: 15 }]}>
              <View style={[styles.dot_button, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
              </View>
          </LinearGradient>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    
    userCard: {
        marginRight: 'auto',
        width: '50%',
        height: 200,
        borderRadius: 20,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 0
      },
      cardTitle: {
        paddingTop: 20,
        paddingBottom: 10,
        textAlign: 'left',
        color: "white",
        fontSize: 25,
        fontWeight: '700',
        fontFamily: 'System',
    },  
    dot_button: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginLeft: 'auto',
        marginTop: 0,
        height: 30,
        width: 30,
        borderRadius: 20
      },

});


export default Box;