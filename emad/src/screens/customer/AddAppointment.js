import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Platform } from "react-native";
import Modal from 'react-native-modal'
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import Divider from "../../components/Divider";
import BackButton from "../../components/BackButton";
import Icon from 'react-native-vector-icons/Ionicons';
import InputButton from "../../components/InputButton";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTheme } from "../../theme/ThemeProvider";
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useLanguage } from "../../localization/Localization";
import moment from 'moment';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/fr';
import { AddAppuntamento, getAppuntamentoByUser, SendBookingInfo, getCustomerById, getCustomerName } from "../../back/connect";

const width = Dimensions.get('window').width;
const height = Dimensions.get('screen').height;


var users = []
const AddAppointment = ({ navigation, route }) => {
    users = getAppuntamentoByUser(route.params.utente).map(u => new Date(u.data).toISOString().substring(0, 10))

    const slots = [
        { "slot": "09:00", "value": "0" },
        { "slot": "09:30", "value": "1" },
        { "slot": "10:00", "value": "2" },
        { "slot": "10:30", "value": "3" },
        { "slot": "11:00", "value": "4" },
        { "slot": "11:30", "value": "5" },
        { "slot": "12:00", "value": "6" },
        { "slot": "12:30", "value": "7" },
        { "slot": "13:00", "value": "8" },
        { "slot": "13:30", "value": "9" },
        { "slot": "14:00", "value": "10" },
        { "slot": "14:30", "value": "11" },
        { "slot": "15:00", "value": "12" },
        { "slot": "15:30", "value": "13" },
        { "slot": "16:00", "value": "14" },
        { "slot": "16:30", "value": "15" },
        { "slot": "17:00", "value": "16" },
        { "slot": "17:30", "value": "17" },
        { "slot": "18:00", "value": "18" },
        { "slot": "18:30", "value": "19" },
        { "slot": "19:00", "value": "20" },
        { "slot": "19:30", "value": "21" },
        { "slot": "20:00", "value": "22" },
        { "slot": "20:30", "value": "23" },
        { "slot": "21:00", "value": "24" }
    ]
    const { key, colors, setScheme, isDark } = useTheme();
    const [lang, setLanguage] = useLanguage();
    const [isModal1Visible, setModal1Visible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);

    moment.locale(lang.codice)
    LocaleConfig.locales[lang.codice] = lang.locale;
    LocaleConfig.defaultLocale = lang.codice;

    const styles = StyleSheet.create({
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
        checkboxContainer: {
            flexDirection: "row",
            marginBottom: 20,

        },
        section: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        checkbox: {
            margin: 8,
        },
    });

    const [isChecked, setChecked] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorText, setErrorText] = useState('Default');
    const [daySelected, setDaySelected] = useState(new Date);

    const [isModalVisible, setModalVisible] = useState(false);

    const [selectedFirstSlot, setSelectedFirstSlot] = useState();
    const [selectedSecondSlot, setSelectedSecondSlot] = useState();
    const [selectedFirstSlotLabel, setSelectedFirstSlotLabel] = useState(undefined);
    const [selectedSecondSlotLabel, setSelectedSecondSlotLabel] = useState(undefined);

    const [startSlots, setStartSlots] = useState(slots);
    const [endSlots, setEndSlots] = useState(slots);

    const [removedSlots, setRemovedSlots] = useState();
    const filterday = (day) => {
        setSelectedFirstSlot(undefined);
        setSelectedSecondSlot(undefined);
        setSelectedFirstSlotLabel(undefined);
        setSelectedSecondSlotLabel(undefined);
        var removedSlot = []
        var newSlots = [];
        newSlots.splice(newSlots.length - 1, 1);
        users = getAppuntamentoByUser(route.params.utente)
        users = (users.filter(d => moment(d.data).format('DD/MM/YYYY') == moment(day).format('DD/MM/YYYY')));
        users.sort((a, b) => (a.slot_inizio > b.slot_inizio) ? 1 : ((b.slot_inizio > a.slot_inizio) ? -1 : 0))
        users.forEach((user) => {
            for (let i = user.slot_inizio; i <= user.slot_fine; i++) {
                removedSlot.indexOf(i) === -1 ? removedSlot.push(i) : null;
            }
            setRemovedSlots(removedSlot);
        });
        for(let j = 0; j< 24; j++) {
            var deleteSlot  = false;
            for (let i = 0; i <= removedSlot[removedSlot.length - 1]; i++) {
                if(parseInt(slots[j].value) == parseInt(removedSlot[i])) { 
                    deleteSlot= true;
                    //console.log(j);
                }
            }
            if(!deleteSlot) {
                newSlots.indexOf(slots[j]) === -1 ? newSlots.push(slots[j]) : null;
            }
        }
        setStartSlots(newSlots);
        setSelectedFirstSlot(true);
    }

    const toggleModal1 = (itemValue) => {
        setSelectedFirstSlot(itemValue);
        var newSlots = [];
        if (removedSlots != undefined) {
            var endIndx = removedSlots.findIndex(el => el > parseInt(itemValue));
            if (endIndx == -1) {
                for (let i = parseInt(itemValue) + 1; i <= 24; i++) {
                    newSlots.push(slots[i])
                }
            } else {
                for (let i = parseInt(itemValue) + 1; i <= removedSlots[endIndx]; i++) {
                    newSlots.push(slots[i])
                }
            }

            setEndSlots(newSlots);
        } else {
            for (let i = parseInt(itemValue) + 1; i < 25; i++) {
                newSlots.push(slots[i]);
            }
            setEndSlots(newSlots);
        }
        setSelectedFirstSlotLabel(slots.find(slots => slots.value == itemValue))
        setModal1Visible(false);
    }
    const toggleModal2 = (itemValue) => {
        setSelectedSecondSlot(itemValue);
        setSelectedSecondSlotLabel(slots.find(slots => slots.value == itemValue))
        setModal2Visible(false);
    }
    const onDayPress = day => {
        filterday(day.dateString)
        setDaySelected(day.dateString);
    }
    const onMonthChange = day => {
        var today = new Date;
        today.setHours(0, 0, 0, 0)
        var selected = new Date(day.dateString)
        if (today.getTime() != selected.getTime()) {
            setDaySelected(day.dateString);
        } else {
            setDaySelected(undefined)
        }
    }

    const toggleScheme = () => {
        isDark ? setScheme('light') : setScheme('dark');
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleModalReturn = async() => {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(300);
        setModalVisible(false);
        await delay(300);
        setIsSuccess(false);
        navigation.goBack();
    }

    const handleSubmitPress = async () => {
        const delay = ms => new Promise(res => setTimeout(res, ms));

        if (selectedFirstSlot === selectedSecondSlot) {
            setErrorText(lang.campoErroreOrari)
            setModalVisible(true)
            return;

        }
        if (selectedFirstSlot == undefined || selectedSecondSlot == undefined) {
            setErrorText(lang.campoErroreOrariNonSelezionati)
            setModalVisible(true)
            return;
        }
        var appuntamento = {}
        appuntamento.id_utente = route.params.utente;
        appuntamento.id_cliente = route.params.cliente.id;
        appuntamento.riservato = (isChecked) ? 1 : 0;
        appuntamento.slot_inizio = selectedFirstSlot;
        appuntamento.slot_fine = selectedSecondSlot;
        appuntamento.data = daySelected;

        const email = getCustomerById(route.params.cliente.id);
        const nome = getCustomerName(route.params.cliente.id);
        const idUser = route.params.utente;

        AddAppuntamento(appuntamento);
        SendBookingInfo(email, nome, daySelected,selectedFirstSlotLabel.slot, selectedSecondSlotLabel.slot,idUser)
        setIsSuccess(true);
        setErrorText(lang.operazioneConclusa)
        setModalVisible(true)
    }


    function renderHeader(date) {
        if (date) {
            var Data = new Date(date)
            return (
                <View style={{ marginTop: '15%', zIndex: 1 }}>
                    <View style={{ position: 'absolute', top: 0, alignSelf: 'center', zIndex: 1 }}>
                        <Text style={{ textTransform: 'capitalize', fontSize: 16, textAlign: 'left', color: colors.theme.primary }}>
                            {moment(Data).format('dddd')}
                        </Text>
                        <Text style={{ textTransform: 'capitalize', fontSize: 28, textAlign: 'left', color: colors.theme.primary, marginBottom: 15 }}>
                            {moment(Data).format('DD MMMM YYYY')}
                        </Text>
                    </View>
                </View>
            )
        }
        var Data = new Date()
        return (
            <View style={{ position: 'absolute', top: 0, alignSelf: 'center', zIndex: 1 }}>
                <Text style={{ textTransform: 'capitalize', fontSize: 16, textAlign: 'left', color: colors.theme.primary }}>
                    {moment(Data).format('dddd')}
                </Text>
                <Text style={{ textTransform: 'capitalize', fontSize: 28, textAlign: 'left', color: colors.theme.primary, marginBottom: 15 }}>
                    {moment(Data).format('DD MMMM YYYY')}
                </Text>
            </View>
        )
    }

    let [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../../../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayMedium': require('../../../assets/fonts/SFProDisplayMedium.otf'),
        'SFProDisplayBold': require('../../../assets/fonts/SFProDisplayBold.otf'),
        'SFProDisplayUltraLightItalic': require('../../../assets/fonts/SFProDisplayUltraLightItalic.otf')
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {

        return (
            <View style={{ backgroundColor: colors.theme.background, flexGrow: 1 }}>
                <Modal
                    isVisible={isModalVisible}
                    statusBarTranslucent={true}
                    animationIn="bounceIn"
                    animationOut="fadeOutDownBig"
                    hasBackdrop={true}
                    backdropOpacity={10}
                    backdropColor={"rgba(0, 0, 0, 0.3)"}
                    useNativeDriverForBackdrop={true}
                    hideModalContentWhileAnimating={true}
                    deviceHeight={height}
                >
                    <View style={{ padding: 20 }}>
                        {isSuccess ?
                            <>
                                <View style={[colors.topModal, { backgroundColor: 'green' }]}>
                                    <Icon name="checkmark-circle-outline" size={75} color={'#FFFFFF'} />
                                </View>
                                <View style={colors.modalContent}>
                                    <Text style={{ color: colors.theme.primary, textAlign: 'center' }}>{errorText}</Text>
                                    <InputButton params={{ marginTop: '5%', width: "75%" }}
                                        name="Conferma" icon="arrow-forward-outline" rotation="-45deg" onPress={toggleModalReturn} />
                                </View>
                            </>
                            :
                            <>
                                <View style={colors.topModal}>
                                    <Icon name="close-circle-outline" size={75} color={'#FFFFFF'} />
                                </View>
                                <View style={colors.modalContent}>
                                    <Text style={{ color: colors.theme.primary, textAlign: 'center' }}>{errorText}</Text>
                                    <InputButton params={{ marginTop: '5%', width: "75%" }}
                                        name="Conferma" icon="arrow-forward-outline" rotation="-45deg" onPress={toggleModal} />
                                </View>
                            </>}

                    </View>
                </Modal>
                <View style={{ flexDirection: 'row' }}>
                    <BackButton onPress={() => { navigation.goBack() }} />
                    <View style={{ flex: 1, justifyContent: "center", marginRight: '15%', alignItems: "center", paddingTop: '15%' }}>
                        <Text style={{ fontFamily: "SFProDisplayMedium", fontSize: 22, alignSelf: 'center', color: colors.theme.title }}>{lang.nuovoAppuntamento}</Text>
                    </View>
                </View>
                {renderHeader(daySelected)}
                <Calendar
                    key={key}
                    style={{ backgroundColor: colors.theme.background, monthTextColor: colors.theme.title }}
                    hideArrows={false}
                    hideExtraDays={false}
                    onPressArrowLeft={subtractMonth => subtractMonth()}
                    onPressArrowRight={addMonth => addMonth()}
                    onDayPress={onDayPress}
                    onMonthChange={onMonthChange}
                    markedDates={{
                        [daySelected]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: colors.calendar_select.circle,
                            selectedTextColor: colors.calendar_select.text,
                        }
                    }}
                    renderHeader={(date) => <View style={{ marginBottom: 55 }} />}
                    theme={colors.calendar}

                />

                <Divider width="100%" />
                <ScrollView overScrollMode="never" style={{ height: "100%", bottom: 10 }}>
                    {route.params.index >= 0.75
                        ?
                        <View style={{ flex: 1, width: '75%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.section}>
                                <Checkbox
                                    style={{ margin: 0, borderRadius: 5 }}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? '#e78630' : undefined}
                                />
                                <Text style={{ margin: 25, fontSize: 16, fontFamily: 'SFProDisplayMedium', color: colors.theme.title }}>{lang.riservaNegozio}</Text>
                            </View>
                        </View>
                        :
                        <View style={{ flex: 1, width: '75%', height:25, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}/>
                    }
                   

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>

                        <TouchableOpacity onPress={selectedFirstSlot == undefined ? null : () => setModal1Visible(true)}>
                            <View style={{ flexDirection: 'row' }} >
                                <Text style={{ fontSize: 16, fontFamily: 'SFProDisplayMedium', color: colors.theme.title }}>{lang.dalle}:</Text>
                                <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayMedium', color: colors.theme.title, paddingTop: 2, paddingLeft: 5 }}>
                                    {selectedFirstSlotLabel == undefined ? '--:--' : selectedFirstSlotLabel.slot}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: '20%' }} />
                        <TouchableOpacity onPress={selectedFirstSlot == undefined ? null : () => setModal2Visible(true)}>
                            <View style={{ flexDirection: 'row' }} >
                                <Text style={{ fontSize: 16, fontFamily: 'SFProDisplayMedium', color: colors.theme.title }}>{lang.alle}:</Text>
                                <Text style={{ fontSize: 14, fontFamily: 'SFProDisplayMedium', color: colors.theme.title, paddingTop: 2, paddingLeft: 5 }}>
                                    {selectedSecondSlotLabel == undefined ? '--:--' : selectedSecondSlotLabel.slot}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        isVisible={isModal1Visible}
                        statusBarTranslucent={true}
                        animationType="slide"
                        hasBackdrop={true}
                        onBackdropPress={() => setModal1Visible(false)}
                        backdropOpacity={10}
                        backdropColor={"rgba(0, 0, 0, 0.7)"}
                        useNativeDriverForBackdrop={true}
                        hideModalContentWhileAnimating={true}
                        style={styles.view}>
                        <View style={styles.content}>
                            <Picker
                                selectedValue={selectedFirstSlot}
                                style={{ width: '50%', fontFamily: 'SFProDisplayBold', color: colors.theme.title, textAlign: 'center', alignSelf: 'center' }}
                                dropdownIconColor={colors.theme.title}

                                onValueChange={(itemValue, itemLabel) =>
                                    toggleModal1(itemValue, itemLabel)
                                }>
                                {Platform.OS === 'ios' ?
                                    <Picker.Item key={-1} color={colors.theme.title} label={'--:--'} value={-1} />
                                    :
                                    <Picker.Item key={-1} label={'--:--'} value={-1} />
                                }
                                {startSlots.map(item => {
                                    if (Platform.OS === 'ios') {
                                        return <Picker.Item key={item.value} color={colors.theme.title} label={item.slot} value={item.value} />;
                                    } else {
                                        return <Picker.Item key={item.value} label={item.slot} value={item.value} />;
                                    }
                                })}
                            </Picker>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={isModal2Visible}
                        statusBarTranslucent={true}
                        animationType="slide"
                        hasBackdrop={true}
                        onBackdropPress={() => setModal2Visible(false)}
                        backdropOpacity={10}
                        backdropColor={"rgba(0, 0, 0, 0.7)"}
                        useNativeDriverForBackdrop={true}
                        hideModalContentWhileAnimating={true}
                        style={styles.view}>
                        <View style={styles.content}>
                            <Picker
                                selectedValue={selectedSecondSlot}
                                style={{ width: '50%', fontFamily: 'SFProDisplayBold', color: colors.theme.title, textAlign: 'center', alignSelf: 'center' }}
                                dropdownIconColor={colors.theme.title}
                                onValueChange={(itemValue, itemIndex) =>
                                    toggleModal2(itemValue)
                                }>
                                {Platform.OS === 'ios' ?
                                    <Picker.Item key={-1} color={colors.theme.title} label={'--:--'} value={-1} />
                                    :
                                    <Picker.Item key={-1} label={'--:--'} value={-1} />
                                }

                                {endSlots.map(item => {
                                    if (Platform.OS === 'ios') {
                                        return <Picker.Item key={item.value} color={colors.theme.title} label={item.slot} value={item.value} />;
                                    } else {
                                        return <Picker.Item key={item.value} label={item.slot} value={item.value} />;
                                    }
                                })}
                            </Picker>
                        </View>
                    </Modal>
                    <InputButton params={{ marginTop: 20, width: "75%" }} name={lang.addAppuntamento} icon="arrow-forward-outline" rotation="-45deg" onPress={handleSubmitPress} />
                </ScrollView>

            </View>

        )
    }

}




export default AddAppointment;