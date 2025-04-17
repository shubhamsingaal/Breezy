
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const { user, saveUserSettings } = useAuth();
  const auth = getAuth();

  // Create a recaptcha verifier
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log('Recaptcha verified');
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            toast.error("reCAPTCHA expired. Please try again.");
          }
        });
      } catch (error) {
        console.error('Recaptcha setup error:', error);
        toast.error("Error setting up verification. Please try again.");
      }
    }
    return (window as any).recaptchaVerifier;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format phone number (ensure it has the + prefix)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      // Setup recaptcha
      const appVerifier = setupRecaptcha();
      
      // Send verification code
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setCodeSent(true);
      toast.success("Verification code sent to your phone");
    } catch (error: any) {
      console.error("Send code error:", error);
      toast.error(error.message || "Failed to send verification code");
      
      // Reset recaptcha if there's an error
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      if (!confirmationResult) {
        toast.error("Verification session expired. Please request a new code.");
        setCodeSent(false);
        setIsVerifying(false);
        return;
      }

      // Confirm the verification code
      const result = await confirmationResult.confirm(verificationCode);
      if (result.user) {
        setVerified(true);
        toast.success("Phone number verified successfully!");
        
        // Update user settings if logged in
        if (user) {
          await saveUserSettings({ 
            phoneVerified: true,
            phoneNumber: phoneNumber
          });
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Verification failed. Please check the code and try again");
    } finally {
      setIsVerifying(false);
    }
  };

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
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
      {/* Hidden recaptcha container */}
      <div id="recaptcha-container"></div>
      
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
            className="w-full" 
            disabled={isLoading || phoneNumber.length < 10}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Phone className="mr-2 h-4 w-4" />
            )}
            Send Verification Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <div className="flex justify-center my-4">
              <InputOTP
                value={verificationCode}
                onChange={setVerificationCode}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} index={index} className="w-10 h-12 text-lg" />
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
            className="w-full" 
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
              if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
                (window as any).recaptchaVerifier = null;
              }
            }}
            disabled={isVerifying}
          >
            Change Phone Number
          </Button>
        </form>
      )}
    </div>
  );
};

export default PhoneAuth;
