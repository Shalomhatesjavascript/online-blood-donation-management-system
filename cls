[1mdiff --git a/backend/src/controllers/donorController.js b/backend/src/controllers/donorController.js[m
[1mindex ade8b4f..26b232a 100644[m
[1m--- a/backend/src/controllers/donorController.js[m
[1m+++ b/backend/src/controllers/donorController.js[m
[36m@@ -1,15 +1,32 @@[m
 const { Donor, User, BloodInventory } = require('../models');[m
 const { Op } = require('sequelize');[m
 [m
[32m+[m
 // Search donors[m
 exports.searchDonors = async (req, res) => {[m
   try {[m
     const { blood_group, city, state, eligible_only } = req.query;[m
 [m
[32m+[m[32m    console.log('🔍 Search params received:', { blood_group, city, state, eligible_only });[m
[32m+[m
     const whereClause = {};[m
[31m-    if (blood_group) whereClause.blood_group = blood_group;[m
[31m-    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };[m
[31m-    if (state) whereClause.state = { [Op.iLike]: `%${state}%` };[m
[32m+[m[41m    [m
[32m+[m[32m    // Only add blood_group filter if it's provided and not empty[m
[32m+[m[32m    if (blood_group && blood_group.trim() !== '') {[m
[32m+[m[32m      whereClause.blood_group = blood_group;[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    // Only add city filter if provided[m
[32m+[m[32m    if (city && city.trim() !== '') {[m
[32m+[m[32m      whereClause.city = { [Op.iLike]: `%${city.trim()}%` };[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    // Only add state filter if provided[m
[32m+[m[32m    if (state && state.trim() !== '') {[m
[32m+[m[32m      whereClause.state = { [Op.iLike]: `%${state.trim()}%` };[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    console.log('📝 Where clause:', whereClause);[m
 [m
     let donors = await Donor.findAll({[m
       where: whereClause,[m
[36m@@ -20,9 +37,12 @@[m [mexports.searchDonors = async (req, res) => {[m
       order: [['createdAt', 'DESC']][m
     });[m
 [m
[32m+[m[32m    console.log(`✅ Found ${donors.length} donors before eligibility filter`);[m
[32m+[m
     // Filter by eligibility if requested[m
     if (eligible_only === 'true') {[m
       donors = donors.filter(donor => donor.isEligible());[m
[32m+[m[32m      console.log(`✅ After eligibility filter: ${donors.length} donors`);[m
     }[m
 [m
     // Add eligibility status to each donor[m
[36m@@ -38,6 +58,7 @@[m [mexports.searchDonors = async (req, res) => {[m
       data: donorsWithEligibility[m
     });[m
   } catch (error) {[m
[32m+[m[32m    console.error('❌ Search donors error:', error);[m
     res.status(500).json({[m
       success: false,[m
       message: 'Failed to search donors',[m
[1mdiff --git a/backend/src/validators/donorValidator.js b/backend/src/validators/donorValidator.js[m
[1mindex 82712ab..867aaea 100644[m
[1m--- a/backend/src/validators/donorValidator.js[m
[1m+++ b/backend/src/validators/donorValidator.js[m
[36m@@ -2,13 +2,13 @@[m [mconst { body, query, param, validationResult } = require('express-validator');[m
 [m
 const validateDonorSearch = [[m
   query('blood_group')[m
[31m-    .optional()[m
[32m+[m[32m    .optional({ checkFalsy: true }) // CHANGED: This allows empty string to be treated as "not provided"[m
     .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])[m
     .withMessage('Invalid blood group'),[m
   [m
   query('eligible_only')[m
     .optional()[m
[31m-    .isBoolean()[m
[32m+[m[32m    .isIn(['true', 'false']) // CHANGED: Accept both string values[m
     .withMessage('eligible_only must be true or false')[m
 ];[m
 [m
[1mdiff --git a/frontend/index.html b/frontend/index.html[m
[1mindex c20fbd3..c165b80 100644[m
[1m--- a/frontend/index.html[m
[1m+++ b/frontend/index.html[m
[36m@@ -4,7 +4,7 @@[m
     <meta charset="UTF-8" />[m
     <link rel="icon" type="image/svg+xml" href="/vite.svg" />[m
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />[m
[31m-    <title>frontend</title>[m
[32m+[m[32m    <title>bloodbank</title>[m
   </head>[m
   <body>[m
     <div id="root"></div>[m
[1mdiff --git a/frontend/src/components/common/Select.jsx b/frontend/src/components/common/Select.jsx[m
[1mindex 1a2a22e..8ace6ff 100644[m
[1m--- a/frontend/src/components/common/Select.jsx[m
[1m+++ b/frontend/src/components/common/Select.jsx[m
[36m@@ -22,7 +22,7 @@[m [mconst Select = ({[m
       [m
       <select[m
         name={name}[m
[31m-        value={value}[m
[32m+[m[32m        value={value || ''} // ENSURE empty string if value is null/undefined[m
         onChange={onChange}[m
         required={required}[m
         disabled={disabled}[m
[36m@@ -36,7 +36,7 @@[m [mconst Select = ({[m
           ${className}[m
         `}[m
       >[m
[31m-        <option value="">{placeholder}</option>[m
[32m+[m[32m        <option value="">{placeholder}</option> {/* Empty value for "All" */}[m
         {options.map((option) => ([m
           <option key={option.value} value={option.value}>[m
             {option.label}[m
[1mdiff --git a/frontend/src/components/recipient/SearchDonorsModal.jsx b/frontend/src/components/recipient/SearchDonorsModal.jsx[m
[1mindex 8dbf4e4..53412fb 100644[m
[1m--- a/frontend/src/components/recipient/SearchDonorsModal.jsx[m
[1m+++ b/frontend/src/components/recipient/SearchDonorsModal.jsx[m
[36m@@ -27,33 +27,49 @@[m [mconst SearchDonorsModal = ({ onClose }) => {[m
     setSearchParams(prev => ({ ...prev, [name]: value }));[m
   };[m
 [m
[31m-  const handleSearch = async (e) => {[m
[31m-    e.preventDefault();[m
[31m-    setLoading(true);[m
[31m-    setAlertMessage(null);[m
[31m-    setSearched(true);[m
[31m-[m
[31m-    try {[m
[31m-      // FIXED: Use the correct searchDonors method[m
[31m-      const response = await donorService.searchDonors(searchParams);[m
[31m-      setDonors(response.data);[m
[31m-      [m
[31m-      if (response.data.length === 0) {[m
[31m-        setAlertMessage({[m
[31m-          type: 'info',[m
[31m-          message: 'No donors found matching your criteria. Try adjusting your search.'[m
[31m-        });[m
[31m-      }[m
[31m-    } catch (error) {[m
[31m-      console.error('Search error:', error);[m
[32m+[m[32m const handleSearch = async (e) => {[m
[32m+[m[32m  e.preventDefault();[m
[32m+[m[32m  setLoading(true);[m
[32m+[m[32m  setAlertMessage(null);[m
[32m+[m[32m  setSearched(true);[m
[32m+[m
[32m+[m[32m  try {[m
[32m+[m[32m    // Clean the search params - remove empty strings[m
[32m+[m[32m    const cleanParams = {};[m
[32m+[m[41m    [m
[32m+[m[32m    if (searchParams.blood_group && searchParams.blood_group !== '') {[m
[32m+[m[32m      cleanParams.blood_group = searchParams.blood_group;[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    if (searchParams.city && searchParams.city.trim() !== '') {[m
[32m+[m[32m      cleanParams.city = searchParams.city.trim();[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    if (searchParams.eligible_only) {[m
[32m+[m[32m      cleanParams.eligible_only = searchParams.eligible_only;[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    console.log('Searching with params:', cleanParams); // DEBUG[m
[32m+[m
[32m+[m[32m    const response = await donorService.searchDonors(cleanParams);[m
[32m+[m[32m    setDonors(response.data);[m
[32m+[m[41m    [m
[32m+[m[32m    if (response.data.length === 0) {[m
       setAlertMessage({[m
[31m-        type: 'error',[m
[31m-        message: error.response?.data?.message || 'Failed to search donors. Please try again.'[m
[32m+[m[32m        type: 'info',[m
[32m+[m[32m        message: 'No donors found matching your criteria. Try adjusting your search.'[m
       });[m
[31m-    } finally {[m
[31m-      setLoading(false);[m
     }[m
[31m-  };[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    console.error('Search error:', error);[m
[32m+[m[32m    setAlertMessage({[m
[32m+[m[32m      type: 'error',[m
[32m+[m[32m      message: error.response?.data?.message || 'Failed to search donors. Please try again.'[m
[32m+[m[32m    });[m
[32m+[m[32m  } finally {[m
[32m+[m[32m    setLoading(false);[m
[32m+[m[32m  }[m
[32m+[m[32m};[m
 [m
   return ([m
     <Modal[m
