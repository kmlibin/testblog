const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, ""); // Removes all HTML tags
  };
  
  export default function truncateHTMLText(html: string, limit: number) {
    const text = stripHtml(html);
    return text.split(" ").slice(0, limit).join(" ") + "...";
  }
