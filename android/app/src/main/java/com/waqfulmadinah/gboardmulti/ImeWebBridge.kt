package com.waqfulmadinah.gboardmulti

import android.webkit.JavascriptInterface

class ImeWebBridge(
    private val onCommitText: (String) -> Unit,
    private val onDeleteBackward: () -> Unit,
    private val onSendEnter: () -> Unit,
    private val onCloseKeyboard: () -> Unit,
) {
    @JavascriptInterface
    fun commitText(text: String?) {
        if (text.isNullOrEmpty()) return
        onCommitText(text)
    }

    @JavascriptInterface
    fun deleteBackward() {
        onDeleteBackward()
    }

    @JavascriptInterface
    fun sendEnter() {
        onSendEnter()
    }

    @JavascriptInterface
    fun closeKeyboard() {
        onCloseKeyboard()
    }
}
