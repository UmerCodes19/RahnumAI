import { useState, useEffect, useRef } from "react";
import { User, Users, Shield, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Aurora from "@/components/visual/Aurora";
import ThemeToggle from "@/components/common/theme/ThemeToggle";
import { useThemeGlobal } from "@/components/common/theme/ThemeProvider";
import MagicCard from "@/components/visual/MagicCard";
import Skeleton from "@/components/common/ui/utils/Skeleton";
import { toast } from "react-toastify"; // Add this import

import { useApi } from "@/contexts/ApiContext";




export default function EnhancedLogin({ onLoginSuccess }) {
    const { login, signUp } = useApi(); // Use the context hook

  const [showBG, setShowBG] = useState(false);
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => { 
    const t = setTimeout(() => setShowBG(true), 300); 
    return () => clearTimeout(t); 
  }, []);

  useEffect(() => { 
    const t = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(t); 
  }, []);

  

  const cardData = [
    { 
      title: "Student", 
      color: "#f39c12", 
      icon: <User size={40} />, 
      description: "Access your courses, assignments, and grades." 
    },
    { 
      title: "Faculty", 
      color: "#8311f2", 
      icon: <Users size={40} />, 
      description: "Manage your classes, students, and schedules." 
    },
    { 
      title: "Admin", 
      color: "#f21311", 
      icon: <Shield size={40} />, 
      description: "Full control of users, permissions, and settings." 
    },
  ];


const CustomInput = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
  roleColor = "#f39c12",
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        id={id}
        type={inputType}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
        style={{
          "--ring": roleColor,
          "--ring-light": `${roleColor}30`,
        }}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
          bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
          text-black dark:text-white 
          border-gray-200 dark:border-slate-600
          focus:outline-none focus:border-[var(--ring)]
          focus:ring-2 focus:ring-[var(--ring-light)]
         
          ${error ? "border-red-500 dark:border-red-400" : ""}
          ${className}
        `}
        {...props}
      />

      
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
      
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

// Custom Select Component
const CustomSelect = ({
  id,
  value,
  onChange,
  required = false,
  roleColor = "#f39c12",
  children,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value || ""}
        onChange={onChange}
        required={required}
        style={{
          "--ring": roleColor,
          "--ring-light": `${roleColor}30`,
        }}
        className={`
          w-full  px-4 py-3 rounded-xl border-2 transition-all duration-300
          bg-white/80 dark:bg-slate-800/80
          text-black dark:text-white
          border-gray-200 dark:border-slate-600
          focus:outline-none focus:border-[var(--ring)]
          focus:ring-2 focus:ring-[var(--ring-light)]
          ${error ? "border-red-500 dark:border-red-400" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>

      
      {/* Custom dropdown arrow */}
      
      
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

const getRoleColor = (role = selectedCard) => {
  const card = cardData.find(c => c.title === role);
  return card?.color || "limegreen";
};


  const handleCardClick = (cardTitle) => {
    if (selectedCard || isAnimating) return;
    setIsAnimating(true);
    setSelectedCard(cardTitle);
    setFormValues({});
    setFormErrors({});
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedCard(null);
    setFormErrors({});
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = (fields) => {
    const errors = {};
    fields.forEach(field => {
      if (!formValues[field]) {
        errors[field] = "This field is required";
      }
    });
    return errors;
  };

  const handleSubmit = async (e, card) => {
    e.preventDefault();
    
    let requiredFields = [];
    if (card.title === "Student") {
      requiredFields = ['enroll', 'pass', 'institute', 'relation'];
    } else if (card.title === "Faculty") {
      requiredFields = ['username', 'pass'];
    } else if (card.title === "Admin") {
      requiredFields = ['email', 'pass'];
    } else if (card.title === "SignUp") {
      requiredFields = ['name', 'email', 'pass', 'role'];
      if (formValues.role === 'student') {
        requiredFields.push('institute', 'relation');
      } else if (formValues.role === 'faculty') {
        requiredFields.push('department');
      } else if (formValues.role === 'admin') {
        requiredFields.push('accessCode');
      }
    }

    const errors = validateForm(requiredFields);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (card.title === "SignUp") {
        const signUpData = {
          role: formValues.role,
          name: formValues.name,
          email: formValues.email,
          password: formValues.pass,
          ...(formValues.role === 'student' && {
            institute: formValues.institute,
            relation: formValues.relation,
            enrollment_number: formValues.enroll,
          }),
          ...(formValues.role === 'faculty' && {
            department: formValues.department,
            username: formValues.username,
          }),
          ...(formValues.role === 'admin' && {
            access_code: formValues.accessCode,
          }),
        };

        const res = await signUp(signUpData);
        
        toast.success(`Sign Up Successful! You can now login as ${formValues.role}`);
        setFormValues({});
        setShowSignUp(false);
        setFormErrors({});
        
      } else {
        const role = card.title.toLowerCase();
        const identifier = 
          role === 'student' ? formValues.enroll :
          role === 'faculty' ? formValues.username :
          formValues.email;

        const loginData = {
          role,
          identifier,
          password: formValues.pass,
        };

        const res = await login(loginData);
        
        if (res.success) {
          // Store auth data
          localStorage.setItem('authToken', res.token);
          localStorage.setItem('userRole', res.user.role);
          localStorage.setItem('userData', JSON.stringify(res.user));
          
          toast.success(`Welcome back, ${res.user.name || res.user.role}!`);
          onLoginSuccess?.(res.user);
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  const renderFormFields = (card) => {
    switch(card.title) {
      case "Student":
        return (
          <>
            <CustomInput
              id="enroll"
              placeholder="Enter your enrollment number"
              value={formValues.enroll}
              onChange={handleInputChange}
              required
              error={formErrors.enroll}
              roleColor={getRoleColor()}
            />
            <CustomInput
              id="pass"
              type="password"
              placeholder="Enter your password"
              value={formValues.pass}
              onChange={handleInputChange}
              required
              error={formErrors.pass}
              roleColor={getRoleColor()}
            />
            <CustomSelect
              id="institute"
              value={formValues.institute}
              onChange={handleInputChange}
              required
              error={formErrors.institute}
              roleColor={getRoleColor()}
            >
              <option value="">Select Institute</option>
              <option value="bahria-karachi">Bahria Karachi</option>
              <option value="bahria-islamabad">Bahria Islamabad</option>
              <option value="bahria-lahore">Bahria Lahore</option>
            </CustomSelect>
            <CustomSelect
              id="relation"
              value={formValues.relation}
              onChange={handleInputChange}
              required
              error={formErrors.relation}
              roleColor={getRoleColor()}
            >
              <option value="">Parent/Child?</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
            </CustomSelect>
          </>
        );
      case "Faculty":
        return (
          <>
            <CustomInput
              id="username"
              placeholder="Enter your username"
              value={formValues.username}
              onChange={handleInputChange}
              required
              error={formErrors.username}
              roleColor={getRoleColor()}
            />
            <CustomInput
              id="pass"
              type="password"
              placeholder="Enter your password"
              value={formValues.pass}
              onChange={handleInputChange}
              required
              error={formErrors.pass}
              roleColor={getRoleColor()}
            />
          </>
        );
      case "Admin":
        return (
          <>
            <CustomInput
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleInputChange}
              required
              error={formErrors.email}
              roleColor={getRoleColor()}
            />
            <CustomInput
              id="pass"
              type="password"
              placeholder="Enter your password"
              value={formValues.pass}
              onChange={handleInputChange}
              required
              error={formErrors.pass}
              roleColor={getRoleColor()}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderSignUpFields = () => (
    <>
      <CustomInput
        id="name"
        placeholder="Enter your full name"
        value={formValues.name}
        onChange={handleInputChange}
        required
        error={formErrors.name}
        roleColor={getRoleColor()}
      />
      <CustomInput
        id="email"
        type="email"
        placeholder="Enter your email"
        value={formValues.email}
        onChange={handleInputChange}
        required
        error={formErrors.email}
        roleColor={getRoleColor()}
      />
      <CustomInput
        id="pass"
        type="password"
        placeholder="Create a password"
        value={formValues.pass}
        onChange={handleInputChange}
        required
        error={formErrors.pass}
        roleColor={getRoleColor()}
      />
      <CustomSelect
        id="role"
        value={formValues.role}
        onChange={handleInputChange}
        required
        error={formErrors.role}
        roleColor={getRoleColor()}
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
        <option value="admin">Admin</option>
      </CustomSelect>

      {formValues.role === 'student' && (
        <>
          <CustomSelect
            id="institute"
            value={formValues.institute}
            onChange={handleInputChange}
            required
            error={formErrors.institute}
            roleColor={getRoleColor()}
          >
            <option value="">Select Institute</option>
            <option value="bahria-karachi">Bahria Karachi</option>
            <option value="bahria-islamabad">Bahria Islamabad</option>
            <option value="bahria-lahore">Bahria Lahore</option>
          </CustomSelect>
          <CustomSelect
            id="relation"
            value={formValues.relation}
            onChange={handleInputChange}
            required
            error={formErrors.relation}
            roleColor={getRoleColor()}
          >
            <option value="">Parent/Child?</option>
            <option value="parent">Parent</option>
            <option value="child">Child</option>
          </CustomSelect>
        </>
      )}

      {formValues.role === 'faculty' && (
        <CustomInput
          id="department"
          placeholder="Enter your department"
          value={formValues.department}
          onChange={handleInputChange}
          required
          error={formErrors.department}
          roleColor={getRoleColor()}
        />
      )}

      {formValues.role === 'admin' && (
        <CustomInput
          id="accessCode"
          placeholder="Enter admin access code"
          value={formValues.accessCode}
          onChange={handleInputChange}
          required
          error={formErrors.accessCode}
          roleColor={getRoleColor()}
        />
      )}
    </>
  );

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`fixed inset-0 transition-opacity duration-1500 ${showBG ? "opacity-100" : "opacity-0"}`}>
        <Aurora colorStops={["#f39c12", "#8311f2", "#f21311"]} blend={0.7} amplitude={0.8} speed={0.5} />
      </div>

      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle/>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-6">
            <Skeleton width="48" height="12" className="mb-4" />
            <div className="flex flex-col md:flex-row gap-6">
              {[1,2,3].map((item) => (
                <div key={item} className="w-36 md:w-40">
                  <Skeleton width="full" height="48" className="rounded-3xl" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {selectedCard && (
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-500 z-30" 
                onClick={handleClose}
              />
            )}

            <div className={`flex flex-col md:flex-row gap-6 z-40`}>
              {cardData.map((card) => {
                const isSelected = selectedCard === card.title;
                const isOtherCardSelected = selectedCard && !isSelected;

                return (
                  <div
                    key={card.title}
                    className={`transition-all duration-300 ease-in-out ${
                      isSelected 
                        ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50' 
                        : isOtherCardSelected 
                          ? 'opacity-30 scale-50 pointer-events-none' 
                          : 'relative cursor-pointer'
                    }`}
                  >
                    <MagicCard
                      spotlightColor={card.color}
                      darkMode={darkMode}
                      className={`flex items-center justify-center p-6 overflow-hidden transition-transform duration-300 ease-in-out ${
                        isSelected ? 'scale-100 w-196 h-[550px]' : 'w-48 md:w-52 h-60'
                      }`}
                      onClick={() => !isSelected && handleCardClick(card.title)}
                      disableHover={isSelected || isOtherCardSelected}
                    >
                      {isSelected ? (
                        <div className="flex flex-col justify-start gap-4 w-full max-w-md relative">
                          <div 
                            className="absolute -left-12 w-64 h-1 rounded-t" 
                            style={{ 
                              backgroundColor: card.color, 
                              transform: `translateY(${card.title === "Student" ? "-115px" : "-153px"})`
                            }} 
                          />
                          <div className="flex flex-col items-center mt-8 gap-4 px-6">
                            <div className={`${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              {card.icon}
                            </div>
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {card.title} Login
                            </h2>
                          </div>
                          <form 
                            className="flex flex-col gap-4 w-full mt-2" 
                            onSubmit={(e) => handleSubmit(e, card)}
                          >
                            {renderFormFields(card)}
                            <button 
                              type="submit" 
                              className="relative inline-block px-6 py-3 mt-2 font-semibold text-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                              style={{ backgroundColor: card.color }}
                            >
                              <span 
                                className="absolute top-0 left-0 w-full h-full rounded-lg opacity-1 animate-pulse " 
                                style={{ background: card.color }}
                              />
                              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Login</span>
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center gap-4 relative z-10">
                          <div className={`${darkMode ? 'text-white' : 'text-gray-900'} transition-transform duration-300 group-hover:scale-110`}>
                            {card.icon}
                          </div>
                          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {card.title}
                          </h2>
                          <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
                            {card.description}
                          </p>
                        </div>
                      )}
                    </MagicCard>
                  </div>
                );
              })}
            </div>

            {!selectedCard && !showSignUp && (
              <div className="mt-6 z-40">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Not Registered Yet?{' '}
                  <button 
                    className="text-blue-500 font-semibold hover:underline transition-colors"
                    onClick={() => setShowSignUp(true)}
                  >
                    Sign Up
                  </button>
                </span>
              </div>
            )}

            {showSignUp && (
              <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                <div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
                  onClick={() => setShowSignUp(false)}
                />
                
                <MagicCard
                  spotlightColor="#22c55e"
                  darkMode={darkMode}
                  className="relative w-196  h-160 p-8 scale-85 transition-transform duration-300 z-50"
                >
                  <div 
                    className="absolute top-0 left-0 w-full h-1 rounded-t"
                    style={{ backgroundColor: '#22c55e' }}
                  />
                  
                  <div className="flex flex-col items-center mt-4 gap-2">
                    <User size={40} className={darkMode ? 'text-white' : 'text-gray-900'} />
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Sign Up
                    </h2>
                  </div>

                  <form 
                    className="flex flex-col gap-4 mt-4"
                    onSubmit={(e) => handleSubmit(e, { title: 'SignUp' })}
                  >
                    {renderSignUpFields()}
                    
                    <button
                      type="submit"
                      className="relative inline-block px-6 py-3 mt-2 font-semibold text-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 bg-green-500 hover:scale-105 hover:shadow-2xl"
                    >
                      <span
                        className="absolute top-0 left-0 w-full h-full rounded-lg opacity-30 animate-pulse"
                        style={{ background: '#22c55e' }}
                      />
                      <span className="relative z-10">Sign Up</span>
                    </button>
                  </form>
                </MagicCard>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}