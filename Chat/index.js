import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet, View, Text, Image, ScrollView,
  TextInput, TouchableOpacity
} from 'react-native';
import firebase from '../config/firebase';
import api from '../services/axios';
import axios from 'axios';



export default function Chat() {

  const [user, setUser] = useState(null)
  const [count, setCount] = useState(0);
  const onPress = () => setCount(prevCount => prevCount + 1);
  
  const [mensagens, setMensagens] = useState([])
  const [caixaTexto, setCaixaTexto] = useState('')
  const [scrollview, setScrollview] = useState('')
  const [imagem, setImagem] = useState(imagem);

  const userr = firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged(userr => {
    
          firebase.storage().ref('users/' + userr.email  + '/picture.jpg').getDownloadURL().then(function (downloadURL) {
          setImagem(downloadURL)
        },function(error){
          console.log(error.code)
        });
    
  });
  

  const db = firebase.firestore()

  const salvar = () => {
    api.post('/enviarMensagem', {
      mensagem: caixaTexto,
      usuario: user.name,
      avatar: imagem,
    })
      .then(function () {
        
        setCaixaTexto('')
        scrollview.scrollToEnd({ animated: true })
      }).catch(function () {

      })
  }

  useEffect(() => {
    carregaUsuarioAnonimo()
    let mensagens_enviadas = []
    const unsubscribe = db.collection("chats")
      .doc("sala_01").collection('mensagens')
      .onSnapshot({ includeMetadataChanges: false }, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const { mensagem, usuario, avatar } = change.doc.data()
            const id = change.doc.id
            mensagens_enviadas.push({ mensagem, usuario, avatar, id })
          } 
        })
        setMensagens([...mensagens_enviadas])
        scrollview ? scrollview.scrollToEnd({ animated: true }) : null;
      })
    return () => {
      unsubscribe()
    }
  }, [])

  const carregaUsuarioAnonimo = () => {
    axios.get('https://randomuser.me/api/')
      .then(function (response) {
        const user = response.data.results[0];
        // setDistance(response.data.distance)
        setUser({
          name: `${user.name.first} ${user.name.last}`,
          picture: user.picture.large
        })
        setImagem(user.picture.large)
        console.log('user', user)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  

  return (
    <View style={styles.view}>

      {user &&
        <>
          <TouchableOpacity onPress={carregaUsuarioAnonimo}>

          <Image source={{ uri: imagem }} style={styles.avatar} /> 
          </TouchableOpacity>

          <Text style={styles.nome_usuario}>{user.name}</Text>
        </>

      }



      <ScrollView style={styles.scrollview} ref={(view) => { setScrollview(view) }}>
        {
          mensagens.length > 0 && mensagens.map(item => (

            <View key={item.id} style={styles.linha_conversa}>
              <Image style={styles.avatar_conversa} source={{ uri: item.avatar }} />
              <View style={{ flexDirection: 'column', marginTop: 5 }}>
                <Text style={{ fontSize: 12, color: '#999' }}>{item.usuario}</Text>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                {typeof (item.mensagem) == "string" ?
                  <Text>{item.mensagem}</Text>
                  :
                  <Text> </Text>
                }
                </TouchableOpacity>
              </View>
              <Text> Like: {count}</Text>
            </View>

          ))
        }
      </ScrollView>


      <View style={styles.footer}>
        <TextInput
          style={styles.input_mensagem}
          onChangeText={text => setCaixaTexto(text)}
          value={caixaTexto} />

        <TouchableOpacity onPress={salvar}>
          <Ionicons style={{ margin: 3 }} name="md-send" size={32} color={'#999'} />
        </TouchableOpacity>
      </View>



    </View>)

    
}



const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'flex-start',
    width: '100%',
    paddingTop: 50,
    borderBottomWidth: 1,
    borderColor: '#fff'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#333'
  },

  avatar_conversa: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10
  },

  nome_usuario: {
    fontSize: 20,
    color: '#999'
  },

  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 50
  },
  input_mensagem: {
    borderColor: '#e6e6e6',
    borderWidth: 1,
    flex: 1,
    borderRadius: 4,
    margin: 10,
    marginTop: 4,
    padding: 2
  },
  scrollView: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
  },
  linha_conversa: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 200,
  }
})
