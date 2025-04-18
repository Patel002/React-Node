import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios'
import { SettingsContext } from "../context/SettingsContext";
import showToast from "../helper/Toast";

const Setting = () => {

    const { section = "setting"} = useParams();

    const [title, setTitle] = useState(SettingsContext);
    const [infoId, setInfoId] = useState(null); 

    const[glCodes, setGlCodes] = useState([]);
    const[mappingRows, setMappingRows] = useState([
          {type: "Purchase Account", glCode: ""},
          {type: "Sales Account", glCode: ""},
          {type: "Inventory Account", glCode: ""},
          {type: "Expense Account", glCode: ""},
          {type: "Receivables Account", glCode: ""},
    ]);

    const [minQuoteEnabled, setMinQuoteEnabled] = useState(false);
    const [supplierQuotes, setSupplierQuotes] = useState("");
    

    const handleToggleMinQuote = () => {
      setMinQuoteEnabled(!minQuoteEnabled);
      if (minQuoteEnabled) setSupplierQuotes("");
    };
    

      const DEFAULT_TERMS = {
        purchase: `1. Payment within 30 days from invoice date.
      2. Goods once sold will not be taken back.
      3. All disputes subject to [Your City] jurisdiction.`,
      
        "sales-tax": `1. Tax is applicable as per prevailing government rates.
      2. Tax invoices will be provided with every shipment.`,
      
        "sales-quotation": `1. Quoted prices are valid for 15 days.
      2. Delivery timelines are subject to stock availability.`
      };
      
      const [terms, setTerms] = useState(DEFAULT_TERMS);


    const fetchTerms = async() => {
      try {
        
        const res = await axios.get(`http://localhost:7171/api/terms/get-terms`);
        const terms = res.data.terms;
        console.log("Terms:", res.data.terms);

        const termMap = {};
        terms.forEach(term => {
        termMap[term.type] = term.fullTerm;
      });

      setTerms({
        purchase: termMap["purchase"] || DEFAULT_TERMS.purchase,
        "sales-tax": termMap["sales-tax"] || DEFAULT_TERMS["sales-tax"],
        "sales-quotation": termMap["sales-quotation"] || DEFAULT_TERMS["sales-quotation"]
      });
      

      } catch (error) {
        console.log("Error while fetch terms",error)
      }
    }

    useEffect(() => {
      fetchTerms();
    }, []);

    const handleSaveTerm = async () => {
      try {

        const typesToSave = ["purchase","sales-tax", "sales-quotation"];

        for (const type of typesToSave) {
          const value = terms[type];
    
        const response = await axios.get(`http://localhost:7171/api/terms/get-terms?type=${type}`);
        const existing = response.data.terms;
        
        if (existing.length > 0) {
          await axios.patch(`http://localhost:7171/api/terms/update-terms/${existing[0].id}`, 
            { 
              fullTerm: value, 
              type 
            });
            console.log(existing[0].id);
        } else {
          await axios.post(`http://localhost:7171/api/terms/set-terms`, { 
            fullTerm: value, 
            type 
          });
        }
      }
      showToast('success',`Term Saved successfully`);
      fetchTerms();
      } catch (error) {
        console.error("Error saving term", error);
        showToast("error","Error saving term");
      }
    };
    
    const handleChange = (type, value) => {
      setTerms({ ...terms, [type]: value });
    };    
 
    useEffect(() => {
      const fetchGLCodes = async () => {
        try {
          const res = await axios.get("http://localhost:7171/api/glcode/get-gl-code");
          setGlCodes(res.data.account);
          console.log("GL codes:", res.data.account);
        } catch (error) {
          console.error("Error fetching GL codes:", error);
        }
      };
      fetchGLCodes();
    }, []);
    

    useEffect(() => {
      const fetchAccountingMappings = async () => {
        try {
          const res = await axios.get("http://localhost:7171/api/accounting/get-accounting");
          const existingMappings = res.data.accounting;
          console.log("Existing mappings:", existingMappings);  
    
          const updatedRows = mappingRows.map((row) => {
            const found = existingMappings.find((m) => m.type === row.type);
            return found ? { ...row, glCodeId: found.glCodeId } : row;
          });
    
          setMappingRows(updatedRows);
        } catch (error) {
          console.error("Error fetching accounting mappings:", error);
        }
      };
    
      fetchAccountingMappings();
    }, []);
    
    const handleMappingSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const res = await axios.get("http://localhost:7171/api/accounting/get-accounting");
        const existingMappings = res.data.accounting;
    
        const existingMap = {};
        existingMappings.forEach((m) => {
          existingMap[m.type] = m;
        });
    
        for (const { type, glCodeId } of mappingRows) {
          if (!glCodeId) continue;

          if (existingMap[type]) {
            await axios.patch(`http://localhost:7171/api/accounting/update-accounting/${existingMap[type].id}`, {
              glCodeId,
            });
          } else {
            await axios.post("http://localhost:7171/api/accounting/set-accounting", {
              type,
              glCodeId,
            });
          }
        }
    
        showToast("success","GL Code mappings saved successfully.");
      } catch (error) {
        console.error("Error saving mappings:", error);
        showToast("error","Failed to save mappings.");
      }
    };

    const handleGlCodeChange = (index, glCodeId) => {
      const updated = [...mappingRows];
      updated[index].glCodeId = glCodeId;
      setMappingRows(updated);
    };
  
    useEffect(() => {
        document.title = title || "Default Title";
        return () => {
          document.title = title;
        }
      }, [title]);

      useEffect(() => {
        const fetchInfo = async () => {
          try {
            const res = await axios.get("http://localhost:7171/api/settings/get-settings");
            if (res.data && res.data.data) {
              setTitle(res.data.data.title || "");
              setInfoId(res.data.data.id);
              console.log("response",res.data.data)
            }
          } catch (err) {
            console.log("No existing info found or error:", err.message);
          }
        };
        fetchInfo();
      }, []); 

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          if (infoId) {
            await axios.patch(`http://localhost:7171/api/settings/update/${infoId}`, {
              title: title,
            });
            showToast("success","Info updated successfully");
          } else {
            const res = await axios.post("http://localhost:7171/api/settings/set-settings", {
              title: title,
            });
            setInfoId(res.data?.data?.id);
            showToast("success","Info created successfully");
          }
        } catch (err) {
          console.error("Error saving info:", err.message);
          showToast("error","Failed to save info");
        }
      };

      const renderGeneralSettings = () => (
        <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group col-md-6">
            <label htmlFor="companyTitle">Title *</label>
            <input
              type="text"
              id="companyTitle"
              name="companyTitle"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {infoId ? "Update" : "Create"}
          </button>
        </form>
        </div>
      );
      
      useEffect(() => {
        fetchTerms("purchase");
      }, []);

        const renderPurchaseSettings = () => {
          return (
            <div>
               <div className="form-check form-switch mb-2">
        <input
          className="form-check-input mb-2"
          type="checkbox"
          role="switch"
          id="minQuoteSwitch"
          checked={minQuoteEnabled}
          onChange={handleToggleMinQuote}
        />
        <label className="form-check-label" htmlFor="minQuoteSwitch">
          Min. Quote Required
        </label>
      </div>

      {minQuoteEnabled && (
        <div className="mb-3">
          <label>No.tof Supplier Quotes</label>
          <input
            type="number"
            className="form-control "
            value={supplierQuotes}
            onChange={(e) => setSupplierQuotes(e.target.value)}
          />
        </div>
      )}
              <label>Purchase Terms</label>
              <div className="mb-3 mt-1">
                <textarea
                className="form-control"
                rows={2 }
                value={terms.purchase}
                onChange={(e) => handleChange("purchase", e.target.value)}
                />
               <button className="btn btn-primary mt-2" onClick={() => handleSaveTerm("purchase")}>
          Save Purchase Term
        </button>
              </div>
            </div>
          );
        };
        
      
      const renderAccountingSettings = () => (
        <div>
          <form onSubmit={handleMappingSubmit}>
            <h5 className="mb-2 fst-italic">GL Code Mapping</h5>
            <table className="table table-bordered">
              <thead>
                <tr className="w-50">
                  <th>Type</th>
                  <th>GL Code</th>
                </tr>
              </thead>
              <tbody>
                {mappingRows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.type}</td>
                    <td>
                      <select
                        className="form-select"
                        value={row.glCodeId}
                        onChange={(e) => handleGlCodeChange(index, e.target.value)}
                      >
                        <option value="">Select GL Code</option>
                        {glCodes.map((gl) => (
                          <option key={gl.id} value={gl.id}>
                            {gl.code}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="submit" className="btn btn-primary mt-3">Save</button>
          </form>
        </div>
      );
      

      const renderSalesSettings = () => (
        <div>
          <label>Sales Tax Terms</label>
          <textarea
            className="form-control mb-3"
            rows={3}
            value={terms["sales-tax"]}
            onChange={(e) => handleChange("sales-tax", e.target.value)}
          />
      
          <label>Sales Quotation Terms</label>
          <textarea
            className="form-control"
            rows={3}
            value={terms["sales-quotation"]}
            onChange={(e) => handleChange("sales-quotation", e.target.value)}
          />
      
      <div className="mt-2">
      <button className="btn btn-primary" onClick={handleSaveTerm}>
        Save Sales Terms
      </button>
    </div>
  </div>
      );
      

      const renderContent = () => {
        switch (section) {
          case "settings":
            return renderGeneralSettings();
          case "purchase":
            return renderPurchaseSettings();
          case "accounting":
            return renderAccountingSettings();
          case "sales":
            return renderSalesSettings();
          default:
            return <p>Section not found</p>;
        }
      };
    
    
      return (
        <div className="content-wrapper">
          <div className="container mt-5">
        <div className="card">
          
        <div className="card-header gap-4 pt-2">

          <Link style={{
            textDecoration: 'none'}} 
            to={'/settings/settings'} 
            className={`btn btn-link ${section === "settings" ? "fw-bold text-primary" : ""}`}
            >
           General Settings
            </Link>

            <Link 
            style={{
            textDecoration: 'none'}}
            to="/settings/purchase"
            className={`btn btn-link ${section === "purchase" ? "fw-bold text-primary" : ""}`}
            >
              Purchase
            </Link>

            <Link
            style={{
            textDecoration: 'none'}}
            to="/settings/sales"
            className={`btn btn-link ${section === "sales" ? "fw-bold text-primary" : ""}`}
            >
              Sales
            </Link>

            <Link
            style={{
              textDecoration: 'none'}}
            to="/settings/accounting"
            className={`btn btn-link ${section === "accounting" ? "fw-bold text-primary" : ""}`}
            >
              Accounting
            </Link>
            </div>

            <div className="card-body">
            {renderContent()}
        </div>
        </div>
        </div>
        </div>
      );
}

export default Setting;