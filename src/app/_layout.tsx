import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/context/auth';
import { CheckoutProvider } from '@/context/checkout';
import { ensureNotificationPermission } from '@/lib/notifications';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    EduQLDHand: require('../../assets/fonts/EduQLDHand-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      void ensureNotificationPermission();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GluestackUIProvider mode="system">
      <AuthProvider>
        <CheckoutProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CheckoutProvider>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
