import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import { StyleSheet, Text, View,Input,ul,li,FlatList,ScrollView, Dimensions} from 'react-native';
import { SearchBar,  CheckBox,  Button } from 'react-native-elements';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import { set } from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MapViewDirections from 'react-native-maps-directions';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import useForceUpdate from 'use-force-update';


export default function App() {

  const [search, setSearch] = useState(``);
  const [searchResults, setSearchResults] = React.useState([]);
  const [currentNav, setNav] = useState({});
  let [ingredients, setIngredients] = React.useState([]);
  const [currentStore,setStore] = useState(``);
  const Stack = createNativeStackNavigator();
  const [tripTime,setTripTime] = useState('');
  const [tripDistance,setTripDistance] = useState('');
  const [choseStores,setChosenStores] = useState([]);
  const [currentNavStore,setNavStore] = useState('');
  // RNLocation.configure({
  //   distanceFilter: null
  //  })

  const sauce = [
    {id: 'Alfredo', price: 3.60, stock: 'Loblaws, Metro'},
    {id: 'Marinaria', price:  3.80, stock: 'Farm Boy'},
    {id: 'Apple', price: 60.0, stock: 'Loblaws, Farm Boy'},
    {id: 'Orange', price:  70.0, stock: 'Metro'},
  ];

  const stores = [
    [{latitude: 43.02909368078946 ,longitude: -81.28254833491538},"Loblaws"],
    [{latitude: 42.99129752163818, longitude: -81.27530057427671},"Metro"],
    [{latitude: 42.992273497494324, longitude: -81.29739968418613},"Farm Boy"],
  ]

  
  function updateTD(result) {
    setTripTime((result.duration).toFixed(2))
    setTripDistance(result.distance.toFixed(2))
    
  }

  React.useEffect(() => {
    let result = sauce.map(a => a.id);
    const results = result.filter(result =>
      result.includes(search)
    );
    setSearchResults(results);
  }, [search]);

  const forceUpdate = useForceUpdate();
  const HomeScreen = ({navigation}) => {


    return (
  
      <View style={styles.container}>
      <ScrollView>
      <View >
        {/* <Text style={{fontSize: 40,color:"blue" }}>Ingredient Finder</Text> style={styles.container}*/}
        <SearchBar style={styles.search} lightTheme
          placeholder="Enter the Desired Ingredient"
          onChangeText={text => setSearch(text)}
          value={search}
          autoFocus
        />
        <FlatList
          data= {sauce.filter(obj => {return searchResults.includes(obj.id)})}
          renderItem={({item}) => ( 
            <ListItem>            
              <Text style={styles.item}>{item.id}</Text>
              {/* <CheckBox style={styles.checkBox}  checkedIcon='clear' checkedColor='red' iconRight={true} onPress={setIngredients(sauce.indexOf(item.id))}/> */}
              <Button title="Buy" onPress={() => itemBuy(item)}/>
            </ListItem>       
  
          )}
        />
        
        
      </View>
      <View >
      <Text style={styles.title}>Current Ingredients</Text>
      <FlatList extraData={dataProcess()}
          data= {dataProcess()}
          renderItem={
            
            ({item}) => ( 
            <ListItem>            
              <Text style={styles.item}>{item.id}</Text>
              <Button title="Remove Item" onPress={() => itemRemove(item)}/>
            </ListItem>       
          
          )}
        />
        
      </View>
      <View >
      {/* <Button title="Save Current Ingredients" onPress={() => alert(dataProcess())}></Button> */}
      <Button title="View My Cart" style={styles.button} onPress={() => navigation.navigate('Cart')}></Button>
        <StatusBar style="auto" />
        
      </View>
          
      </ScrollView>
      </View>
    )
  
  }

  function itemBuy(item) {

    if (!dataProcess().map(function(key){return key.id}).includes(item.id)) {
      ingredients.push(['id', item.id,'price', item.price,'stock',item.stock])
      dataProcess()
      forceUpdate();
    }
    else {
      alert("Item already in cart")
    }
  }

  function itemRemove(item) {

      setIngredients(ingredients.filter(a => (a[1] != item.id))) 
      dataProcess()
      forceUpdate();
      console.log(ingredients)
  }


  const ItemFind = ({ navigation}) => {
    return (
      <View>
      <ScrollView>
        <ListItem> 
        <Text style={styles.titleitem}>Current Food: </Text>
        <Text style={styles.titleitem}> {currentNav.id}</Text>
        </ListItem>   
        
        
        
        <MapView style={styles.map} initialRegion={{
      latitude: 42.9942567553923,
      longitude: -81.27906148665927,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,

      
    }}>
      {stores.map((marker) => (<Marker
            coordinate={marker[0]}
            title={marker[1]}
            onPress={() => setStore(marker)}
            
            
          />
      ))}
      <MapViewDirections
    origin={{latitude: 42.9942567553923,
      longitude: -81.27906148665927}}
    destination={currentStore[0]}
    apikey={''}
    lineDashPattern = {
   [1]
}
strokeWidth={8}
onRes
onReady={result => {
              updateTD(result);
            }}

  />
      
          
          
          </MapView>

          <Text style={styles.titleitem}> {"Distance Estimated: " + tripDistance + " km"}</Text>
        <Text style={styles.titleitem}> {"Time Estimated: " + tripTime + " minutes"}</Text>
        <Button title={"Choose " + currentStore[1]} onPress={() => chooseHandle()}></Button>
        <Text style={styles.titleitem}> {"Chosen Locations"}</Text>
        <FlatList extraData={storesProcess()}
          data= {storesProcess()}
          renderItem={
            
            ({item}) => ( 
            <ListItem style={styles.rowStyle}>            
              <Text style={styles.cartItem}>{item.id}</Text>
            </ListItem>       
          
          )}
        />
        <Button title={"Navigate to Stores"} onPress={() => navChange(navigation)}></Button>
        </ScrollView>
      </View>
      
    );

  }


  function chooseHandle() {

    if (!choseStores.map(function(key){return key.id}).includes(currentStore.id) && currentStore !=null) {
      choseStores.push(currentStore)
      setNav(sauce[1]);
    }
    else {
      alert("Already chose " + currentStore.id)
    }
    
    setStore([{latitude: 42.9942567553923, longitude: -81.27906148665927},"A Store"])
    updateTD({distance: 0, duration: 0});
    
  }
  const ListScreen = ({ navigation}) => {
    return (
      <View style={styles.gridContainer}>
      <ListItem style={styles.rowStyle}>            
              <Text style={styles.titleitem}>Item</Text>
              <Text style={styles.titleitem}>Price</Text>
              <Text style={styles.titleitem}>Stores</Text>
            </ListItem>   
      <FlatList extraData={dataProcess()}
          data= {dataProcess()}
          renderItem={
            
            ({item}) => ( 
            <ListItem style={styles.rowStyle}>            
              <Text style={styles.cartItem}>{item.id}</Text>
              <Text style={styles.cartItem}>{item.price}</Text>
              <Text style={styles.cartItem}>{item.stock}</Text>
            </ListItem>       
          
          )}
        />

        <ListItem style={styles.rowStyle}>
        <View style={styles.rowStyle}>
          <Text style={styles.item}>Current Ingredients</Text>
          <Text style={styles.item}>{sum()}</Text>
        </View>
        </ListItem> 

        <Button title="Find my Items" style={styles.button} onPress={() => changeTo(navigation)}></Button>
        </View>
        
    );
  };

  const NavScreen = ({ navigation}) => {
    return (
      <View>
            <Text style={styles.title}>{"Going to: " + currentNavStore[1]}</Text>
            <MapView style={styles.mapnav} initialRegion={{
              latitude: 42.9942567553923,
              longitude: -81.27906148665927,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
        
              
            }}>
              {choseStores.map((marker) => (<Marker
                    coordinate={marker[0]}
                    title={marker[1]}
                    onPress={() => setStore(marker)}
                    
                    
                  />
              ))}
              <MapViewDirections
            origin={{latitude: 42.9942567553923,
              longitude: -81.27906148665927}}
            destination={currentStore[0]}
            apikey={''}
            lineDashPattern = {
          [1]
        }
        strokeWidth={8}
        onRes
        onReady={result => {
                      updateTD(result);
                    }}
        
          />
        
            
            
            </MapView></View>

      
    );
  };

  function navChange(navigation) {
    navigation.navigate('NavScreen')
    setNavStore(choseStores[0])
  }
  function changeTo(navigation) {
    navigation.navigate('ItemFind')
    console.log(sauce[0].id)
    setNav(sauce[0])
  }
  function sum() {
    var sum = 0
    let current
    for (let i =0; i < ingredients.length;i++) {
      current = ingredients[i] 
      sum = sum + current[3]
    }
    return sum
  }
  function dataProcess() {
    //console.log(ingredients)
       var ingredArray= [];
      //console.log(ingredients)
      let current
      let obj

      for (let i =0; i < ingredients.length;i++) {
        current = ingredients[i] 
        obj = {'id':current[1],'price':current[3],'stock':current[5]}
        ingredArray.push(obj)
      }
      
    
    //ingredients.forEach(function(item) {ingredArray.push(Object.fromEntries(item))})
    return ingredArray;
  }

  function storesProcess() {
    //console.log(ingredients)
       var storesArray= [];
      //console.log(ingredients)

      let current
      let obj
      for (let i =0; i < choseStores.length;i++) {
        current = choseStores[i] 
        obj = {'id':choseStores[i][1],"ll":choseStores[i][0],"time":tripTime,"distance":tripDistance}

        
        storesArray.push(obj)
      }
      
    
    //ingredients.forEach(function(item) {ingredArray.push(Object.fromEntries(item))})
    return storesArray;
  }



  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'IngredFind' }}
        />
        <Stack.Screen name="Cart" component={ListScreen} options={{ title: 'My Cart' }} />
        <Stack.Screen name="ItemFind" component={ItemFind} options={{ title: 'Store Find' }} />
        <Stack.Screen name="NavScreen" component={NavScreen} options={{ title: 'Navigate to Stores' }} />
    </Stack.Navigator>
    </NavigationContainer>
  );

  
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 0,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  search: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  checkBox:{
    padding:10,
  },
  button: {
    padding:10,
  },
  cartItem: {
    padding: 8,
    fontSize: 18,
    height: 44,
  },
  titleitem: {
    fontSize: 24,
    padding: 8,
    height: 44,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    padding: 8,
    height: 44,
    fontWeight: 'bold',
  },
  viewprice:{
    flex:1, 
    flexDirection: 'row',     
  },
  gridContainer: {
    width: 270,
},
rowStyle: {
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "space-around",
},
cellStyle: {
  flex: 1,
  margin: 10,
},
map: {
  width: Dimensions.get('window').width,
  height: 350,
},
mapnav: {
  width: Dimensions.get('window').width,
  height: 600,
},
});

// 
// Dimensions.get('window').height



