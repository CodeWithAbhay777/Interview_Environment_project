export function validateJobData(jobData) {
  
  if (!jobData.title?.trim()) {
    return { isValid: false, message: "Job title is required" };
  }

 
  const allowedTypes = ["job", "internship"];
  if (!allowedTypes.includes(jobData.type)) {
    return { isValid: false, message: "Type must be either 'job' or 'internship'" };
  }

  
  const salary = Number(jobData.salaryOffered);
  if (isNaN(salary)) {
    return { isValid: false, message: "Salary must be a number" };
  }
  if (salary < 0) {
    return { isValid: false, message: "Salary must be non-negative" };
  }

 
  const allowedPeriods = ["hourly", "monthly", "yearly"];
  if (!allowedPeriods.includes(jobData.salaryPeriod)) {
    return { isValid: false, message: "Salary period must be hourly, monthly, or yearly" };
  }

  
  const allowedCurrencies = ["INR", "USD", "EUR", "GBP"];
  if (!allowedCurrencies.includes(jobData.salaryCurrency)) {
    return { isValid: false, message: "Salary currency must be INR, USD, EUR, or GBP" };
  }

 
  if (!jobData.description?.trim()) {
    return { isValid: false, message: "Job description is required" };
  }
  


  const allowedDepartments = ["software engineer", "backend developer", "frontend developer", "fullstack developer"];
  if (!allowedDepartments.includes(jobData.department)) {
    return { isValid: false, message: "Invalid department selected" };
  }


  if (!Array.isArray(jobData.skillsRequired) || jobData.skillsRequired.length === 0) {
    return { isValid: false, message: "At least one skill is required" };
  }
  if (jobData.skillsRequired.some((s) => !s.trim())) {
    return { isValid: false, message: "Skill names cannot be empty" };
  }

  
  const allowedLevels = ["fresher", "junior", "mid", "senior", "lead"];
  if (!allowedLevels.includes(jobData.experienceLevel)) {
    return { isValid: false, message: "Invalid experience level" };
  }

  
  const openings = Number(jobData.openings);
  if (isNaN(openings)) {
    return { isValid: false, message: "Openings must be a number" };
  }
  if (openings < 1) {
    return { isValid: false, message: "There must be at least one opening" };
  }

  
  if (!jobData.applicationDeadline) {
    return { isValid: false, message: "Application deadline is required" };
  }
  if (isNaN(Date.parse(jobData.applicationDeadline))) {
    return { isValid: false, message: "Application deadline must be a valid date" };
  }

  
  return { isValid: true, message: "Valid job data" };
}
