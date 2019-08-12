
# Litentry Signer

## Build it
### Requirements

- `node.js` (tested on `v8.4.0`)
- `yarn` (tested on `1.6.0`)
- `rustup` (tested on `rustup 1.16.0`)
- `rustc` (tested on `rustc 1.32.0 (9fda7c223 2019-01-16)`)
- `cargo` (tested on `cargo 1.32.0 (8610973aa 2019-01-02)`)
- `android_ndk` (tested on `r19`)
- `Android Studio` (only for Android, tested on `Version 3.3`)
- `Xcode` (only for iOS, tested on `Version 9.4.1 (9F2000)`)
- `$NDK_HOME` envarionment variable set to ndk home directory (eg. `/usr/local/opt/android-ndk`)
- `$JAVA_HOME` envarionment variable set to java home directory (eg. `/Library/Java/JavaVirtualMachines/jdk1.8.0_60.jdk/Contents/Home`)
- `$ANDROID_HOME` environment variable set to Android SDK directory (eg. `/home/your_username/Android/Sdk`)*.

\* It's recommended to install **Android Studio** and use that to install the necessary build tools and SDKs for the Android version you want to test on. It's also the best way to test in the emulator. **DO NOT INSTALL NDK VIA ANDROID STUDIO** as that will install the latest version. Make sure to get `r19` instead.

### Setup

- macOS

    ```
    ./setup_macos.sh

    echo "ndk.dir=$NDK_HOME" > android/local.properties
    echo "sdk.dir=$ANDROID_HOME" >> android/local.properties
    ```

- linux

    ```
    ./setup_linux.sh

    echo "ndk.dir=$NDK_HOME" > android/local.properties
    echo "sdk.dir=$ANDROID_HOME" >> android/local.properties
    ```

### Usage

first, start React Native server

```
yarn start
```

and then 

- iOS

    ```
    yarn run ios
    ```

- Android

    ```
    yarn run android
    ```

### Troubleshooting

#### `No dimension set for key window` on Android < 5.0

This error should be accompanied with `error: closed` in terminal when deploying the debug version of the signer on a device that runs Android older than 5.0. It happens because the Android API does not support the reverse proxy that would allow the phone to communicate with the debug server on your computer.

A suitable workaround is to run both devices on the same WiFi and use your local WiFi IP address. Check your WiFi settings for your local IP address (eg. `192.168.1.42`), then, while having the app open on the phone (either on error page or blank screen) run a command in terminal:

```
adb shell input keyevent 82
```

(You can find `adb` binary in your local Android SDK folder under `platform-tools`, eg. `/home/your_username/Android/Sdk/platform-tools`)

This should open a menu on the device. In that menu go to `Dev Settings` > `Debug server host & port for device`, and enter your local IP address with port 8081 (eg. `192.168.1.42:8081`). Restart the app, the error should disappear.

#### Upgrading NDK from `r13b` to `r19`

1. [Download NDK `r19`](https://developer.android.com/ndk/downloads/), unpack it in a convenient location.
1. Update your `NDK_HOME` env variable to the absolute path of the NDK directory.
1. Edit `./android/local.properties` so that `ndk.dir` points to the absolute path to the NDK directory.
1. Remove old NDK build with `rm -rf ./NDK`.
1. Build the new NDK with `./create-ndk-standalone.sh`.
