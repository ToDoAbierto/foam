/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package foam.core;

import android.content.Context;
import android.util.AttributeSet;

import foam.android.view.CheckBoxBridge;
import foam.android.view.ViewBridge;

public abstract class AbstractBooleanProperty extends AbstractProperty<Boolean> {

  public int compareValues(Boolean b1, Boolean b2) {
    return b1.equals(b2) ? 0 : b1 ? 1 : -1; // false < true, according to this.
  }

  public boolean toNative(Boolean o) {
    return o;
  }

  public ViewBridge<Boolean> createView(Context context, AttributeSet attrs) {
    return new CheckBoxBridge(context, attrs);
  }

  public ViewBridge<Boolean> createView(Context context) {
    return new CheckBoxBridge(context);
  }
}