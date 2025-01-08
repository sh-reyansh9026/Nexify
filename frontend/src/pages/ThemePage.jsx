import React from "react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features",
    isSent: true,
  },
];

const ThemePage = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        {/* Theme Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map(
            (
              t // here we are mapping over the THEMES array and creating a button for each theme to show on setting page
            ) => (
              <button
                key={t} // t is the theme name used in mapping so we are using it as key
                className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"} 
              `} // if the localStorage theme == theme selected then we are adding bg-base-200 class else we are adding hover:bg-base-200/50 class
                onClick={() => setTheme(t)} // on click of the button we are calling setTheme function from useThemeStore and passing the theme name
              >
                <div
                  className="relative h-8 w-full rounded-md overflow-hidden"
                  data-theme={t} // setting the theme for the button
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    {" "}
                    {/* here we are creating a grid of 4 columns for each theme */}
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}{" "}
                  {/* here we are capitalizing the first letter of the theme name and t.slice is used to append the theme name starting from index 1 as index 0 is capitalized */}
                </span>
              </button>
            )
          )}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map(
                    (
                      message // here we are mapping over the PREVIEW_MESSAGES array and creating a div for each message to show in the chat preview
                    ) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isSent ? "justify-end" : "justify-start" // if message is sent then we are aligning it to right else we are aligning it to left
                        }`}
                      >
                        <div
                          className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${
                            message.isSent // if message is sent then bg-primary and text-primary-content else bg-base-200
                              ? "bg-primary text-primary-content"
                              : "bg-base-200"
                          }
                        `}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`
                            text-[10px] mt-1.5
                            ${
                              message.isSent // if message is sent then text-primary-content/70 else text-base-content/70
                                ? "text-primary-content/70"
                                : "text-base-content/70"
                            }
                          `}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly // making the input read only
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} /> {/* send icon */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThemePage;
