export const cleanDecimalInput = (rawVal) => {
    if (!rawVal) return "";
    
    let val = String(rawVal).replace(/,/g, "").replace(/[^0-9.]/g, "");
  
    const parts = val.split(".");
    if (parts.length > 2) {
      val = `${parts[0]}.${parts.slice(1).join("")}`;
    }
  
    return val;
  };