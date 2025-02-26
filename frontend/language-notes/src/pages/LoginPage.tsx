import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupabaseContext } from "@/index";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { useNavigate } from "react-router";

function LoginPage() {
    const supabase = useContext(SupabaseContext)
    
    const navigate = useNavigate();

    const handleSignInWithGoogle = async (response: GoogleCredentialResponse) => {
        // TODO: Error handling
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential || "",
        })
    
        if (error) {
          console.error("Supabase Auth Error:", error.message);
        } else {
            navigate("/orientation")
        }
      }
      
    return(
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-1/4 h-1/4 text-center">
                <CardHeader>
                    <CardTitle>Welcome to Language Notes</CardTitle>
                    <CardDescription>
                        Currently only allowing Google sign ins. Sorry for the inconvenience :(
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <GoogleLogin 
                        onSuccess={handleSignInWithGoogle} 
                        onError={() => console.log("nogood")}
                    />
                </CardContent>
                {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
            </Card>
        </div>
    )
}

export default LoginPage;