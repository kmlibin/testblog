export const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Invalid Date";
  
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };