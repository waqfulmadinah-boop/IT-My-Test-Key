package com.waqfulmadinah.gboardmulti

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.provider.Settings
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

class MainActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(32), dp(20), dp(32))
        }

        root.addView(TextView(this).apply {
            text = getString(R.string.setup_title)
            textSize = 22f
            setTextColor(Color.parseColor("#0F172A"))
        })

        root.addView(TextView(this).apply {
            text = getString(R.string.setup_body)
            textSize = 15f
            setTextColor(Color.parseColor("#334155"))
            setPadding(0, dp(12), 0, dp(24))
        })

        root.addView(button(getString(R.string.enable_keyboard)) {
            startActivity(Intent(Settings.ACTION_INPUT_METHOD_SETTINGS))
        })

        root.addView(button(getString(R.string.select_keyboard)) {
            val manager = getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
            manager.showInputMethodPicker()
        })

        val scroll = ScrollView(this).apply {
            addView(
                root,
                ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
            )
        }

        setContentView(scroll)
    }

    private fun button(label: String, onClick: () -> Unit): Button {
        return Button(this).apply {
            text = label
            isAllCaps = false
            setOnClickListener { onClick() }
        }
    }

    private fun dp(value: Int): Int {
        return (value * resources.displayMetrics.density).toInt()
    }
}
