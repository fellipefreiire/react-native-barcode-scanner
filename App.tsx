import { Audio } from 'expo-av';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { findProductByCode, IProduct } from './services/api';

type Payload = {
  type: string
  data: string
}

async function askForPermission() {
  const { status } = await BarCodeScanner.requestPermissionsAsync()

  return status === 'granted'
}

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanning, setScanning] = useState(false)
  const [product, setProduct] = useState<IProduct | null | undefined>(null)

  useEffect(() => {
    askForPermission().then(setHasPermission)
  }, [])

  async function onBarCodeScanned({ data }: Payload) {

    const { sound } = await Audio.Sound.createAsync(
      require('./assets/beep.mp3')
    )
    await sound.playAsync()
    const product = findProductByCode(data)
    setProduct(product)
    setScanning(false)
  }

  if (hasPermission === null) {
    return <Text>Obtendo permissões...</Text>
  }

  if (hasPermission === false) {
    return <Text>Sem permissões para acessar a câmera</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Easy Bar Code Scanner</Text>
      <Text style={styles.subTitle}>
        Encontre o preço dos itens que você precisa
      </Text>

      {product === undefined && (
        <Text style={styles.subTitle}>
          Produto não encontrado 😢
        </Text>
      )}

      {product && (
        <View style={styles.productContainer}>
          <Text style={styles.productPrice}>{product?.price}</Text>
          <Text style={styles.productName}>{product?.name}</Text>
          <View style={styles.productImageContainer}>
            <Image
              source={{
                uri: product?.image
              }}
              style={styles.productImage}
            />
          </View>
        </View>
      )}

      {scanning && (
        <BarCodeScanner
          onBarCodeScanned={onBarCodeScanned}
          style={{
            height: 300,
            width: Dimensions.get('screen').width,
            flex: 1,
            alignItems: 'center',
          }}
        />
      )}

      <TouchableOpacity style={styles.button}>
        <Text
          style={styles.buttonText}
          onPress={() => {
            setScanning(prev => !prev)
            setProduct(null)
          }}
        >
          {scanning ? 'Cancelar' : 'Consultar Preço'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2CA58D',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 40,
    color: '#fff'
  },
  subTitle: {
    fontSize: 20,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  button: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#0a2342'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  productContainer: {
    flex: 1,
    alignItems: 'center'
  },
  productPrice: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0a2342'
  },
  productName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0a2342'
  },
  productImageContainer: {
    marginVertical: 30,
    width: 350,
    height: 350,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  }
});
