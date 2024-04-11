import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Achievements from './Achievements';
import Journal from './Journal';
import MyFeed from './MyFeed';
import Pokedex from './Pokedex';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({state, navigation}) => {
  return (
    <>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tintColor = isFocused ? '#1DC2FF' : 'black';
          const tabWidth = 30; // Width of the indicator line

          return (
            <View key={route.key} style={styles.tab}>
              <TouchableOpacity // Use TouchableOpacity to remove touch feedback
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}>
                <Text style={{color: tintColor, padding: '5%'}}>
                  {route.name}
                </Text>
              </TouchableOpacity>

              {isFocused && (
                <View style={[styles.indicator, {width: tabWidth}]} />
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.border}></View>
    </>
  );
};

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="일지"
      screenOptions={{
        inactiveTintColor: 'black',
        activeTintColor: '#1DC2FF',
        indicatorStyle: {borderWidth: 0}, // Remove default indicator line
      }}
      tabBar={CustomTabBar}>
      <Tab.Screen name="일지" component={Journal} />
      <Tab.Screen name="업적" component={Achievements} />
      <Tab.Screen name="도감" component={Pokedex} />
      <Tab.Screen name="피드" component={MyFeed} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white', // Set your tab bar background color
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  indicator: {
    height: 3, // Height of the indicator line
    backgroundColor: '#1DC2FF', // Indicator line color
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
});

export default Tabs;
