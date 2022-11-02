import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import tw from 'twrnc';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import SamplePrint from '../components/sample-print';
import ItemList from '../components/item-list';



const SettingPrinter = ({navigation}) => {
    const [pairedDevices, setPairedDevices] = useState([]);
    const [foundDs, setFoundDs] = useState([]);
    const [bleOpend, setBleOpend] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [boundAddress, setBoundAddress] = useState('');

    useEffect(() => {
        BluetoothManager.isBluetoothEnabled().then(
          enabled => {
            setBleOpend(Boolean(enabled));
            setLoading(false);
          },
          err => {
            err;
          },
        );
    
        if (Platform.OS === 'ios') {
          let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
          bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
            deviceAlreadPaired(rsp);
          });
          bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
            deviceFoundEvent(rsp);
          });
          bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
            setName('');
            setBoundAddress('');
          });
        } else if (Platform.OS === 'android') {
          DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
            deviceAlreadPaired(rsp);
          });
          DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
            deviceFoundEvent(rsp);
          });
          DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
            setName('');
            setBoundAddress('');
          });
          DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
            ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
          });
        }
        if (pairedDevices.length < 1) {
          scan();
        }
    }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);
    
    const deviceAlreadPaired = useCallback(
        rsp => {
          var ds = null;
          if (typeof rsp.devices === 'object') {
            ds = rsp.devices;
          } else {
            try {
              ds = JSON.parse(rsp.devices);
            } catch (e) {}
          }
          if (ds && ds.length) {
            let pared = pairedDevices;
            if (pared.length < 1) {
              pared = pared.concat(ds || []);
            }
            setPairedDevices(pared);
          }
        },
        [pairedDevices],
    );
    
    const deviceFoundEvent = useCallback(
        rsp => {
          var r = null;
          try {
            if (typeof rsp.device === 'object') {
              r = rsp.device;
            } else {
              r = JSON.parse(rsp.device);
            }
          } catch (e) {
            // ignore error
          }
    
          if (r) {
            let found = foundDs || [];
            if (found.findIndex) {
              let duplicated = found.findIndex(function (x) {
                return x.address == r.address;
              });
              if (duplicated == -1) {
                found.push(r);
                setFoundDs(found);
              }
            }
          }
        },
        [foundDs],
    );
    
    const connect = row => {
        setLoading(true);
        BluetoothManager.connect(row.address).then(
          s => {
            setLoading(false);
            setBoundAddress(row.address);
            setName(row.name || 'UNKNOWN');
          },
          e => {
            setLoading(false);
            alert(e);
          },
        );
    };
    
    const unPair = address => {
        setLoading(true);
        BluetoothManager.unpaire(address).then(
          s => {
            setLoading(false);
            setBoundAddress('');
            setName('');
          },
          e => {
            setLoading(false);
            alert(e);
          },
        );
    };
    
    const scanDevices = useCallback(() => {
        setLoading(true);
        BluetoothManager.scanDevices().then(
          s => {
            // const pairedDevices = s.paired;
            var found = s.found;
            try {
              found = JSON.parse(found); //@FIX_it: the parse action too weired..
            } catch (e) {
              //ignore
            }
            var fds = foundDs;
            if (found && found.length) {
              fds = found;
            }
            setFoundDs(fds);
            setLoading(false);
          },
          er => {
            setLoading(false);
            // ignore
          },
        );
    }, [foundDs]);
    
    const scan = useCallback(() => {
        try {
          async function blueTooth() {
            const permissions = {
              title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
              message: 'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
              buttonNeutral: 'Lain Waktu',
              buttonNegative: 'Tidak',
              buttonPositive: 'Boleh',
            };
    
            const bluetoothConnectGranted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              permissions,
            );
            if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
              const bluetoothScanGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                permissions,
              );
              if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
                scanDevices();
              }
            } else {
              // ignore akses ditolak
            }
          }
          blueTooth();
        } catch (err) {
          console.warn(err);
        }
    }, [scanDevices]);

    return (
        <View style={tw`bg-white h-full pb-8`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw``}>Setting Printer</Text>
                <Text></Text>
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.bluetoothStatusContainer}>
                  <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
                      Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
                  </Text>
                </View>
                {!bleOpend && <Text style={styles.bluetoothInfo}>Mohon aktifkan bluetooth anda</Text>}
                  <Text style={styles.sectionTitle}>Printer yang terhubung ke aplikasi:</Text>
                  {boundAddress.length > 0 && (
                  <ItemList
                      label={name}
                      value={boundAddress}
                      onPress={() => unPair(boundAddress)}
                      actionText="Putus"
                      color="#E9493F"
                  />
                )}
                {boundAddress.length < 1 && (
                  <Text style={styles.printerInfo}>Belum ada printer yang terhubung</Text> )}
                  <TouchableOpacity onPress={scanDevices} style={tw`flex flex-row justify-end mb-4`}>
                    <Text style={tw`text-white bg-blue-800 p-3 px-5 rounded`}>Scan</Text>
                  </TouchableOpacity>
                  <Text style={styles.sectionTitle}>Bluetooth yang terhubung ke HP ini:</Text>
                  {loading ? <ActivityIndicator animating={true} /> : null}
                  <View style={[styles.containerList, tw`mb-10`]}>
                    {pairedDevices.map((item, index) => {
                        return (
                            <ItemList
                                key={index}
                                onPress={() => connect(item)}
                                label={item.name}
                                value={item.address}
                                connected={item.address === boundAddress}
                                actionText="Hubungkan"
                                color="#00BCD4"
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      paddingHorizontal: 20,
    },
    containerList: { flex: 1, flexDirection: 'column' },
    bluetoothStatusContainer: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
    bluetoothStatus: color => ({
      backgroundColor: color,
      padding: 8,
      borderRadius: 2,
      color: 'white',
      paddingHorizontal: 14,
      marginBottom: 20,
    }),
    bluetoothInfo: { textAlign: 'center', fontSize: 16, color: '#FFC806', marginBottom: 20 },
    sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
    printerInfo: { textAlign: 'center', fontSize: 16, color: '#E9493F', marginBottom: 20 },
  });

export default SettingPrinter