/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import SplashScreen from  "react-native-splash-screen";
import Navigation from './src/navigation/navigation';
import { Provider } from 'react-redux';
import { Store } from './src/redux/store';

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <Provider store={Store}>
      <Navigation  />
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
