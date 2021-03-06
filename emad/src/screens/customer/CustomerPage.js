import React, { useState,useEffect  } from "react";
import { Image, View, Text, ScrollView, useWindowDimensions } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from "../../theme/ThemeProvider";
import BackButton from "../../components/BackButton";
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Divider from "../../components/Divider";
import MenuItem from "../../components/MenuItem";
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Svg, Text as TextSVG, Rect } from 'react-native-svg';
import { getCliente, getTotaleOrdini,getLastOrdini } from "../../back/connect";
import { useLanguage } from "../../localization/Localization";
import moment from 'moment';
import 'moment/locale/it';



const CustomerPage = ({ navigation, route }) => {
    var data1 = [
        [1660, 2222,2123,400,2123,1111],
        [1130,16100,1300,1450,14400,2400]
    ]
    var data2 = [
        [1,3,2,0,3,2],
        [1,8,2,1,6,2]
    ]
    var data3 = [
        [5,12,1,3,4,1],
        [1,11,6,2,7,4]
    ]
    var data4 = [
        [19,34,26,12,9],
        [30,9,38,18,5]
    ]
    const [lang, setLanguage] = useLanguage();

    moment.locale(lang.codice)
    const mesi=lang.locale.monthNamesShort;
    const actualMonth= (new Date()).getMonth()
    /* Da 0 a 6 Funziona */
    const lab =(actualMonth<6)? mesi.slice(actualMonth+6, 12).concat(mesi.slice(0, actualMonth))
    :mesi.slice(actualMonth-6, 6).concat(mesi.slice(6, actualMonth));
    let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
    useEffect(()=>{
        setCliente(costumers.find(us => us.id === route.params.cliente))
    })
    const acquisti = getTotaleOrdini(route.params.cliente);
    var time = new Date;
    time.setHours(0,0,0,0)
    const lastAcquisti = getLastOrdini(route.params.cliente, time);
    const costumers = getCliente();
    const utente =route.params.user
    const layout = useWindowDimensions();

    const FirstRoute = () => (
        <View style={{ justifyContent: 'center' }}>
            <LineChart
                decorator={() => {
                    return tooltipPos.visible ? <View>
                        <Svg >
                            <Rect x={tooltipPos.x - 16.5}
                                y={tooltipPos.y + 8.5}
                                width="63"
                                height="33"
                                fill={colors.theme.title}
                                rx="6.5"

                            />
                            <Rect x={tooltipPos.x - 15}
                                y={tooltipPos.y + 10}
                                width="60"
                                height="30"
                                fill={colors.theme.background}
                                rx="5"

                            />

                            <TextSVG
                                x={tooltipPos.x + 15}
                                y={tooltipPos.y + 30}
                                fill={colors.theme.title}
                                fontSize="16"
                                fontWeight="bold"
                                textAnchor="middle">
                                {tooltipPos.value + '???'}
                            </TextSVG>
                        </Svg>
                    </View> : null
                }}
                onDataPointClick={(data) => {

                    let isSamePoint = (tooltipPos.x === data.x
                        && tooltipPos.y === data.y)

                    isSamePoint ? setTooltipPos((previousState) => {
                        return {
                            ...previousState,
                            value: data.value,
                            visible: !previousState.visible
                        }
                    })
                        :
                        setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });

                }}
                data={{
                    labels: lab,
                    datasets: [
                        {
                            data: route.params.cliente == 1 ? data1[1] : data1[0]
                        }
                    ]
                }}
                
            fromZero={true}
                yAxisSuffix={" ???"}
                width={350}
                height={220}
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: colors.theme.background,
                    backgroundGradientTo: colors.theme.background,

                    color: (opacity = 1) => '#EA9F5A',
                    labelColor: (opacity = 1) => colors.theme.primary,
                    style: { borderRadius: 16 },
                    decimalPlaces: 0,
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#fff"
                    }
                }}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                style={{
                    marginTop: '5%',
                }}
            />
        </View>
    );

    const SecondRoute = () => (
        <BarChart
            data={{
                labels: lab,
                datasets: [
                    {
                        data: route.params.cliente == 1 ? data2[1] : data2[0]
                    }
                ]
            }}
            width={layout.width * 0.9}
            
            fromZero={true}
            height={220}
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: colors.theme.background,
                backgroundGradientTo: colors.theme.background,

                color: (opacity = 1) => '#EA9F5A',
                labelColor: (opacity = 1) => colors.theme.primary,
                style: { borderRadius: 16 },
                decimalPlaces: 0,
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#fff"
                }
            }}
            withInnerLines={false}
            bezier
            style={{
                marginTop: '5%',
                marginLeft: -25
            }}
        />
    );

    const ThirdRoute = () => (
        <BarChart
            data={{
                labels: lab,
                datasets: [
                    {
                        data: route.params.cliente == 1 ? data3[1] : data3[0]
                    }
                ]
            }}

            fromZero={true}
            width={350}
            height={220}
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: colors.theme.background,
                backgroundGradientTo: colors.theme.background,

                color: (opacity = 1) => '#EA9F5A',
                labelColor: (opacity = 1) => colors.theme.primary,
                style: { borderRadius: 16 },
                decimalPlaces: 0,
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#fff"
                }
            }}
            withInnerLines={false}
            bezier
            style={{
                marginTop: '5%',
                marginLeft: -25
            }}
        />
    );

    const FourthRoute = () => (
        <BarChart
        
            data={{
                labels: ["Borse", "Accessori", "Scarpe", "Abbigliamento","Altro"],
                datasets: [
                    {
                        data:  route.params.cliente == 1 ? data4[1] : data4[0]
                    }
                ]
            }}
            verticalLabelRotation={-90}
            
            width={350}
            height={220}
            fromZero={true}
            
            yAxisSuffix="%"
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: colors.theme.background,
                backgroundGradientTo: colors.theme.background,
                color: (opacity = 1) => '#EA9F5A',
                labelColor: (opacity = 1) => colors.theme.primary,
                style: { borderRadius: 16 },
                decimalPlaces: 0,
                
            }}
            withInnerLines={false}
            bezier
            style={{
                marginTop: '5%',
                marginLeft: -25
            }}
        />
        
        
    );


    const { colors, isDark } = useTheme();

    const tabBarHeight = useBottomTabBarHeight();


    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title:  lang.acquisti},
        { key: 'second', title: lang.ordini },
        { key: 'third', title: lang.visite },
        { key: 'fourth', title: lang.preferiti },
    ]);

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
        fourth: FourthRoute,
    });

    const [cliente, setCliente] = React.useState(costumers.find(us => us.id === route.params.cliente));
    var tot = 0;
    var average = 0;
    var last = '--/--/----';
    var taxFidelity = 0;
    function getDistribution(avg) {
        const threshold = 5000;
        if(avg == 0) {
            return 0
        }
        if (avg < threshold) {
            return avg/threshold;
        }
        if(avg>=threshold) {
            return 2;
        }    
    }
    if(acquisti.length != 0) {
        tot = acquisti.map(at => at.totale).reduce((a, b) => a + b, 0);
        average = Math.round(tot / acquisti.length);
        last = moment(acquisti[acquisti.length-1].data).format('DD/MM/YYYY');
        var max = Math.max.apply(null, acquisti.map(at => at.totale))
        var min = Math.min.apply(null, acquisti.map(at => at.totale))
        var diff = max-min;
        var totLast = lastAcquisti.map(at => at.totale).reduce((a, b) => a + b, 0);
        var avgLast = Math.round(totLast / lastAcquisti.length);
        var maxLast = Math.max.apply(null, lastAcquisti.map(at => at.totale))
        var minLast = Math.min.apply(null, lastAcquisti.map(at => at.totale))
        var diff2 = maxLast-minLast;
        var visite = 0;
        var lastVisite = 0;
        var orderFrequency = 0;
        var lastOrderFrequency = 0;
        if(visite != 0) {
            orderFrequency = acquisti.length/visite;
        }
        if(lastVisite != 0) {
            lastOrderFrequency = lastAcquisti.length/visite;
        }
        if(diff == 0) {
            diff = average;
        }
        if(diff2 == 0) {
            diff2 = avgLast;
        }
        
        taxFidelity = (2*((average-min)/(diff)) + 2*((avgLast-minLast)/(diff2)) + orderFrequency + lastOrderFrequency)/12 + getDistribution(average);
    } 
    if(taxFidelity > 1){
        taxFidelity = 1;
    }
    let [fontsLoaded] = useFonts({
        'SFProDisplayMedium': require('../../../assets/fonts/SFProDisplayMedium.otf'),
        'SFProDisplayBold': require('../../../assets/fonts/SFProDisplayBold.otf'),
        'SFProDisplayRegular': require('../../../assets/fonts/SFProDisplayRegular.otf'),
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={{ backgroundColor: colors.theme.background, height: '100%' }}>
                <View style={{flexDirection: 'row'}}>
                    <BackButton onPress={() => { navigation.goBack() }} />
                    <View style={{flex:1,justifyContent: "center",marginRight:'15%',alignItems: "center", paddingTop: '15%'}}>
                    <Text style={{fontFamily: "SFProDisplayMedium", fontSize: 22, alignSelf:'center', color: colors.theme.title}}>{lang.schedaCliente}</Text>
                    </View>
                </View>                
                <View style={{ flexDirection: "column", width: "100%", alignItems: "center", marginTop: '10%', marginBottom: '5%' }}>
                    <View style={{ flexDirection: "row", width: "80%" }}>
                        <View style={{ justifyContent: "flex-start", height: 120, width: 120, shadowOffset: { width: 1, height: 2 },shadowOpacity: 0.25,shadowRadius: 5, elevation: 5, borderRadius: 5 }}>
                            <Image source={{uri:cliente.avatar}} style={{ height: 120, width: 120, borderRadius: 5, borderWidth: 5, borderColor: "white"}} />
                        </View>
                        <View style={{ flexDirection: "column", paddingLeft: 15, alignItems: "flex-start" }}>
                            <Text style={{ color: colors.theme.title, fontSize: 20, fontFamily: "SFProDisplayBold" }}>{cliente.nome} {cliente.cognome}</Text>

                            <Text style={{ color: colors.theme.subtitle, fontSize: 12, fontFamily: "SFProDisplayRegular", marginBottom: 2 }}>{lang.regCliente} {moment(new Date(cliente.data_registrazione)).format('DD/MM/YYYY')}</Text>

                            <Text style={{ color: colors.theme.title, fontSize: 10, fontFamily: "SFProDisplayMedium" }}>{lang.tassoFedelta}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: '50%', height: 6, backgroundColor: '#D4D4D4', borderRadius: 3 }}>
                                    <View style={{ position: 'absolute', width: taxFidelity*100+'%', height: 6, backgroundColor: '#EA9F5A', borderRadius: 3 }}></View>
                                </View>
                                <Text style={{ marginLeft: 5, color: colors.theme.primary, fontSize: 10, fontFamily: "SFProDisplayMedium", marginBottom: 2 }}>{Math.round(taxFidelity*100)}%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", width: "80%", justifyContent: "space-between", marginTop: 20 }}>
                        <View>
                            <Text style={{ fontSize: 12, color: colors.theme.subtitle, fontFamily: "SFProDisplayRegular",alignSelf: 'center'  }}>{lang.totaleAcquisti}</Text>
                            <Text style={{ fontSize: 16, color: colors.theme.title, fontFamily: "SFProDisplayRegular", alignSelf: 'center' }}>{tot} ???</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, color: colors.theme.subtitle, fontFamily: "SFProDisplayRegular",alignSelf: 'center'  }}>{lang.mediaAcquisti}</Text>
                            <Text style={{ fontSize: 16, color: colors.theme.title, fontFamily: "SFProDisplayRegular",alignSelf: 'center'  }}>{average} ???</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, color: colors.theme.subtitle, fontFamily: "SFProDisplayRegular",alignSelf: 'center'  }}>{lang.ultimoAcquisto}</Text>
                            <Text style={{ fontSize: 16, color: colors.theme.title, fontFamily: "SFProDisplayRegular",alignSelf: 'center'  }}>{last}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView overScrollMode="never" style={{ marginBottom: tabBarHeight, width: '100%' }} contentContainerStyle={{ flexGrow: 1 }}>

                    <Divider width={"100%"} />
                    <MenuItem title={lang.nuovoAppuntamento} onPress={() => 
                        navigation.navigate('AddAppointment',{cliente:cliente,utente:utente,index:taxFidelity})} />
                    <MenuItem title={lang.contatta} onPress={() => navigation.navigate('Communication',{cliente:cliente,utente:utente})} />
                    <View style={{ height: 280}}>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={{ width: layout.width }}
                            contentContainerStyle={{ flexGrow: 1 }}
                            indicatorStyle={{ backgroundColor: 'white' }}
                            tabBarPosition="top"
                            renderTabBar={props =>
                                <TabBar
                                    {...props}
                                    renderLabel={({ focused, route }) => {
                                        return (
                                            <Text style={{ color: colors.theme.title, fontFamily: "SFProDisplayMedium" }}>
                                                {route.title}
                                            </Text>
                                        );
                                    }}
                                    indicatorStyle={{ backgroundColor: colors.theme.title }}
                                    style={{ backgroundColor: colors.theme.background, borderBottomWidth: 0 }}
                                />
                            }

                        />
                    </View>
                </ScrollView>

            </View>
        )
    };
}
export default CustomerPage;