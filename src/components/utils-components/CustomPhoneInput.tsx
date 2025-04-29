import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
 // Import the default style

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  return (
    <PhoneInput
      placeholder="Enter phone number"
      className='phone-input'
      value={value}
      onChange={onChange}
      international
      defaultCountry="IN" // Default country code
    />
  );
};

export default CustomPhoneInput;
