
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTheme } from '@/hooks/use-theme';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const { user, sendVerificationCode, verifyPhoneNumber } = useAuth();
  const { theme } = useTheme();

  // Try to restore phone number from localStorage if code was sent but page was refreshed
  useEffect(() => {
    const savedPhone = localStorage.getItem('phoneAuthNumber');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setCodeSent(true);
    }
    
    // Add a hidden div element for recaptcha if it doesn't exist
    if (!document.getElementById('phone-auth-recaptcha')) {
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'phone-auth-recaptcha';
      recaptchaContainer.style.display = 'none';
      document.body.appendChild(recaptchaContainer);
    }
    
    // Cleanup function
    return () => {
      const container = document.getElementById('phone-auth-recaptcha');
      if (container) {
        container.innerHTML = ''; // Clear recaptcha
      }
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format phone number (ensure it has the + prefix)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      // Send verification code using the auth context method
      const success = await sendVerificationCode(formattedPhone);
      
      if (success) {
        setCodeSent(true);
        toast.success("Verification code sent to your phone");
      } else {
        toast.error("Failed to send verification code");
      }
    } catch (error: any) {
      console.error("Send code error:", error);
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const success = await verifyPhoneNumber(phoneNumber, verificationCode);
      
      if (success) {
        setVerified(true);
        toast.success("Phone number verified successfully!");
      } else {
        toast.error("Verification failed. Please check the code and try again");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  if (verified) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 space-y-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold">Phone Verified</h3>
        <p className="text-center text-muted-foreground">
          Your phone number has been successfully verified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {!codeSent ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8901"
                className="pl-10"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your phone number including country code (e.g. +1 for US)
            </p>
          </div>
          <Button 
            type="submit" 
            className={`w-full transition-all duration-300 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            disabled={isLoading || phoneNumber.length < 10}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Phone className="mr-2 h-4 w-4" />
            )}
            Send Verification Code
          </Button>
          
          {/* This hidden div will be used by Firebase for the reCAPTCHA verification */}
          <div id="phone-auth-recaptcha" className="hidden"></div>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className={`space-y-2 p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
            <Label htmlFor="verification-code">Verification Code</Label>
            <div className="flex justify-center my-4">
              <InputOTP
                value={verificationCode}
                onChange={setVerificationCode}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot 
                        key={index} 
                        index={index} 
                        className={`w-10 h-12 text-lg ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : ''}`}
                      />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code sent to your phone
            </p>
          </div>
          <Button 
            type="submit" 
            className={`w-full transition-all duration-300 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            disabled={isVerifying || verificationCode.length < 6}
          >
            {isVerifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Verify Code
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-2" 
            onClick={() => {
              setCodeSent(false);
              localStorage.removeItem('phoneAuthNumber');
            }}
            disabled={isVerifying}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change Phone Number
          </Button>
        </form>
      )}
    </div>
  );
};

export default PhoneAuth;
