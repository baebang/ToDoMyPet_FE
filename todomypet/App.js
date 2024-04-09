import React, {useEffect} from 'react';
import {Platform} from 'react-native';

import {QueryClient, QueryClientProvider} from 'react-query';
import NavigationContainerComponent from './NavigationContainerComponent';
import SplashScreen from 'react-native-splash-screen';

function App() {
  const queryClient = new QueryClient();
  useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainerComponent />
    </QueryClientProvider>
  );
}

export default App;
