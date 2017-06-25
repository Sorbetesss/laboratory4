/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.views.textinput;

import javax.annotation.Nullable;

import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputConnectionWrapper;
import android.widget.EditText;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;

/**
 * This class wraps the {@link InputConnection} as returned by
 * {@link EditText#onCreateInputConnection(EditorInfo)} of the underlying {@link ReactEditText}
 * of {@link ReactTextInputManager}
 * The job of this class is to determine the key pressed by the soft keyboard.
 *
 * Firstly, we can make some deductions about a soft keyPress based on changes to the position of the
 * input cursor before and after the edit/change. We know that if there was no text selection before
 * the edit, and the cursor moves backwards, then it must be a delete; equally if it moves forwards
 * by a character, then we deduce the key input is the character preceding the new cursor position.
 * We also know if there was no text selection before the edit and the cursor was at the beginning of the input before,
 * and still is after,then it must also be a delete, i.e. an 'empty delete' where no text actually is deleted.
 * N.B. we are making the assumption that {@link InputConnection#endBatchEdit()} will fire in this case.
 *
 * In cases where there was a text selection before the edit, if the start of the selection is the same
 * after the edit as it was before, then we know it is a delete, if it is not the same, i.e.
 * it has moved forward a character, then we take that character to be the key input, i.e. a user
 * has selected some text and pressed a character to replace the selected text.
 *
 * With {@link EditText}s, text can be in two different states in the input itself, 'committed' &
 * currently 'composing'. N.B there is no composing text state when auto-correct is disabled, text
 * will be committed straight away character by character.
 * When a user is composing a word we get a callback to {@link InputConnection#setComposingText(CharSequence, int)}
 * with the entire word being composed. For example, composing 'hello' would result callbacks with
 * 'h', 'he', 'hel' 'hell', 'hello'. Our above logic for deriving the keyPress based on cursor position
 * handles this case. However we need additional logic surrounding the case whereby text can be committed.
 *
 * It is up to the IME to decide when text changes state from 'composing' to 'committed',
 * however the stock Android keyboard, for example, changes text being composed to be committed
 * when a user selects an auto-correction from the bar above the keyboard or presses 'space' or 'enter
 * to complete the word or text. In this case, our above logic with cursor positions does not apply,
 * as our cursor could be anywhere within the word being composed when a correction is selected,
 * and clearly selecting a single character from this correction would be the wrong thing to do.
 * It's fairly arbitrary, but we can set our keyPress to be the correction itself as this is what
 * the iOS implementation of 'onKeyPress' does.
 * In the case where a user commits with a space or enter, the stock IME first commits the composing text,
 * and then commits the user input of space or return afterwards, as a secondary commit within the batch edit. We of course
 * want the keyPress entered by the user, so we take the second of these two commits as the keyPress.
 *
 * A final case is the case whereby a user has committed some text, and their cursor comes straight
 * after the word they have just committed with no trailing space, as is the default behavior. If a user
 * is to input a character as to start a new word, the stock IME will first commit a space to the
 * input, and then set the composing text to be the character the user entered. In this case we
 * choose our onKeyPress to be the new composing character.
 */
 class ReactTextInputInputConnection extends InputConnectionWrapper {
  public static final String NewLineRawValue = "\n";
  public static final String BackspaceKeyValue = "Backspace";
  public static final String EnterKeyValue = "Enter";

  private @Nullable ReactEditText mEditText;
  private EventDispatcher mEventDispatcher;
  private int mPreviousSelectionStart;
  private int mPreviousSelectionEnd;
  private String mCommittedText;
  private String mComposedText;

  public ReactTextInputInputConnection(
      InputConnection target,
      boolean mutable,
      final ReactContext reactContext) {
    super(target, mutable);
    mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
  }

  public void setEditText(final ReactEditText editText) {
    mEditText = editText;
  }

  @Override
  public boolean setComposingText(CharSequence text, int newCursorPosition) {
    mComposedText = text.toString();
    return super.setComposingText(text, newCursorPosition);
  }

  @Override
  public boolean commitText(CharSequence text, int newCursorPosition) {
    mCommittedText = text.toString();
    return super.commitText(text, newCursorPosition);
  }

  @Override
  public boolean beginBatchEdit() {
    mPreviousSelectionStart = mEditText.getSelectionStart();
    mPreviousSelectionEnd = mEditText.getSelectionEnd();
    mCommittedText = null;
    mComposedText = null;
    return super.beginBatchEdit();
  }

  @Override
  public boolean endBatchEdit() {
    String key;
    int selectionStart = mEditText.getSelectionStart();
    if (mCommittedText == null) {
      if ((noPreviousSelection() && selectionStart < mPreviousSelectionStart)
          || (!noPreviousSelection() && selectionStart == mPreviousSelectionStart)
          || (mPreviousSelectionStart == 0 && selectionStart == 0)) {
        key = BackspaceKeyValue;
      } else {
        char enteredChar = mEditText.getText().charAt(selectionStart - 1);
        key = String.valueOf(enteredChar);
      }
    }
    else {
      key = mComposedText != null ? mComposedText : mCommittedText;
    }
    key = keyValueFromString(key);
    mEventDispatcher.dispatchEvent(
        new ReactTextInputKeyPressEvent(
            mEditText.getId(),
            key));
    return super.endBatchEdit();
  }

  private boolean noPreviousSelection() {
    return mPreviousSelectionStart == mPreviousSelectionEnd;
  }

  private String keyValueFromString(final String key) {
    String returnValue;
    switch (key) {
      case "": returnValue = BackspaceKeyValue;
        break;
      case NewLineRawValue: returnValue = EnterKeyValue;
        break;
      default:
        returnValue = key;
        break;
    }
    return returnValue;
  }
}
