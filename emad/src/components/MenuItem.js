import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from 'react-native-vector-icons/Ionicons'
import Divider from "./Divider";
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

const MenuItem = (props) => {

    const {colors, isDark} = useTheme();

    if (props.type === 'fixed') {
        colors.backbutton.color = 'white';
    }

    let [fontsLoaded] = useFonts({
        'SFProDisplayMedium': require('../../assets/fonts/SFProDisplayMedium.otf'),
        'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
        'SFProDisplayUltraLightItalic': require('../../assets/fonts/SFProDisplayUltraLightItalic.otf')
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <TouchableOpacity activeOpacity={.75} onPress={props.onPress} style={{ width: "75%", height: 48, alignSelf: "center" }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: colors.theme.primary, fontFamily: "SFProDisplayMedium", paddingBottom: 12 }}>{props.title}</Text>
                    <Icon name="chevron-forward-outline" size={20} color={colors.theme.primary} style={{ alignSelf: 'flex-end', paddingBottom: 12}} />
                </View>
                <Divider width={"100%"} />
            </TouchableOpacity>
        )
    }
};

export default MenuItem;