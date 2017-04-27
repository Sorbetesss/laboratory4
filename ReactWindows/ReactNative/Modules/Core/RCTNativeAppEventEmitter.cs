﻿using ReactNative.Bridge;

namespace ReactNative.Modules.Core
{
    /// <summary>
    /// Native app event emitter.
    /// </summary>
    public class RCTNativeAppEventEmitter : JavaScriptModuleBase
    {
        /// <summary>
        /// Emit a native app event.
        /// </summary>
        /// <param name="eventName">The event name.</param>
        /// <param name="data">The event data.</param>
        public void emit(string eventName, object data)
        {
            Invoke(nameof(emit), eventName, data);
        }
    }
}
