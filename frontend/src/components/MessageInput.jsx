import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // file is selected
    if (!file.type.startsWith("image/")) {
      // if file is not an image then error is shown
      toast.error("Please select an image file");
      return;
    }

    // if file is an image then it is read using FileReader function and shown as preview
    const reader = new FileReader();
    reader.onloadend = () => {
      // when image is loaded then it is shown as preview
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file); // image is read as data url
  };

  const removeImage = () => {
    // when image is removed then image preview is removed
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // value of image field is set to null
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return; // if no text is written and no image is selected then nothing is done

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      // Clear form : after sending message text is set to null and image preview is removed
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Input field for chat if image is selected then imagePreview is shown by below code*/}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview} // image is shown
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button // it is the cross button to remove the image from the chat just before sending
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input field for chat */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Hidden input field to select image from your machine */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Button to select image from your machine */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()} // when this button is clicked then hidden input field is clicked to select image
          >
            <Image size={20} />
            {/* Image icon for selecting image from machine */}
          </button>
        </div>

        {/* Button to send message */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // button is disabled if no text is written and no image is selected
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
