# Add project specific ProGuard rules here.
# WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class android.webkit.** { *; }

# Keep app classes
-keep class com.desiixvideo.app.** { *; }
