import React, { useRef, useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { Text, View, Dimensions, TouchableOpacity, ScrollView, Animated, Platform } from "react-native";
import Modal from 'react-native-modal'
import SlidingUpPanel from "rn-sliding-up-panel";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import InputButton from "./InputButton";
import { useTheme } from "../theme/ThemeProvider";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { getStockByUserProduct, getQtaByProduct, getCaratteristicheProduct, getAttributoColoreByProduct, getAttributoTagliaByProduct } from "../back/connect";
import { ShoppingCart} from "../back/cart";
import { useLanguage } from "../localization/Localization";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const BottomProduct2 = ({ navigation, prodotto, utente }) => {
    let cart = ShoppingCart();
    const [isModalVisible, setModalVisible] = useState(false);
    var qta = getStockByUserProduct(prodotto.id, utente)
    var otherqta = getQtaByProduct(prodotto.id, utente)
    var caratteristiche = getCaratteristicheProduct(prodotto.id)

    const [index, setIndex] = useState(0);
    const [lang, setLanguage] = useLanguage();

    const FirstRoute = () => (
        <View style={{ width: '95%', alignSelf: 'center' }}>
            <View style={{ paddingTop: '5%' }}>
                <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayRegular', color: colors.theme.primary }}>
                        {lang.inNegozio}:
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayBold', color: colors.theme.primary, paddingLeft: 10 }}>
                        {qta}
                    </Text>
                </View>
                {qta == 0 ? (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayRegular', color: colors.theme.primary }}>
                            {lang.inAltri}:
                        </Text>
                        <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayBold', color: colors.theme.primary, paddingLeft: 5 }}>
                            {otherqta}
                        </Text>
                    </View>
                ) : null
                }
            </View>
            {qta == 0 ? (
                <InputButton params={{ marginTop: "5%", width: "80%", fontFamily: 'SFProDisplayMedium', fontSize: 14 }}
                    name={lang.altriStore} onPress={() => navigation.navigate('StoreList', { prodotto: prodotto, utente: utente })} />
            ) : null}
            {/*<InputButton params={{ marginTop: "5%", width: "60%", height: 30, fontFamily: 'SFProDisplayMedium', fontSize: 14 }}
                name="VEDI IN ALTRI STORE" outline onPress={() => navigation.navigate('StoreList')} />*/}
        </View>

    );
    const SecondRoute = () => (
        <ScrollView style={{ width: '100%', alignSelf: 'center' }}>
            <View style={{ paddingTop: '5%' }}>
                <Text style={{ width: '90%', fontSize: 14, fontFamily: 'SFProDisplayBold', color: colors.theme.primary, alignSelf: 'center' }}>
                    {lang.descrizione}
                </Text>
                <View style={{ width: '90%', flexDirection: 'column', paddingTop: 5, alignSelf: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayRegular', color: colors.theme.primary, textAlign: 'justify' }}>
                        {prodotto['descrizione_'+lang.codice]}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
    const ThirdRoute = () => (
        <ScrollView style={{ width: '95%', alignSelf: 'center' }}>
            <View style={{ paddingTop: '5%' }}>
                <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayBold', color: colors.theme.primary, marginLeft:10 }}>
                    {lang.schedaProdotto}
                </Text>
                <View style={{ width: '95%', flexDirection: 'column', paddingTop: 5, alignSelf: 'center' }}>
                    {caratteristiche.map((item) => (
                        <View style={{ flexDirection: 'row' }} key={item.id}>
                            <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.theme.primary, marginTop: 9, marginRight: 5 }}></View>
                            <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayRegular', color: colors.theme.primary, textAlign: 'left' }}>
                                {item['valore_' + lang.codice]}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
    const [routes] = useState([
        { key: 'first', title: lang.disponibilita },
        { key: 'second', title: lang.descrizione },
        { key: 'third', title: lang.schedaProdotto },
    ]);
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
    });
    const animatedValue1 = new Animated.Value(1);
    if(Platform.OS === 'ios') {
        var slidePadding = height * 0.15 -5;
    } else {
        var slidePadding = height * 0.15;
    }
 
    const productColors = getAttributoColoreByProduct(prodotto.id);
    
    const taglia = getAttributoTagliaByProduct(prodotto.id)
    const { colors, isDark } = useTheme();
    const tabBarHeight = useBottomTabBarHeight();
    const elementRef = useRef();
    
    const [selectedSize, setSelectedSize] = useState(undefined);
    const [selectedColor,setSelectedColor] = useState(productColors[0]);

    /*const [show, setSelected] = useState(productColors.map((item) => ({'color': item, active: false})));
    console.log(show);*/
    var showColors = []
    for(let i = 0; i< productColors.length; i++) {
        if(i==0 ){
            showColors.push(true);
        } else {
            showColors.push(false);
        }
    }
    const [show, setSelected] = useState(showColors);

    const toggleColor = (color,index) => {
        for (let i = 0; i < showColors.length; i++) {
            if (i == index) {
                showColors[i] = true;
            } else {
                showColors[i] = false;
            }
        }

        setSelected(showColors)
        setSelectedColor(color);
    }
    const toggleModal = (itemValue) => {
        setSelectedSize(itemValue);
        setModalVisible(false);
    }
    
    const styles = {
        view: {
            justifyContent: 'flex-end',
            margin: 0,
          },
          content: {
              backgroundColor: colors.theme.background,
              padding: 22,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
        container: {
            flexGrow: 1,
            zIndex: 1
        },
        dragHandler: {
            height: 80,
            width: '100%',
            alignSelf: 'center',
            marginTop: '5%'
        }
    }
    function numberWithPointers(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
    return (
        

        <SlidingUpPanel
            ref={elementRef}
            draggableRange={{ top: height * 0.75, bottom: (slidePadding + tabBarHeight)}}
            showBackdrop={true}>
            {dragHandler => (
                <View style={[styles.container, { backgroundColor: colors.theme.background }]}>
                    <View style={styles.dragHandler} {...dragHandler}>
                        <View style={{flexDirection: 'row', alignContent: 'center', alignSelf: 'center'}}>
                            <View style={{ flexDirection: 'column', width: '60%'}}>
                                <Text style={{ fontSize: 18, fontFamily: 'SFProDisplayBold', color: colors.theme.title, paddingTop: 2, paddingRight:5 }}>
                                    {prodotto['nome_' + lang.codice]}
                                </Text>
                                <Text style={{ fontSize: 16, marginTop:8,fontFamily: 'SFProDisplayBold', color: colors.theme.subtitle}}>
                                {'??? ' + numberWithPointers(prodotto.prezzo) +'   '}
                                    <Text style={{fontSize: 12,fontFamily: 'SFProDisplayBold', color: colors.theme.subtitle}}>{lang.iva}</Text> 
                                </Text>
                            </View>

                        {qta != 0 ? (
                        <TouchableOpacity activeOpacity={0.5} style={{
                            height: 45, width: 45, borderRadius: 22.5, backgroundColor: '#EA9F5A',
                            justifyContent: 'center', alignItems: 'center', alignContent: 'center', shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5,
                        }} onPress={() => {
                            cart.addProduct(prodotto,selectedSize,selectedColor)
                            navigation.navigate('ProductPage',{prodotto:prodotto.id,utente:utente})
                            //navigation.navigate('Cart', { prodotto: prodotto })
                        }
                        }>
                            <Icon name="cart-plus" size={24} color={'white'} style={{ marginRight: 2 }} />
                        </TouchableOpacity>
                    ) : null}
                    </View>
                    </View>
                    
                    <ScrollView style={{ width: '100%', backgroundColor: colors.theme.background, marginBottom: tabBarHeight }}>

                        <View style={{ width: '75%', alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent:'flex-start' }}>
                                <View style={{ flexDirection: 'row', width: '50%', paddingLeft: 5 }}>
                                    {productColors.map((item, index) => (
                                        <TouchableOpacity activeOpacity={0.75} key={item} onPress={() => toggleColor(item,index)}>
                                        {show[index] ?
                                            <View style={{
                                                marginTop: 2,
                                                marginRight: 7,
                                                width: 21,
                                                height: 21,
                                                borderRadius: 10.5,
                                                backgroundColor: "#"+item,
                                                borderWidth: 3, borderColor: 'white',
                                                shadowColor: '#000000',
                                                shadowOffset: { width: 1, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 5, elevation: 5
                                            }}
                                            />
                                            :
                                            <View style={{
                                                marginTop: 2,
                                                marginRight: 7,
                                                width: 18,
                                                height: 18,
                                                borderRadius: 9,
                                                backgroundColor: "#"+item,
                                                shadowColor: '#000000',
                                                shadowOffset: { width: 1, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 5, elevation: 5
                                            }}
                                            />
                                        }
                            
                                    </TouchableOpacity>
                                    ))}
                                </View>
                                {(selectedSize == undefined && taglia.length > 0)?
                                    setSelectedSize(taglia[0].valore)
                                    :
                                    null
                                }
                                {taglia.length == 0 ?

                                    null
                                    :
                                    <>
                                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                                            <Text style={{fontFamily: 'SFProDisplayBold', color: colors.theme.title, textAlign: 'center' }}>{lang.taglia}: {selectedSize}</Text>
                                        </TouchableOpacity>
                                        <Modal
                                            isVisible={isModalVisible}
                                            statusBarTranslucent={true}
                                            animationType="slide"
                                            hasBackdrop={true}
                                            onBackdropPress={() => setModalVisible(false)}
                                            backdropOpacity={10}
                                            backdropColor={"rgba(0, 0, 0, 0.7)"}
                                            useNativeDriverForBackdrop={true}
                                            hideModalContentWhileAnimating={true}
                                            style={styles.view}>
                                            <View style={styles.content}>
                                                <Picker
                                                    selectedValue={selectedSize}
                                                    style={{ width: '50%', fontFamily: 'SFProDisplayBold', color: colors.theme.title, textAlign: 'center' }}
                                                    dropdownIconColor={colors.theme.title}
                                                    onValueChange={(itemValue) =>
                                                        toggleModal(itemValue)
                                                    }
                                                    mode="dialog">
                                                    {taglia.map(item => {
                                                        if(Platform.OS === 'ios') {
                                                            return <Picker.Item key={item.id} color={colors.theme.title} label={item.valore} value={item.valore} />;
                                                        } else {
                                                            return <Picker.Item key={item.id} label={item.valore} value={item.valore} />;
                                                        }
                                                    })}
                                                </Picker>
                                            </View>
                                        </Modal>
                                    </>

                                }
                            </View>
                            <InputButton params={{ marginTop: "5%", width: "100%", fontFamily: 'SFProDisplayMedium', fontSize: 14 }} name={lang.visualizzaAR} onPress={() => { navigation.navigate('ExpoAR')}} />
                        </View>

                        <View style={{ height: height * 0.325, marginTop: '5%' }}>
                            <TabView
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                onIndexChange={setIndex}
                                initialLayout={{ width: width }}
                                contentContainerStyle={{ flexGrow: 1 }}
                                indicatorStyle={{ backgroundColor: 'white' }}
                                tabBarPosition="top"
                                renderTabBar={props =>
                                    <TabBar
                                        {...props}
                                        renderLabel={({ focused, route }) => {
                                            if (focused) {
                                                return (
                                                    <Text style={{ color: colors.theme.title, fontFamily: "SFProDisplayMedium" }}>
                                                        {route.title}
                                                    </Text>
                                                );
                                            }
                                            return (
                                                <Text style={{ color: colors.theme.subtitle, fontFamily: "SFProDisplayMedium" }}>
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
                        <View style={{ marginBottom: '5%' }}></View>
                    </ScrollView>
                </View>
            )}
        </SlidingUpPanel>
    )
};

export default BottomProduct2;