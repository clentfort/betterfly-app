# Betterfly App

Better Butterfly Members App

## Environment

- Requires `eas-cli`
- Requires Java Version 17
- Requires Android Studio or other form of Android SDK

### Required

| Name                             | Purpose                                   |
| -------------------------------- | ----------------------------------------- |
| EXPO_PUBLIC_PARSE_APPLICATION_ID | Application ID configured on the backend  |
| EXPO_PUBLIC_PARSE_CLIENT_KEY     | REST Client Key configured on the backend |
| EXPO_PUBLIC_PARSE_SERVER_URL     | URL of the backend                        |

### Recommended

| Name                          | Purpose                                                              | Example                                                            |
| ----------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| ANDROID_HOME                  | Path were the Android SDK is. Required for expo to work.             | `"${HOME}/Library/Android/sdk"`                                    |
| JAVA_HOME                     | Path where Java Version 17 is installed. Required for gradle to work | `"/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home"` |
| EAS_LOCAL_BUILD_ARTIFACTS_DIR | Path were `eas` puts built binaries. If not set puts them into `./`  | `./dist`                                                           |
| PATH                          | Should provide [`emulator`][emulator-cli] and `java` (Version 17)    | `${ANDROID_HOME}/emulator/:/opt/homebrew/opt/openjdk@17/bin:$PATH` |

[emulator-cli]: https://developer.android.com/studio/run/emulator-commandline
