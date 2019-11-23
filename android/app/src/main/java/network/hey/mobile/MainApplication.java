package network.hey.mobile;

import com.swmansion.reanimated.ReanimatedPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.actionsheet.ActionSheetPackage;
import com.imagepicker.ImagePickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

      @Override
      protected ReactGateway createReactGateway() {
          ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
              @Override
              protected String getJSMainModuleName() {
                  return "index";
              }
          };
          return new ReactGateway(this, isDebug(), host);
      }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
      }

    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeExceptionHandlerPackage(),
            new ReanimatedPackage(),
            new SplashScreenReactPackage(),
            new RNFetchBlobPackage(),
            new ImageResizerPackage(),
            new ReactNativeRestartPackage(),
		  new RNFirebaseMessagingPackage(),
		  new RNFirebasePackage(),
		  new RNI18nPackage(),
		  new ActionSheetPackage(),
		  new ImagePickerPackage(),
		  new LinearGradientPackage(),
		  new VectorIconsPackage(),
		  new RNGestureHandlerPackage()
      );
    }
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
