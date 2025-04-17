import { useEffect, useState, } from 'react';
import axios from 'axios';
import showToast from '../helper/Toast';

const CompanyInfoForm = () => {
  const [formData, setFormData] = useState({
    companyFullName: '',
    companyShortName: '',
    proprietor: '',
    phone: '',
    phone2: '',
    emailId: '',
    emailId2: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    pincode: '',
    city: '',
    stateCode: '',
    gstNo: '',
    gstApplicable: false,
    cinNo: '',
    panNo: '',
    website: '',
    logo: null
  });

  const [existingInfoId, setExistingInfoId] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [pincodeError, setPincodeError] = useState('');

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [postlCode, setPostlCode] = useState([]);

  const validatePincode = (value) => {
    const pinRegex = /^[1-9][0-9]{5}$/; 
    if (!pinRegex.test(value)) {
      setPincodeError('Invalid pincode. Must be 6 digits.');
    } else {
      setPincodeError('');
    }
  };

  const API_KEY = "N2hVOU5LY3NWaE9rV3A3SW5NWjZJaFo5eVRQVDE5cVkyc0drRGVpcw==";

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://api.countrystatecity.in/v1/countries', {
          headers: {
            'X-CSCAPI-KEY': API_KEY
          }
        });
        // console.log(res.data);
        setCountries(res.data);
      } catch (error) {
        console.log('Error fetching countries:', error.message);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.country) {

      const fetchStates = async (countryIso2) => {
        try {
          const res = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryIso2}/states`, {
            headers: {
             'X-CSCAPI-KEY': API_KEY
            }
          });
          console.log(res.data)
          setStates(res.data);
        } catch (error) {
          console.log('Error fetching states:', error.message);
        }
      };
      fetchStates(formData.country);
    }
  }, [formData.country]);


  useEffect(() => {
    if (formData.state) {
      const fetchCities = async (countryIso2, stateIso2) => {
        try {
          const res = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryIso2}/states/${stateIso2}/cities`, {
            headers: {
              'X-CSCAPI-KEY': API_KEY
            }
          });
          setCities(res.data);
        } catch (error) {
          console.log('Error fetching cities:', error.message);
        }
      };
      
    fetchCities(formData.country, formData.state);
    }
  }, [formData]);

  useEffect(() => {
        const fetchPostlCode = async() => {
          if(formData.country === 'IN' && formData.city){
          try {
            const res = await axios.get(`https://api.postalpincode.in/postoffice/${formData.city}`)
            console.log("response",res);

            const offices = res.data[0]?.PostOffice  || [];

            setPostlCode(
              offices.map((office) => ({
                label: `${office.Name} - ${office.Pincode}`,
                value: office.Pincode
              }))
            );
            
            // console.log("formattedOption",formattedOption);

          } catch (error) {
            console.log("Error while fetch city post code", error)
            showToast("error","Error while selecting postal code");
          }
      }
    }

    fetchPostlCode();

  }, [formData])


  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get('http://localhost:7171/api/info/info');
        if (res.data && res.data.data) {
          setFormData(res.data.data);
          setExistingInfoId(res.data.data.id);

          const logoUrl = (`http://localhost:7171/api/info/logo/${res.data.data.id}`)
          console.log(logoUrl)
          console.log(res.data.data.id)
          setLogoPreview(logoUrl)
        }
      } catch (error) {
        console.log('No existing info or error:', error.message);
      }
    };

    fetchInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
   
  if (name === "logo" && files && files[0]) {
    setFormData((prev) => ({
      ...prev,
      logo: files[0],
    }));
    setLogoPreview(URL.createObjectURL(files[0]));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (name === 'pincode') {
    validatePincode(value);
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        logo,
        ...infoWithoutLogo
      } = formData;

      if (existingInfoId) {

        await axios.patch(`http://localhost:7171/api/info/update/${existingInfoId}`, infoWithoutLogo,{
          headers:{
            'Content-Type': 'application/json'
          }
        });

        console.log("existingInfoId",existingInfoId)
        console.log("Updating with:", infoWithoutLogo);

        if (logo) {
          const logoFormData = new FormData();
          logoFormData.append("logo", logo);

          const res = await axios.patch(`http://localhost:7171/api/info/update-logo/${existingInfoId}`, logoFormData);

          const updatedLogoPath = res.data?.data?.logo;
          if (updatedLogoPath) {
            setLogoPreview(`http://localhost:7171/${updatedLogoPath}?t=${Date.now()}`);
          }  
        }
        showToast("success",'Info updated successfully');

      } else {
        const createFormData = new FormData();
        Object.entries(formData).forEach(([key, val]) =>
          createFormData.append(key, val)
        );

        await axios.post('http://localhost:7171/api/info/c-info', createFormData);

        showToast("success",'Info created successfully');
      }

    } catch (err) {
      console.error(err);
      showToast("error",'Something went wrong');
    }
  };

  return (
  <div className='content-wrapper'>
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
           
          <h3 className="card-title"> <i className='fa-solid fa-user'></i> Company Details</h3>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="card-body row">
            <div className="form-group col-md-3">
              <label>Company Full Name *</label>
              <input type="text" className="form-control" name="companyFullName" value={formData.companyFullName} onChange={handleChange} autoComplete='off' required />
            </div>

            <div className="form-group col-md-3">
              <label>Company Short Name *</label>
              <input type="text" className="form-control" name="companyShortName" value={formData.companyShortName} autoComplete='off' onChange={handleChange} required />
            </div>

            <div className="form-group col-md-3">
              <label>Proprietor *</label>
              <input type="text" className="form-control" name="proprietor" value={formData.proprietor} onChange={handleChange} autoComplete='off' required />
            </div>

            <div className="form-group col-md-3">
              <label>Phone *</label>
              <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} autoComplete='off' required/>
            </div>

            <div className="form-group col-md-3">
              <label>Phone 2</label>
              <input type="text" className="form-control" name="phone2" value={formData.phone2} onChange={handleChange} autoComplete='off' />
            </div>

            <div className="form-group col-md-3">
              <label>Email ID *</label>
              <input type="email" className="form-control" name="emailId" value={formData.emailId} onChange={handleChange} autoComplete='off' required/>
            </div>

            <div className="form-group col-md-3">
              <label>Email ID 2</label>
              <input type="email" className="form-control" name="emailId2" value={formData.emailId2} onChange={handleChange} />
            </div>

            <div className="form-group col-md-3">
            <label>GST Applicable *</label>
            <select
                className="form-control"
                name="gstApplicable"
                value={formData.gstApplicable}
                onChange={handleChange}
                required
            >
                <option value="">-- select --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            </div>

            <div className="form-group col-md-3">
              <label>GST No *</label>
              <input type="text" className="form-control" name="gstNo" value={formData.gstNo} onChange={handleChange} autoComplete='off' required />
            </div>

            <div className="form-group col-md-3">
              <label>PAN No *</label>
              <input type="text" className="form-control" name="panNo" value={formData.panNo} onChange={handleChange} autoComplete='off' required />
            </div>

            <div className="form-group col-md-3">
              <label>CIN No</label>
              <input type="text" className="form-control" name="cinNo" value={formData.cinNo} autoComplete='off' onChange={handleChange} />
            </div>

            <div className="form-group col-md-3">
              <label>Website</label>
              <input type="text" className="form-control" name="website" value={formData.website} autoComplete='off' onChange={handleChange} />
            </div>

            <div className="form-group col-md-3">
            <label>Country *</label>
            <select
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  {countries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>

            </div>

            <div className="form-group col-md-3">
            <label>State *</label>
                <select
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  {states.map((state) => (
                    <option key={state.iso2} value={state.iso2}>
                      {state.name}
                    </option>
                  ))}
                </select>
            </div>

            <div className="form-group col-md-3">
              <label>City *</label>
              <select
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>

            </div>

            <div className="form-group col-md-3">
              <label>Pincode *</label>
              <select className={`form-control ${pincodeError ? 'is-invalid' : ''}`}
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required>

          <option value="">-- Select --</option>
              {postlCode.map((option, index) => (
                <option key={index} value={option.value}>
                 {option.label}
                </option>
              ))}
              </select>
              {pincodeError && <div className="invalid-feedback">{pincodeError}</div>}
            </div>

            <div className="form-group col-md-3">
              <label>State Code </label>
              <input type="text" className="form-control" name="stateCode" value={formData.stateCode} onChange={handleChange} />
            </div>

            <div className="form-group col-md-3">
              <label>Address Line 1 *</label>
              <input type="text" className="form-control" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
            </div>

            <div className="form-group col-md-3">
              <label>Address Line 2</label>
              <input type="text" className="form-control" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
            </div>

            <div className="form-group col-md-6 d-flex align-items-start">
            <div style={{ flex: 1 }}>
            <div className="mr-4">
              <label>Company Logo *</label>
              <input type="file" className="form-control" name="logo" onChange={handleChange} />
            </div>
          </div>
          {logoPreview && (
                <div className="form-group col-md-6 mt-3">
                  <div>
                    <img
                      src={logoPreview}
                      style={{ width: '60%', height: '60%', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              )}
              </div>
              </div>
  
          <div className="card-footer">
            <button type="submit" className="btn btn-primary">
              {existingInfoId ? 'Update Details' : 'Create Info'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CompanyInfoForm;
