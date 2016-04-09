@echo off
set /p version="Enter Build Version: "
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore %cd%/mykeys.keystore %cd%/platforms/android/build/outputs/apk/android-release-unsigned.apk taxfree4u
C:/Android/sdk/tools/zipalign -v 4 %cd%/platforms/android/build/outputs/apk/android-release-unsigned.apk %cd%/TaxFree4U_v.%version%.apk
pause