package com.first.bsp;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    WebView.setWebContentsDebuggingEnabled(true); // ✅ Add this line
  }
}
