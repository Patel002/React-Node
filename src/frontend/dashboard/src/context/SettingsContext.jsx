import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settingsTitle, setSettingsTitle] = useState("");
  
    useEffect(() => {
      const fetchTitle = async () => {
        try {
          const res = await axios.get("http://localhost:7171/api/settings/get-settings");
          if (res.data?.data?.title) {
            setSettingsTitle(res.data.data.title);
            document.title = res.data.data.title;
          }
        } catch (err) {
          console.error("Failed to fetch settings:", err.message);
        }
      };
  
      fetchTitle();
    }, []);
  
    return (
      <SettingsContext.Provider value={{ settingsTitle, setSettingsTitle }}>
        {children}
      </SettingsContext.Provider>
    );
  };
  