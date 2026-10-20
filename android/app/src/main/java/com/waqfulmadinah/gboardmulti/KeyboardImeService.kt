package com.waqfulmadinah.gboardmulti

import android.graphics.Color
import android.inputmethodservice.InputMethodService
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.widget.FrameLayout
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat

class KeyboardImeService : InputMethodService() {

    private var webView: WebView? = null

    private val assetLoader: WebViewAssetLoader by lazy {
        WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
    }

    override fun onCreate() {
        super.onCreate()
        setCandidatesViewShown(false)
    }

    override fun onCreateInputView(): View {
        val container = object : FrameLayout(this) {
            override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
                val desiredHeight = dp(300).coerceIn(dp(240), dp(360))
                super.onMeasure(
                    widthMeasureSpec,
                    View.MeasureSpec.makeMeasureSpec(desiredHeight, View.MeasureSpec.EXACTLY)
                )
            }
        }

        val view = WebView(this).apply {
            setBackgroundColor(Color.TRANSPARENT)
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            overScrollMode = View.OVER_SCROLL_NEVER
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
            setOnLongClickListener { true }

            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.mediaPlaybackRequiresUserGesture = false
            settings.textZoom = 100

            addJavascriptInterface(
                ImeWebBridge(
                    onCommitText = { text -> postToUi { commitText(text) } },
                    onDeleteBackward = { postToUi { deleteBackward() } },
                    onSendEnter = { postToUi { sendEnter() } },
                    onCloseKeyboard = { postToUi { requestHideSelf(0) } },
                ),
                BRIDGE_NAME
            )

            webViewClient = object : WebViewClientCompat() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }

                override fun onPageFinished(view: WebView, url: String) {
                    notifyJsStartInput()
                }
            }

            loadUrl(IME_URL)
        }

        webView = view
        container.addView(
            view,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )
        return container
    }

    override fun onStartInput(attribute: EditorInfo?, restarting: Boolean) {
        super.onStartInput(attribute, restarting)
        notifyJsStartInput()
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        notifyJsStartInput()
    }

    override fun onFinishInput() {
        evaluateJs("window.__gboardIme && window.__gboardIme.onFinishInput()")
        super.onFinishInput()
    }

    override fun onComputeInsets(outInsets: InputMethodService.Insets) {
        super.onComputeInsets(outInsets)
        outInsets.contentTopInsets = outInsets.visibleTopInsets
        outInsets.touchableInsets = InputMethodService.Insets.TOUCHABLE_INSETS_VISIBLE
    }

    override fun onDestroy() {
        webView?.destroy()
        webView = null
        super.onDestroy()
    }

    private fun notifyJsStartInput() {
        val subtype = getSystemService(InputMethodManager::class.java)
            ?.currentInputMethodSubtype
            ?.languageTag
            ?: DEFAULT_SUBTYPE
        evaluateJs("window.__gboardIme && window.__gboardIme.onStartInput(${quote(subtype)})")
    }

    private fun evaluateJs(script: String) {
        webView?.post { webView?.evaluateJavascript(script, null) }
    }

    private fun postToUi(action: () -> Unit) {
        webView?.post { action() }
    }

    private fun commitText(text: String) {
        vibrateKey()
        currentInputConnection?.commitText(text, 1)
    }

    private fun deleteBackward() {
        val connection = currentInputConnection ?: return
        vibrateKey()
        connection.sendKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_DEL))
        connection.sendKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DEL))
    }

    private fun sendEnter() {
        val connection = currentInputConnection ?: return
        val action = currentInputEditorInfo?.imeOptions?.and(EditorInfo.IME_MASK_ACTION)
            ?: EditorInfo.IME_ACTION_NONE
        if (action != EditorInfo.IME_ACTION_NONE && action != EditorInfo.IME_ACTION_UNSPECIFIED) {
            connection.performEditorAction(action)
        } else {
            connection.sendKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER))
            connection.sendKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER))
        }
    }

    private fun vibrateKey() {
        val vibrator = getSystemService(Vibrator::class.java) ?: return
        if (!vibrator.hasVibrator()) return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(14, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(14)
        }
    }

    private fun quote(value: String): String {
        val escaped = value.replace("\\", "\\\\").replace("'", "\\'")
        return "'$escaped'"
    }

    private fun dp(value: Int): Int {
        return (value * resources.displayMetrics.density).toInt()
    }

    private companion object {
        const val BRIDGE_NAME = "AndroidIME"
        const val DEFAULT_SUBTYPE = "bn_BD"
        const val IME_URL = "https://appassets.androidplatform.net/assets/www/index.html?ime=1"
    }
}
