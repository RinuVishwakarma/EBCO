export const copyTextToClipBoard =  (text: string) => {
    try {
      if (!navigator.clipboard) {
        console.error("Clipboard API not supported");
        return;
      }
       navigator.clipboard.writeText(text);
      console.log("Text copied");
      // toast.success('Copied to Clipboard!')
    } catch (error) {
      console.error("Error while copying:", error);
    }
  };