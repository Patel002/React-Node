import { error } from "console";
import { Info } from "../model/info.model.js";
import fs from 'fs';
import path from 'path';

const getInfo = async(req, res) => {
    try {
        const {companyFullName,companyShortName,proprietor,phone,phone2,emailId,emailId2,country,state,pincode,city,stateCode,addressLine1,addressLine2,gstApplicable,gstNo,panNo,cinNo,website,logo} = req.body


        if (companyFullName && emailId && panNo && gstNo) {
            const existingInfo = await Info.findOne({
              where: { companyFullName, emailId, panNo, gstNo }
            });


        if(existingInfo){
            return res.status(400).json({
                message: "this company name with email, pan number and gst number is already present in system"
            })
        }
    }

        const info = await Info.create({
            companyFullName,
            companyShortName,
            proprietor,
            phone,
            phone2: phone2 ? phone2:null,
            emailId,
            emailId2: emailId2 ? emailId2:null,
            addressLine1,
            addressLine2 : addressLine1 ? addressLine2:null,
            country,
            state,
            pincode,
            city,
            stateCode,
            gstNo,
            gstApplicable,
            cinNo: cinNo ? cinNo:null,
            panNo,
            website,
            logo
        })

        if(!info)
        {
            return res.status(500)
                      .json({
                        message: "Error while creating Information"
                      }) 
        }

        return res.status(201).json({
            success:true,
            message:info
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const getAllInfo = async(req, res) => {
    try {
        const info = await Info.findOne();

        if(!info){
            return res.status(500).json({
                message: 'company information is not present'
            })
        }

        return res.status(200).json({
            success:true,
            data: info
        })
        
    } catch (error) {
        console.log("getAllInfo error",error);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
} 

const updateInfo = async(req, res) => {
    try {
        const {id} = req.params;
        const {companyFullName,companyShortName,proprietor,phone,phone2,emailId,emailId2,country,state,pincode,city,stateCode,addressLine1,addressLine2,gstApplicable,gstNo,panNo,cinNo,website} = req.body

        console.log("Request body:", req.body);


        const info = await Info.findByPk(id);

        if(!info){
            return res.status(404).json({
                message: "info not found"
            })
        }
        const updatedInfo = await info.update({
            companyFullName,
            companyShortName,
            proprietor,
            phone,
            phone2: phone2 ? phone2:null,
            emailId,
            emailId2: emailId2 || null,
            country,
            state,
            pincode,
            city,
            stateCode,
            addressLine1,
            addressLine2: addressLine2 || null,
            gstApplicable,
            gstNo,
            panNo,
            cinNo,
            website
        })

        if(!updateInfo){
            console.log(error);
            return res.status(400).json({
                message: error
            })
        }

        console.log("updated information", updateInfo)

        return res.status(200).json({
            data:updatedInfo
        })

    } catch (error) {
        console.log("Sequelize Validation Error:", error);
        return res.status(500).json({
            message: "Error updating info",
            error: error.message
        });    
    }
}

const updateLogo = async(req, res) => {
    try {
        const {id} = req.params;
        const logo = req.file?.path;
        console.log("this is logo path",logo)
       

        const info = await Info.findByPk(id);
        if (!info) return res.status(404).json({ message: 'Info not found' });

        // if (info.logo) {
        //     const oldLogoPath = path.join(process.cwd(), info.logo);
        //     fs.unlink(oldLogoPath, (err) => {
        //         if (err) {
        //             console.warn("Old logo not deleted:", err.message);
        //         } else {
        //             console.log("Old logo deleted:", oldLogoPath);
        //         }
        //     });
        // }
    
        info.logo = logo;
       const saveLogo = await info.save();
       if(!saveLogo){
        console.log("save logo error",error)
        return res.status(400).json({
            message: error
        })
       }
    
        return res.status(201).json({
            data:info
        })
        
    } catch (error) {
        console.log("logo update", error)
        return res.status(500).json({
            success:false,
            message:error
        })
    }
}


const getLogoFilenameFromDB = async (companyId) => {
    try {
      const company = await Info.findByPk(companyId);
    //   console.log("This is company",company.logo)
      if (company && company.logo) {
        return company.logo;
      }
      return null;
    } catch (error) {
      console.error('Error fetching logo from database:', error);
      return null;
    }
  };
  
  
  const getLogo = async (req, res) => {
    const { id } = req.params;
  
    try {
      const logoFile = await getLogoFilenameFromDB(id);
    //   console.log("This is logoFile", logoFile)
  
      if (!logoFile) {
        return res.status(404).send('Logo not found in database');
      }
  
      const logoPath = path.resolve('', logoFile);

    //   console.log("This is logo path", logoPath)
    //   console.log("All files",fs.existsSync(logoPath    ))
  
      if (fs.existsSync(logoPath)) {
        // console.log("hi from inside function",(logoPath))
        return res.sendFile(logoPath);
    } else {
        return res.status(404).send('Logo file does not exist on disk');
      }
  
    } catch (err) {
      console.error('Error in getLogo:', err);
      return res.status(500).send('Server error retrieving logo');
    }
  };
  

export {
    getInfo,
    getAllInfo,
    updateInfo,
    updateLogo,
    getLogo
}