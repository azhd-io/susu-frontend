import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import Medusa from "@medusajs/medusa-js";


interface RegisterCredentials extends FieldValues {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
  metadata?:object
}

const Register = () => {
  const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()

  
  async function getListOfCustomers(): Promise<void> {
    try {
      const response = await medusaClient.admin.customers.list();
        console.log("Customers:",response.customers );
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
  }
  
  // Call the function

  const handleError = (e: Error) => {
    setAuthError("An error occured. Please try again.")
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>()
 const onSubmit = handleSubmit(async (credentials) => {
  getListOfCustomers();
    // Create the customer first without the referral code
    await medusaClient.customers
      .create(credentials)
      .then(() => {
        refetchCustomer();
        router.push("/account");

        // After customer creation, generate a unique referral code
        const uniqueReferralCode = Math.random().toString(36).substr(2, 9).toUpperCase();

        // Add the referral code to the customer's metadata
        const customerDataWithReferral = {
          metadata: {
            referral_code: uniqueReferralCode,
          },
        };

        // Update the customer with the referral code
        medusaClient.customers
          .update(customerDataWithReferral)
          .then(() => {
         
          })
          .catch(handleError);
      })
      .catch(handleError);
  });


  return (
    <div className="max-w-sm flex flex-col items-center mt-12">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <h1 className="text-large-semi uppercase mb-6">Become a SUFFY Member</h1>
      <p className="text-center text-base-regular text-gray-700 mb-4">
        Create your SUFFY Member profile, and get access to an enhanced shopping
        experience.
      </p>
      <form className="w-full flex flex-col" onSubmit={onSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            {...register("first_name", { required: "First name is required" })}
            autoComplete="given-name"
            errors={errors}
          />
          <Input
            label="Last name"
            {...register("last_name", { required: "Last name is required" })}
            autoComplete="family-name"
            errors={errors}
          />
          <Input
            label="Email"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            errors={errors}
          />
          <Input
            label="Phone"
            {...register("phone")}
            autoComplete="tel"
            errors={errors}
          />
          <Input
            label="Password"
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            autoComplete="new-password"
            errors={errors}
          />
         <Input
            label="Referral Code (Optional)"
            {...register("phone")}
            errors={errors}
          />
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              These credentials do not match our records
            </span>
          </div>
        )}
        <span className="text-center text-gray-700 text-small-regular mt-6">
          By creating an account, you agree to SUFFY&apos;s{" "}
          <Link href="/content/privacy-policy" className="underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/content/terms-of-use" className="underline">
            Terms of Use
          </Link>
          .
        </span>
        <Button className="mt-6">Join</Button>
      </form>
      <span className="text-center text-gray-700 text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
